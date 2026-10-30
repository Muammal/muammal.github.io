"""
Portfolio Full-Stack FastAPI Backend
Provides authentication, rate-limiting, protected CMS APIs for all sections:
- Profile & Bio
- Experience & Milestones
- Skills & Capabilities
- Certifications
- Projects
and serves the static frontend with unified routing.
"""

import os
import json
import io
import uuid
import re
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Request, Response, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field
from PIL import Image, ImageOps

from server.database import init_db, get_connection
from server.auth import (
    verify_password,
    create_session,
    delete_session,
    get_user_from_token,
    is_rate_limited,
    record_login_attempt,
    clear_login_attempts
)

app = FastAPI(
    title="Muammal Portfolio Backend API",
    description="Secure backend with Argon2id auth, rate limiting, and full portfolio content CMS.",
    version="2.1.0"
)

# Startup DB initialization
@app.on_event("startup")
def startup_event():
    init_db()

# Environment settings
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
IS_PRODUCTION = os.environ.get("ENVIRONMENT", "development").lower() == "production"

# Configurable CORS Origins
configured_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
).split(",")
configured_origins = [o.strip() for o in configured_origins if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=configured_origins,
    allow_origin_regex=r"^https:\/\/.*\.github\.io$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: Extract authenticated user from Cookie or Authorization header
def get_current_user(request: Request) -> dict:
    token = None
    # 1. Check Bearer token in header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()

    # 2. Check HttpOnly cookie
    if not token:
        token = request.cookies.get("portfolio_session")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in."
        )

    user = get_user_from_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or is invalid."
        )
    user["token"] = token
    return user

# Pydantic Schemas
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=200)

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    roles: Optional[List[str]] = None
    hero_desc: Optional[str] = None
    based_in: Optional[str] = None
    studying: Optional[str] = None
    focus: Optional[str] = None
    about_headline: Optional[str] = None
    about_body: Optional[str] = None
    stats: Optional[List[Dict[str, Any]]] = None
    socials: Optional[List[Dict[str, Any]]] = None
    contact_email: Optional[str] = None
    avatar_url: Optional[str] = None

class ExperienceCreate(BaseModel):
    period: str
    role: str
    company: str
    description: str
    bullets: Optional[List[str]] = []
    tags: Optional[List[str]] = []
    media_url: Optional[str] = ""
    display_order: Optional[int] = 0

class ExperienceUpdate(BaseModel):
    period: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    bullets: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    media_url: Optional[str] = None
    display_order: Optional[int] = None

class ServiceCreate(BaseModel):
    title: str
    description: str
    display_order: Optional[int] = 0

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None

class ToolkitGroupCreate(BaseModel):
    category: str
    items: List[str]
    display_order: Optional[int] = 0

class ToolkitGroupUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[List[str]] = None
    display_order: Optional[int] = None

class CertificationCreate(BaseModel):
    title: str
    issuer: str
    full_image_url: str
    fallback_image_url: Optional[str] = ""
    display_order: Optional[int] = 0

class CertificationUpdate(BaseModel):
    title: Optional[str] = None
    issuer: Optional[str] = None
    full_image_url: Optional[str] = None
    fallback_image_url: Optional[str] = None
    display_order: Optional[int] = None

class ProjectCreate(BaseModel):
    slug: str
    title: str
    description: str
    badge: str
    image_url: str
    link_url: Optional[str] = ""
    tags: List[str] = []
    facts_json: Optional[List[dict]] = []
    is_published: bool = True
    display_order: int = 0

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    display_order: Optional[int] = None

# --- Health Endpoint ---
@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "portfolio-api", "version": "2.1.0"}

# --- Authentication Endpoints ---
@app.post("/api/auth/login")
def login(creds: LoginRequest, request: Request, response: Response):
    client_ip = request.client.host if request.client else "unknown"

    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 5 minutes before trying again."
        )

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, password_hash FROM users WHERE username = ?", (creds.username,))
    row = cur.fetchone()

    if not row or not verify_password(creds.password, row["password_hash"]):
        record_login_attempt(client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    # Success: clear rate limiter
    clear_login_attempts(client_ip)

    # Create session
    token = create_session(row["id"])

    # Set secure HttpOnly cookie
    response.set_cookie(
        key="portfolio_session",
        value=token,
        httponly=True,
        samesite="lax",
        secure=IS_PRODUCTION,
        max_age=86400  # 24 hours
    )

    return {
        "success": True,
        "token": token,
        "user": {
            "id": row["id"],
            "username": row["username"]
        }
    }

@app.post("/api/auth/logout")
def logout(response: Response, user: dict = Depends(get_current_user)):
    delete_session(user["token"])
    response.delete_cookie(key="portfolio_session")
    return {"success": True, "message": "Successfully logged out."}

@app.get("/api/auth/me")
def get_me(user: dict = Depends(get_current_user)):
    return {
        "authenticated": True,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "created_at": user["created_at"]
        }
    }

# ==============================================================================
# PUBLIC FULL CONTENT ENDPOINT (Single fast request for the entire website)
# ==============================================================================
@app.get("/api/content")
def get_full_content():
    conn = get_connection()
    cur = conn.cursor()

    # 1. Profile
    cur.execute("SELECT * FROM site_profile WHERE id = 1")
    p_row = cur.fetchone()
    profile = {}
    if p_row:
        profile = {
            "name": p_row["name"],
            "roles": json.loads(p_row["roles_json"]),
            "hero_desc": p_row["hero_desc"],
            "based_in": p_row["based_in"],
            "studying": p_row["studying"],
            "focus": p_row["focus"],
            "about_headline": p_row["about_headline"],
            "about_body": p_row["about_body"],
            "stats": json.loads(p_row["stats_json"]),
            "socials": json.loads(p_row["socials_json"]),
            "contact_email": p_row["contact_email"],
            "avatar_url": p_row["avatar_url"] if "avatar_url" in p_row.keys() and p_row["avatar_url"] else "assets/ME.png"
        }

    # 2. Experience
    cur.execute("SELECT * FROM experience ORDER BY display_order ASC, id ASC")
    exp_rows = cur.fetchall()
    experience = [
        {
            "id": r["id"],
            "period": r["period"],
            "role": r["role"],
            "company": r["company"],
            "description": r["description"],
            "bullets": json.loads(r["bullets_json"]),
            "tags": json.loads(r["tags_json"]),
            "media_url": r["media_url"],
            "display_order": r["display_order"]
        } for r in exp_rows
    ]

    # 3. Services / Capabilities
    cur.execute("SELECT * FROM services ORDER BY display_order ASC, id ASC")
    services = [
        {
            "id": r["id"],
            "title": r["title"],
            "description": r["description"],
            "display_order": r["display_order"]
        } for r in cur.fetchall()
    ]

    # 4. Toolkit Groups
    cur.execute("SELECT * FROM toolkit_groups ORDER BY display_order ASC, id ASC")
    toolkit = [
        {
            "id": r["id"],
            "category": r["category"],
            "items": json.loads(r["items_json"]),
            "display_order": r["display_order"]
        } for r in cur.fetchall()
    ]

    # 5. Certifications
    cur.execute("SELECT * FROM certifications ORDER BY display_order ASC, id ASC")
    certifications = [
        {
            "id": r["id"],
            "title": r["title"],
            "issuer": r["issuer"],
            "full_image_url": r["full_image_url"],
            "fallback_image_url": r["fallback_image_url"],
            "display_order": r["display_order"]
        } for r in cur.fetchall()
    ]

    # 6. Projects
    cur.execute("""
        SELECT id, slug, title, description, badge, image_url, link_url, tags, facts_json, display_order
        FROM projects
        WHERE is_published = 1
        ORDER BY display_order ASC, id ASC
    """)
    projects = [
        {
            "id": r["id"],
            "slug": r["slug"],
            "title": r["title"],
            "description": r["description"],
            "badge": r["badge"],
            "image_url": r["image_url"],
            "link_url": r["link_url"],
            "tags": json.loads(r["tags"]),
            "facts": json.loads(r["facts_json"]),
            "display_order": r["display_order"]
        } for r in cur.fetchall()
    ]

    return {
        "profile": profile,
        "experience": experience,
        "services": services,
        "toolkit": toolkit,
        "certifications": certifications,
        "projects": projects
    }

# ==============================================================================
# ADMIN CMS ENDPOINTS: PROFILE & BIO
# ==============================================================================
@app.get("/api/admin/profile")
def get_admin_profile(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM site_profile WHERE id = 1")
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "name": row["name"],
        "roles": json.loads(row["roles_json"]),
        "hero_desc": row["hero_desc"],
        "based_in": row["based_in"],
        "studying": row["studying"],
        "focus": row["focus"],
        "about_headline": row["about_headline"],
        "about_body": row["about_body"],
        "stats": json.loads(row["stats_json"]),
        "socials": json.loads(row["socials_json"]),
        "contact_email": row["contact_email"],
        "avatar_url": row["avatar_url"] if "avatar_url" in row.keys() and row["avatar_url"] else "assets/ME.png"
    }

@app.put("/api/admin/profile")
def update_admin_profile(data: ProfileUpdate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    fields = []
    values = []

    if data.name is not None:
        fields.append("name = ?"); values.append(data.name)
    if data.roles is not None:
        fields.append("roles_json = ?"); values.append(json.dumps(data.roles))
    if data.hero_desc is not None:
        fields.append("hero_desc = ?"); values.append(data.hero_desc)
    if data.based_in is not None:
        fields.append("based_in = ?"); values.append(data.based_in)
    if data.studying is not None:
        fields.append("studying = ?"); values.append(data.studying)
    if data.focus is not None:
        fields.append("focus = ?"); values.append(data.focus)
    if data.about_headline is not None:
        fields.append("about_headline = ?"); values.append(data.about_headline)
    if data.about_body is not None:
        fields.append("about_body = ?"); values.append(data.about_body)
    if data.stats is not None:
        fields.append("stats_json = ?"); values.append(json.dumps(data.stats))
    if data.socials is not None:
        fields.append("socials_json = ?"); values.append(json.dumps(data.socials))
    if data.contact_email is not None:
        fields.append("contact_email = ?"); values.append(data.contact_email)
    if data.avatar_url is not None:
        fields.append("avatar_url = ?"); values.append(data.avatar_url)

    if fields:
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(1)
        with conn:
            conn.execute(f"UPDATE site_profile SET {', '.join(fields)} WHERE id = ?", tuple(values))

    return {"success": True, "message": "Profile updated successfully"}

# ==============================================================================
# ADMIN CMS ENDPOINTS: EXPERIENCE
# ==============================================================================
@app.get("/api/admin/experience")
def get_admin_experience(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM experience ORDER BY display_order ASC, id ASC")
    return [
        {
            "id": r["id"],
            "period": r["period"],
            "role": r["role"],
            "company": r["company"],
            "description": r["description"],
            "bullets": json.loads(r["bullets_json"]),
            "tags": json.loads(r["tags_json"]),
            "media_url": r["media_url"],
            "display_order": r["display_order"]
        } for r in cur.fetchall()
    ]

@app.post("/api/admin/experience")
def create_experience(data: ExperienceCreate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT INTO experience (period, role, company, description, bullets_json, tags_json, media_url, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.period, data.role, data.company, data.description,
            json.dumps(data.bullets or []), json.dumps(data.tags or []),
            data.media_url or "", data.display_order
        ))
    return {"success": True, "message": "Experience entry added successfully"}

@app.put("/api/admin/experience/{exp_id}")
def update_experience(exp_id: int, data: ExperienceUpdate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    fields = []
    values = []
    if data.period is not None:
        fields.append("period = ?"); values.append(data.period)
    if data.role is not None:
        fields.append("role = ?"); values.append(data.role)
    if data.company is not None:
        fields.append("company = ?"); values.append(data.company)
    if data.description is not None:
        fields.append("description = ?"); values.append(data.description)
    if data.bullets is not None:
        fields.append("bullets_json = ?"); values.append(json.dumps(data.bullets))
    if data.tags is not None:
        fields.append("tags_json = ?"); values.append(json.dumps(data.tags))
    if data.media_url is not None:
        fields.append("media_url = ?"); values.append(data.media_url)
    if data.display_order is not None:
        fields.append("display_order = ?"); values.append(data.display_order)

    if fields:
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(exp_id)
        with conn:
            cur = conn.execute(f"UPDATE experience SET {', '.join(fields)} WHERE id = ?", tuple(values))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Experience entry not found")
    return {"success": True, "message": f"Experience entry {exp_id} updated successfully"}

@app.delete("/api/admin/experience/{exp_id}")
def delete_experience(exp_id: int, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        cur = conn.execute("DELETE FROM experience WHERE id = ?", (exp_id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Experience entry not found")
    return {"success": True, "message": f"Experience entry {exp_id} deleted successfully"}

# ==============================================================================
# ADMIN CMS ENDPOINTS: SERVICES (CAPABILITIES)
# ==============================================================================
@app.get("/api/admin/services")
def get_admin_services(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM services ORDER BY display_order ASC, id ASC")
    return [dict(r) for r in cur.fetchall()]

@app.post("/api/admin/services")
def create_service(data: ServiceCreate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT INTO services (title, description, display_order)
            VALUES (?, ?, ?)
        """, (data.title, data.description, data.display_order))
    return {"success": True, "message": "Service capability added successfully"}

@app.put("/api/admin/services/{svc_id}")
def update_service(svc_id: int, data: ServiceUpdate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    fields = []
    values = []
    if data.title is not None:
        fields.append("title = ?"); values.append(data.title)
    if data.description is not None:
        fields.append("description = ?"); values.append(data.description)
    if data.display_order is not None:
        fields.append("display_order = ?"); values.append(data.display_order)

    if fields:
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(svc_id)
        with conn:
            cur = conn.execute(f"UPDATE services SET {', '.join(fields)} WHERE id = ?", tuple(values))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Service not found")
    return {"success": True, "message": f"Service {svc_id} updated successfully"}

@app.delete("/api/admin/services/{svc_id}")
def delete_service(svc_id: int, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        cur = conn.execute("DELETE FROM services WHERE id = ?", (svc_id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Service not found")
    return {"success": True, "message": f"Service {svc_id} deleted successfully"}

# ==============================================================================
# ADMIN CMS ENDPOINTS: TOOLKIT
# ==============================================================================
@app.get("/api/admin/toolkit")
def get_admin_toolkit(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM toolkit_groups ORDER BY display_order ASC, id ASC")
    return [
        {
            "id": r["id"],
            "category": r["category"],
            "items": json.loads(r["items_json"]),
            "display_order": r["display_order"]
        } for r in cur.fetchall()
    ]

@app.post("/api/admin/toolkit")
def create_toolkit_group(data: ToolkitGroupCreate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT INTO toolkit_groups (category, items_json, display_order)
            VALUES (?, ?, ?)
        """, (data.category, json.dumps(data.items), data.display_order))
    return {"success": True, "message": "Toolkit category added successfully"}

@app.put("/api/admin/toolkit/{tk_id}")
def update_toolkit_group(tk_id: int, data: ToolkitGroupUpdate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    fields = []
    values = []
    if data.category is not None:
        fields.append("category = ?"); values.append(data.category)
    if data.items is not None:
        fields.append("items_json = ?"); values.append(json.dumps(data.items))
    if data.display_order is not None:
        fields.append("display_order = ?"); values.append(data.display_order)

    if fields:
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(tk_id)
        with conn:
            cur = conn.execute(f"UPDATE toolkit_groups SET {', '.join(fields)} WHERE id = ?", tuple(values))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Toolkit category not found")
    return {"success": True, "message": f"Toolkit category {tk_id} updated successfully"}

@app.delete("/api/admin/toolkit/{tk_id}")
def delete_toolkit_group(tk_id: int, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        cur = conn.execute("DELETE FROM toolkit_groups WHERE id = ?", (tk_id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Toolkit category not found")
    return {"success": True, "message": f"Toolkit category {tk_id} deleted successfully"}

# ==============================================================================
# ADMIN CMS ENDPOINTS: CERTIFICATIONS
# ==============================================================================
@app.get("/api/admin/certifications")
def get_admin_certifications(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM certifications ORDER BY display_order ASC, id ASC")
    return [dict(r) for r in cur.fetchall()]

@app.post("/api/admin/certifications")
def create_certification(data: CertificationCreate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        conn.execute("""
            INSERT INTO certifications (title, issuer, full_image_url, fallback_image_url, display_order)
            VALUES (?, ?, ?, ?, ?)
        """, (data.title, data.issuer, data.full_image_url, data.fallback_image_url or "", data.display_order))
    return {"success": True, "message": "Certification added successfully"}

@app.put("/api/admin/certifications/{cert_id}")
def update_certification(cert_id: int, data: CertificationUpdate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    fields = []
    values = []
    if data.title is not None:
        fields.append("title = ?"); values.append(data.title)
    if data.issuer is not None:
        fields.append("issuer = ?"); values.append(data.issuer)
    if data.full_image_url is not None:
        fields.append("full_image_url = ?"); values.append(data.full_image_url)
    if data.fallback_image_url is not None:
        fields.append("fallback_image_url = ?"); values.append(data.fallback_image_url)
    if data.display_order is not None:
        fields.append("display_order = ?"); values.append(data.display_order)

    if fields:
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(cert_id)
        with conn:
            cur = conn.execute(f"UPDATE certifications SET {', '.join(fields)} WHERE id = ?", tuple(values))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Certification not found")
    return {"success": True, "message": f"Certification {cert_id} updated successfully"}

@app.delete("/api/admin/certifications/{cert_id}")
def delete_certification(cert_id: int, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        cur = conn.execute("DELETE FROM certifications WHERE id = ?", (cert_id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Certification not found")
    return {"success": True, "message": f"Certification {cert_id} deleted successfully"}

# ==============================================================================
# PROJECTS ENDPOINTS (PUBLIC & ADMIN)
# ==============================================================================
@app.get("/api/projects")
def get_public_projects():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, slug, title, description, badge, image_url, link_url, tags, facts_json, display_order
        FROM projects
        WHERE is_published = 1
        ORDER BY display_order ASC, id ASC
    """)
    rows = cur.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "slug": r["slug"],
            "title": r["title"],
            "description": r["description"],
            "badge": r["badge"],
            "image_url": r["image_url"],
            "link_url": r["link_url"],
            "tags": json.loads(r["tags"]),
            "facts": json.loads(r["facts_json"]),
            "display_order": r["display_order"]
        })
    return results

@app.get("/api/admin/projects")
def get_admin_projects(user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, slug, title, description, badge, image_url, link_url, tags, facts_json, is_published, display_order, created_at, updated_at
        FROM projects
        ORDER BY display_order ASC, id ASC
    """)
    rows = cur.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "slug": r["slug"],
            "title": r["title"],
            "description": r["description"],
            "badge": r["badge"],
            "image_url": r["image_url"],
            "link_url": r["link_url"],
            "tags": json.loads(r["tags"]),
            "facts": json.loads(r["facts_json"]),
            "is_published": bool(r["is_published"]),
            "display_order": r["display_order"],
            "created_at": r["created_at"],
            "updated_at": r["updated_at"]
        })
    return results

@app.put("/api/admin/projects/{project_id}")
def update_project(project_id: int, data: ProjectUpdate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id FROM projects WHERE id = ?", (project_id,))
    if not cur.fetchone():
        raise HTTPException(status_code=404, detail="Project not found")

    fields = []
    values = []
    if data.title is not None:
        fields.append("title = ?"); values.append(data.title)
    if data.description is not None:
        fields.append("description = ?"); values.append(data.description)
    if data.badge is not None:
        fields.append("badge = ?"); values.append(data.badge)
    if data.image_url is not None:
        fields.append("image_url = ?"); values.append(data.image_url)
    if data.link_url is not None:
        fields.append("link_url = ?"); values.append(data.link_url)
    if data.tags is not None:
        fields.append("tags = ?"); values.append(json.dumps(data.tags))
    if data.is_published is not None:
        fields.append("is_published = ?"); values.append(1 if data.is_published else 0)
    if data.display_order is not None:
        fields.append("display_order = ?"); values.append(data.display_order)

    if fields:
        fields.append("updated_at = CURRENT_TIMESTAMP")
        values.append(project_id)
        with conn:
            conn.execute(f"UPDATE projects SET {', '.join(fields)} WHERE id = ?", tuple(values))

    return {"success": True, "message": f"Project {project_id} updated successfully"}

@app.post("/api/admin/projects")
def create_project(data: ProjectCreate, user: dict = Depends(get_current_user)):
    conn = get_connection()
    try:
        with conn:
            conn.execute("""
                INSERT INTO projects (slug, title, description, badge, image_url, link_url, tags, facts_json, is_published, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data.slug, data.title, data.description, data.badge,
                data.image_url, data.link_url or "", json.dumps(data.tags),
                json.dumps(data.facts_json or []), 1 if data.is_published else 0,
                data.display_order
            ))
        return {"success": True, "message": "Project created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/admin/projects/{project_id}")
def delete_project(project_id: int, user: dict = Depends(get_current_user)):
    conn = get_connection()
    with conn:
        cur = conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "message": f"Project {project_id} deleted successfully"}

# --- Image Upload & Optimization API ---
@app.post("/api/admin/upload")
async def upload_image(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    valid_extensions = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"}
    original_name = file.filename
    ext = os.path.splitext(original_name)[1].lower()
    if ext not in valid_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Allowed: PNG, JPG, JPEG, WEBP, SVG, GIF"
        )

    upload_dir = os.path.join(FRONTEND_DIR, "assets", "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    contents = await file.read()
    if len(contents) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 25MB.")

    # Clean stem for file naming
    clean_stem = re.sub(r'[^a-zA-Z0-9_\-]', '_', os.path.splitext(original_name)[0])[:30]
    if not clean_stem:
        clean_stem = "upload"
    unique_suffix = uuid.uuid4().hex[:8]

    if ext == ".svg":
        saved_filename = f"{clean_stem}_{unique_suffix}.svg"
        out_path = os.path.join(upload_dir, saved_filename)
        with open(out_path, "wb") as f:
            f.write(contents)
    elif ext == ".gif":
        saved_filename = f"{clean_stem}_{unique_suffix}.gif"
        out_path = os.path.join(upload_dir, saved_filename)
        with open(out_path, "wb") as f:
            f.write(contents)
    else:
        # Convert raster to optimized WebP with EXIF transpose & downscaling
        saved_filename = f"{clean_stem}_{unique_suffix}.webp"
        out_path = os.path.join(upload_dir, saved_filename)
        try:
            img = Image.open(io.BytesIO(contents))
            img = ImageOps.exif_transpose(img)
            
            # Limit dimension if exceedingly high
            max_dim = 2560
            if img.width > max_dim or img.height > max_dim:
                img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

            # Preserve transparency if present
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                img = img.convert("RGBA")
                img.save(out_path, "WEBP", quality=90, method=6)
            else:
                img = img.convert("RGB")
                img.save(out_path, "WEBP", quality=90, method=6)
        except Exception:
            # Fallback to saving original format
            saved_filename = f"{clean_stem}_{unique_suffix}{ext}"
            out_path = os.path.join(upload_dir, saved_filename)
            with open(out_path, "wb") as f:
                f.write(contents)

    rel_url = f"assets/uploads/{saved_filename}"
    return {
        "success": True,
        "url": rel_url,
        "filename": saved_filename,
        "message": "Image uploaded and optimized successfully."
    }

# --- Static Frontend Serving ---
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

@app.get("/login", include_in_schema=False)
@app.get("/login/", include_in_schema=False)
@app.get("/login.html", include_in_schema=False)
def serve_login():
    return FileResponse(os.path.join(FRONTEND_DIR, "login.html"))

@app.get("/dashboard", include_in_schema=False)
@app.get("/dashboard/", include_in_schema=False)
@app.get("/dashboard.html", include_in_schema=False)
def serve_dashboard():
    return FileResponse(os.path.join(FRONTEND_DIR, "dashboard.html"))

@app.get("/styles.css", include_in_schema=False)
def serve_styles():
    return FileResponse(os.path.join(FRONTEND_DIR, "styles.css"))

@app.get("/script.js", include_in_schema=False)
def serve_script():
    return FileResponse(os.path.join(FRONTEND_DIR, "script.js"))

@app.get("/api-config.js", include_in_schema=False)
def serve_config():
    return FileResponse(os.path.join(FRONTEND_DIR, "api-config.js"))

@app.get("/", include_in_schema=False)
def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
