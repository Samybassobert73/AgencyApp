# Project Commands
- Build: `npm run build`
- Dev: `npm run dev --turbopack`
- Start: `npm run start`
- Lint: `npm run lint`
- Test: Not configured yet; add to package.json when needed

# Code Style Guidelines
- **TypeScript**: Strict typing with explicit return types and props interfaces
- **Imports**: Group by 1) React/Next.js, 2) external libs, 3) internal modules
- **Naming**: PascalCase for components/interfaces, camelCase for variables/functions
- **Component Structure**: Functional components with explicit typing
- **Formatting**: Use consistent indentation (2 spaces) and semicolons
- **Path Aliases**: Use `@/*` import paths as configured in tsconfig
- **Error Handling**: Use try/catch with typed errors for async operations
- **CSS**: Use Tailwind utility classes with semantic class names
- **State Management**: Prefer React hooks (useState, useReducer) for component state

# Project Structure
- Use Next.js App Router architecture
- Place shared components in `components/` directory
- Group related functionality in feature-based directories