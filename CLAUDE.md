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
├── Sidebar        (nav, logout)
├── Topbar         (search input, FiltersPanel trigger)
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
