# Muammal A. Fadhil — Engineering Portfolio

A high-end, monochrome glass digital experience combining minimalist design, luminous animated typography, living light atmospheric depth, click-activated project lightboxes, and a full-stack Python/FastAPI backend with Argon2id authentication.

---

## 🌟 Key Architecture & Capabilities

### 1. Visual & Motion System: Monochrome Glass + Living Light
- **Monochrome Glass Aesthetic**: Deep `#080808` canvas, crisp typography, and frosted glass panels with `backdrop-filter: blur(20px)` and subtle border highlights.
- **Living Light Depth**: Organic drifting cyan (`rgba(6, 182, 212)`) and violet (`rgba(168, 85, 247)`) ambient lighting fields with floating glass and geometric elements.
- **Luminous Typography**: GSAP-driven headline reveals with shimmering gradient sweeps and ScrollTrigger word illumination.
- **Dual-Theme Engine**: Dark and light themes with pre-paint theme bootstrap to prevent flash of wrong theme (FOUT) and persistent storage in `localStorage`.

### 2. Interactive Project Image Lightbox
- **Strict User-Activated Lightbox**: Images **never** open on scroll or viewport entry. Opening an enlarged view strictly requires an explicit click or keyboard activation.
- **Full Gallery Navigation**: Previous (`←`) and Next (`→`) navigation, Escape key handler, backdrop click dismissal, focus trap, and automatic focus restoration to the clicked trigger.

### 3. Full-Stack Backend & Secure Authentication
- **FastAPI + Uvicorn + SQLite Architecture**: Fast, production-ready, asynchronous Python backend.
- **Argon2id Password Hashing**: Industry gold standard (`argon2-cffi`) with custom memory and parallelism parameters.
- **Sliding-Window Rate Limiting**: Automatic IP-based throttling (maximum 5 failed attempts per 5 minutes) returning HTTP `429 Too Many Requests`.
- **Protected Administrator CMS**: Secure `/login` and `/dashboard` allowing real-time edits to project titles, descriptions, visibility status, and destination links.
- **Dual Session Support**: Supports both `HttpOnly` `SameSite=Lax` cookies and `Authorization: Bearer <token>` headers, enabling cross-origin API calls when the frontend is decoupled on GitHub Pages.

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Python 3.10+
- Dependencies: `fastapi`, `uvicorn`, `argon2-cffi`, `pydantic`

### 2. Provision Administrator Account
Create the initial administrator account securely via the CLI (no public registration exposed):
```bash
python server/cli.py create-admin --username admin --password "YourStrongPassword123!"
```

To list users or reset credentials:
```bash
python server/cli.py list-users
python server/cli.py reset-password --username admin --password "NewPassword123!"
```

### 3. Launch the Unified Server
Run the FastAPI application which serves both the API endpoints (`/api/*`) and the static frontend:
```bash
python -m uvicorn server.main:app --host 127.0.0.1 --port 8000
```
Then visit:
- **Public Portfolio**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Admin Login**: [http://127.0.0.1:8000/login/](http://127.0.0.1:8000/login/)
- **Admin Dashboard**: [http://127.0.0.1:8000/dashboard/](http://127.0.0.1:8000/dashboard/)
- **API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## ☁️ Deployment Architecture

### A. Frontend on GitHub Pages (`github.io`)
GitHub Pages is a static file host. The portfolio is pre-configured for automated deployment:
1. **Automated GitHub Action**: `.github/workflows/deploy.yml` runs on push to `main` or `master`.
2. **SPA Routing Fallback**: `404.html` automatically routes direct visits to `/login` or `/dashboard` to the appropriate static files.
3. **Decoupled API Configuration**:
   - In `api-config.js`, configure `API_CONFIG.BASE_URL` to point to your hosted backend (e.g., `https://api.yourdomain.com`).
   - Or set `window.PORTFOLIO_API_URL = "https://api.yourdomain.com"` in `index.html`.

### B. Backend on Railway, Render, Fly.io, or VPS
Deploy the `server/` directory to any Python-capable backend host:
- **Build Command**: `pip install -r requirements.txt` (or `pip install fastapi uvicorn argon2-cffi pydantic`)
- **Start Command**: `uvicorn server.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  ```env
  ENVIRONMENT=production
  DATABASE_PATH=server/portfolio.db
  ALLOWED_ORIGINS=https://muammal.github.io,https://yourdomain.com
  ```

### C. Custom Domain DNS Setup
If pointing your custom domain (e.g. `yourdomain.com`):
1. **Apex Domain (`@`)**: Add 4 DNS `A` records pointing to GitHub Pages servers:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. **Subdomain (`www`)**: Add a `CNAME` record pointing to `<your-username>.github.io`.
3. **API Subdomain (`api.yourdomain.com`)**: Add a `CNAME` pointing to your backend host (e.g. `your-app.up.railway.app` or `your-app.onrender.com`).
4. **CORS Allowlist**: Add your custom domain to `ALLOWED_ORIGINS` in your backend environment variables.

---

## 🛡️ Security & Privacy
- **Zero Plaintext Passwords**: Hashed with Argon2id using salt and high memory cost.
- **Login Rate Limiter**: Maximum 5 attempts per 5 minutes per IP; subsequent attempts receive HTTP `429`.
- **Protected Endpoints**: All `/api/admin/*` routes strictly verify active database session tokens.
- **No Public Registration**: Admin accounts can only be provisioned via the secure CLI command.

---

## 📁 Repository Structure
```
├── assets/                  # High-resolution & optimized WebP images
├── server/
│   ├── main.py              # FastAPI application & route controllers
│   ├── auth.py              # Argon2id hasher, session store & rate limiter
│   ├── database.py          # SQLite schema, connection & initial seeding
│   ├── cli.py               # Administrator provisioning CLI
│   └── portfolio.db         # Persistent SQLite database
├── login/
│   └── index.html           # Monochrome glass login interface
├── dashboard/
│   └── index.html           # Protected administrator dashboard
├── .github/workflows/
│   └── deploy.yml           # Automated GitHub Pages CI/CD workflow
├── index.html               # Public portfolio markup
├── styles.css               # Design system, glassmorphism & living light tokens
├── script.js                # GSAP motion engine, luminous typography & lightbox
├── api-config.js            # Unified cross-origin API client
├── 404.html                 # GitHub Pages SPA fallback router
├── .env.example             # Configuration settings template
└── README.md                # Comprehensive documentation
```

