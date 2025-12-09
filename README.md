# Suspense + ViewTransition Demo

Small Vite app that highlights React 19.2 canary's `ViewTransition` API applied to `Suspense` content.

## Features (with snippets)

**Named view transition wraps Suspense output**

```jsx
// src/SuspenseViewTransitionDemo.jsx
<ViewTransition default="vt-fade">
  <div className="card-slot vt-fade">
    <Suspense fallback={<LoadingCard />}>
      <LoadedCard requestId={requestId} />
    </Suspense>
  </div>
</ViewTransition>
```

**startTransition controls show/hide + reload**

```jsx
function toggle() {
  startTransition(() => {
    setShow(prev => !prev);
    setRequestId(id => id + 1);
  });
}

function reload() {
  startTransition(() => {
    setShow(true);
    setRequestId(id => id + 1);
  });
}
```

**Suspending loader with skeleton and resolved card**

```jsx
function loadCard(requestId) {
  const cached = cache.get(requestId);
  if (cached?.status === 'resolved') return cached.data;
  if (cached?.status === 'pending') throw cached.promise;

  const promise = new Promise(resolve => {
    const delay = 650 + Math.random() * 900;
    setTimeout(() => {
      const payload = { id: requestId, time: new Date().toLocaleTimeString() };
      cache.set(requestId, { status: 'resolved', data: payload });
      resolve(payload);
    }, delay);
  });

  cache.set(requestId, { status: 'pending', promise });
  throw promise;
}
```

**Custom snapshot animation styling**

```css
/* src/index.css */
.vt-fade { view-transition-name: vt-fade; }
::view-transition-new(vt-fade) { animation: vt-fade-in 460ms ease forwards; }
::view-transition-old(vt-fade) { animation: vt-fade-out 460ms ease forwards; }
```

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173), then toggle and reload the card to see the view-transition snapshots animate across Suspense fallback and resolved states.
