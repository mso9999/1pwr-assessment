# Deployment — 1PWR Leadership Assessment

Standalone personal app for Matt. **Not** part of the 1PWR CC production repo.

## Canonical public URL (GitHub Pages)

**https://mso9999.github.io/1pwr-assessment/**

- Deep link to first question: `…/1pwr-assessment/#start`
- Build uses Vite with `base: /1pwr-assessment/` (see `vite.config.js`).

### Automatic deploy (recommended)

1. GitHub repo **Settings → Pages → Build and deployment → Source:** **GitHub Actions**.
2. Push to `master` (or run **Deploy to GitHub Pages** workflow manually).
3. Optional: add `VITE_FIREBASE_*` repository secrets for cloud sync (see `SETUP_FIREBASE.md`).

### Manual deploy to `gh-pages` branch

```bash
npm ci
npm run build
npm run deploy:gh-pages
```

This pushes `dist/` to the `gh-pages` branch (works even if Actions is misconfigured).

### Local preview (production paths)

```bash
npm run build
npx vite preview --host 127.0.0.1 --port 4173
# open http://127.0.0.1:4173/1pwr-assessment/
```

## Other static hosts

```bash
npm ci
VITE_BASE_PATH=/assessment/ npm run build   # example subdirectory
```

Upload the contents of `dist/` to the host. Do **not** deploy `public/index.html` alone—it is only a pointer file; the app is the Vite bundle.

## Legacy EC2 path (never used in production)

Earlier notes described **https://cc.1pwrafrica.com/assessment/** on EC2 with Caddy and `server/results_api.py`. That was never wired up for this app. If you ever host there, deploy **`dist/`** (not the old Babel standalone HTML). The Python API in `server/` is optional and unrelated to Firebase sync.

## Firebase

Optional. Without config, the app uses **localStorage** + export. See **SETUP_FIREBASE.md**.
