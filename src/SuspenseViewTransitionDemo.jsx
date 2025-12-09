// SuspenseViewTransitionDemo.jsx
import { ViewTransition, startTransition, Suspense, useState } from 'react';

// Tiny in-memory cache that behaves like a Suspense resource.
const cache = new Map();

function loadCard(requestId) {
  const cached = cache.get(requestId);
  if (cached?.status === 'resolved') {
    return cached.data;
  }
  if (cached?.status === 'pending') {
    throw cached.promise;
  }

  const promise = new Promise(resolve => {
    const delay = 650 + Math.random() * 900;
    setTimeout(() => {
      const payload = {
        id: requestId,
        mood: ['glow', 'calm', 'spark'][requestId % 3],
        time: new Date().toLocaleTimeString(),
      };
      cache.set(requestId, { status: 'resolved', data: payload });
      resolve(payload);
    }, delay);
  });

  cache.set(requestId, { status: 'pending', promise });
  throw promise;
}

function LoadedCard({ requestId }) {
  const data = loadCard(requestId);

  return (
    <article className="card ready">
      <p className="eyebrow">Suspense resolved</p>
      <h3>View transition snapshot #{data.id}</h3>
      <p className="meta">Arrived at {data.time}</p>
      <p className="body">
        The loaded state crossfades with the skeleton while React keeps the DOM
        in sync through <code>startTransition</code>.
      </p>
      <span className="badge">{data.mood}</span>
    </article>
  );
}

function LoadingCard() {
  return (
    <article className="card skeleton" aria-label="Loading card">
      <div className="pulse bar short" />
      <div className="pulse bar" />
      <div className="pulse bar" />
      <div className="pulse bar wide" />
    </article>
  );
}

function EmptyCard() {
  return (
    <article className="card empty">
      <p className="eyebrow">Nothing mounted</p>
      <h3>Toggle the view transition</h3>
      <p className="body">
        Hiding removes the content, but React still captures a snapshot so you
        can see the transition back in.
      </p>
    </article>
  );
}

export default function SuspenseViewTransitionDemo() {
  const [show, setShow] = useState(true);
  const [requestId, setRequestId] = useState(1);

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

  return (
    <div className="suspense-demo">
      <header className="demo-header">
        <p className="eyebrow">Suspense + ViewTransition</p>
        <h1>See the attached snapshots</h1>
        <p className="body">
          Tap the buttons to flip between the Suspense fallback and resolved
          content. The view transition wraps them so the DOM snapshots animate
          instead of popping.
        </p>
      </header>

      <div className="controls">
        <button type="button" onClick={toggle}>
          {show ? 'Hide content' : 'Show content'}
        </button>
        <button type="button" className="ghost" onClick={reload}>
          Reload with transition
        </button>
      </div>

      <ViewTransition default="vt-fade">
        <div className="card-slot vt-fade">
          {show ? (
            <Suspense fallback={<LoadingCard />}>
              <LoadedCard requestId={requestId} />
            </Suspense>
          ) : (
            <EmptyCard />
          )}
        </div>
      </ViewTransition>

      <p className="hint">
        The cards above are captured as view-transition snapshots (see the
        custom fade/scale defined in <code>::view-transition-old(.vt-fade)</code>
        and <code>::view-transition-new(.vt-fade)</code>).
      </p>
    </div>
  );
}
