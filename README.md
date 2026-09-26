# 1PWR Leadership Assessment

Single-page React assessment (`src/App.jsx`). Run locally or deploy the static build to any host.

## Where is the UI hosted?

| Environment | URL | Notes |
|-------------|-----|--------|
| **GitHub Pages** | **https://mso9999.github.io/1pwr-assessment/** | Primary URL for Matt. Vite build on **`gh-pages`** or via GitHub Actions. Use **`#start`** for first question. See [DEPLOY.md](DEPLOY.md). |
| EC2 / CC (legacy notes) | — | Not deployed; see [DEPLOY.md](DEPLOY.md) if hosting under 1PWR infra later. |

The app is the Vite bundle (`npm run build` → `dist/`). `public/index.html` is only a deploy pointer—not the runnable app.

## Question bank quality (POE)

Scenario items are vulnerable to **pattern matching** (e.g. longest option) if distractors are weak. The app **shuffles** options at display time; item authors should still keep distractors **plausible** and **similar length** where possible. Run:

```bash
npm run audit:questions
```

to list rows where the keyed answer is still much longer than alternatives (review queue).

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
