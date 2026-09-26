# Firebase setup (optional cloud sync)

The assessment **works fully without Firebase**: progress is stored in **localStorage** on the device and via **Export** (JSON / markdown). Cloud sync is optional so Matt can read sessions from Firestore on a dedicated project—not the procurement (`pr-system-4ea55`) production Firebase.

## Trade-off: Anonymous Auth + owner UID (chosen)

| Approach | Pros | Cons |
|----------|------|------|
| **Anonymous Auth** (this repo) | Each device gets a Firebase UID; rules restrict read/write to `ownerUid == auth.uid`. No login UI. | Must enable Anonymous sign-in; agents need Firebase console or a small admin script to list docs (rules deny `list`). |
| Public create/update (old) | No auth setup | Anyone on the internet could write/read the collection if rules slip—unacceptable on a shared prod project. |

We use **Anonymous Auth** so rules stay tight without a login flow.

---

## 1. Create a new Firebase project

1. [Firebase Console](https://console.firebase.google.com/) → **Add project** (e.g. `1pwr-assessment-matt`).
2. Do **not** reuse `pr-system-4ea55` or any 1PWR procurement/CC project.

## 2. Enable Firestore

1. **Build → Firestore Database → Create database**.
2. Start in **production mode** (you will deploy rules from this repo).

## 3. Enable Anonymous Authentication

1. **Build → Authentication → Get started**.
2. **Sign-in method → Anonymous → Enable**.

## 4. Register a web app

1. Project settings → **Your apps → Web**.
2. Copy the `firebaseConfig` object values into `.env.local` (from `.env.example`):

```bash
cp .env.example .env.local
# fill VITE_FIREBASE_* values
```

For **GitHub Pages**, add the same `VITE_FIREBASE_*` names as **repository secrets** (Settings → Secrets and variables → Actions). The deploy workflow passes them into `npm run build`.

## 5. Deploy Firestore rules

Install Firebase CLI if needed, then from this repo root:

```bash
firebase login
firebase use --add    # select your new project
firebase deploy --only firestore:rules
```

You need a minimal `firebase.json` pointing at `firestore.rules` (create locally if you prefer not to commit project aliases):

```json
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

## 6. Verify

1. `npm run dev` with `.env.local` filled → answer a question → header should show **Cloud saved** when sync succeeds.
2. Firestore console → `assessment_results` → one document per browser session id.

---

## Important: retire the old procurement rules

The earlier standalone HTML pointed at Firebase project **`pr-system-4ea55`** with a publicly writable `assessment_results` collection. That project belongs to **1PWR procurement** (different repo).

**Matt (or whoever owns that Firebase project) must remove any public write rule on `assessment_results` in `pr-system-4ea55`** in that project’s Firestore rules—this assessment repo does not touch the procurement codebase.

After migrating, no app build should reference `pr-system-4ea55`.
