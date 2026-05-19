# Coding Standards

## TypeScript
- `strict: true` is required in tsconfig.app.json — no exceptions
- Never use `any` — prefer `unknown` with explicit type narrowing
- Prefer interfaces for public contracts, type aliases for unions and primitives
- Use discriminated unions for action/result types in game engine
- All exported functions must have explicit return type annotations

## React
- Functional components only — no class components
- Custom hooks over imperative patterns
- Avoid prop drilling — use useGame() context hook for game state
- Keep components under 250 lines — extract sub-components when larger
- Co-locate component-specific types in the same file as the component

## Architecture
- No business logic inside /src/components — delegate all logic to /src/lib/
- All game state mutations go in /src/lib/gameEngine.ts as pure functions
- Shared UI primitives live in /src/components/ui/ (shadcn/ui — do not reinvent)
- Game-specific UI lives in /src/components/game/
- Global state lives in /src/contexts/, custom hooks in /src/hooks/

## Testing
- All new features require tests before merge
- Business logic in /src/lib/ requires unit tests covering edge cases
- Use Vitest for unit and integration tests, Playwright for e2e
- Test behavior and outputs, not internal implementation details
