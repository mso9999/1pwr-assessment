import { isFirebaseConfigured, getFirebaseWebConfig } from "./firebaseConfig.js";

const STORAGE_KEY = "1pwr_assessment_state_v1";
const SESSION_KEY = "1pwr_assessment_session_id";

let firebaseReady = null;
let syncStatusListeners = new Set();

export function onSyncStatusChange(fn) {
  syncStatusListeners.add(fn);
  return () => syncStatusListeners.delete(fn);
}

function setSyncStatus(status) {
  syncStatusListeners.forEach((fn) => {
    try {
      fn(status);
    } catch (_) {
      /* ignore */
    }
  });
}

export function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}

export function serializeState(state) {
  return {
    ...state,
    questionsSeen: Array.from(state.questionsSeen || []),
  };
}

export function deserializeState(raw) {
  if (!raw || typeof raw !== "object") return null;
  const out = { ...raw };
  out.questionsSeen = new Set(Array.isArray(raw.questionsSeen) ? raw.questionsSeen : []);
  out.sessionHistory = Array.isArray(raw.sessionHistory) ? raw.sessionHistory : [];
  out.bookmarks = Array.isArray(raw.bookmarks) ? raw.bookmarks : [];
  out.contests = Array.isArray(raw.contests) ? raw.contests : [];
  out.shuffleMode = !!raw.shuffleMode;
  if (typeof out.sessionStartTime !== "number") out.sessionStartTime = Date.now();
  if (!out.domainStates || typeof out.domainStates !== "object") return null;
  return out;
}

export function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return deserializeState(JSON.parse(raw));
  } catch (e) {
    console.warn("Could not load saved assessment state:", e);
    return null;
  }
}

export function saveLocalState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState(state)));
  } catch (e) {
    console.warn("Could not save assessment state locally:", e);
  }
}

async function getFirebaseBackend() {
  if (!isFirebaseConfigured()) return null;
  if (firebaseReady === false) return null;
  if (firebaseReady) return firebaseReady;
  try {
    const [{ initializeApp }, { getFirestore, doc, setDoc }, { getAuth, signInAnonymously }] =
      await Promise.all([
        import("firebase/app"),
        import("firebase/firestore"),
        import("firebase/auth"),
      ]);
    const app = initializeApp(getFirebaseWebConfig());
    const auth = getAuth(app);
    const db = getFirestore(app);
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    firebaseReady = { db, doc, setDoc, uid: auth.currentUser.uid };
    return firebaseReady;
  } catch (e) {
    console.warn("Firebase unavailable; using local storage only:", e);
    firebaseReady = false;
    return null;
  }
}

function buildFirestorePayload(state, sessionId, ownerUid) {
  const domainAbilities = {};
  let totalCorrect = 0;
  let totalAttempted = 0;
  Object.entries(state.domainStates || {}).forEach(([k, ds]) => {
    if (ds.totalAttempted > 0) {
      domainAbilities[k] = ds.estimatedAbility;
      totalCorrect += ds.totalCorrect;
      totalAttempted += ds.totalAttempted;
    }
  });
  return {
    sessionId,
    ownerUid,
    lastUpdated: new Date().toISOString(),
    totalQuestions: state.totalQuestions || 0,
    questionsSeen: Array.from(state.questionsSeen || []),
    contests: state.contests || [],
    bookmarks: state.bookmarks || [],
    domainStates: state.domainStates || {},
    summary: {
      totalCorrect,
      totalAttempted,
      accuracy: totalAttempted > 0 ? +(totalCorrect / totalAttempted * 100).toFixed(1) : 0,
      domainAbilities,
    },
  };
}

export async function syncResultsToBackend(state) {
  saveLocalState(state);
  const backend = await getFirebaseBackend();
  if (!backend) {
    setSyncStatus("local");
    return;
  }
  setSyncStatus("syncing");
  try {
    const sessionId = getOrCreateSessionId();
    const payload = buildFirestorePayload(state, sessionId, backend.uid);
    await backend.setDoc(backend.doc(backend.db, "assessment_results", sessionId), payload, {
      merge: true,
    });
    setSyncStatus("synced");
  } catch (e) {
    console.warn("Firestore sync failed:", e);
    setSyncStatus("error");
  }
}

export function initResultsBackend() {
  if (isFirebaseConfigured()) {
    getFirebaseBackend().catch(() => {});
  }
}
