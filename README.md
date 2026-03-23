1. Overview
This frontend is a Next.js pages router app that serves three areas. The public user app starts at the home route and continues to the analysis flow. Public SEO content is served by the dynamic slug route and the symptom routes. The SEO panel is hosted under the indexcontrol base route. The superadmin portal is hosted under the supermadin base route. Global styling is defined in a single stylesheet and the application uses Tailwind for layout and utility classes. SEO content pages are rendered with dedicated templates for symptom, cause, disease, test, medicine, treatment, and specialist page types.

2. Routes and responsibilities
The route slash renders the user experience and symptom entry flow. The route slash analysis continues the user flow. The route slash symptom slash headache and the routes under slash symptoms are fixed symptom pages. The route slash bracket dot dot dot slug renders SEO pages dynamically by resolving slugs from the backend. The route slash indexcontrol hosts the SEO panel and its sub routes, including dashboard, pages, keywords, content blog, on page issues, technical signals, backlinks, competitors, semrush, google business, assets, and settings. The route slash supermadin hosts the superadmin login and dashboard. The route slash sitemap dot xml and the route slash sitemaps slash id dot xml serve sitemap responses.

3. Folder structure
The folder src pages contains all routes for the pages router and includes indexcontrol and supermadin areas. The folder src components contains shared UI, SEO panel layout, and superadmin layout. The folder src components templates contains SEO content templates. The folder src services contains API client helpers, including the superadmin client and analysis client. The folder src lib contains data helpers such as the SEO pages API client. The folder src styles contains the global stylesheet and external imports. The folder src hooks contains UI hooks used by the user app. The folder src types contains shared TypeScript types.

4. Services and API usage
The user experience and SEO panel call the backend using NEXT_PUBLIC_API_URL. The SEO panel relies on the pages API for listing, creating, updating, and deleting SEO pages and requires authenticated SEO users. The SEO login stores a session token in sessionStorage and fetches user identity from the backend on each load. Idle timeout and token expiry handling are enforced on the client. The superadmin portal uses the admin API for summary, user management, logs, and job triggers. Frontend logs are sent to the backend logs ingestion endpoint using a background request. Microsoft Clarity is loaded only on public routes and is excluded from indexcontrol and supermadin. The page builder includes a live preview pane and supports rich content sections with React Quill.

5. Local setup
Install dependencies and start the dev server. The dev script auto selects an available port if the default is busy.

npm install
npm run dev


6. Environment
Set NEXT_PUBLIC_API_URL to the backend base URL. For local development this is usually http://localhost:4000. For production on Vercel, point to your Railway service URL. Clarity is configured in the application shell and uses a fixed project identifier. If you need to change the identifier, update the script in the app shell.

7. Developer notes
The SEO panel layout is provided by a shared layout component and applied to each indexcontrol route. SEO authentication uses sessionStorage and role based access to guard editing and delete actions. The superadmin pages are protected on the client by requiring a stored token, and the backend enforces superadmin role checks. The page builder uses a split editor and live preview layout on desktop and a toggleable preview on smaller screens.

8. Authentication flow
The IndexControl login route stores a session token in sessionStorage and fetches the current user profile from the backend on each load. Token expiry is enforced using the JWT exp value and idle timeout is enforced in the layout. The supermadin portal stores a token in localStorage and relies on backend role checks for access.

9. Deployment notes
Vercel builds require NEXT_PUBLIC_API_URL to be defined so that rewrites can resolve safely. If the backend URL is not set, rewrites are disabled automatically.

10. SEO metadata
Public routes now use a shared SEO head component that sets title, description, canonical URL, Open Graph, Twitter, AI meta, robots, author, language, geo, theme color, charset, and viewport per page. The component is in src/components/seo/SeoHead.tsx and is used by the home page, dynamic SEO pages, and symptom pages.

11. Bulk upload templates
CSV templates for page and blog bulk upload live under templates. The blog uploader accepts CSV and JSON, while the pages uploader accepts CSV and JSON. Share the templates with the SEO team for consistent headers.
