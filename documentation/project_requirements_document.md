# Project Requirements Document (PRD)

## 1. Project Overview

This project is a modern, community-driven photo-sharing web application—think of a lightweight, open-source take on Flickr. Built on a React + Vite frontend and Supabase backend, it provides everything you need to let users register, upload images, browse galleries, and interact with each other’s photos. The goal is to abstract away the boilerplate and infrastructure setup so you can focus on creating features that make your community unique.

We’re building this because starting a secure, scalable, and polished photo social network from scratch is time-consuming and error-prone. Success means users can sign up easily, upload and view images with minimal load times, and perform social actions (likes, comments) in real time. If the app feels smooth, reliable, and accessible across devices, we’ve met our key objectives.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1.0):**
- User authentication (email/password, session management).
- User profiles with display name and avatar.
- Photo upload flow (select, preview, add title/description, submit).
- Secure storage of images via Supabase Storage.
- Main feed: gallery grid of recent or popular photos.
- Photo detail view: full image, metadata, like button, comment section.
- Like and comment interactions with real-time updates.
- Infinite scroll or paginated feed using TanStack Query.
- Dark/light mode toggle.
- Responsive design for desktop and mobile.
- Basic error handling and toast notifications.

**Out-of-Scope (Planned for Later Phases):**
- Advanced search, filtering, or tagging system.
- User albums or collections.
- Direct messaging between users.
- Group or community creation.
- AI-powered features (auto-tagging, face recognition).
- Admin dashboard or moderation tools.
- Native mobile app.

## 3. User Flow

A new visitor arrives on the landing page and sees a brief feature tour plus sign-up/sign-in buttons. They click “Sign Up,” enter their email and password, and confirm via email if required. Once authenticated, they land on the home feed—a masonry or grid layout showing recent uploads by the community. A top navbar or sidebar lets them navigate to Upload, Profile, or Settings.

From the home feed, the user scrolls to view thumbnails. Clicking any thumbnail opens the photo detail view in a modal or dedicated page, displaying the full image, its title, the author’s name, a like button, and comments below. To upload a photo, they click the “Upload” button, open a form dialog, choose a file, add title/description, and hit “Submit.” A toast confirms success, and the new photo appears at the top of the feed once the query cache refreshes.

## 4. Core Features

- **Authentication & Authorization**: Email/password sign-up & login, JWT sessions, protected routes.
- **User Profiles**: Editable display name, avatar upload, personal gallery page.
- **Photo Upload & Storage**: File selection, client-side preview, image upload to Supabase Storage, metadata saved in PostgreSQL.
- **Photo Feed & Gallery**: Grid or masonry layout, infinite scroll (or pagination), caching and background refetch with TanStack Query.
- **Photo Detail View**: Full-size image, metadata, author link, like count, comments list.
- **Social Interactions**: Likes (with optimistic UI updates), comments (with real-time display via Supabase Realtime).
- **Theming**: Dark/light mode using next-themes, extendable via Tailwind CSS.
- **Responsive & Accessible UI**: Built with Shadcn/ui (Radix UI primitives + Tailwind), WCAG 2.1 AA compliance, keyboard navigation, ARIA labels.
- **State Management & Validation**: Server state via TanStack Query; form handling and validation via React Hook Form + Zod.
- **Animations & Transitions**: Smooth UI feedback with Framer Motion (e.g., image opening, like button bounce).

## 5. Tech Stack & Tools

**Frontend:**
- React (component-based UI)
- Vite (build tool)
- TypeScript (static typing)
- Tailwind CSS (utility-first styling)
- Shadcn/ui + Radix UI (accessible headless components)
- TanStack Query (data fetching & caching)
- React Hook Form + Zod (form state & validation)
- Framer Motion (animations)
- next-themes (dark/light mode)

**Backend:**
- Supabase
  • PostgreSQL (database for users, photos, comments, likes)
  • Auth (user management, JWT sessions)
  • Storage (secure image hosting)
  • Realtime (live updates for comments/likes)

**Tooling & Workflows:**
- ESLint + Prettier (code quality and formatting)
- Vitest (unit tests)
- Cypress or Playwright (end-to-end tests)
- GitHub Actions (CI/CD)
- VSCode (IDE), optional plugins: Cursor, Windsurf

## 6. Non-Functional Requirements

- **Performance:**
  • Initial feed load < 1s on 3G.
  • API response < 200ms (cached) / < 500ms (uncached).
  • Lazy loading of off-screen images; serve optimized thumbnails.
- **Security:**
  • Enforce SSL/TLS for all endpoints.
  • Use Supabase Row Level Security (RLS) policies to restrict data access.
  • Store secrets in environment variables.
- **Scalability:**
  • Horizontal scaling of storage and database via Supabase.
  • Efficient pagination/infinite scroll to handle large photo sets.
- **Accessibility:**
  • WCAG 2.1 AA compliance: semantic HTML, ARIA labels, focus management.
- **Reliability:**
  • 99.9% uptime SLA.
  • Error logging and monitoring (e.g., Sentry).

## 7. Constraints & Assumptions

- Supabase free tier limits may cap storage and requests; plan to upgrade as needed.
- Users run the app in modern evergreen browsers (Chrome, Firefox, Safari, Edge).
- Environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_KEY`) are correctly configured.
- No server-side rendering (SSR) needed in v1; focus is on client-side routing.
- Internet connectivity is available and stable for real-time features.

## 8. Known Issues & Potential Pitfalls

- **Large File Uploads:** Browsers may time out; enforce max file size (e.g., 10 MB) and show friendly error messages.
- **Supabase Rate Limits:** Too many realtime events can throttle; batch subscriptions or debounce UI updates.
- **RLS Complexity:** Misconfigured policies can lock out data; write test cases for every policy scenario.
- **Image Optimization:** Serving full-resolution images by default can slow page loads; generate and use scaled thumbnails.
- **Infinite Scroll Memory Leak:** Persisting large lists in memory may cause jank; use windowing libraries (e.g., react-virtual).
- **Accessibility Gaps:** Automated tests can miss ARIA issues; conduct manual audits with screen readers and keyboard only navigation.

---

This PRD captures all requirements for the first version of the photo community web app. With these details, an AI or development team can generate the detailed Tech Stack document, Frontend Guidelines, Backend Structure, and subsequent flowcharts or file structures without ambiguity.