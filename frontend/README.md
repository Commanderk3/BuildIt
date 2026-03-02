# BuildIt Frontend

React + TypeScript + Vite frontend for the BuildIt UI.

## Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- shadcn/ui + Radix primitives
- Sandpack (`@codesandbox/sandpack-react`)

## Requirements

- Node.js 20+
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

App runs on Vite's default dev server (usually `http://localhost:5173`).

## Available Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Type-check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Routes

- `/` - Home page
- `/signup` - Signup page
- `/work` - WorkStation page (wrapped with `BuildProvider`)

## WorkStation Notes

`src/pages/WorkStation.tsx` supports three modes:

- `preview`
- `code_editor`
- `inspector`

In inspector mode, TSX nodes are instrumented with IDs, selection messages are read from `window.postMessage`, and selected node style metadata is pushed into build context state.

## Project Structure

```text
src/
  components/
    ui/                # shadcn/ui components
    Inspector.tsx
    SandpackWindow.tsx
  contexts/
    BuildContext.tsx
  lib/
    ast/
      parser.ts
      updateCode.ts
    getStyle.ts
  pages/
    Home.tsx
    signup.tsx
    WorkStation.tsx
```

## shadcn/ui

To add UI elements from shadcn:

```bash
npx shadcn@latest add button
```

## Notes / TODO

- Add stronger type guards around cross-window message payloads in WorkStation event handling.
- Define and document the backend chat persistence + streaming contract before wiring full frontend integration.

