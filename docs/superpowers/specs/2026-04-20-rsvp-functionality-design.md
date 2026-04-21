# MIMS Club — RSVP Functionality & Light Polish Design Spec

**Project:** CS571 Web Project — Check-in #3
**Date:** 2026-04-20
**Status:** Approved
**Builds on:** `docs/superpowers/specs/2026-03-18-mims-design.md` (Phase 1 scaffold)

---

## Overview

Phase 2 implements the RSVP interaction that was stubbed out in Phase 1. Users can now RSVP to events from the Events page, see their saved events on the My Events page, and remove RSVPs from either page. State persists across browser sessions via `localStorage`. Light UX polish is added around the RSVP interaction: clear button state labeling, hover affordances, and an inline feedback message on RSVP.

This phase also extracts two new components (`EventCard`, `MyEventRow`) and adds a navbar count badge, pushing the component count well past the 8-component requirement.

---

## State Architecture

### Single source of truth in `App.jsx`

```
App.jsx
  useState<number[]>(rsvpIds)   ← initialized from localStorage on mount
  useEffect → writes rsvpIds to localStorage on every change

  addRSVP(id: number)    → setRsvpIds(prev => [...prev, id])
  removeRSVP(id: number) → setRsvpIds(prev => prev.filter(x => x !== id))

  <Navbar rsvpCount={rsvpIds.length} />
  <Events rsvpIds={rsvpIds} onRSVP={addRSVP} onUnRSVP={removeRSVP} />
  <MyEvents rsvpIds={rsvpIds} onUnRSVP={removeRSVP} />
```

**localStorage key:** `mims_rsvps` — JSON array of event ID numbers (e.g. `[1, 3]`)

**Initialization:** `JSON.parse(localStorage.getItem('mims_rsvps') || '[]')`

**Sync:** `useEffect(() => { localStorage.setItem('mims_rsvps', JSON.stringify(rsvpIds)) }, [rsvpIds])`

No fake loading state — localStorage is synchronous. No Context — only two pages consume this state.

---

## New & Modified Files

| File | Action | Change |
|---|---|---|
| `src/App.jsx` | Modify | Add rsvpIds state, localStorage sync, pass props |
| `src/components/Navbar.jsx` | Modify | Accept `rsvpCount` prop, render badge |
| `src/components/Navbar.css` | Modify | Badge styles |
| `src/components/EventCard.jsx` | Create | Extracted event row with RSVP logic |
| `src/components/EventCard.css` | Create | EventCard styles (moved from Events.css) |
| `src/components/MyEventRow.jsx` | Create | Single saved-event row with Remove button |
| `src/components/MyEventRow.css` | Create | MyEventRow styles |
| `src/pages/Events.jsx` | Modify | Replace inline map with EventCard, receive props |
| `src/pages/Events.css` | Modify | Remove styles now in EventCard.css |
| `src/pages/MyEvents.jsx` | Modify | Add populated state using rsvpIds + events data |
| `src/pages/MyEvents.css` | Modify | Add populated state styles |

---

## Component Designs

### `EventCard` (`src/components/EventCard.jsx`)

Props: `event`, `isRsvpd: boolean`, `onRSVP(id)`, `onUnRSVP(id)`

Internal state: `showFeedback: boolean` — controls the "Saved to My Events" message.

**Behavior:**
- On RSVP click: call `onRSVP(event.id)`, set `showFeedback = true`, auto-clear after 1500ms via `setTimeout`
- On Un-RSVP click: call `onUnRSVP(event.id)` (no feedback needed — removal is self-evident)

**Layout:**
```
[DATE]  [TITLE]                          [RSVP BUTTON]
        [📍 Location · Time]
        [Description]
        [Saved to My Events ✓]  ← fades in/out, only visible briefly after RSVP
```

**Cleanup:** `useEffect` cleanup clears the timeout on unmount to prevent state updates on dead components.

---

### RSVP Button States

| State | Label | Appearance | Hover |
|---|---|---|---|
| Not RSVP'd | `RSVP` | Outline red (`outline-danger`) | Fills red |
| RSVP'd | `✓ RSVP'd` | Filled red (`danger`) | Label changes to `Remove` |

The hover label change on the RSVP'd button (`✓ RSVP'd` → `Remove`) is done with CSS `:hover` + `::after` content swap or a React `useState(hovered)` on the button, whichever is cleaner.

---

### `MyEventRow` (`src/components/MyEventRow.jsx`)

Props: `event`, `onUnRSVP(id)`

Renders a surface-bg row with:
- Left red border (matching the About page card style)
- Event title (bold white) + date · location (muted)
- `Remove` button (ghost/outline, right-aligned) — calls `onUnRSVP(event.id)`

---

### `MyEvents` — Two States

**State A — Has RSVPs:**
```
RSVP'D EVENTS (3)   ← section heading with live count
────────────────────
<MyEventRow> × n
```

Events are derived by filtering the shared `events` array against `rsvpIds`:
```js
const rsvpdEvents = events.filter(e => rsvpIds.includes(e.id))
```

**State B — Empty:**
Unchanged from Phase 1 — centered empty state with 🎵 icon and "Browse Events →" link.

Switching between states is automatic based on `rsvpIds.length`.

---

### Navbar Badge

`Navbar` receives `rsvpCount: number` prop.

When `rsvpCount > 0`, renders a small red pill badge next to the "My Events" nav text:

```jsx
<NavLink to="/my-events">
  My Events {rsvpCount > 0 && <span className="navbar__badge">{rsvpCount}</span>}
</NavLink>
```

CSS: small inline-block, red bg, white text, `border-radius: 999px`, `padding: 1px 6px`, `font-size: 10px`. Positioned inline after the link text.

---

## UX Polish Details

- **RSVP button transition:** CSS `transition: background 0.15s, color 0.15s` already in place from Phase 1 — no change needed.
- **Hover "Remove" label:** Implemented via React `onMouseEnter/Leave` on the button — simpler than CSS content tricks with Bootstrap buttons.
- **Feedback message:** `opacity` CSS transition (0 → 1) over 200ms, auto-hidden after 1500ms. Small green-tinted or muted text, not a full toast — keeps it subtle.
- **Remove animation:** Row disappears instantly when removed (no exit animation — save that for Phase 3 with Framer Motion).

---

## Component Count (post Phase 2)

| # | Component | Type |
|---|---|---|
| 1 | `Navbar` | Shared component |
| 2 | `EventCard` | New component |
| 3 | `MyEventRow` | New component |
| 4 | `Home` | Page component |
| 5 | `About` | Page component |
| 6 | `Leadership` | Page component |
| 7 | `Events` | Page component |
| 8 | `MyEvents` | Page component |

Total: **8 components** — meets the check-in requirement exactly. Any inline sub-components (RSVP button wrapper, empty state block) push the count higher if needed.

---

## Phase 3 Ideas (deferred)

- **Framer Motion animations:** staggered event list entrance, spring scale pulse on RSVP toggle, page transition fade, animated exit on MyEventRow remove
- **Event detail modal:** click a card to see full event details in a Bootstrap Modal
- **Filter/search bar** on Events page (by date, keyword)
- **Full design pass:** spacing, typography refinements, Inter font, hero section visual upgrade
- **Real data:** actual officer photos, real Discord/GroupMe/Instagram links
- **Leadership page:** LinkedIn links on officer cards

---

## Out of Scope (this phase)

- No React Context (Approach A with lifted state is sufficient)
- No Framer Motion (CSS transitions only)
- No fake loading/disabled states (localStorage is synchronous)
- No filter or search on Events page
- No event detail pages or modals
