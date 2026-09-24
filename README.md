# Stages of Decomposition

An interactive, static website that walks through the stages of animal
decomposition. Pick an animal, then step through its stages. The
illustration shows on the left and the description in the sidebar.

This is a midterm draft. The illustrations are placeholders for now.

## Files

| File | What it does |
|------|--------------|
| `index.html` | Page structure |
| `style.css` | Colors, layout, mobile styles (colors are set at the top in `:root`) |
| `script.js` | Loads `data.json`, builds the buttons, updates the page on click |
| `data.json` | **All the content**: animals, stages, text, image paths |
| `images/placeholders/` | Temporary 16:9 SVG placeholders |

## Running it locally

Double-clicking `index.html` **will not work**. Browsers block `fetch()` from
reading `data.json` on `file://` pages, so the page shows an error instead.
Use a local web server. Either of these works:

- **VS Code:** install the "Live Server" extension, right-click `index.html`, then choose *Open with Live Server*.
- **Terminal:** run `python3 -m http.server` in this folder, then open <http://localhost:8000>.

## Adding your illustrations

1. Export each illustration from Illustrator at **16:9** (for example, 1600 × 900).
   Other sizes still display without cropping, but they get letterboxed.
   SVG or PNG exports both work.
2. Put the files in `images/`, for example `images/pig-1-fresh.png`.
3. In `data.json`, change that stage's `"image"` path to point to the new file.
   Also update `"image_alt"` with a short description of the picture for screen readers.
4. Once nothing uses the placeholders anymore, delete `images/placeholders/`.

File paths are **case-sensitive** on GitHub Pages. `Pig.PNG` and `pig.png` are
different files there, even though your computer may treat them as the same.

## Editing content

Everything the page shows comes from `data.json`. To add an animal, copy one of
the `{ "id": ..., "stages": [...] }` blocks and edit it. The buttons are
generated automatically. JSON is strict: no trailing commas and no comments.
If the page says it can't load the data, paste the file into a JSON validator
to find the mistake.

The **rabbit** text is marked `TODO`. Replace it with your own researched,
cited descriptions.

## Publishing on GitHub Pages

Repo **Settings → Pages →** *Source: Deploy from a branch* → choose `main` and
`/ (root)` → **Save**. The site will be at
`https://<your-username>.github.io/<repo-name>/`.
