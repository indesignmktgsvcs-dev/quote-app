# INDesign Quotes — Mobile App Setup

Same idea as the FitOut app: this turns your INDesign quotation tool
into a home-screen app icon, full-screen, no browser bars.

## What's in this folder

- `index.html` — your quotation tool (same content as V123, now app-ready)
- `manifest.json` — tells the phone this is an installable app
- `service-worker.js` — lets it open even with a weak signal
- `icons/` — the app icon in the sizes phones need

## Step 1: Upload to your repo

Your repo: **github.com/indesignmktgsvcs-dev/quote-app**

Use GitHub Desktop (most reliable — avoids the browser drag-and-drop
issue from before):
1. Install GitHub Desktop (desktop.github.com), sign in as
   `indesignmktgsvcs-dev`.
2. File → Clone repository → `indesignmktgsvcs-dev/quote-app` → pick a
   folder on your PC.
3. Copy everything from this folder (`index.html`, `manifest.json`,
   `service-worker.js`, the `icons` folder, this README) into that
   cloned folder — plain copy-paste in File Explorer.
4. In GitHub Desktop: commit message like "Add app files" → **Commit
   to main** → **Push origin**.

## Step 2: Turn on GitHub Pages

1. On the repo page → **Settings** → **Pages** (left sidebar)
2. Source: **Deploy from a branch** → Branch: **main** → folder **/ (root)** → **Save**
3. **Important — add a `.nojekyll` file:** in the repo, click "Add
   file" → "Create new file", name it exactly `.nojekyll`, leave it
   empty, and commit it. (Without this, GitHub sometimes shows your
   README instead of the actual app at the site's home address —
   this file tells GitHub to skip that and serve your files directly.)
4. Wait 1–2 minutes, refresh the Settings → Pages screen, and you'll
   see a green banner with your link:
   **https://indesignmktgsvcs-dev.github.io/quote-app/**

## Step 3: Install it on a phone

**iPhone (Safari):** open the link → Share button → "Add to Home Screen"

**Android (Chrome):** open the link → tap the green "📲 Install App"
button in the toolbar, or use the ⋮ menu → "Install app"

## Notes

- Same tool, same data entry, same PDFs — just wrapped to install as
  an app.
- Offline support is "nice to have": opens fine on a weak signal,
  first load and PDF generation still need internet once.
- Type the full address including `https://` — on some phones,
  typing just the domain without `https://` can 404.
