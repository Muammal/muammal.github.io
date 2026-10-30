# Muammal A. Fadhil — Engineering Portfolio

[![Live Site](https://img.shields.io/badge/Live_Site-muammal.github.io-00f0ff?style=for-the-badge&logo=githubpages&logoColor=black)](https://muammal.github.io/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![GSAP](https://img.shields.io/badge/Motion-GSAP_3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![Security](https://img.shields.io/badge/Auth-Argon2id-critical?style=for-the-badge)](https://www.argon2.com/)

> A high-end engineering portfolio and dynamic content management system featuring a monochrome glass aesthetic, organic living light depth, GSAP kinetic typography, an interactive image lightbox, and an asynchronous Python/FastAPI backend with Argon2id cryptographic security and automated Pillow WebP optimization.

🌐 **Production Website**: [https://muammal.github.io](https://muammal.github.io)

---

## 🌟 Key Architecture & Capabilities

### 1. Visual & Motion System: Monochrome Glass + Living Light
- **Monochrome Glass Aesthetic**: Deep `#080808` canvas, high-legibility typography, and frosted glass cards featuring `backdrop-filter: blur(20px)` and subtle luminescence.
- **Living Light Depth**: Organic drifting cyan (`rgba(6, 182, 212)`) and violet (`rgba(168, 85, 247)`) ambient lighting fields with interactive cursor spotlights.
- **GSAP Kinetic Typography**: Staggered headline entrance animations, shimmering gradient sweeps, and ScrollTrigger-driven word scrub illumination.
- **Accessibility & Motion Preference**: Automatic detection of `prefers-reduced-motion` with graceful static fallbacks and full ARIA navigation support.

### 2. Interactive Media Lightbox
- **Strict User-Activated Lightbox**: High-resolution image inspection activated strictly by click or keyboard interaction (never triggering automatically on scroll).
- **Accessible Gallery Controls**: Next/Previous arrows, Escape key dismissal, outside click closing, focus trapping, and automatic focus restoration to the trigger element.

### 3. Full-Stack Backend & CMS Engine
- **FastAPI + SQLite Architecture**: High-throughput asynchronous backend providing public content APIs and secure CMS management.
- **Direct Picture Submission & WebP Pipeline**: Directly upload images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, `.gif`) through the dashboard. The backend utilizes Pillow to normalize EXIF orientation, constrain oversized dimensions, and convert raster images into lightweight, modern **WebP** assets.
- **Dynamic Content Management**: Live editing for Profile/Bio, Career Milestones, Technical Toolkit, Credentials/Certifications, and Featured Projects.
- **Argon2id Authentication**: Cryptographic security using the industry gold standard (`argon2-cffi`) with elevated memory and iteration cost parameters.
- **Sliding-Window Rate Limiting**: IP-based throttling (maximum 5 attempts per 5-minute window) defending against automated brute-force attempts.

---

## 🚀 Quick Start & Local Development

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Muammal/muammal.github.io.git
cd muammal.github.io
pip install -r requirements.txt
```

### 2. Provision Administrator Account
Create your admin user securely via the command line (no public registration endpoint):
```bash
python server/cli.py create-admin --username CAS --password "YourStrongPassword123!"
```

To list users or reset credentials:
```bash
python server/cli.py list-users
python server/cli.py reset-password --username CAS --password "NewPassword123!"
```

### 3. Launch Local Server
Start the unified FastAPI server which serves both the API endpoints and the frontend:
```bash
python -m uvicorn server.main:app --host 127.0.0.1 --port 8000 --reload
```

Once running locally, access:
- **Local Portfolio**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Admin Login**: [http://127.0.0.1:8000/login/](http://127.0.0.1:8000/login/)
- **Admin Dashboard**: [http://127.0.0.1:8000/dashboard/](http://127.0.0.1:8000/dashboard/)
- **Interactive OpenAPI Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## ☁️ Production Deployment Architecture

```
                                  ┌────────────────────────┐
                                  │   GitHub Pages (CDN)   │
                                  │ https://muammal.github.io
                                  └───────────┬────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │                                               │
             [Static Fallback Mode]                         [Decoupled API Mode]
       Instant pre-rendered UI and assets             Fetches live updates from hosted
       (Works 100% offline without backend)          FastAPI backend via api-config.js
                                                                      │
                                                        ┌─────────────┴─────────────┐
                                                        │   Cloud Python Backend    │
                                                        │  (Render / Railway / VPS) │
                                                        └───────────────────────────┘
```

### A. Static Deployment on GitHub Pages (`muammal.github.io`)
GitHub Pages automatically serves the root repository as a static website:
1. **Automated CI/CD**: Pushing to `main` triggers `.github/workflows/deploy.yml` for instant deployment.
2. **SPA Routing**: `404.html` transparently redirects `/login` or `/dashboard` requests to their static counterparts.
3. **Resilient Static Fallback**: All portfolio sections, GSAP animations, and case studies are fully functional even when the Python backend is offline.

### B. Cloud Backend Deployment (Optional)
To host the administrative CMS and live API online:
1. Deploy the `server/` folder to any Python platform (Render, Railway, Fly.io, or VPS).
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn server.main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables:
   ```env
   ENVIRONMENT=production
   DATABASE_PATH=server/portfolio.db
   ALLOWED_ORIGINS=https://muammal.github.io
   ```
5. In `api-config.js`, point `defaultApiUrl` to your cloud backend URL.

---

## 🛡️ Security & Privacy Guardrails

- **Zero Tracked Credentials**: Sensitive database files (`*.db`, `*.sqlite3`) and environment configs (`.env`) are strictly excluded in `.gitignore` and never committed to version control.
- **Zero Hardcoded Secrets**: All configuration values use environment variables with secure defaults.
- **Argon2id Password Storage**: Passwords are cryptographically salted and hashed before persistence.
- **Cryptographic Session Tokens**: 256-bit entropy random tokens (`secrets.token_urlsafe(32)`).
- **Protected Endpoints**: All `/api/admin/*` and upload endpoints enforce valid session verification.

---

## 📁 Repository Structure

```
├── .github/workflows/
│   └── deploy.yml           # Automated GitHub Pages CI/CD workflow
├── assets/                  # High-resolution & optimized WebP assets
│   ├── optimized/           # Compressed WebP showcases & credentials
│   └── uploads/             # Dynamic user-uploaded pictures (.gitkeep tracked)
├── server/
│   ├── main.py              # FastAPI application, CORS & CMS endpoints
│   ├── auth.py              # Argon2id hashing, sessions & rate limiting
│   ├── database.py          # SQLite schema, connection & initial data seeding
│   └── cli.py               # Secure administrative provisioning CLI
│   # Note: portfolio.db is created at runtime and excluded by .gitignore
├── login.html               # Monochrome glass login interface
├── dashboard.html           # Full-stack CMS dashboard with direct picture uploads
├── index.html               # Public portfolio entrypoint
├── styles.css               # Design system, glassmorphism tokens & layout
├── script.js                # GSAP motion choreography, typography & lightbox
├── api-config.js            # Unified cross-origin API client
├── requirements.txt         # Production Python dependencies
├── 404.html                 # GitHub Pages SPA fallback router
├── .env.example             # Configuration environment template
├── .gitignore               # Strict exclusion rules for DB, logs & virtual environments
└── README.md                # Project documentation & architecture overview
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
