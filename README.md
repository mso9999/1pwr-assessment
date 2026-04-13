# 1PWR Leadership Assessment

Single-page React assessment (`src/App.jsx`). Run locally or deploy the static build to any host.

## Where is the UI hosted?

| Environment | URL | Notes |
|-------------|-----|--------|
| **1PWR production (EC2 + Caddy)** | **https://cc.1pwrafrica.com/assessment/** | Primary cloud UI for the team. Deploy steps: [DEPLOY.md](DEPLOY.md). |
| **GitHub Pages (optional)** | https://mso9999.github.io/1pwr-assessment/ | Static build from `master` via [Actions](.github/workflows/deploy-github-pages.yml). Requires **Settings → Pages → GitHub Actions** and, if deploy fails, **Settings → Environments → `github-pages` → Deployment branches** — allow **`master`** (or “All branches”), not only `gh-pages`. |

The Vite app in this repo (`npm run build` → `dist/`) is the bundled React assessment. The older single-file build under `public/index.html` may still be used by some deployments; prefer updating EC2 with `dist/` contents if you want the latest Vite build live at `/assessment/`.

## Local

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Cloud (GitHub Pages)

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
3. Push to `master` or `main` (or run the workflow manually). The [Deploy to GitHub Pages](.github/workflows/deploy-github-pages.yml) workflow builds with `npm run build` and publishes `dist/`.

Your site URL will be:

`https://<username>.github.io/<repository>/`

(For a user/org site named `<username>.github.io`, set `base: '/'` in `vite.config.js` instead of `./`.)

## Other hosts

`npm run build` outputs `dist/`. Upload that folder to Netlify, Vercel, Cloudflare Pages, S3+CloudFront, etc. Use `base: './'` in `vite.config.js` for subdirectory installs, or set `base` to your public path.
