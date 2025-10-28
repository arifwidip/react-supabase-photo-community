# Frontend Guidelines Document

This document outlines the frontend architecture, design principles, and technologies used in the `react-supabase-photo-community` starter template. It’s written in everyday language so that anyone—technical or not—can understand how the frontend is set up.

## 1. Frontend Architecture

**Frameworks and Libraries**
- **React & Vite**: React provides a powerful component model, and Vite offers super-fast builds and hot-module replacement for a smooth development experience.
- **Tailwind CSS**: A utility-first CSS framework that makes styling fast, consistent, and custom.
- **Shadcn/ui (Radix UI)**: A set of headless, accessible components (cards, dialogs, carousels) you can style with Tailwind.
- **TanStack Query**: Manages server-state (data fetching, caching, syncing) so your photo feeds, profiles, and comments load smoothly.
- **React Hook Form & Zod**: Handles form state and enforces data validation rules—critical for upload forms and profile settings.
- **Framer Motion**: Adds polished animations to your UI, such as transitions when opening a photo viewer or liking an image.
- **next-themes**: Enables dark/light mode toggling out of the box.
- **TypeScript, ESLint, Prettier**: Ensures code quality, consistent style, and fewer bugs.

**How It Supports Scalability, Maintainability, and Performance**
- **Scalability**: Modular architecture splits code into `components/`, `pages/`, `services/`, `hooks/`, and `types/`. As features grow, you know exactly where to add new pieces.
- **Maintainability**: Component-driven development means each UI piece lives in one place. You can update a button or card once, and it updates everywhere.
- **Performance**: Vite’s build optimization, TanStack Query’s caching, and lazy loading of images ensure the app stays snappy even as your community grows.

## 2. Design Principles

**1. Usability**
- Clear layouts and predictable interactions.
- Pre-built Shadcn/ui components reduce guesswork.

**2. Accessibility**
- Radix UI primitives follow WCAG standards.
- Keyboard navigation, ARIA labels, and focus management are built in.

**3. Responsiveness**
- Mobile-first design with Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`) ensures the UI adapts to any screen size.

**4. Consistency**
- A shared design language—colors, typography, spacing—across all screens.

**5. Feedback & Clarity**
- Toast notifications confirm actions (e.g., "Photo uploaded!").
- Loading skeletons indicate data is on the way.

## 3. Styling and Theming

### Styling Approach
- **Utility-First CSS** with **Tailwind CSS**. No BEM or SMACSS—use Tailwind classes in JSX for all styling.
- No additional pre-processor; Tailwind’s built-in features (variants, plugins) cover most needs.

### Theming
- **Dark/Light Mode**: Managed by **next-themes**. Define color tokens in `tailwind.config.js` under `theme.extend.colors`, and switch themes with a small toggle.

### Visual Style
- **Modern, Flat Design**: Clean edges, subtle shadows, and minimal gradients.
- **Glassmorphism**: Used sparingly for overlays (e.g., modal backs) with `backdrop-filter: blur(10px)` utilities.

### Color Palette
- **Primary**: #3B82F6 (blue)
- **Secondary**: #6366F1 (indigo)
- **Accent**: #F59E0B (amber)
- **Background (light)**: #F3F4F6 (gray-100)
- **Background (dark)**: #1F2937 (gray-800)
- **Surface (cards, dialogs)**: #FFFFFF (light), #374151 (dark)
- **Text**: #111827 (dark), #F9FAFB (light)
- **Error**: #EF4444 (red)
- **Success**: #10B981 (green)

### Typography
- **Font Family**: Inter, sans-serif.
- **Base Font Size**: 16px.
- **Line Heights & Weights**: Tailwind defaults (e.g., `leading-relaxed`, `font-medium`) are recommended.

## 4. Component Structure

**Directory Layout**
```
src/
├─ components/
│  ├─ ui/           # Shadcn/ui primitives (Button, Card, Dialog)
│  ├─ features/     # Feature-specific components (PhotoGrid, CommentList)
├─ pages/           # Top-level views (HomePage, PhotoDetailPage)
├─ hooks/           # Custom React hooks (usePhotoFeed, useUserPhotos)
├─ services/        # Supabase client abstractions (photoService.ts)
├─ lib/             # Utility functions (formatDate, buildImageUrl)
├─ types/           # Shared TypeScript types (Photo, UserProfile)
```

**Reuse and Modularity**
- **UI Primitives** live in `components/ui` and are unopinionated.
- **Feature Components** in `components/features` compose primitives into full features.
- This separation makes it easy to swap out styles or update logic in one place.

## 5. State Management

**Server State**
- **TanStack Query** handles all data fetching, caching, and synchronization with Supabase.
- Queries (`useQuery`, `useInfiniteQuery`) fetch lists (photo feeds, comments).
- Mutations (`useMutation`) handle uploads, likes, and profile updates.
- Automatic cache invalidation keeps UI in sync.

**Local UI State**
- **React Hook Form** manages form inputs and validation state.
- Component-level `useState` for simple toggles (e.g., modal open/close).

**Shared State**
- **next-themes** context for theme selection.
- No global Redux store—TanStack Query + React state cover most needs.

## 6. Routing and Navigation

- **React Router DOM (v6+)** is recommended for page-based routing.
- **Routes**:
  - `/` – Home feed with infinite scrolling.
  - `/photos/:id` – Photo detail view.
  - `/users/:username` – User profile and gallery.
  - `/login`, `/signup`, `/settings` – Auth and profile management.
- **Nested Routes** and **Layout Routes** let you keep navigation bars and footers consistent.

Navigation is seamless thanks to client-side routing and prefetching data with TanStack Query.

## 7. Performance Optimization

- **Image Optimization**:
  - Use Supabase Storage transformations to serve appropriate thumbnail sizes.
  - Lazy load off-screen images with the `loading="lazy"` attribute.
- **Code Splitting**:
  - Use `React.lazy` and `Suspense` or route-based splitting via Vite’s dynamic imports so users only download needed code.
- **Infinite Scrolling & Pagination**:
  - `useInfiniteQuery` loads more photos as the user scrolls, reducing initial payload.
- **Asset Optimization**:
  - SVG icons inlined or served from a sprite.
  - Minified CSS/JS by Vite automatically.

## 8. Testing and Quality Assurance

**Unit Tests**
- **Vitest** with `@testing-library/react` for component logic and utility functions (e.g., `formatDate`).

**Integration Tests**
- Test full photo upload form: validation, file selection, submission flow.

**End-to-End (E2E) Tests**
- **Cypress** or **Playwright** for critical user flows: sign-up → upload → view → logout.

**Linting & Formatting**
- **ESLint** enforces code standards.
- **Prettier** auto-formats code on save.

**Accessibility Testing**
- Use browser extensions (axe, Lighthouse) and manual keyboard navigation checks.

## 9. Conclusion and Overall Frontend Summary

This document lays out a clear roadmap for building and growing the frontend of your photo-sharing community: a modern React + Vite core, Tailwind for styling, Shadcn/ui for accessible primitives, and TanStack Query for data. By following these guidelines—component-driven structure, utility-first styling, robust state management, and a strong testing strategy—you’ll deliver a scalable, maintainable, and performant application that delights users. Whether you’re extending this template with new social features or refining the existing UI, these principles will keep your codebase clean, your team aligned, and your community engaged.