# PlantIQ - Technology Stack

## React
- **Why**: Industry-standard UI library for building interactive user interfaces. Component-based architecture aligns with the project's modular design. React's ecosystem and hooks system enable efficient state management and side effects.

## Vite
- **Why**: Next-generation frontend build tool. Provides instant server start and fast hot module replacement (HMR). Significantly faster development experience compared to Create React App. Optimized production builds with Rollup.

## JavaScript (ES2024)
- **Why**: Native language of the web. ES6+ features (destructuring, spread operators, arrow functions) used throughout. No transpilation needed for modern browsers. Keeps the stack lightweight without TypeScript overhead for Phase 1.

## Tailwind CSS
- **Why**: Utility-first CSS framework for rapid UI development. Consistent design tokens across components. Enables responsive design without writing custom CSS. Combined with the design system in DESIGN.md.

## Lucide React
- **Why**: Beautiful, consistent icon set. Tree-shaken, only used icons are included in the final bundle. Comprehensive set of icons for plants, sensors, analytics, and actions.

## Motion
- **Why**: Animation library for React (Framer Motion-inspired). Simple motion primitives for component enter/exit transitions. Hover interactions, spring animations for UI polish. Performance-animated values.

## Recharts
- **Why**: Simple charting library for React. Used for sensor history charts and health score visualization. Lightweight compared to D3.js. Component-based charting aligns with React architecture.

## LocalStorage
- **Why**: Client-side data persistence. No backend required for Phase 1. Stores plant data, sensor readings, alerts, and settings persistently. Limitations documented in DATABASE.md.

## Why This Stack
- Frontend-only architecture eliminates need for Node.js backend, database servers, or API layers.
- All technologies are well-supported and have excellent documentation.
- No unnecessary dependencies or experimental technologies.
- Easy to extend with real hardware integration in future phases.