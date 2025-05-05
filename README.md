# Instructions for Building the Nature Magazine Blog Website

## 1. Project Overview

You are tasked with building a full-stack magazine blog website focused on nature-related topics using NextJS. The website has two types of access:

- **Normal Users**: Can view content without logging in (focus of this document).
- **Admin**: One admin who logs in via a footer link to manage content in a separate dashboard section.

For now, prioritize the user-facing part, but include the admin dashboard as a secondary component. Use the latest version of NextJS with TypeScript (ensuring no type errors) and MUI for a professional, nature-themed UI.

## 2. Functional Requirements

### User-Facing Part
- **Home Page**:
  - Display a hero section with a featured article or carousel of featured articles.
  - Show a grid or list of recent articles below, with pagination if needed.
  - Each article preview includes title, short excerpt, author name, and publication date.
- **Article Page**:
  - Show full article details: title, author, publication date, and rich text content (supporting images, headings, lists).
  - Include a section for related articles (optional: comments section).
- **Category Page**:
  - List articles by category (e.g., wildlife, conservation, travel).
  - Include category name and article previews.
- **Search Functionality**:
  - Provide a search bar in the header or a dedicated search page.
  - Display search results with article titles and excerpts.

### Admin Dashboard
- **Login Page**:
  - Accessible via a small "Admin Login" link in the footer.
  - Simple form to log in (no registration; one admin user).
- **Dashboard**:
  - Redirect admin to dashboard after login.
  - Allow creation, editing, and deletion of articles and categories.
  - Basic interface to upload media (e.g., images).

## 3. Non-Functional Requirements
- **Responsive Design**: Ensure the UI adapts to desktop and mobile devices.
- **Performance**: Optimize for fast page loads (home and article pages especially).
- **SEO**: Include meta tags, structured data, and clean URLs for search engine visibility.
- **Security**: Secure admin login and API routes with proper authentication.
- **Type Safety**: Use TypeScript with no type errors.
- **Accessibility**: Follow basic accessibility guidelines (e.g., alt text for images).
- **Maintainability**: Write clean, modular, and well-documented code.

## 4. Tech Stack
- **Framework**: Latest version of NextJS
- **Language**: TypeScript
- **UI Library**: MUI (Material-UI)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth (email and password with encryption)

## 5. Best Practices
- **TypeScript**: Use strict typing for all components, props, and API responses; eliminate type errors.
- **NextJS**: Leverage server-side rendering (SSR) or static site generation (SSG) for performance and SEO; optimize images with `next/image`.
- **MUI**: Customize the theme for a consistent, professional look; use responsive Grid and components.
- **Error Handling**: Gracefully handle API errors and user inputs with fallback UI.
- **Code Quality**: Write modular (To avoid long codes), reusable components; keep functions small and focused.
- **Testing**: Test critical features (e.g., article fetching, admin login) manually or with unit tests.

## 6. Development Steps

### a. Project Setup
- Create a new NextJS project with TypeScript:
  - Run: `npx create-next-app@latest nature-magazine --typescript`
  - Navigate to the project: `cd nature-magazine`
- Install dependencies:
  - Run: `npm install @mui/material @emotion/react @emotion/styled`
  - Run: `npm install mongoose`
  - Run: `npm install next-auth` (if using NextAuth)

### b. Database Setup
- Set up a MongoDB database (cloud-based) with prisma.
- Create a connection file (e.g., `lib/db.ts`) using Mongoose and setup prisma.
- Define schemas:
  - **Article**: `{ title: string, content: string, author: string, publicationDate: Date, categories: string[], image: string, slug: string }`
  - **Category**: `{ name: string, description: string }`
  - **User**: `{ username: string, password: string (hashed) }` (one admin user)
- Seed with sample articles for testing.

### c. API Routes
- In `pages/api/`:
  - `articles/index.ts`: GET to fetch all articles.
  - `articles/[id].ts`: GET (fetch one), POST/PUT/DELETE (admin-only CRUD).
  - `categories/index.ts`: GET to fetch all categories.
  - `categories/[id].ts`: GET, POST/PUT/DELETE (admin-only).
  - `auth/login.ts`: POST for admin login (if custom auth).

### d. User-Facing Pages
- `pages/index.tsx`: Home page with hero and article list.
- `pages/articles/[slug].tsx`: Dynamic article page.
- `pages/categories/[category].tsx`: Dynamic category page.
- `pages/search.tsx`: Search page with results.

### e. Admin Dashboard
- `pages/admin/login.tsx`: Login form (checks against admin credentials).
- `pages/admin/dashboard.tsx`: Dashboard with links to manage content.
- `pages/admin/articles/`: Subpages for article CRUD.
- `pages/admin/categories/`: Subpages for category CRUD.

### f. Authentication
- Implement admin login:
  - Use NextAuth or custom JWT/session-based auth.
  - Protect admin pages and API routes with middleware or `getServerSideProps`.
- Store one admin user in the database with a hashed password.

### g. Styling
- Create a custom MUI theme in `theme.ts`:
  - Primary color: Green (e.g., `#2E7D32` - forest green).
  - Secondary color: Earthy tone (e.g., `#8D6E63` - warm brown).
  - Typography: Serif for headings (e.g., `Georgia`), sans-serif for body (e.g., `Roboto`).
- Apply the theme globally and ensure responsive layouts with MUI Grid.
- Implement lazy-loading for better optimization.
- Add page loading animations.
- Add transitions and animations when necessary.

### h. Testing
- Verify all pages load correctly and responsively.
- Test API routes and admin functionality.
- Check for and resolve any TypeScript errors.

## 7. Additional Notes
- **Color Palette**: Use a green-based theme (e.g., forest green, lime, olive) with earthy accents (browns, tans) to reflect the nature niche. Avoid blue-heavy designs.
- **Innovative Ideas**:
  - Add subtle animations (e.g., fade-ins for articles) to enhance UX.
  - Include a "Featured Image Gallery" on the home page showcasing nature photography.
  - Offer a dark mode toggle for user preference.
- **Terminal Commands**: Run each command separately (e.g., no `command1 && command2`).
- **Content**: Use placeholder nature articles (e.g., from Unsplash or lorem ipsum) until the admin adds real content.

By following these instructions, you will create a professional, user-friendly nature magazine blog with a robust admin dashboard.