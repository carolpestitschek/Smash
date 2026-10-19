# Smash Happens

Carol’s personal padel journal — games, tournaments, clubs and a gear notebook.

Responsive HTML, CSS and JavaScript with locally hosted fonts and images. No package installation is required.

## Preview locally

```sh
python3 -m http.server 4173
```

Open http://localhost:4173/.

## Editing

- `index.html`: desktop and mobile page markup.
- `styles.css`: site styles.
- `*-motion.js`: motion and interactions.
- `gear-data.js`, `shoe-data.js`, `gear-controls.js`: products, views and filtering.
- `match-data.js`: games and tournaments.
- `assets/`: fonts, product imagery and illustrations.
- `design-source/`: retained layout source and style overrides. Its optional `build.py` regenerates `index.html`, `styles.css` and `app.js`; make layout changes there if using the generator. Other runtime scripts are maintained directly.

Gear states are `current`, `owned` and `archived`, supplied through each product card’s `data-gear-status`. Oldest/newest sorting uses notebook addition order, not purchase dates. Unfilled product cards remain placeholders.

Motion respects reduced-motion preferences. Product rotations use isolated views from supplied spritesheets.

## Gallery

Open `gallery.html`. Add images to `assets/gallery/` and entries to `gallery-data.js`. Each entry supports `src`, descriptive `alt`, `caption`, optional `photographer` (an @handle) and optional `photographerUrl` (a full profile URL). Credits are hidden when omitted. Clicking a photo opens an accessible dialog; Escape closes it. The gallery currently awaits Carol’s selected photos.
