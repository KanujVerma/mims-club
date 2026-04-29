# MIMS Design Overhaul Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the MIMS club site to final-submission quality through component extraction (OfficerCard, PageHeader, AnimatedPage → 12 total), Framer Motion animations, WCAG AA color contrast fixes, Inter font, and per-page design polish — all without touching any existing functionality.

**Architecture:** Layer the work in order: foundation (deps + tokens) → component extraction → CSS polish per page → accessibility fixes → Framer Motion on top of the validated layout. Each layer is verifiable before the next begins.

**Tech Stack:** Vite + React 18 + React Bootstrap 2 + React Router v6 + Framer Motion (to install) + plain CSS modules per component

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `src/components/OfficerCard.jsx` | Officer avatar + name + role — extracted from Leadership |
| `src/components/OfficerCard.css` | OfficerCard styles only |
| `src/components/PageHeader.jsx` | Red badge + h1 + subtitle + divider — shared across 4 pages |
| `src/components/PageHeader.css` | PageHeader styles only |
| `src/components/AnimatedPage.jsx` | Framer Motion page transition wrapper — wraps all 5 pages |

### Modified files
| File | What changes |
|---|---|
| `index.html` | Add Inter Google Fonts `<link>` |
| `src/index.css` | Update color tokens, add `--red-text`, `--surface-raised`; update font-family |
| `src/App.jsx` | Add `useLocation`, `AnimatePresence` wrapping `<Routes>` |
| `src/components/Navbar.css` | Active link → `--red-text`; add `:focus-visible` ring |
| `src/components/EventCard.jsx` | `Card.Title as="div"`; wrap RSVP button in `motion.div`; add stagger variants |
| `src/components/EventCard.css` | Add `border-left: 3px solid var(--red)`; `background: var(--surface-raised)`; box-shadow |
| `src/components/FeedbackMessage.css` | Color already uses `--text-muted`; verify it picks up the bumped value |
| `src/pages/Home.jsx` | Responsive H1 clamp; hero radial gradient; wrap hero in stagger `motion.div` |
| `src/pages/Home.css` | H1 font-size via clamp; hero gradient |
| `src/pages/About.jsx` | Use `<PageHeader>`; convert `.section-heading` divs → `<h2>`; keep item titles as `<h3>` |
| `src/pages/Leadership.jsx` | Use `<PageHeader>`; use `<OfficerCard>` in map |
| `src/pages/Leadership.css` | Stagger entrance styles if needed |
| `src/pages/Events.jsx` | Use `<PageHeader>`; wrap list in stagger `motion.div` |
| `src/pages/MyEvents.jsx` | Use `<PageHeader>`; wrap list in `<AnimatePresence initial={false}>` |

---

## Chunk 1: Foundation

### Task 1: Install Framer Motion

**Files:** `package.json`, `package-lock.json` (auto-updated)

- [ ] **Step 1: Install**

```bash
cd /Users/kanuj/mims-club
npm install framer-motion
```

Expected: `added N packages` with no errors. `framer-motion` appears in `package.json` dependencies.

- [ ] **Step 2: Verify install**

```bash
grep "framer-motion" /Users/kanuj/mims-club/package.json
```

Expected: `"framer-motion": "^X.Y.Z"` in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install framer-motion"
```

---

### Task 2: Update color tokens and typography

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Update `src/index.css` — `:root` token block**

Replace the existing `:root` and `[data-bs-theme="dark"]` blocks with:

```css
/* ── Design Tokens ── */
:root {
  --bg: #0d0d0d;
  --surface: #1a1a1a;
  --surface-raised: #161616;
  --border: #252525;
  --red: #cc0000;
  --red-text: #ff3333;
  --red-hover: #ff4444;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --text-muted: #888888;
}

/* ── Bootstrap Overrides ── */
:root,
[data-bs-theme="dark"] {
  --bs-danger: #cc0000;
  --bs-danger-rgb: 204, 0, 0;
  --bs-primary: #cc0000;
  --bs-primary-rgb: 204, 0, 0;
  --bs-body-bg: #0d0d0d;
  --bs-body-color: #ffffff;
  --bs-card-bg: #161616;
  --bs-card-border-color: #252525;
  --bs-border-color: #252525;
}
```

- [ ] **Step 2: Update font-family in body rule**

Find the `body` rule in `src/index.css`. Change `font-family`:

```css
body {
  background: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  min-height: 100vh;
}
```

- [ ] **Step 3: Add outline-danger text override**

Add this rule near the Bootstrap overrides section:

```css
/* ── WCAG AA: red text on dark must use --red-text not --red ── */
.btn-outline-danger {
  color: var(--red-text) !important;
  border-color: var(--red-text) !important;
}
.btn-outline-danger:hover,
.btn-outline-danger:focus {
  background-color: var(--red) !important;
  border-color: var(--red) !important;
  color: #ffffff !important;
}
```

- [ ] **Step 4: Add Inter to `index.html`**

In `index.html`, add inside `<head>` before the closing `</head>` tag (after the title):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
```

- [ ] **Step 5: Start dev server and verify font loads**

```bash
npm run dev
```

Open http://localhost:5173 (or whatever port Vite reports). In browser devtools → Computed styles on `body` → `font-family` should show `Inter` first. Text should look sharper with the new font.

- [ ] **Step 6: Commit**

```bash
git add src/index.css index.html
git commit -m "feat: update color tokens for WCAG AA and add Inter font"
```

> **Note:** The Home H1 responsive clamp (`clamp(36px, 6vw, 56px)`) is handled in Chunk 3 Task 7 (Home hero polish), not here. Tokens established in this task are used by every subsequent CSS change.

---

## Chunk 2: New Components

### Task 3: Create OfficerCard

**Files:**
- Create: `src/components/OfficerCard.jsx`
- Create: `src/components/OfficerCard.css`
- Modify: `src/pages/Leadership.jsx` (use the new component)

- [ ] **Step 1: Read Leadership.jsx to understand current officer card structure**

Read `src/pages/Leadership.jsx` — the officer card is currently an inline `<div className="officer-card">` inside the map. Extract this structure exactly into the new component.

- [ ] **Step 2: Create `src/components/OfficerCard.jsx`**

```jsx
import './OfficerCard.css'

export default function OfficerCard({ officer }) {
  return (
    <div className="officer-card">
      <div className="officer-card__avatar">{officer.initials}</div>
      <div className="officer-card__name">{officer.name}</div>
      <div className="officer-card__role">{officer.role}</div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/OfficerCard.css`**

Move the `.officer-card` rules from `src/pages/Leadership.css` into this file. Read `Leadership.css` first to copy the exact rules, then remove them from `Leadership.css`.

After reading Leadership.css, the new `OfficerCard.css` should contain:

```css
.officer-card {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  padding: 24px 16px;
  text-align: center;
  border-radius: 4px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.officer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.officer-card__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1a0000;
  border: 2px solid var(--red);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  color: var(--red-text);
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 1px;
}

.officer-card__name {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
}

.officer-card__role {
  color: var(--red-text);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}
```

**Note:** If `Leadership.css` already has different styles, copy them exactly and only adjust `color: var(--red)` to `color: var(--red-text)` for the role text (WCAG fix).

- [ ] **Step 4: Update Leadership.jsx to use OfficerCard**

```jsx
import { Badge } from 'react-bootstrap'
import { officers } from '../data/officers'
import OfficerCard from '../components/OfficerCard'
import './Leadership.css'

export default function Leadership() {
  return (
    <div className="page">
      <Badge bg="danger" className="red-tag">The Team</Badge>
      <h1 className="page-title">Leadership</h1>
      <p className="page-subtitle">Meet the officers running MIMS for 2024–25.</p>
      <hr className="divider" />
      <div className="section-heading">Executive Board</div>
      <div className="leadership__grid">
        {officers.map(officer => (
          <OfficerCard key={officer.id} officer={officer} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Remove officer-card styles from Leadership.css**

Open `src/pages/Leadership.css`. Remove any `.officer-card`, `.officer-card__avatar`, `.officer-card__name`, `.officer-card__role` rules — they now live in `OfficerCard.css`.

- [ ] **Step 6: Verify Leadership page looks identical**

With dev server running, navigate to `/leadership`. Officers should appear exactly as before. No visual regression.

- [ ] **Step 7: Commit**

```bash
git add src/components/OfficerCard.jsx src/components/OfficerCard.css src/pages/Leadership.jsx src/pages/Leadership.css
git commit -m "refactor: extract OfficerCard component from Leadership"
```

---

### Task 4: Create PageHeader

**Files:**
- Create: `src/components/PageHeader.jsx`
- Create: `src/components/PageHeader.css`
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Leadership.jsx`
- Modify: `src/pages/Events.jsx`
- Modify: `src/pages/MyEvents.jsx`

PageHeader is used on 4 pages (About, Leadership, Events, MyEvents). Home keeps its own hero layout.

- [ ] **Step 1: Create `src/components/PageHeader.jsx`**

```jsx
import { Badge } from 'react-bootstrap'
import './PageHeader.css'

export default function PageHeader({ tag, title, subtitle }) {
  return (
    <div className="page-header">
      <Badge bg="danger" className="red-tag">{tag}</Badge>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      <hr className="divider" />
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/PageHeader.css`**

```css
.page-header {
  margin-bottom: 0;
}
```

(Minimal — PageHeader uses global utility classes `page-title`, `page-subtitle`, `divider`, `red-tag` that already exist in `index.css`.)

- [ ] **Step 3: Update About.jsx — use PageHeader**

Read `src/pages/About.jsx` first, then replace the top-of-page markup:

```jsx
import { Badge } from 'react-bootstrap'  // remove this import
import PageHeader from '../components/PageHeader'  // add this
import './About.css'

// Remove these lines from JSX:
//   <Badge bg="danger" className="red-tag">Who We Are</Badge>
//   <h1 className="page-title">About MIMS</h1>
//   <hr className="divider" />

// Replace with:
//   <PageHeader tag="Who We Are" title="About MIMS" />
```

Full updated About.jsx:

```jsx
import PageHeader from '../components/PageHeader'
import './About.css'

const whatWeDo = [
  { title: 'Industry Panels', desc: 'Hear directly from label executives, managers, and artists.' },
  { title: 'Networking Mixers', desc: 'Build your professional network before you graduate.' },
  { title: 'Workshops', desc: 'Hands-on skills in music marketing, A&R, and more.' },
  { title: 'Career Support', desc: 'Resume reviews, mock interviews, and internship leads.' },
]

export default function About() {
  return (
    <div className="page">
      <PageHeader tag="Who We Are" title="About MIMS" />

      <section className="about__mission">
        <h2 className="section-heading">Our Mission</h2>
        <p>
          MIMS — Music Industry for Madison Students — bridges the gap between UW–Madison academics
          and the professional music business world. We bring together students passionate about
          labels, publishing, management, marketing, and live events.
        </p>
      </section>

      <hr className="divider" />

      <section>
        <h2 className="section-heading">What We Do</h2>
        <div className="about__what-grid">
          {whatWeDo.map(item => (
            <div key={item.title} className="about__what-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="about__membership">
        <h2 className="section-heading">Membership</h2>
        <p>
          Open to all UW–Madison students. No audition, no experience required — just a passion
          for the music industry. Meetings are biweekly on Tuesdays.
        </p>
      </section>
    </div>
  )
}
```

**Heading structure after this change:** h1 (About MIMS) → h2 (Our Mission) → h2 (What We Do) → h3 (Industry Panels, etc.) → h2 (Membership). No skips.

- [ ] **Step 4: Update Leadership.jsx — use PageHeader**

Revise the Leadership.jsx from Task 3 to use PageHeader:

```jsx
import { officers } from '../data/officers'
import PageHeader from '../components/PageHeader'
import OfficerCard from '../components/OfficerCard'
import './Leadership.css'

export default function Leadership() {
  return (
    <div className="page">
      <PageHeader tag="The Team" title="Leadership" subtitle="Meet the officers running MIMS for 2024–25." />
      <div className="section-heading">Executive Board</div>
      <div className="leadership__grid">
        {officers.map(officer => (
          <OfficerCard key={officer.id} officer={officer} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Update Events.jsx — use PageHeader**

Read `src/pages/Events.jsx` then update:

```jsx
import { events } from '../data/events'
import PageHeader from '../components/PageHeader'
import EventCard from '../components/EventCard'
import './Events.css'

export default function Events({ rsvpIds = [], onRSVP, onUnRSVP }) {
  return (
    <div className="page">
      <PageHeader tag="What's Happening" title="Upcoming Events" subtitle="RSVP to save events to your personal list." />
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

- [ ] **Step 6: Update MyEvents.jsx — use PageHeader**

**Note:** The `<div className="section-heading">RSVP'd Events ({rsvpdEvents.length})</div>` inside the populated state intentionally stays as a styled `div`, not a heading. It's a count label, not a document section. This is the correct semantic choice — the page h1 already names the page.

Read `src/pages/MyEvents.jsx` then update the header section:

```jsx
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { events } from '../data/events'
import PageHeader from '../components/PageHeader'
import MyEventRow from '../components/MyEventRow'
import './MyEvents.css'

export default function MyEvents({ rsvpIds = [], onUnRSVP }) {
  const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))

  return (
    <div className="page">
      <PageHeader tag="Your Schedule" title="My Events" subtitle="Events you've RSVP'd to. Saved locally in your browser." />

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

- [ ] **Step 7: Verify all 4 pages render correctly**

With dev server running, check /about, /leadership, /events, /my-events. All pages should have consistent headers with the red badge, h1, optional subtitle, and divider. No visual regressions.

- [ ] **Step 8: Commit**

```bash
git add src/components/PageHeader.jsx src/components/PageHeader.css \
        src/pages/About.jsx src/pages/Leadership.jsx \
        src/pages/Events.jsx src/pages/MyEvents.jsx
git commit -m "refactor: extract PageHeader component, update About/Leadership/Events/MyEvents"
```

---

### Task 5: Create AnimatedPage + wire App.jsx

> **Prerequisites:** `framer-motion` was installed in Chunk 1 Task 1. `BrowserRouter` lives in `main.jsx` wrapping `<App>`, so `useLocation()` is safe to call inside `App.jsx` — no restructuring needed.

**Files:**
- Create: `src/components/AnimatedPage.jsx`
- Modify: `src/App.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Leadership.jsx`
- Modify: `src/pages/Events.jsx`
- Modify: `src/pages/MyEvents.jsx`

- [ ] **Step 1: Create `src/components/AnimatedPage.jsx`**

```jsx
import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
}

export default function AnimatedPage({ children }) {
  const prefersReduced = useReducedMotion()
  const v = prefersReduced ? reducedVariants : variants
  return (
    <motion.div
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Update App.jsx — add AnimatePresence + useLocation**

Read `src/App.jsx` first, then replace:

```jsx
import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
  const location = useLocation()

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
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/events"     element={<Events rsvpIds={rsvpIds} onRSVP={addRSVP} onUnRSVP={removeRSVP} />} />
          <Route path="/my-events"  element={<MyEvents rsvpIds={rsvpIds} onUnRSVP={removeRSVP} />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 3: Wrap each page in AnimatedPage**

For each of the 5 page files, wrap the outermost return value in `<AnimatedPage>`. The `<div className="page">` becomes the child of `<AnimatedPage>`.

**Home.jsx** — outer wrapper becomes:
```jsx
import AnimatedPage from '../components/AnimatedPage'
// ...
return (
  <AnimatedPage>
    <div className="page">
      {/* existing content unchanged */}
    </div>
  </AnimatedPage>
)
```

**About.jsx, Leadership.jsx, Events.jsx, MyEvents.jsx** — same pattern: add `import AnimatedPage` at top, wrap `<div className="page">` in `<AnimatedPage>`.

- [ ] **Step 4: Verify page transitions work**

With dev server running, navigate between pages. Each route change should show a subtle fade + slight upward slide (y: 8 → 0, opacity 0 → 1). The old page should fade out (y: 0 → -8) before the new one fades in. Duration is ~220ms — very quick, not dramatic.

To test reduced-motion: in macOS System Settings → Accessibility → Display → enable "Reduce Motion". Reload the page and navigate — transitions should be opacity-only fades with no y movement. Re-disable when done.

- [ ] **Step 5: Commit**

```bash
git add src/components/AnimatedPage.jsx src/App.jsx \
        src/pages/Home.jsx src/pages/About.jsx src/pages/Leadership.jsx \
        src/pages/Events.jsx src/pages/MyEvents.jsx
git commit -m "feat: add AnimatedPage wrapper and wire AnimatePresence in App"
```

---

## Chunk 3: CSS Design Pass

### Task 6: Navbar polish + focus states

**Files:**
- Modify: `src/components/Navbar.css`

- [ ] **Step 1: Read current Navbar.css**

Read `src/components/Navbar.css` to understand existing rules.

- [ ] **Step 2: Update Navbar.css**

Replace the file content with the polished version:

```css
.mims-navbar {
  background: var(--bg) !important;
  border-bottom: 1px solid var(--border);
}

.mims-navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}

.mims-navbar__logo {
  color: var(--text-primary) !important;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 4px;
  text-decoration: none;
  text-transform: uppercase;
}

/* Nav links */
.mims-navbar .nav-link {
  color: var(--text-muted) !important;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  padding: 8px 12px !important;
  transition: color 0.15s ease;
}

.mims-navbar .nav-link:hover {
  color: var(--text-secondary) !important;
}

/* Active route */
.mims-navbar .nav-link.active {
  color: var(--red-text) !important;
  border-bottom: 1px solid var(--red-text);
}

/* Keyboard focus ring — all interactive nav elements */
.mims-navbar .nav-link:focus-visible,
.mims-navbar__logo:focus-visible,
.mims-navbar .navbar-toggler:focus-visible {
  outline: 2px solid var(--red-text);
  outline-offset: 3px;
  border-radius: 2px;
}

/* Mobile toggle */
.mims-navbar .navbar-toggler {
  border-color: var(--border);
}

/* RSVP count badge */
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

- [ ] **Step 3: Add global focus-visible styles to index.css**

Add this block to `src/index.css` at the end, after the existing utility classes:

```css
/* ── Global focus states for keyboard navigation ── */
button:focus-visible,
a:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--red-text);
  outline-offset: 3px;
  border-radius: 2px;
}
```

- [ ] **Step 4: Verify**

Tab through the navbar with keyboard. Each link should show a red-text outline ring when focused. Active link should show `--red-text` (#ff3333) instead of `--red` (#cc0000). Verify contrast visually.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.css src/index.css
git commit -m "feat: polish navbar, add focus-visible rings, fix active link contrast"
```

---

### Task 7: Home hero polish

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/Home.css`

- [ ] **Step 1: Update Home.jsx hero section**

Read `src/pages/Home.jsx`. The hero `<section className="home__hero">` gets a responsive H1 and the date text color fix:

```jsx
// In the events preview section, update event-date color:
// .home__event-date class in CSS → uses var(--red-text) not var(--red)
// (handled in CSS step below)

// H1 needs no JSX change — clamp is handled in CSS
// But update event row date color is done via CSS
```

The JSX itself doesn't need changes for the hero — all changes are in CSS.

- [ ] **Step 2: Update Home.css**

Read `src/pages/Home.css`. Apply these changes:

**H1 responsive size** — update inside `.home__hero h1`:
```css
.home__hero h1 {
  font-size: clamp(36px, 6vw, 56px);
  font-weight: 900;
  margin-bottom: 12px;
  line-height: 1.05;
  letter-spacing: -1.5px;
}
```

**Hero radial glow** — add to `.home__hero`:
```css
.home__hero {
  padding: 64px 0 40px;
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.home__hero::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: radial-gradient(ellipse at 90% 10%, rgba(204, 0, 0, 0.08) 0%, transparent 65%);
  pointer-events: none;
}
```

**Date color fix** (text on dark must use --red-text):
```css
.home__event-date {
  color: var(--red-text);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  width: 52px;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Verify**

Navigate to `/`. Hero H1 should be larger with tighter letter-spacing. A very subtle red glow should be visible in the upper-right of the hero. On a narrow viewport (resize browser to ~375px), the H1 should scale down gracefully. Event dates should be `#ff3333` not `#cc0000`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/pages/Home.css
git commit -m "feat: polish Home hero — responsive h1, radial glow, date contrast fix"
```

---

### Task 8: EventCard polish

**Files:**
- Modify: `src/components/EventCard.jsx`
- Modify: `src/components/EventCard.css`

- [ ] **Step 1: Read EventCard.jsx and EventCard.css**

Read both files to understand current structure.

- [ ] **Step 2: Update EventCard.jsx — Card.Title fix**

Change `<Card.Title className="event-card__title">{event.title}</Card.Title>` to use `as="div"`:

```jsx
<Card.Title as="div" className="event-card__title">{event.title}</Card.Title>
```

This fixes the h1 → h5 heading skip. Event titles are list items, not document headings.

- [ ] **Step 3: Update EventCard.css — cinematic depth treatment**

Read `src/components/EventCard.css`. Update the `.event-card` rule to add border-left, raised surface, and shadow:

```css
.event-card {
  background: var(--surface-raised) !important;
  border: 1px solid var(--border) !important;
  border-left: 3px solid var(--red) !important;
  border-radius: 4px !important;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.event-card:hover {
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.5);
}
```

Also update date color in EventCard.css to use `--red-text`:
```css
.event-card__date {
  color: var(--red-text);
  /* rest of existing rules unchanged */
}
```

And update meta/desc colors to use the new tokens:
```css
.event-card__meta {
  color: var(--text-muted);
  /* ... */
}

.event-card__desc {
  color: var(--text-secondary);
  /* ... */
}
```

- [ ] **Step 4: Verify**

Navigate to `/events`. Event cards should have a visible red left border, slightly lifted appearance, and deeper shadow. Hover should deepen the shadow slightly. Date text should be `#ff3333`.

- [ ] **Step 5: Commit**

```bash
git add src/components/EventCard.jsx src/components/EventCard.css
git commit -m "feat: polish EventCard — border-left accent, depth, contrast fixes"
```

---

### Task 9: About, Leadership, MyEvents CSS polish

**Files:**
- Modify: `src/pages/About.css`
- Modify: `src/pages/Leadership.css`
- Modify: `src/pages/MyEvents.css`
- Modify: `src/components/MyEventRow.css`

- [ ] **Step 1: About.css — What We Do card polish**

Read `src/pages/About.css`. Update `.about__what-card` to match cinematic depth:

```css
.about__what-card {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-left: 3px solid var(--red);
  padding: 20px;
  border-radius: 4px;
}

.about__what-card h3 {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
}

.about__what-card p {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
  line-height: 1.6;
}
```

Also update `.section-heading` usage — since we're now using `<h2>` elements with `className="section-heading"`, verify the `.section-heading` rule in `index.css` works on `h2` (it's a class-based rule so it will apply regardless of element — this is fine).

- [ ] **Step 2: MyEvents.css — empty state and list polish**

Read `src/pages/MyEvents.css`. Update the empty state:

```css
.my-events__empty {
  text-align: center;
  padding: 60px 24px;
  background: var(--surface-raised);
  border: 1px dashed var(--border);
  border-radius: 6px;
  margin-top: 8px;
}

.my-events__empty-icon {
  font-size: 36px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.my-events__empty h2 {
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.my-events__empty p {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 20px;
}
```

- [ ] **Step 3: MyEventRow.css — verify left-border accent**

Read `src/components/MyEventRow.css`. Confirm `border-left: 3px solid var(--red)` is present. If not, add it. Update background to `var(--surface-raised)` if not already set.

- [ ] **Step 4: Verify all three pages**

Check /about (mission/what-we-do/membership cards), /leadership (grid of OfficerCards), /my-events (RSVP to an event first, then check row styling; also check empty state by opening in a new incognito window).

- [ ] **Step 5: Commit**

```bash
git add src/pages/About.css src/pages/Leadership.css \
        src/pages/MyEvents.css src/components/MyEventRow.css
git commit -m "feat: CSS polish — About cards, MyEvents empty state, MyEventRow depth"
```

---

## Chunk 4: Framer Motion Animations

### Task 10: Hero stagger animation

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Read Home.jsx — understand hero section structure**

The hero section has these direct children: `<Badge>` (tag), `<h1>`, `<p>`, `<div className="home__hero-buttons">`. These become the staggered children.

- [ ] **Step 2: Read Home.jsx in full before editing**

Read `src/pages/Home.jsx` completely. You will only modify:
1. The import block (add `motion`, `useReducedMotion`)
2. Add `heroParent` and `heroChild` variant constants
3. Wrap `<section className="home__hero">` children in `motion.div` wrappers

**Do NOT touch:**
- The `DiscordIcon`, `GroupMeIcon`, `InstagramIcon` SVG components (lines 6–22 in current file)
- The `<section className="home__community">` block (social buttons)
- The `<section className="home__events">` block (event preview rows)

Apply only these targeted additions to Home.jsx:

**Add at top of file** (new imports + constants):
```jsx
import { motion, useReducedMotion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'

const heroParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const heroChild = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}
```

**Add `const prefersReduced = useReducedMotion()` inside the `Home` function** (before the return).

**Wrap just the hero section children** — change only the `<section className="home__hero">` block:
```jsx
<section className="home__hero">
  <motion.div
    variants={prefersReduced ? {} : heroParent}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={prefersReduced ? {} : heroChild}>
      <Badge bg="danger" className="red-tag">Music Industry for Madison Students</Badge>
    </motion.div>
    <motion.h1 variants={prefersReduced ? {} : heroChild}>Connect. Learn. Grow.</motion.h1>
    <motion.p variants={prefersReduced ? {} : heroChild}>
      The home for music industry students at UW–Madison. Network with professionals, attend exclusive events, and launch your career.
    </motion.p>
    <motion.div className="home__hero-buttons" variants={prefersReduced ? {} : heroChild}>
      <Button as={Link} to="/events" variant="outline-danger" className="btn-mims btn-mims--primary">Explore Events →</Button>
      <Button as={Link} to="/about" variant="outline-secondary" className="btn-mims btn-mims--ghost">About MIMS</Button>
    </motion.div>
  </motion.div>
</section>
```

**Wrap the outer `<div className="page">` in `<AnimatedPage>`** (if not already done in Chunk 2 Task 5).

Everything else in Home.jsx remains identical to the current file.

- [ ] **Step 3: Verify**

Navigate to `/`. The hero elements (badge, h1, paragraph, buttons) should stagger in with a subtle upward fade, starting ~100ms after page load. Total reveal is about 400-500ms. Should feel natural and not overdone.

With OS reduced-motion enabled, the stagger should not fire (variants are `{}` empty objects).

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: hero stagger animation with reduced-motion support"
```

---

### Task 11: EventCard list stagger + hover lift

**Files:**
- Modify: `src/components/EventCard.jsx`
- Modify: `src/pages/Events.jsx`

The list stagger is driven from the Events page; EventCard gets hover lift.

- [ ] **Step 1: Update Events.jsx — staggered list wrapper**

Read `src/pages/Events.jsx`. Add stagger motion wrapper around the event list:

```jsx
import { events } from '../data/events'
import { motion, useReducedMotion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import EventCard from '../components/EventCard'
import AnimatedPage from '../components/AnimatedPage'
import './Events.css'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function Events({ rsvpIds = [], onRSVP, onUnRSVP }) {
  const prefersReduced = useReducedMotion()

  return (
    <AnimatedPage>
      <div className="page">
        <PageHeader tag="What's Happening" title="Upcoming Events" subtitle="RSVP to save events to your personal list." />
        <motion.div
          className="events__list"
          variants={prefersReduced ? {} : listVariants}
          initial="hidden"
          animate="visible"
        >
          {events.map(event => (
            <motion.div key={event.id} variants={prefersReduced ? {} : itemVariants}>
              <EventCard
                event={event}
                isRsvpd={rsvpIds.includes(event.id)}
                onRSVP={onRSVP}
                onUnRSVP={onUnRSVP}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  )
}
```

- [ ] **Step 2: Update EventCard.jsx — hover lift**

Read `src/components/EventCard.jsx`. Wrap the `<Card>` in a `motion.div` for hover:

```jsx
import { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { motion, useReducedMotion } from 'framer-motion'
import FeedbackMessage from './FeedbackMessage'
import './EventCard.css'

export default function EventCard({ event, isRsvpd, onRSVP = () => {}, onUnRSVP = () => {} }) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [hovered, setHovered] = useState(false)
  const prefersReduced = useReducedMotion()

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

  const buttonLabel = isRsvpd ? (hovered ? 'Remove' : "✓ RSVP'd") : 'RSVP'

  return (
    <motion.div
      whileHover={prefersReduced ? {} : { y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      <Card className="event-card">
        <Card.Body>
          <div className="event-card__date">{event.date}</div>
          <div className="event-card__content">
            <Card.Title as="div" className="event-card__title">{event.title}</Card.Title>
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
    </motion.div>
  )
}
```

- [ ] **Step 3: Verify**

Navigate to `/events`. Cards should stagger in from bottom-up over ~300ms. Hovering a card should produce a very slight upward lift (2px). RSVP functionality must still work — test clicking RSVP on one event, verifying it fills red and badge count increments in the navbar.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Events.jsx src/components/EventCard.jsx
git commit -m "feat: event list stagger entrance and card hover lift"
```

---

### Task 12: RSVP spring pop interaction

**Files:**
- Modify: `src/components/EventCard.jsx`

The RSVP button gets the strongest motion — a satisfying spring scale pop on click.

**Key design note:** Using `animate={showFeedback ? keyframe : reset}` alone won't replay the animation if the user RSVPs multiple times quickly (Framer Motion only re-runs when the value changes, not when it's already in the same state). The fix is to add a `rsvpAnimKey` counter that increments on each RSVP click and is passed as `key` on the `motion.div` — forcing a re-mount and replaying the animation every time.

- [ ] **Step 1: Update EventCard.jsx — add rsvpAnimKey state and wrap RSVP button**

Add `rsvpAnimKey` to state:
```jsx
const [rsvpAnimKey, setRsvpAnimKey] = useState(0)
```

Update `handleRSVP` to increment it:
```jsx
function handleRSVP() {
  onRSVP(event.id)
  setShowFeedback(true)
  setRsvpAnimKey(k => k + 1)
}
```

Replace the RSVP Button in JSX with a `motion.div`-keyed wrapper:

```jsx
<motion.div
  key={rsvpAnimKey}
  className="event-card__rsvp-wrapper"
  whileTap={prefersReduced ? {} : { scale: 0.93 }}
  animate={prefersReduced ? {} : { scale: [1, 1.08, 1] }}
  transition={{ type: 'spring', stiffness: 400, damping: 15, duration: 0.2 }}
>
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
</motion.div>
```

Add `.event-card__rsvp-wrapper` to EventCard.css:
```css
.event-card__rsvp-wrapper {
  flex-shrink: 0;
}
```

The `key={rsvpAnimKey}` forces a fresh `motion.div` mount on each RSVP click, guaranteeing the scale keyframe fires every time regardless of prior state. `whileTap` provides immediate tactile press feedback.

- [ ] **Step 2: Verify**

On `/events`, click RSVP on an un-RSVP'd event. The button should visibly pop (scale up then back) as the feedback message appears. Pressing the button should also feel tactile via the `whileTap` shrink. Un-RSVP (hover to show "Remove", click) should have the `whileTap` shrink but no pop.

- [ ] **Step 3: Commit**

```bash
git add src/components/EventCard.jsx src/components/EventCard.css
git commit -m "feat: RSVP spring pop animation on interaction"
```

---

### Task 13: MyEventRow exit animation

**Files:**
- Modify: `src/pages/MyEvents.jsx`

- [ ] **Step 1: Update MyEvents.jsx — AnimatePresence with initial={false}**

Read `src/pages/MyEvents.jsx`. Update the populated state to use `AnimatePresence`:

```jsx
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { events } from '../data/events'
import PageHeader from '../components/PageHeader'
import MyEventRow from '../components/MyEventRow'
import AnimatedPage from '../components/AnimatedPage'
import './MyEvents.css'

export default function MyEvents({ rsvpIds = [], onUnRSVP }) {
  const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))
  const prefersReduced = useReducedMotion()

  return (
    <AnimatedPage>
      <div className="page">
        <PageHeader tag="Your Schedule" title="My Events" subtitle="Events you've RSVP'd to. Saved locally in your browser." />

        {rsvpdEvents.length > 0 ? (
          <>
            <div className="section-heading my-events__heading">
              RSVP'd Events ({rsvpdEvents.length})
            </div>
            <div className="my-events__list">
              <AnimatePresence initial={false}>
                {rsvpdEvents.map(event => (
                  <motion.div
                    key={event.id}
                    exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                  >
                    <MyEventRow
                      event={event}
                      onUnRSVP={onUnRSVP}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
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
    </AnimatedPage>
  )
}
```

`initial={false}` prevents items from animating in on page load — only removals animate.

- [ ] **Step 2: Verify**

1. RSVP to 2-3 events on `/events`
2. Navigate to `/my-events`
3. Items should appear immediately (no entrance animation — `initial={false}`)
4. Click "Remove" on one event — the row should slide left and fade out before disappearing
5. Count in heading should update immediately

- [ ] **Step 3: Commit**

```bash
git add src/pages/MyEvents.jsx
git commit -m "feat: MyEventRow exit animation with AnimatePresence"
```

---

### Task 14: OfficerCard stagger

**Files:**
- Modify: `src/pages/Leadership.jsx`

- [ ] **Step 1: Update Leadership.jsx — staggered grid entrance**

Read `src/pages/Leadership.jsx`. Add stagger motion wrapper around the officer grid:

```jsx
import { motion, useReducedMotion } from 'framer-motion'
import { officers } from '../data/officers'
import PageHeader from '../components/PageHeader'
import OfficerCard from '../components/OfficerCard'
import AnimatedPage from '../components/AnimatedPage'
import './Leadership.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function Leadership() {
  const prefersReduced = useReducedMotion()

  return (
    <AnimatedPage>
      <div className="page">
        <PageHeader tag="The Team" title="Leadership" subtitle="Meet the officers running MIMS for 2024–25." />
        <div className="section-heading">Executive Board</div>
        <motion.div
          className="leadership__grid"
          variants={prefersReduced ? {} : gridVariants}
          initial="hidden"
          animate="visible"
        >
          {officers.map(officer => (
            <motion.div key={officer.id} variants={prefersReduced ? {} : cardVariants}>
              <OfficerCard officer={officer} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedPage>
  )
}
```

- [ ] **Step 2: Verify**

Navigate to `/leadership`. Officer cards should stagger in from bottom-up, each ~50ms after the previous one. Should feel like the grid assembles itself gently. With reduced motion, no transform — cards appear without animation.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Leadership.jsx
git commit -m "feat: OfficerCard stagger entrance animation"
```

---

## Chunk 5: Final Verification

### Task 15: Accessibility audit

**Files:**
- Modify: `src/components/FeedbackMessage.css` (if contrast check fails)
- Modify: any file where issues are found

- [ ] **Step 1: Verify heading structure with browser devtools**

For each page, open browser devtools → Accessibility tab (or install axe DevTools extension). Check the heading structure:

| Page | Expected heading structure |
|---|---|
| Home | h1: "Connect. Learn. Grow." — no sub-headings ✅ |
| About | h1 → h2 (Our Mission) → h2 (What We Do) → h3 (Industry Panels, Networking Mixers, Workshops, Career Support) → h2 (Membership) |
| Leadership | h1 → no sub-headings ✅ |
| Events | h1 → no headings inside event cards (Card.Title as div) ✅ |
| MyEvents | h1 → (if empty: h2 "No events yet") ✅ |

If any skips exist, fix them before proceeding.

- [ ] **Step 2: Verify focus states on all interactive elements**

Tab through the entire app with keyboard only. The following must show a visible red outline (`var(--red-text)`) when focused:
- All navbar links (Home, About, Leadership, Events, My Events)
- MIMS brand logo link
- RSVP buttons on Events page
- Remove buttons on My Events page
- Social links on Home (Discord, GroupMe, Instagram)
- "Browse Events →" button on empty My Events state
- "Explore Events →" and "About MIMS" hero buttons

If any element lacks a visible focus ring, add `:focus-visible` styles to the relevant CSS file.

- [ ] **Step 3: Verify contrast**

Check these specific spots in the rendered browser UI:
- Nav inactive links: should be `#888888` on `#0d0d0d` — visually readable
- Nav active link: `#ff3333` on `#0d0d0d` — should feel clearly red/bright
- Event card dates: `#ff3333` — should be clearly readable
- Event card body text (description): `#aaaaaa` — should be readable
- Event card meta (location/time): `#888888` — should be readable
- Officer card role: `#ff3333` on `#161616` — should be readable

If any element looks too low-contrast in the real UI, adjust its color token assignment.

- [ ] **Step 4: Verify no forms or inputs exist**

```bash
grep -r "<input\|<form\|<select\|<textarea" /Users/kanuj/mims-club/src
```

Expected: no results. If any inputs exist, verify they have associated `<label>` elements or `aria-label` attributes.

- [ ] **Step 5: Commit any accessibility fixes**

```bash
git add -A
git commit -m "fix: accessibility audit — heading structure, focus states, contrast"
```

---

### Task 16: Component count verification

- [ ] **Step 1: Count all component files**

```bash
find /Users/kanuj/mims-club/src -name "*.jsx" | sort
```

Expected files:
```
src/App.jsx
src/components/AnimatedPage.jsx
src/components/EventCard.jsx
src/components/FeedbackMessage.jsx
src/components/MyEventRow.jsx
src/components/Navbar.jsx
src/components/OfficerCard.jsx
src/components/PageHeader.jsx
src/pages/About.jsx
src/pages/Events.jsx
src/pages/Home.jsx
src/pages/Leadership.jsx
src/pages/MyEvents.jsx
src/main.jsx
```

- [ ] **Step 2: Verify each component is actually imported and rendered**

Check that each component is meaningfully used:
- `AnimatedPage` — imported in all 5 pages, wraps `<div className="page">`
- `EventCard` — imported in Events.jsx, rendered in map
- `FeedbackMessage` — imported in EventCard.jsx, rendered in card body
- `MyEventRow` — imported in MyEvents.jsx, rendered in list
- `Navbar` — imported in App.jsx, rendered at root
- `OfficerCard` — imported in Leadership.jsx, rendered in map
- `PageHeader` — imported in About, Leadership, Events, MyEvents — rendered at top of each

Component count: 7 shared components + 5 page components = **12 total** ✅

The rubric states "The page component counts towards the overall number of components."

- [ ] **Step 3: No commit needed — this is verification only**

---

### Task 17: Final rubric checklist + deploy

- [ ] **Step 1: Verify GitHub Pages URL**

```bash
cat /Users/kanuj/mims-club/vite.config.js
```

Check the `base` config. Then check `src/main.jsx` for the `basename` on `<BrowserRouter>`. The deployed URL and basename must match. The basename is `/p116` per `main.jsx`.

```bash
gh repo view --web 2>/dev/null || echo "check repo settings for Pages URL"
```

- [ ] **Step 2: Run the rubric checklist**

Verify each item against the running dev server AND the deployed GitHub Pages URL:

```
□ Committed and pushed to GitHub — run: git log --oneline -5
□ Live on GitHub Pages — open: https://[username].github.io/p116/
□ Consistent React Bootstrap — every page uses Bootstrap components ✅
□ Navbar present, functional, polished — verify active states, badge, mobile toggle
□ 5 pages with React Router — Home, About, Leadership, Events, MyEvents
□ 12 components defined and meaningfully used — verified in Task 16
□ Interactable element polished — RSVP flow: click RSVP → button pops → badge increments → My Events shows event → Remove → event disappears
□ Thoughtful design principles — Inter font, visual hierarchy, consistent spacing, red accent system, cinematic depth
□ No skipped heading levels — verified in Task 15
□ Alt text on images — no img tags exist ✅
□ WCAG AA contrast — verified in Task 15
□ Inputs labeled — no inputs exist ✅
□ Forms keyboard-completable — no forms exist ✅
□ Focus states on all keyboard-navigable controls — verified in Task 15 step 2
```

- [ ] **Step 3: Push to GitHub and verify Pages deployment**

```bash
git push origin main
```

Wait ~2 minutes for GitHub Pages to rebuild, then open the live URL and verify:
1. The site loads at the correct path
2. Navigation works (deep links like `/about`, `/events`)
3. RSVP functionality works end-to-end on the live site
4. Animations are visible

- [ ] **Step 4: Final commit if any last fixes**

```bash
git add -A
git commit -m "feat: Phase 3 design overhaul complete — 12 components, Framer Motion, WCAG AA"
git push origin main
```
