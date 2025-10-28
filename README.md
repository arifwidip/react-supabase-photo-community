# PhotoShare - Community Image Social Network

A modern, community-powered image social network built with React and Supabase. Share your photos, discover amazing moments from other photographers, and connect with a creative community.

## Features

- 📸 **Photo Upload & Management** - Upload high-quality photos with titles and descriptions
- 👥 **User Profiles** - Create customizable profiles to showcase your photography portfolio
- 🖼️ **Photo Gallery** - Browse a responsive grid layout with infinite scroll and modal views
- 🔐 **Secure Authentication** - Email/password authentication with session management
- 💬 **Social Interactions** - Like and comment on photos (UI ready, backend extensible)
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🔍 **Public & Private Content** - Public viewing with authenticated uploads and profiles
- ⚡ **Real-time Updates** - Instant photo updates with TanStack Query caching

## Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Backend:** [Supabase](https://supabase.com/) (Database, Auth, Storage)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Data Management:** [TanStack Query](https://tanstack.com/query)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- A [Supabase](https://supabase.com/) account for database and authentication

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd photo-share-community
npm install
```

### 2. Set Up Supabase

Follow the complete setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:

1. Create a new Supabase project
2. Configure authentication settings
3. Run the database schema
4. Set up storage bucket
5. Get your API credentials

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Start Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the application.

## Quick Demo

1. **Sign up** for a new account
2. **Upload your first photo** with title and description
3. **Browse the gallery** to see community photos
4. **View profiles** and explore user portfolios
5. **Customize your profile** with display name and avatar

## Application Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation bar
│   ├── PhotoCard.tsx   # Photo display component
│   ├── ProtectedRoute.tsx # Authenticated route wrapper
│   └── PublicRoute.tsx # Public route wrapper
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── hooks/              # Custom React hooks
│   ├── usePhotos.ts    # Photo data fetching
│   ├── useUploadPhoto.ts # Photo upload logic
│   └── useUserProfile.ts # User profile management
├── lib/               # Utility functions
│   └── supabaseClient.ts # Supabase client configuration
├── pages/             # Page components
│   ├── HomePage.tsx   # Main photo feed
│   ├── UploadPage.tsx # Photo upload interface
│   ├── ProfilePage.tsx # User profile view
│   ├── LoginPage.tsx  # User login
│   └── SignupPage.tsx # User registration
├── types/             # TypeScript type definitions
│   └── database.ts    # Database schema types
```

## Routes

- `/` - Public landing page (unauthenticated) / Photo gallery (authenticated)
- `/login` - User login
- `/signup` - User registration
- `/upload` - Photo upload (authenticated only)
- `/profile/:userId` - User profile view (public)

## Database Schema

The application uses two main tables:

### `profiles`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `display_name` (Text, Optional)
- `avatar_url` (Text, Optional)
- `created_at` (Timestamp)

### `photos`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `image_url` (Text, Required)
- `title` (Text, Optional)
- `description` (Text, Optional)
- `created_at` (Timestamp)

## Security Features

- **Row Level Security (RLS)** on all tables
- **Authenticated uploads** - Only logged-in users can upload photos
- **Public viewing** - Photos are publicly visible but only owners can modify
- **Storage policies** - Secure file upload with user isolation
- **Session management** - Secure authentication with automatic token refresh

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Documentation Setup

To implement the generated documentation from CodeGuide:

1. Create a `documentation` folder in the root directory:

   ```bash
   mkdir documentation
   ```

2. Place all generated markdown files from CodeGuide in this directory:

   ```bash
   # Example structure
   documentation/
   ├── project_requirements_document.md
   ├── app_flow_document.md
   ├── frontend_guideline_document.md
   └── backend_structure_document.md
   ```

3. These documentation files will be automatically tracked by git and can be used as a reference for your project's features and implementation details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
