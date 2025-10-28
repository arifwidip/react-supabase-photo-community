# Security Guidelines for react-supabase-photo-community

This document provides a comprehensive set of security best practices tailored to the `react-supabase-photo-community` starter template. By following these guidelines, you will ensure that your photo-sharing social network is secure by design, resilient to attacks, and protects user data and privacy.

---

## 1. Secure Development Principles

- **Security by Design:** Embed security at every phase—architecture, implementation, testing, and deployment. Treat security as a core feature, not an afterthought.
- **Defense in Depth:** Layer controls (authentication, authorization, validation, monitoring) so that a breach in one layer does not compromise the entire system.
- **Least Privilege:** Only grant each component, service, or user the minimal permissions required to perform its function.
- **Fail Securely:** On errors or exceptions, don’t expose sensitive details. Return generic error messages to clients and capture full details in secure logs.
- **Secure Defaults:** Adopt safe-by-default configurations (e.g., deny-all RLS policies, secure HTTP headers, restrictive CORS).

---

## 2. Authentication & Access Control

### Supabase Auth Configuration

- Enforce **strong password policies**: minimum length (≥ 12), complexity (mixed case, symbols), and optionally periodic rotation.
- Enable **Multi-Factor Authentication (MFA)** for power users or administrators.
- Do **not** expose the Supabase service role key in frontend code—only use the public (ANON) key client-side.
- Store all keys and secrets in environment variables, never in source code or version control.

### Role-Based Access Control & Row-Level Security

- Define distinct roles in your Supabase database (e.g., `authenticated`, `admin`, `service`).
- Enable **Row-Level Security (RLS)** on every table (`photos`, `comments`, `likes`, `profiles`).
- Create granular policies:
  - **Photos**: only owners can `UPDATE`/`DELETE`; all authenticated users can `SELECT` public photos.
  - **Comments**: only comment authors can modify or delete their comments.
  - **Profiles**: users can read all profiles but only update their own.
- Test RLS policies thoroughly with both valid and invalid access scenarios.

### JWT Security

- Rely on Supabase’s hosted JWT tokens. Validate on every request:
  - Check signature and `exp` (expiration).
  - Reject tokens with the `alg` set to `none`.
- Rotate signing keys periodically and provide a key-rotation strategy.

---

## 3. Input Validation & Output Encoding

### Client-Side & Server-Side Validation

- Use **React Hook Form** with **Zod** schemas for all forms (upload, comments, profile edits).
- Mirror client-side validation on the server (via Supabase Edge Functions or middleware) to prevent bypass.

### Prevent Injection Attacks

- Use Supabase’s parameterized queries or built-in query builder—never interpolate user input directly into SQL.
- Escape and/or sanitize any user-supplied text before displaying it in the UI.

### Mitigate XSS

- Rely on React’s built-in escaping for JSX. Avoid `dangerouslySetInnerHTML` unless absolutely necessary, and sanitize any HTML inputs with a robust library (e.g., DOMPurify).
- Implement a **Content Security Policy (CSP)** header to restrict source origins for scripts, styles, and media.

---

## 4. Secure File Uploads

- Validate file type by checking both the file extension and MIME type (e.g., only `image/jpeg`, `image/png`, `image/webp`).
- Enforce a maximum file size limit (e.g., 10 MB).
- Scan uploads for malware using a dedicated scanning service or API.
- Store uploaded files in a private Supabase bucket and generate **signed URLs** for access control as needed.
- Prevent path-traversal by sanitizing file names or generating server-side unique identifiers (e.g., UUIDs).

---

## 5. Data Protection & Privacy

### In Transit and At Rest

- Enforce **HTTPS/TLS 1.2+** for all client–server and server–Supabase traffic.
- Rely on Supabase’s built-in encryption for data at rest (PostgreSQL, Storage).

### Secrets Management

- Store API keys, database URLs, and service account credentials in a secrets manager or environment variables.
- Do **not** commit `.env` files to source control.

### Logging & Monitoring

- Log security-relevant events (failed logins, permission denials, file upload errors) to a centralized, write-only logging service.
- Mask or omit PII (emails, user IDs) in logs.
- Implement alerting on unusual patterns (e.g., spikes in failed authentication attempts).

---

## 6. API & Frontend Security

### Rate Limiting & Throttling

- Implement client-side request throttling for actions like login attempts and photo uploads.
- Use Supabase Edge Functions or an API gateway to enforce server-side rate limits (e.g., 100 requests/minute per IP).

### CORS Configuration

- Configure CORS strictly: allow only your production and staging origins.
- Disallow wildcard (`*`) origin in production.

### CSRF Protection

- For custom endpoints or Edge Functions that perform state-changing operations, require and validate CSRF tokens (e.g., double-submit cookie pattern).
- For Supabase Auth, use the built-in anti-CSRF protections and always call auth methods via Supabase JS client.

### Security Headers

Set the following HTTP headers on your hosting platform (Vercel, Netlify, etc.):

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; img-src 'self' https://your-supabase-storage.supabase.co; script-src 'self'; style-src 'self' 'unsafe-inline';`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 7. Infrastructure & Configuration

- Harden your deployment environment:
  - Disable debug/verbose error pages in production.
  - Keep the OS, container images, and dependencies updated with the latest security patches.
  - Expose only necessary ports (e.g., 443).
- Use Infrastructure as Code (IaC) to track and review all configuration changes.

---

## 8. Dependency & Version Management

- Use lockfiles (e.g., `package-lock.json`) to ensure deterministic installs.
- Regularly run automated dependency scanners (e.g., Snyk, Dependabot, GitHub Security Alerts) to detect and remediate known vulnerabilities.
- Remove unused dependencies to reduce attack surface.

---

## 9. Testing & Auditing

- **Static Analysis:** Integrate ESLint with security plugins (e.g., eslint-plugin-security).
- **Unit & Integration Tests:** Cover authentication flows, RLS policy enforcement, file upload validation.
- **End-to-End Tests:** Automate critical user journeys (sign-up, upload photo, comment, like).
- **Penetration Testing & Code Reviews:** Conduct periodic security reviews and penetration tests, focusing on authentication, file handling, and RLS configurations.

---

## 10. Incident Response & Key Rotation

- Maintain a documented incident response plan that includes:
  1. Identification and triage.
  2. Containment and eradication.
  3. Notification (users, stakeholders).
  4. Recovery and root cause analysis.
- Regularly rotate Supabase service role keys and any other long-lived credentials.
- Have automated scripts to revoke and reissue compromised keys quickly.

---

By rigorously following these guidelines, you will build a secure, robust, and scalable photo-sharing application that protects your users and your platform from common threats. Regularly revisit and update this document as your application evolves and new security risks emerge.