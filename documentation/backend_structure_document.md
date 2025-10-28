# Backend Structure Document

## 1. Backend Architecture

Our backend is built on Supabase, a Backend-as-a-Service platform that bundles several components—PostgreSQL database, authentication, storage, and real-time subscriptions—into a single, managed solution. This architecture follows a serverless and micro-services style under the hood, letting us focus on application logic rather than infrastructure management.

- **Design Patterns and Frameworks**
  - **BaaS Pattern:** Supabase handles database connections, file storage, authentication flows, and real-time updates.
  - **RESTful API via PostgREST:** Supabase auto-generates a RESTful API layer on top of the PostgreSQL database, simplifying endpoint creation.
  - **Client-Driven Logic:** Frontend communicates directly with Supabase APIs using an official JavaScript client, removing the need for a custom backend server.

- **Scalability**
  - **Automatic Scaling:** Supabase infrastructure scales database and storage capacity as your user base grows.
  - **CDN for Storage:** Images served through a global CDN reduce latency and offload traffic from the database.

- **Maintainability**
  - **Managed Service:** No manual database or server maintenance—supabase.io handles updates and security patches.
  - **Schema Migrations:** You can track changes with SQL migration files.

- **Performance**
  - **Built-in Caching:** Supabase’s HTTP endpoints support standard cache headers.
  - **Realtime Subscriptions:** Live updates (e.g., new comments or likes) pushed over WebSocket connections.

---

## 2. Database Management

- **Technology**
  - **Type:** Relational (SQL) database.
  - **System:** PostgreSQL hosted on Supabase.

- **Data Structure and Storage**
  - **Normalized Tables:** We separate users, photos, comments, and likes into distinct tables.
  - **Supabase Storage:** Binary files (images) stored outside the database in a dedicated storage bucket.
  - **Access:** Data is accessed through the Supabase client library or direct REST endpoints provided by PostgREST.

- **Data Management Practices**
  - **Row Level Security (RLS):** Enforced in the database to ensure users only read or write rows they own.
  - **Migration Scripts:** Tracked in version control to manage schema changes.
  - **Backups:** Automated daily snapshots by Supabase for disaster recovery.

---

## 3. Database Schema

Below is the core PostgreSQL schema for our photo community. It is presented in SQL and paired with a plain-English description.

```sql
-- Profiles table: extends auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Photos table: stores metadata for each image
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comments table: user comments on photos
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Likes table: tracks which users liked which photos
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(photo_id, user_id)
);
```

- **Plain-English Summary**
  - **profiles:** Holds user profile data linked to authentication.
  - **photos:** Contains metadata and storage path for each uploaded image.
  - **comments:** Records user comments tied to specific photos.
  - **likes:** Tracks a single like per user per photo.

---

## 4. API Design and Endpoints

Supabase automatically exposes RESTful endpoints for each table under the `/rest/v1/` namespace and provides specialized routes for authentication and file storage.

- **Authentication** (`/auth/v1/`)
  - **Sign Up:** `POST /auth/v1/signup`
  - **Sign In:** `POST /auth/v1/token?grant_type=password`
  - **User Profile:** `GET /auth/v1/user` (returns current session’s user)

- **Profiles** (`/rest/v1/profiles`)
  - `GET /profiles` (list or filter by username)
  - `PATCH /profiles` (update profile fields)

- **Photos** (`/rest/v1/photos`)
  - `GET /photos` (filter by tags, user_id, pagination)
  - `POST /photos` (create new photo record after upload)
  - `GET /photos?id=eq.<photo_id>` (fetch single photo)

- **Comments** (`/rest/v1/comments`)
  - `GET /comments?photo_id=eq.<photo_id>`
  - `POST /comments`

- **Likes** (`/rest/v1/likes`)
  - `GET /likes?photo_id=eq.<photo_id>`
  - `POST /likes` (adds a like)
  - `DELETE /likes?id=eq.<like_id>` (removes a like)

- **Storage** (`/storage/v1/*`)
  - `POST /bucket/{bucketId}/upload` (upload image file)
  - `GET /bucket/{bucketId}/public/{fileId}` (retrieve public URL)

All endpoints follow standard HTTP methods and support filtering, sorting, and pagination via query parameters.

---

## 5. Hosting Solutions

- **Primary Hosting:** Supabase Cloud
  - **Managed PostgreSQL:** High availability database with automatic failover.
  - **Edge Infrastructure:** CDN for file distribution, global points of presence reduce latency.

- **Benefits**
  - **Reliability:** 99.9% SLA with built-in backups and replication.
  - **Scalability:** Transparent scaling of compute and storage resources.
  - **Cost-Effectiveness:** Pay-as-you-go pricing for database, auth, and storage usage.

---

## 6. Infrastructure Components

- **Content Delivery Network (CDN)**
  - Supabase Storage uses a global CDN to cache images close to end users.

- **Load Balancing**
  - Handled by Supabase to distribute database queries and storage requests across multiple nodes.

- **Caching Mechanisms**
  - HTTP caching for REST endpoints—Leverage standard `Cache-Control` headers.
  - Client-side caching with tools like TanStack Query to reduce network round trips.

- **Realtime Engine**
  - WebSocket connections managed by Supabase Realtime for live comment and like updates.

These components work together to ensure fast, reliable data delivery and a responsive user experience.

---

## 7. Security Measures

- **Authentication & Authorization**
  - **Supabase Auth (JWT):** Secure user sessions with JSON Web Tokens.
  - **Row Level Security (RLS):** Database policies ensure only authorized users can read or modify records.

- **Data Encryption**
  - **In Transit:** All API traffic over HTTPS/TLS.
  - **At Rest:** Database and storage buckets encrypted by default.

- **Access Controls**
  - **Bucket Policies:** Public vs. private storage buckets to control image visibility.
  - **Role-Based Policies:** Fine-grained control on who can insert, update, or delete entries.

- **Additional Protections**
  - Rate limiting on Auth and REST endpoints.
  - Secure environment variables stored in Supabase dashboard.

---

## 8. Monitoring and Maintenance

- **Monitoring Tools**
  - **Supabase Dashboard:** Real-time metrics for database connections, CPU usage, and bandwidth.
  - **Logs & Audit Trails:** View query logs and authentication events.

- **Alerts**
  - Configure email or Slack alerts for unusual activity, high error rates, or resource limits.

- **Maintenance Strategies**
  - **Regular Backups:** Automated daily snapshots with 7-day retention.
  - **Schema Migrations:** Managed via versioned SQL files and `supabase migrations` CLI.
  - **Dependency Updates:** Supabase updates handled by the provider; track client library versions locally.

---

## 9. Conclusion and Overall Backend Summary

This backend leverages Supabase’s fully managed services to deliver a reliable, scalable, and secure foundation for a photo-sharing community. By combining a production-ready PostgreSQL database, seamless authentication, efficient file storage, and real-time capabilities, it aligns perfectly with the needs of a modern social network. The auto-generated REST API, global CDN, and robust security measures ensure that developers can focus on feature development rather than infrastructure concerns. This setup stands out by offering an all-in-one backend solution that grows with your community and minimizes operational overhead.