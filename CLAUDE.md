# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See `AGENTS.md` for general Expo rules (always check versioned Expo docs — this project is on **Expo SDK 55**, React Native 0.83, React 19.2; install packages with `npx expo install`). This file covers what is specific to this repo.

## Project

"Simulador Trabajo Mecánico" — an educational physics app (Física 1) that simulates mechanical work `W = F · d · cos(θ)`: the user sets force, angle and distance, and sees force components, the work value/interpretation, an SVG vector chart and an animation. A second tab is a flashcard-style wiki of physics concepts. All UI text and code comments are in **Spanish**; keep new user-facing strings in Spanish.

## Commands

The project uses npm (`package-lock.json`), so use `npx`.

```bash
npx expo start          # dev server (Expo Go works: no custom native modules)
npx expo start --web    # web
npx expo lint           # lint (no ESLint config committed yet; first run will set one up)
npx expo-doctor         # dependency/config diagnostics
```

There is no test suite and no TypeScript: the codebase is plain JavaScript/JSX (no `tsconfig.json`), so `npx tsc --noEmit` from AGENTS.md does not apply unless TS is introduced.

## Architecture

**Deviation from AGENTS.md:** routes live in the top-level `app/` directory (not `src/app/`). Entry point is `expo-router/entry` (`package.json` `main`). `App.js` and `index.js` are leftover create-expo boilerplate and are **not** used.

- `app/` — thin Expo Router route files only; each just renders a screen from `modules/`.
  - `app/_layout.jsx` — root: Redux `Provider` → `PaperProvider` (light/dark theme chosen from `state.theme.isDarkMode`) → `Stack` with headers hidden.
  - `app/index.jsx` — welcome screen; navigates with `router.replace('/(tabs)/simulator')`.
  - `app/(tabs)/_layout.jsx` — floating, rounded bottom tab bar (`simulator`, `wiki`) styled from the Paper theme. Because the tab bar is `position: 'absolute'`, screens need bottom padding so content isn't hidden behind it.
- `modules/<feature>/{screens,components,stores}` — feature modules (`home` = welcome + simulator, `wiki`). Each feature owns its Redux slice.
- `src/` — shared code: `stores/index.js` (the `configureStore` that combines `theme`, `wiki`, `simulator` slices — register new slices here), `stores/themeSlice.js`, `styles/theme.js` (green MD3 light/dark themes extending react-native-paper), `components/Header.jsx` (Paper `Appbar` with the dark-mode toggle), `utils/physicsCalculations.js`.
- `data/wikiData.json` — wiki content (array of `{id, title, subtitle, formula, description, keyPoints[], application}`). `wikiSlice` derives `totalItems` from its length, so adding concepts only requires editing the JSON.

### State and physics flow

`simulatorSlice` stores only raw inputs (`force` N, `angle` °, `distance` m). Derived values (`fx`, `fy`, `work`) are computed in the `selectPhysicsResults` selector via the pure functions in `src/utils/physicsCalculations.js`; `getWorkInterpretation` classifies work as nulo/positivo/negativo with a display color. Keep physics math in that utils file and derived data in selectors rather than in the store or components.

### UI conventions

- UI components come from **react-native-paper** (MD3); read colors via `useTheme()` rather than hardcoding, so dark mode works.
- Icons: `MaterialCommunityIcons` from `@expo/vector-icons` (bundled with Expo; the `react-native-vector-icons` dependency is not what the code imports).
- Charts use `react-native-svg`; animations use React Native's built-in `Animated` API (Reanimated is not installed).
- Imports are relative paths (no path aliases configured).
