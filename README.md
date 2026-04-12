# 1PWR Leadership Assessment

Single-page React assessment (`src/App.jsx`). Run locally or deploy the static build to any host.

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
