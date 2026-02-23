# Valentine Project 2026 - Gemini Context

This file provides context and instructions for AI agents working on the "Valentine Project 2026".

## Project Overview

- **Purpose**: A cinematic, interactive Valentine's Day website designed to celebrate a love story with memories, letters, and galleries.
- **Framework**: React 18 with Vite and TypeScript.
- **Styling**: Tailwind CSS (utilizing the newer `@tailwindcss/vite` plugin).
- **Animations**: Framer Motion (via the `motion` and `motion/react` packages) for a cinematic feel.
- **Icons**: Lucide React and Material UI Icons.
- **Routing**: React Router DOM (v7).

## Architecture

- `src/app/pages/`: Contains the main view components:
  - `home-page.tsx`: Landing page with hero section, counter, and previews.
  - `our-story-page.tsx`: Narrative timeline.
  - `love-letters-page.tsx`: Personal notes and letters.
  - `memories-page.tsx`: Photo memory grids.
  - `private-gallery-page.tsx`: Restricted/special gallery section.
- `src/app/components/`: Reusable UI elements:
  - `navbar.tsx`: Site navigation.
  - `floating-hearts.tsx`: Background animation effects.
  - `figma/`: Components intended to match Figma designs (e.g., `ImageWithFallback.tsx`).
- `src/styles/`: Global CSS and styling configurations.
- `src/app/App.tsx`: Main entry point for routing and global layout.

## Building and Running

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Linting**: `npm run lint`
- **Preview**: `npm run preview`

## Development Conventions

- **Type Safety**: Always use TypeScript and define proper interfaces for props and state.
- **Styling**: Prefer Tailwind CSS utility classes. Avoid complex custom CSS unless necessary for specific cinematic effects.
- **Animations**: Use Framer Motion (`motion` components) for transitions and interactions to maintain the "cinematic" theme.
- **Path Aliases**: Use `@/` to refer to the `src/` directory as configured in `vite.config.ts`.
- **Figma Alignment**: When implementing new UI, refer to the provided Figma design (if accessible) and place related helper components in `src/app/components/figma/`.

## Important Note on Figma Imports
While there is a `figma/` directory, components are currently manually implemented to match the design. Direct automated import from Figma is not active; all design translations should be done via code (Tailwind + Framer Motion).
