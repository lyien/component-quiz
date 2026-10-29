# What Component Are You?

A personality quiz that matches you with one of 8 UI components. The site is plain HTML, CSS and JavaScript with no build step.

## Put it online with GitHub Pages

1. On GitHub, create a new **public** repository, e.g. `component-quiz`.
2. Click **Add file → Upload files**, then drag in everything inside this folder: `index.html` plus the `css`, `js` and `assets` folders. Commit.
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, pick `main` and `/ (root)`, then click **Save**.
4. After a minute or two the quiz is live at `https://<your-username>.github.io/component-quiz/`.

To make changes later, upload the edited files again and the site updates on its own.

### Optional: link previews in Slack and Teams

Some apps need a full URL for the preview image. Once the site is live, open `index.html` and change

```html
<meta property="og:image" content="assets/og-image.png" />
```

to the full address, e.g. `https://<your-username>.github.io/component-quiz/assets/og-image.png`.

## Test it on your computer

Browsers block some features when you open `index.html` directly, so run a small local server from this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Where things live

| File | What's in it |
| --- | --- |
| `js/data.js` | All copy, questions, answers and scoring (from the copy deck) |
| `js/scoring.js` | Tally scoring and tie-breakers |
| `js/app.js` | Screens and navigation |
| `js/share-card.js` | The 1080 × 1350 "Save my card" image |
| `css/styles.css` | Styles; tokens match the Figma variables |
| `assets/illustrations` | SVGs exported from Figma |
| `assets/fonts` | Comic Relief (SIL Open Font License, see `OFL.txt`) |

To edit copy or scoring, change `js/data.js`. Each answer is listed as `[label, main (+2), secondary (+1)]`.
