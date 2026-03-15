# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build locally
```

There are no tests in this project.

## Environment

Create a `.env` file in the project root with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

### State & Data Flow

All global state lives in `src/App.jsx` and is passed down via props — there is no Redux or Zustand. The three primary state objects are:

- `machinelist` — all machines with status `in_progress`, fetched on mount with nested relations (`sequenzen`, `kommentare`, `dateien`, `machine_tags`, `maengel`). `machine_tags` is remapped to a flat `Tags` array (array of `tag_id` values) on the machine object.
- `areas` — production areas from the `areas` table, each with a nested `slots` array from `area_slots`.
- `filters` — applied in `MainBoard.jsx` to produce `filteredMachines`, which is passed to every area component.

### Component Hierarchy

```
App.jsx            (state, auth, Supabase fetches, routing)
├── Topbar         (search input, FiltersPanel trigger — no sidebar, removed for space)
└── MainBoard      (filters machines, renders all work areas)
    └── [AreaComponent]  (e.g. PPM1_Pool, Lackierung_Arbeit, ...)
        └── Slot   (one physical slot — creates machine or shows Card)
            ├── Card    (renders machine info, opens Modal)
            └── Modal   (edit machine fields, move between slots, delete, mark finished)
```

### Work Areas & DB Mapping

`MainBoard.jsx` renders areas by **hardcoded index** into the `areas` array (e.g. `areas[0]` = PPM1 Pool, `areas[6]` = PPM2 Pool). The order depends on the DB row order. Each physical work area has separate components per section type (Pool/Line/NAorWait or Arbeit/Puffer/Nacharbeit).

The 13 default sequences created per machine (in `Slot.jsx`) map to these `bereich` values in order:
`PPM1, PPM2, PUMI, Dock, Prüffeld Pumpe, Prüffeld Mast, Lackierung, Endmontage, PDI, Konservieren, Optimieren, BSA Linie, BSA Dock`

### Slot/Machine Relationship

A machine's position in the board is determined by `machine.area` (area name string) and `machine.position` (slot name string). Moving a machine between slots in `Modal.jsx` involves a swap: if the target slot is occupied, the two machines exchange `area` and `position` in the DB, then local state is updated — this is **not atomic**.

### Supabase

All DB access goes through `src/supabaseClient.js`. Auth uses email/password. User metadata fields: `firstName`, `lastName`, `displayName`, `profileColor`.

Key tables: `machines`, `sequenzen`, `kommentare`, `dateien`, `machine_tags`, `maengel`, `areas`, `area_slots`, `globaltags`.

### Notifications

`ToastContext.jsx` wraps the protected layout. Use `const { addToast } = useToast()` anywhere inside that tree to show toasts: `addToast("message", "success" | "error" | "warning" | "info")`.

## Layout & Visual Design

### Board Layout

The board is a **full-screen flex layout** with no sidebar. `App.jsx` renders:
- A fixed `h-8` (32px) `Topbar` at the top
- A scroll container `mt-8 overflow-y-auto overflow-x-hidden` at `height: calc(100vh - 32px)`
- Inside: a board div with `minHeight: '1850px', height: '100%', padding: '8px'`

The `minHeight: 1850px` ensures the tightest grid cells (`grid-rows-6` station areas) are never smaller than ~115px, which is required to fit card content without clipping.

`MainBoard.jsx` is a single `flex gap-1 h-full w-full` row split into:
- **Left group** (`flex-[8]`): PPM1 / PPM2 / PUMI / Dock / BSA rows stacked in a flex-col with vertical proportions `flex-[3/3/2/3/3]`
- **Divider** (`w-6 flex-shrink-0`): coloured vertical labels ("in Arbeit", "Puffer", "Nacharbeit")
- **Right group** (`flex-[7]`): 6 station columns (Pumpe=`flex-[2]`, all others=`flex-[1]`), each a flex-col with sections Arbeit=`flex-[6]`, Puffer=`flex-[5]`, Nacharbeit=`flex-[3]`

Each section is wrapped in an `Area` component (defined inline in `MainBoard.jsx`) that renders a yellow header and passes children into a `flex-1 min-h-0` container.

### Area Grid Components

Every area component (`PPM1_Pool`, `Mast_Arbeit`, etc.) renders a `grid h-full w-full gap-1` with `grid-cols-N grid-rows-M` matching the physical number of slots. Slots fill their grid cell via `h-full w-full`.

### Slot Layout (`Slot.jsx`)

The slot outer div is `flex flex-col ... relative overflow-hidden h-full w-full`. It contains:
1. A tiny absolutely-positioned slot name label (`top-0.5 left-1`, `font-bold`, `clamp(6px, 0.55vw, 9px)`, 70% opacity, `z-10`)
2. When occupied: an **absolute** card container (`absolute inset-0 flex items-center justify-center`) with `padding: 3px, paddingTop: 16px, paddingBottom: 10px` — this centers the card vertically and ensures it never overlaps the slot name label or the bottom edge
3. When empty: a `flex-1 flex items-center justify-center` div with a small `+` sign

### Card (`Card.jsx`)

Cards are **not stretched** — they size to their natural content height and are centered inside the slot by the absolute container. All cards are the same height regardless of slot size.

Card structure (inside `mx-1.5 my-1.5` inner div with left colored border):
- Type badge: `clamp(5px, 0.45vw, 8px)`, colored pill (`TYPE_COLORS` map)
- Customer name: `clamp(6px, 0.65vw, 11px)`, bold
- K-number: `clamp(5px, 0.5vw, 9px)`, gray
- Start / End dates: `clamp(5px, 0.45vw, 8px)`, from the sequenz with `showOnCard = true`
- Tag circles (`TagCircles.jsx`)

Clicking the card opens the `Modal`. There is no separate settings button.

**TYPE_COLORS**: `BSF=#22c55e`, `PUMI=#FFCC00`, `BSA=#f97316`, `Prototyp=#94a3b8`, `E-Mischer=#3b82f6`. All other types fall back to `#e2e8f0`.

### Typography Scaling

All text uses `clamp(min, vw-value, max)` inline styles so it scales with viewport width. Area headings use `clamp(8px, 0.75vw, 13px)`. Never use fixed `text-[Npx]` classes on elements that should scale.

### Colors

- Company yellow: `rgb(255,204,0)` — used for area headers, topbar, accents
- Dark text/UI: `rgb(85,90,90)`
- Background: `rgb(240,241,245)`
- Slot background: `bg-white/40` with `border-white/60`
