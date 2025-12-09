# Suspense + ViewTransition Demo (React 19.2 canary)

Small Vite app that highlights React 19.2 canary’s `ViewTransition` API applied to `Suspense` content. The demo shows:

- A Suspense fallback skeleton that crossfades into the loaded card.
- A named view transition (`vt-fade`) so the DOM snapshots animate instead of popping.
- Buttons to hide/show and reload, proving transitions attach across both mounting and data refresh.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173) and toggle/reload the card to see the view-transition snapshots animate.
