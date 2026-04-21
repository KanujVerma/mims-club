# RSVP Functionality & Light Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up working RSVP functionality with localStorage persistence, extract new components, add light UX polish, and push to GitHub Pages.

**Architecture:** `App.jsx` owns a single `rsvpIds: number[]` state initialized from (and synced to) `localStorage`. It passes `rsvpIds`, `addRSVP`, and `removeRSVP` down as props to `Events` and `MyEvents`. Two new components (`EventCard`, `MyEventRow`) are extracted from the page files. `FeedbackMessage` is a small presentational component used inside `EventCard`.

**Tech Stack:** React 18, React Router v6, React Bootstrap, plain CSS, Vite, localStorage API

> **Note on testing:** No test framework (Vitest / Jest) is configured in this project. All verification is done via the dev server (`npm run dev`) and the browser. Run `npm run dev` once and keep it running throughout.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/App.jsx` | Modify | Add `rsvpIds` state, localStorage sync, `addRSVP`/`removeRSVP`, thread props |
| `src/components/Navbar.jsx` | Modify | Accept `rsvpCount` prop, render count badge on My Events link |
| `src/components/Navbar.css` | Modify | Add `.navbar__badge` styles |
| `src/components/EventCard.jsx` | Create | Single event row — date, title, meta, description, RSVP button, feedback message |
| `src/components/EventCard.css` | Create | Styles for event card layout and RSVP button states |
| `src/components/FeedbackMessage.jsx` | Create | Inline "✓ Saved to My Events" fade message, always in DOM, opacity-controlled |
| `src/components/MyEventRow.jsx` | Create | Single saved-event row with title, meta, Remove button |
| `src/components/MyEventRow.css` | Create | Styles for saved-event row |
| `src/pages/Events.jsx` | Modify | Replace inline card map with `<EventCard>`, receive and pass RSVP props |
| `src/pages/Events.css` | Modify | Remove card styles now owned by EventCard.css; keep only page-level layout |
| `src/pages/MyEvents.jsx` | Modify | Add populated state (list of `MyEventRow`), derive from `rsvpIds` + events data |
| `src/pages/MyEvents.css` | Modify | Add `.my-events__list` and `.my-events__heading` styles for populated state |

---

## Chunk 1: App State + Prop Threading

### Task 1: Add RSVP state to App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Read the current file**

Open `src/App.jsx` and note the existing imports and route definitions. The file is currently a thin shell with no state.

- [ ] **Step 2: Replace App.jsx with the stateful version**

```jsx
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Leadership from './pages/Leadership'
import Events from './pages/Events'
import MyEvents from './pages/MyEvents'

function loadRsvpIds() {
  try {
    const parsed = JSON.parse(localStorage.getItem('mims_rsvps') || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function App() {
  const [rsvpIds, setRsvpIds] = useState(loadRsvpIds)

  useEffect(() => {
    localStorage.setItem('mims_rsvps', JSON.stringify(rsvpIds))
  }, [rsvpIds])

  function addRSVP(id) {
    setRsvpIds(prev => prev.includes(id) ? prev : [...prev, id])
  }

  function removeRSVP(id) {
    setRsvpIds(prev => prev.filter(x => x !== id))
  }

  return (
    <>
      <Navbar rsvpCount={rsvpIds.length} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/events" element={<Events rsvpIds={rsvpIds} onRSVP={addRSVP} onUnRSVP={removeRSVP} />} />
        <Route path="/my-events" element={<MyEvents rsvpIds={rsvpIds} onUnRSVP={removeRSVP} />} />
      </Routes>
    </>
  )
}
```

- [ ] **Step 3: Verify — no crashes**

Visit `http://localhost:5173`. All 5 routes should load without console errors. The `Events` and `MyEvents` components will receive new props but don't yet use them — that's fine for now.

Open DevTools → Application → Local Storage → `localhost`. After first visit, `mims_rsvps` key should be present with value `[]`.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add RSVP state to App with localStorage persistence"
```

---

## Chunk 2: FeedbackMessage + EventCard Components

### Task 2: Create FeedbackMessage component

**Files:**
- Create: `src/components/FeedbackMessage.jsx`

- [ ] **Step 1: Create `src/components/FeedbackMessage.jsx`**

```jsx
import './FeedbackMessage.css'

export default function FeedbackMessage({ visible }) {
  return (
    <p className={`feedback-message${visible ? ' feedback-message--visible' : ''}`}>
      ✓ Saved to My Events
    </p>
  )
}
```

- [ ] **Step 2: Create `src/components/FeedbackMessage.css`**

```css
.feedback-message {
  opacity: 0;
  transition: opacity 0.2s;
  color: var(--text-muted);
  font-size: 12px;
  margin: 4px 0 0 0;
  min-height: 18px;
}

.feedback-message--visible {
  opacity: 1;
}
```

- [ ] **Step 3: Verify the component renders without errors**

Temporarily import and render it in `Events.jsx` with `visible={true}`:

```jsx
import FeedbackMessage from '../components/FeedbackMessage'
// add anywhere visible in the JSX temporarily:
<FeedbackMessage visible={true} />
```

Visit `/events`. You should see "✓ Saved to My Events" in muted text. Remove the temporary import/render — do not commit it.

---

### Task 3: Create EventCard component

**Files:**
- Create: `src/components/EventCard.jsx`
- Create: `src/components/EventCard.css`

- [ ] **Step 1: Create `src/components/EventCard.css`**

```css
.event-card {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: 0 !important;
  margin-bottom: 8px;
}

.event-card .card-body {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
}

.event-card__date {
  color: var(--red);
  font-size: 11px;
  font-weight: 700;
  width: 52px;
  flex-shrink: 0;
  padding-top: 2px;
}

.event-card__content {
  flex: 1;
}

.event-card__title {
  color: var(--text-primary) !important;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 3px !important;
}

.event-card__meta {
  color: var(--text-muted) !important;
  font-size: 12px;
  margin-bottom: 5px !important;
}

.event-card__desc {
  color: var(--text-secondary) !important;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 0 !important;
}

.event-card__rsvp {
  flex-shrink: 0;
  font-size: 11px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
```

- [ ] **Step 2: Create `src/components/EventCard.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import FeedbackMessage from './FeedbackMessage'
import './EventCard.css'

export default function EventCard({ event, isRsvpd, onRSVP, onUnRSVP }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!showFeedback) return
    const timer = setTimeout(() => setShowFeedback(false), 1500)
    return () => clearTimeout(timer)
  }, [showFeedback])

  function handleRSVP() {
    onRSVP(event.id)
    setShowFeedback(true)
  }

  function handleUnRSVP() {
    onUnRSVP(event.id)
    setShowFeedback(false)
    setHovered(false)
  }

  let buttonLabel = isRsvpd ? (hovered ? 'Remove' : '✓ RSVP\'d') : 'RSVP'

  return (
    <Card className="event-card">
      <Card.Body>
        <div className="event-card__date">{event.date}</div>
        <div className="event-card__content">
          <Card.Title className="event-card__title">{event.title}</Card.Title>
          <Card.Subtitle className="event-card__meta">
            📍 {event.location} · {event.time}
          </Card.Subtitle>
          <Card.Text className="event-card__desc">{event.description}</Card.Text>
          <FeedbackMessage visible={showFeedback} />
        </div>
        <Button
          variant={isRsvpd ? 'danger' : 'outline-danger'}
          size="sm"
          className="event-card__rsvp"
          onClick={isRsvpd ? handleUnRSVP : handleRSVP}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {buttonLabel}
        </Button>
      </Card.Body>
    </Card>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FeedbackMessage.jsx src/components/FeedbackMessage.css src/components/EventCard.jsx src/components/EventCard.css
git commit -m "feat: add FeedbackMessage and EventCard components"
```

---

## Chunk 3: Events Page Refactor

### Task 4: Refactor Events.jsx to use EventCard

**Files:**
- Modify: `src/pages/Events.jsx`
- Modify: `src/pages/Events.css`

- [ ] **Step 1: Read the current Events.jsx**

Note the current inline `Card` map and the hardcoded `index === 0` RSVP'd mock. Both will be replaced.

- [ ] **Step 2: Replace Events.jsx**

```jsx
import { events } from '../data/events'
import { Badge } from 'react-bootstrap'
import EventCard from '../components/EventCard'
import './Events.css'

export default function Events({ rsvpIds = [], onRSVP, onUnRSVP }) {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">What's Happening</Badge>
      <h1 className="page-title">Upcoming Events</h1>
      <p className="page-subtitle">RSVP to save events to your personal list.</p>
      <hr className="divider" />
      <div className="events__list">
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isRsvpd={rsvpIds.includes(event.id)}
            onRSVP={onRSVP}
            onUnRSVP={onUnRSVP}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Replace Events.css**

Replace the entire contents of `src/pages/Events.css` with just the page-level list rule (all card-level styles now live in `EventCard.css`):

```css
.events__list {
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 4: Verify in browser**

Visit `http://localhost:5173/events`. Expected:
- All 4 events render with correct date, title, meta, description
- All buttons show `RSVP` (outline red) — no hardcoded RSVP'd state
- Click `RSVP` on any event: button turns filled red showing `✓ RSVP'd`
- Hover over an RSVP'd button: label changes to `Remove`
- Click `Remove` (or `✓ RSVP'd` again): button reverts to outline `RSVP`
- After RSVP, `✓ Saved to My Events` appears below the description and fades out after 1.5s
- Check DevTools → Local Storage: `mims_rsvps` updates on each toggle

- [ ] **Step 5: Commit**

```bash
git add src/pages/Events.jsx src/pages/Events.css
git commit -m "feat: refactor Events page to use EventCard with live RSVP state"
```

---

## Chunk 4: MyEventRow + MyEvents Populated State

### Task 5: Create MyEventRow component

**Files:**
- Create: `src/components/MyEventRow.jsx`
- Create: `src/components/MyEventRow.css`

- [ ] **Step 1: Create `src/components/MyEventRow.css`**

```css
.my-event-row {
  background: var(--surface);
  border-left: 3px solid var(--red);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.my-event-row__info {
  flex: 1;
}

.my-event-row__title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 2px;
}

.my-event-row__meta {
  color: var(--text-muted);
  font-size: 12px;
}
```

- [ ] **Step 2: Create `src/components/MyEventRow.jsx`**

```jsx
import { Button } from 'react-bootstrap'
import './MyEventRow.css'

export default function MyEventRow({ event, onUnRSVP }) {
  return (
    <div className="my-event-row">
      <div className="my-event-row__info">
        <div className="my-event-row__title">{event.title}</div>
        <div className="my-event-row__meta">{event.date} · {event.location}</div>
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => onUnRSVP(event.id)}
      >
        Remove
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MyEventRow.jsx src/components/MyEventRow.css
git commit -m "feat: add MyEventRow component"
```

---

### Task 6: Wire up MyEvents populated state

**Files:**
- Modify: `src/pages/MyEvents.jsx`
- Modify: `src/pages/MyEvents.css`

- [ ] **Step 1: Read the current MyEvents.jsx**

Note the existing empty state markup — it stays unchanged. The populated state wraps around it conditionally.

- [ ] **Step 2: Replace MyEvents.jsx**

```jsx
import { Link } from 'react-router-dom'
import { Badge, Button } from 'react-bootstrap'
import { events } from '../data/events'
import MyEventRow from '../components/MyEventRow'
import './MyEvents.css'

export default function MyEvents({ rsvpIds = [], onUnRSVP }) {
  const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))

  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">Your Schedule</Badge>
      <h1 className="page-title">My Events</h1>
      <p className="page-subtitle">Events you've RSVP'd to. Saved locally in your browser.</p>
      <hr className="divider" />

      {rsvpdEvents.length > 0 ? (
        <>
          <div className="section-heading my-events__heading">
            RSVP'd Events ({rsvpdEvents.length})
          </div>
          <div className="my-events__list">
            {rsvpdEvents.map(event => (
              <MyEventRow
                key={event.id}
                event={event}
                onUnRSVP={onUnRSVP}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="my-events__empty">
          <div className="my-events__empty-icon">🎵</div>
          <h2>No events yet</h2>
          <p>Head to the Events page and RSVP to something!</p>
          <Button as={Link} to="/events" variant="outline-danger" size="sm">Browse Events →</Button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Add populated-state styles to MyEvents.css**

Read the current `src/pages/MyEvents.css` first. Add these rules to the bottom without removing the existing `.my-events__empty` styles:

```css
.my-events__heading {
  margin-bottom: 12px;
}

.my-events__list {
  display: flex;
  flex-direction: column;
}
```

- [ ] **Step 4: Verify in browser**

Go to `/events`, RSVP to 2 events, then navigate to `/my-events`. Expected:
- Section heading: `RSVP'd Events (2)`
- Two `MyEventRow` entries with correct title, date, location
- Click `Remove` on one → count updates to `(1)`, row disappears
- Remove the last one → empty state appears with 🎵 icon
- Navigate back to `/events` — the removed events show `RSVP` (outline) again

Check DevTools Local Storage after each Remove: `mims_rsvps` array updates correctly.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MyEvents.jsx src/pages/MyEvents.css
git commit -m "feat: add MyEvents populated state with Remove functionality"
```

---

## Chunk 5: Navbar Badge

### Task 7: Add RSVP count badge to Navbar

**Files:**
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Navbar.css`

- [ ] **Step 1: Read the current Navbar.jsx**

Note that `Nav.Link as={NavLink}` is used for all links. The badge renders inline inside the My Events link text.

- [ ] **Step 2: Update Navbar.jsx to accept and display rsvpCount**

Replace `src/components/Navbar.jsx`:

```jsx
import { NavLink, Link } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'
import './Navbar.css'

export default function Navbar({ rsvpCount = 0 }) {
  return (
    <BsNavbar className="mims-navbar" expand="md" sticky="top">
      <Container fluid className="mims-navbar__inner">
        <BsNavbar.Brand as={Link} to="/" className="mims-navbar__logo">
          MIMS
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/leadership">Leadership</Nav.Link>
            <Nav.Link as={NavLink} to="/events">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/my-events">
              My Events
              {rsvpCount > 0 && (
                <span className="navbar__badge">{rsvpCount}</span>
              )}
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
```

- [ ] **Step 3: Add badge styles to Navbar.css**

Add to the bottom of `src/components/Navbar.css`:

```css
.navbar__badge {
  display: inline-block;
  background: var(--red);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  margin-left: 4px;
  vertical-align: middle;
  line-height: 1.6;
}
```

- [ ] **Step 4: Verify in browser**

RSVP to 1 event on `/events`. Expected:
- "My Events" in the navbar now shows a red pill badge with `1`
- RSVP to a second: badge updates to `2`
- Navigate to `/my-events`, Remove one: badge updates to `1`
- Remove all: badge disappears entirely

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.jsx src/components/Navbar.css
git commit -m "feat: add live RSVP count badge to navbar"
```

---

## Chunk 6: Final Verification + Deploy

### Task 8: Full smoke test

- [ ] **Step 1: Clear localStorage and do a full end-to-end test**

Open DevTools → Application → Local Storage → right-click `localhost` → Clear. Then:

1. `/` — Home loads, event preview rows visible, "Explore Events →" link works
2. `/about` — Content renders, no errors
3. `/leadership` — Officer grid renders
4. `/events` — 4 events render, all buttons show `RSVP` (outline)
5. RSVP to events #1 and #3: buttons go filled red, "✓ Saved to My Events" appears then fades
6. Hover over a RSVP'd button — label changes to `Remove`
7. Navbar badge shows `2`
8. Navigate to `/my-events` — populated state shows 2 rows
9. Remove event #1 — badge updates to `1`, row disappears
10. Remove event #3 — badge disappears, empty state appears
11. Refresh the page — empty state persists (localStorage correctly empty)
12. RSVP to event #2, refresh — badge shows `1`, My Events still shows 1 row (localStorage persisted)
13. Navbar mobile toggle (narrow the browser) — hamburger opens, all links work, badge visible

- [ ] **Step 2: Check for React warnings in console**

Open the browser console. There should be no warnings about:
- Missing `key` props
- Unknown DOM props
- State updates on unmounted components

Fix any warnings before proceeding.

---

### Task 9: Push to GitHub and verify deployment

- [ ] **Step 1: Check git log is clean**

```bash
git log --oneline -10
```

Expected: a clean series of commits from this session ending with the navbar badge commit.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin main
```

Expected: push succeeds, GitHub Actions workflow triggers automatically.

- [ ] **Step 3: Wait for deployment**

```bash
gh run watch
```

Or visit the repository's Actions tab on GitHub. The `Deploy to GitHub Pages` workflow should complete within ~2 minutes.

- [ ] **Step 4: Verify live site**

Visit the GitHub Pages URL (format: `https://<username>.github.io/<repo>/`). Repeat the smoke test from Task 8 on the live site:
- All 5 routes work
- RSVP toggle works
- Badge updates
- My Events populated/empty states work
- localStorage persists across page refresh on the live domain

- [ ] **Step 5: Final commit if any fixes were needed**

If any bugs were caught in the live smoke test, fix them, commit, and push again. Otherwise the plan is complete.
