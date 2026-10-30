"""
Portfolio Administrator Provisioning CLI
Allows secure creation and credential management without public sign-up endpoints.
"""

import sys
import argparse
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server.database import get_connection, init_db
from server.auth import hash_password

def create_admin(username: str, password: str):
    init_db()
    if len(password) < 8:
        print("Error: Password must be at least 8 characters long.")
        sys.exit(1)

    hashed = hash_password(password)
    conn = get_connection()
    try:
        with conn:
            conn.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                (username, hashed)
            )
        print(f"Success: Administrator '{username}' provisioned with Argon2id hash.")
    except Exception as e:
        print(f"Error provisioning administrator: {e}")
        sys.exit(1)

def reset_password(username: str, password: str):
    init_db()
    if len(password) < 8:
        print("Error: Password must be at least 8 characters long.")
        sys.exit(1)

    hashed = hash_password(password)
    conn = get_connection()
    with conn:
        cur = conn.execute(
            "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE username = ?",
            (hashed, username)
        )
        if cur.rowcount == 0:
            print(f"Error: User '{username}' not found.")
            sys.exit(1)
    print(f"Success: Password for '{username}' has been updated.")

def list_users():
    init_db()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username, created_at, updated_at FROM users")
    rows = cur.fetchall()
    if not rows:
        print("No users found in database.")
        return
    print(f"{'ID':<4} {'Username':<20} {'Created At':<25}")
    print("-" * 50)
    for r in rows:
        print(f"{r['id']:<4} {r['username']:<20} {r['created_at']:<25}")

def main():
    parser = argparse.ArgumentParser(description="Portfolio Security & Admin CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # create-admin
    p_create = subparsers.add_parser("create-admin", help="Create a new administrator account")
    p_create.add_argument("--username", required=True, help="Administrator username")
    p_create.add_argument("--password", required=True, help="Administrator password")

    # reset-password
    p_reset = subparsers.add_parser("reset-password", help="Reset an administrator password")
    p_reset.add_argument("--username", required=True, help="Administrator username")
    p_reset.add_argument("--password", required=True, help="New password")

    # list-users
    subparsers.add_parser("list-users", help="List all registered administrator users")

    args = parser.parse_args()

    if args.command == "create-admin":
        create_admin(args.username, args.password)
    elif args.command == "reset-password":
        reset_password(args.username, args.password)
    elif args.command == "list-users":
        list_users()

if __name__ == "__main__":
    main()

