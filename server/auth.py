"""
Portfolio Authentication & Security Module
Implements Argon2id hashing, secure session management, and sliding-window rate limiting.
"""

import time
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError
from server.database import get_connection

# Argon2id password hasher with production recommended parameters
hasher = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=2,
    hash_len=32
)

SESSION_DURATION_HOURS = 24

# Sliding window rate limiter for login attempts: ip -> list of timestamps
_login_attempts: Dict[str, list] = {}
RATE_LIMIT_MAX_ATTEMPTS = 5
RATE_LIMIT_WINDOW_SECONDS = 300  # 5 minutes

def is_rate_limited(ip: str) -> bool:
    now = time.time()
    attempts = _login_attempts.get(ip, [])
    # Filter attempts within the window
    valid_attempts = [t for t in attempts if now - t < RATE_LIMIT_WINDOW_SECONDS]
    _login_attempts[ip] = valid_attempts
    return len(valid_attempts) >= RATE_LIMIT_MAX_ATTEMPTS

def record_login_attempt(ip: str):
    now = time.time()
    if ip not in _login_attempts:
        _login_attempts[ip] = []
    _login_attempts[ip].append(now)

def clear_login_attempts(ip: str):
    if ip in _login_attempts:
        del _login_attempts[ip]

def hash_password(password: str) -> str:
    return hasher.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    try:
        return hasher.verify(hashed, password)
    except (VerifyMismatchError, InvalidHashError):
        return False

def create_session(user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=SESSION_DURATION_HOURS)
    conn = get_connection()
    with conn:
        conn.execute(
            "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
            (token, user_id, expires_at.isoformat())
        )
    return token

def delete_session(token: str) -> bool:
    conn = get_connection()
    with conn:
        cur = conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
        return cur.rowcount > 0

def get_user_from_token(token: str) -> Optional[dict]:
    if not token:
        return None
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT u.id, u.username, u.created_at, s.expires_at
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    """, (token,))
    row = cur.fetchone()
    if not row:
        return None

    # Check expiration
    expires_at = datetime.fromisoformat(row["expires_at"])
    if datetime.utcnow() > expires_at:
        delete_session(token)
        return None

    return {
        "id": row["id"],
        "username": row["username"],
        "created_at": row["created_at"]
    }

