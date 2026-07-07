# ATS Resume Builder

A React + Vite + Tailwind resume builder with a live A4 preview, LinkedIn PDF import,
PDF export, and a job-description match score. Light and dark mode included.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To make a production build: `npm run build`, then `npm run preview`.

## What it does

**Live editor + preview.** Edit on the left, watch the A4 page update on the right.
Sections render in this order: Summary, Experience, Education, Technical Skills, Languages.

**Export to PDF.** The "Export PDF" button opens your browser print dialog. Choose
"Save as PDF", paper A4, margins None. The print stylesheet hides the app and prints
only the resume page, so the PDF matches the on-screen design.

**Import LinkedIn PDF.** On LinkedIn go to your profile, then More, then "Save to PDF".
Upload that file with "Import LinkedIn PDF". The parser reads the two-column export,
pulls out your name, headline, summary, every role, education, and top skills, then
fills the editor. It is tuned for LinkedIn's own PDF layout and is best-effort, so
review the result before exporting. LinkedIn descriptions are prose, so each role
comes in as one or more bullets you can split and tighten.

**Job match score.** Paste a job description and press "Score My Resume". You get an
overall percentage, matched and missing hard skills, and missing keywords. This is a
keyword-coverage heuristic to guide your edits. It is not a real applicant tracking
system, and a high score is not a guarantee of anything.

**Save / Load.** "Save" downloads your data as JSON. "Load" reads it back so you can
keep multiple versions.

## Customizing colors

App chrome uses the violet base `#a78bfa` (Tailwind `brand-400` in `tailwind.config.js`).

The resume page keeps the original professional navy design so the exported PDF stays
ATS-friendly. To recolor the resume itself, change `--resume-accent` in
`src/styles/resume.css` (for example set it to `#a78bfa` to match the app).

## Project Structure

```
src/
  api/
    client.js          # fetch wrapper, auto JWT refresh on 401
    tokens.js          # localStorage token helpers
    auth.js            # /auth/register, /auth/login, /auth/me, DELETE /auth/me
    resumes.js         # /resumes CRUD + /users/{username}/public
  auth/
    AuthContext.jsx    # user state, login, register, logout, deleteAccount
    ProtectedRoute.jsx # redirects to /login if not authed
  hooks/
    useApiResumeData.js  # replaces useResumeData, syncs with API (debounced)
  lib/
    username.js        # derives username from email (frontend-only helper)
  pages/
    LoginPage.jsx
    RegisterPage.jsx
    EditorPage.jsx
    PublicProfilePage.jsx
  components/
    public/
      PublicNav.jsx
      sections.jsx     # Home, About, Experience, Education, Certifications, Projects, Skills, Contact
      icons.jsx
    Toolbar.jsx
     indicator, copy public link
  App.jsx
```

### Env var

Create a `.env` (or `.env.local`) at the project root with:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Routes

| Path         | Access    | Purpose                   |
| ------------ | --------- | ------------------------- |
| `/login`     | public    | Sign in                   |
| `/register`  | public    | Create account            |
| `/`          | protected | Editor (the original app) |
| `/:username` | public    | Public profile page       |

Reserved usernames that fall through to `/`: `login`, `register`, `logout`, `api`, `admin`, `settings`, `auth`, `resumes`, `ml`, `health`, `_next`, `assets`, `static`.

## Auth flow

1. `POST /auth/register` creates the account.
2. The frontend then calls `POST /auth/login` to get `access_token` + `refresh_token` (both saved to `localStorage`).
3. `GET /auth/me` loads the current user. The editor lists resumes via `GET /resumes` and either opens the first one or creates a new one with `POST /resumes`.
4. Edits debounce-save through `PATCH /resumes/{id}` (800ms).
5. On any 401 with a valid refresh token, the client transparently calls `POST /auth/refresh` and retries once.
6. Logout clears tokens locally. Delete account calls `DELETE /auth/me` then clears tokens.

The exact request/response shapes the client expects:

```
POST /auth/register  -> { email, password, full_name }
POST /auth/login     -> { email, password }   returns { access_token, refresh_token }
POST /auth/refresh   -> { refresh_token }     returns { access_token, refresh_token }
GET  /auth/me        -> { id, email, full_name, ... }
DELETE /auth/me      -> 204

GET    /resumes              -> [ { id, title, ... } ]
POST   /resumes              -> { title, content }   returns full resume
GET    /resumes/{id}         -> { id, title, content, ... }
PATCH  /resumes/{id}         -> { content?, title? } partial
DELETE /resumes/{id}         -> 204
```

If your backend uses different field names (e.g. `name` instead of `full_name`, or different token field names), the changes are isolated to `src/api/auth.js` and `src/api/client.js`.

## Public profile sections

The page renders sections in this order, hiding any that are empty:

- **Home** — large hero with name + headline, LinkedIn / Projects / Website buttons.
- **About** — avatar with initials + summary + location.
- **Experience** — alternating timeline of `data.experience[]`.
- **Education** — alternating timeline of `data.education[]`.
- **Certifications & Awards** — two columns, `data.certifications[]` and `data.achievements[]`.
- **Projects** — card grid of `data.projects[]`. The first bullet that looks like a URL becomes the "Website" link; the location field or first bullet doubles as tech tags (comma/pipe separated).
- **Skills** — card grid of `data.skills[]` plus a `Languages` row from `data.languages[]`.
- **Contact** — mailto-based form using `data.email`.
