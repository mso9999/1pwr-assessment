/**
 * Dedicated Firebase project for assessment results (NOT pr-system / procurement).
 * Copy `.env.example` → `.env.local` and fill values after creating the project.
 * See SETUP_FIREBASE.md. Leave empty to use localStorage only.
 */
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

export function isFirebaseConfigured() {
  return Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
}

export function getFirebaseWebConfig() {
  return { ...cfg };
}
