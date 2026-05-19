# Technology Stack

## Frontend
- React 18
- TypeScript 5 (strict mode enabled)
- Vite 5 (SWC transpiler via @vitejs/plugin-react-swc)
- Tailwind CSS 3 (class-based dark mode)
- shadcn/ui (Radix UI primitives)
- React Router DOM v6
- TanStack Query v5

## Testing
- Vitest (unit + integration)
- Playwright (e2e)
- React Testing Library

## Tooling
- ESLint 9 + typescript-eslint
- Bun (primary package manager)
- npm (fallback, lock file present)

## Design System
- Colors: cyber-red, cyber-blue, cyber-green, cyber-yellow, cyber-purple (custom Tailwind tokens)
- Fonts: Orbitron (display headings), JetBrains Mono (mono/body)
- Dark mode only
- Effects: grid background, scanline overlay, glow utilities (in /src/index.css)
