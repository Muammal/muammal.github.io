"""
Portfolio Database Architecture (SQLite)
Provides persistent storage for users, sessions, and dynamically managed portfolio content:
- Profile & Bio
- Experience & Career Milestones
- Skills & Capabilities
- Certifications & Credentials
- Projects & Case Studies
"""

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "portfolio.db"))

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_connection()
    with conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS site_profile (
                id INTEGER PRIMARY KEY DEFAULT 1,
                name TEXT NOT NULL,
                roles_json TEXT NOT NULL DEFAULT '[]',
                hero_desc TEXT NOT NULL,
                based_in TEXT NOT NULL,
                studying TEXT NOT NULL,
                focus TEXT NOT NULL,
                about_headline TEXT NOT NULL,
                about_body TEXT NOT NULL,
                stats_json TEXT NOT NULL DEFAULT '[]',
                socials_json TEXT NOT NULL DEFAULT '[]',
                contact_email TEXT NOT NULL DEFAULT '',
                avatar_url TEXT NOT NULL DEFAULT 'assets/ME.png',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS experience (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                period TEXT NOT NULL,
                role TEXT NOT NULL,
                company TEXT NOT NULL,
                description TEXT NOT NULL,
                bullets_json TEXT NOT NULL DEFAULT '[]',
                tags_json TEXT NOT NULL DEFAULT '[]',
                media_url TEXT NOT NULL DEFAULT '',
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS services (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS toolkit_groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                items_json TEXT NOT NULL DEFAULT '[]',
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS certifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                issuer TEXT NOT NULL,
                full_image_url TEXT NOT NULL,
                fallback_image_url TEXT NOT NULL DEFAULT '',
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                badge TEXT NOT NULL,
                image_url TEXT NOT NULL,
                link_url TEXT,
                tags TEXT NOT NULL DEFAULT '[]',
                facts_json TEXT NOT NULL DEFAULT '[]',
                is_published INTEGER NOT NULL DEFAULT 1,
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur = conn.cursor()

        # Check for avatar_url column in site_profile migration
        cur.execute("PRAGMA table_info(site_profile)")
        profile_cols = [c[1] for c in cur.fetchall()]
        if "avatar_url" not in profile_cols:
            cur.execute("ALTER TABLE site_profile ADD COLUMN avatar_url TEXT NOT NULL DEFAULT 'assets/ME.png'")

        # 1. Seed Site Profile if empty
        cur.execute("SELECT COUNT(*) FROM site_profile")
        if cur.fetchone()[0] == 0:
            cur.execute("""
                INSERT INTO site_profile (
                    id, name, roles_json, hero_desc, based_in, studying, focus,
                    about_headline, about_body, stats_json, socials_json, contact_email
                ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "Muammal A. Fadhil",
                json.dumps(["Data Scientist", "ML Developer"]),
                "I’m a Data Scientist and Bachelor’s student in Artificial Intelligence and Robotics, driven by a curiosity of how machines learn, reason, and occasionally surprise us. I enjoy working at the intersection of theory and application, where math meets code and ideas turn into systems that actually work.",
                "Baghdad, Iraq",
                "Bachelor’s, AI & Robotics",
                "LLMs · Agentic AI · Robotics",
                "Building intelligent models and robotics architectures that unlock real-world value.",
                "I focus on developing specialized reasoning models, autonomous agents, and intelligent robotics systems that solve complex, verifiable problems at the intersection of mathematical theory and physical execution.",
                json.dumps([
                    {"value": "3+", "label": "Years Active"},
                    {"value": "10+", "label": "Models Shipped"},
                    {"value": "500+", "label": "Developers Trained"}
                ]),
                json.dumps([
                    {"name": "Hugging Face", "url": "https://huggingface.co/Castial"},
                    {"name": "Kaggle", "url": "https://www.kaggle.com/castial"},
                    {"name": "GitHub", "url": "https://github.com/Muammal"},
                    {"name": "LinkedIn", "url": "https://www.linkedin.com/in/muammal-a-fadhil-54a1b8233/"}
                ]),
                "muammal.fadhil@gmail.com"
            ))

        # 2. Seed Experience if empty
        cur.execute("SELECT COUNT(*) FROM experience")
        if cur.fetchone()[0] == 0:
            seed_experience = [
                (
                    "2026 - Present",
                    "Founder | Executive Director",
                    "AI Developers Festival",
                    "AI DevFest is a community-driven event that brings together developers, researchers, and students to explore the latest advancements in artificial intelligence. It typically features talks, workshops, and hands-on sessions covering topics like machine learning, generative AI, and real-world AI applications, with the goal of sharing knowledge, building skills, and connecting people working in the AI ecosystem.",
                    json.dumps([
                        "Leading the strategic vision and execution of AI DevFest.",
                        "Overseeing program design, scientific workshops, and cross-functional teams to deliver a high-impact, community-driven artificial intelligence event."
                    ]),
                    json.dumps(["Networking", "Tech Leadership", "Community Development", "Technical Training", "Event Management"]),
                    "assets/optimized/aidevfest.webp",
                    1
                ),
                (
                    "October 2025",
                    "Machine Learning Developer",
                    "Fintech Hackathon by Makers | Zain Iraq",
                    "At Fintech Hackathon, I worked on building Nabu, an AI-powered bookstore platform that uses LLM-based recommendations to help users discover books and nearby bookstores in a more personalized and intelligent way. The project focused on combining financial and user-behavior insights with AI-driven discovery to create a seamless browsing experience.",
                    json.dumps([
                        "Developed LLM recommendation systems",
                        "Secured 3rd place in the Hackathon"
                    ]),
                    json.dumps(["PyTorch", "Hugging Face Inference", "Transformers", "Quantizers", "Qwen"]),
                    "assets/optimized/Fintech.webp",
                    2
                ),
                (
                    "November 2025",
                    "Machine Learning Developer",
                    "GEW AI Hackathon by Makers | Zain Iraq",
                    "At the GEW AI Hackathon, I participated with a project called Flow.ai, an AI gateway designed to simplify LLM and AI integration for developers and businesses. The platform provides unified, easy-to-use API access to multiple AI models, enabling faster and more scalable B2B implementation without dealing with complex infrastructure or model-specific setups.",
                    json.dumps([
                        "Worked on LLM Inference Functions through FastAPI and Transformers Module"
                    ]),
                    json.dumps(["PyTorch", "Hugging Face Inference", "Transformers", "Quantizers", "Ollama | Qwen | Gpt-oss"]),
                    "assets/optimized/GEW.webp",
                    3
                ),
                (
                    "April 2025",
                    "Python Developer",
                    "Super Hackathon by SuperNova | Department of Scientific Affairs",
                    "SuperHackathon is a competitive programming-focused hackathon centered around problem solving, algorithmic thinking, and LeetCode-style challenges. Participants are tested on their ability to design efficient solutions under time constraints, tackling problems that span data structures, algorithms, and logical reasoning.",
                    json.dumps([
                        "Secured the 2nd Place",
                        "Solved about 8 to 10 Leetcode Problems in 3 to 4 Hours"
                    ]),
                    json.dumps(["Python", "Problem Solving", "Leetcode"]),
                    "assets/optimized/superhackathon.webp",
                    4
                ),
                (
                    "2024 — 2025",
                    "Founder",
                    "Acceleration",
                    "An innovative Volunteer Team in Iraq, advancing AI software and tech education while aiming to integrate highly advanced technologies for local and global growth opportunities.",
                    json.dumps([
                        "Spearheaded AI educational content creation and tech literacy programs in Iraq.",
                        "Built relationships and fostered developer ecosystems, organizing coding groups and leadership workshops."
                    ]),
                    json.dumps(["AI Research and Writing", "Content Creation", "Networking", "Community Development", "Team Leadership"]),
                    "assets/optimized/acceleration.webp",
                    5
                )
            ]
            cur.executemany("""
                INSERT INTO experience (period, role, company, description, bullets_json, tags_json, media_url, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, seed_experience)

        # 3. Seed Services (Capabilities) if empty
        cur.execute("SELECT COUNT(*) FROM services")
        if cur.fetchone()[0] == 0:
            seed_services = [
                (
                    "Mathematical Reasoning & Deep Learning",
                    "Fine-tuning open weights with PEFT/LoRA and Unsloth for Olympiad-grade mathematical deduction, synthetic reasoning dataset synthesis, and high-accuracy predictive inference.",
                    1
                ),
                (
                    "Autonomous Agents & Intelligent Systems",
                    "Engineering multi-step reasoning chains, deterministic tool-augmented pipelines, and agentic workflows that turn unstructured inputs into verifiable real-world outcomes.",
                    2
                ),
                (
                    "Robotics & Embodied AI",
                    "Developing autonomous robotics architectures, kinematic telemetry bridges, embedded sensor integration, and real-time perception systems that bridge mathematical theory with physical robotic hardware.",
                    3
                )
            ]
            cur.executemany("""
                INSERT INTO services (title, description, display_order)
                VALUES (?, ?, ?)
            """, seed_services)

        # 4. Seed Toolkit Groups if empty
        cur.execute("SELECT COUNT(*) FROM toolkit_groups")
        if cur.fetchone()[0] == 0:
            seed_toolkit = [
                (
                    "LLM & Reasoning",
                    json.dumps(["Transformers", "Unsloth", "PEFT & LoRA", "Quantization", "Hugging Face", "Ollama"]),
                    1
                ),
                (
                    "Robotics & Control",
                    json.dumps(["MAVLink", "ROS / ROS 2", "PX4 / ArduPilot", "Embedded Vision"]),
                    2
                ),
                (
                    "Machine Learning",
                    json.dumps(["PyTorch", "scikit-learn", "NumPy & Pandas"]),
                    3
                ),
                (
                    "Languages & Backend",
                    json.dumps(["Python", "FastAPI", "C++ / Embedded"]),
                    4
                ),
                (
                    "Leadership & Community",
                    json.dumps(["Technical Leadership", "Developer Workshops", "Hackathon Mentoring", "AI DevFest Speaker"]),
                    5
                )
            ]
            cur.executemany("""
                INSERT INTO toolkit_groups (category, items_json, display_order)
                VALUES (?, ?, ?)
            """, seed_toolkit)

        # 5. Seed Certifications if empty
        cur.execute("SELECT COUNT(*) FROM certifications")
        if cur.fetchone()[0] == 0:
            seed_certs = [
                (
                    "Supervised Learning with scikit-learn",
                    "DataCamp",
                    "assets/optimized/datacamp1.webp",
                    "assets/datacamp1.jpg",
                    1
                ),
                (
                    "Machine Learning With Python",
                    "IBM",
                    "assets/optimized/IBM.webp",
                    "assets/IBM.png",
                    2
                ),
                (
                    "One Million Jordanian Coders (Data Analysis Track)",
                    "Udacity & Jordanian Government",
                    "assets/optimized/Million.webp",
                    "assets/Million.png",
                    3
                ),
                (
                    "Python Mastering Course",
                    "Ai Dojo",
                    "assets/optimized/AiDojo.webp",
                    "assets/AiDojo.png",
                    4
                ),
                (
                    "Elements of AI",
                    "University of Helsinki & MinnaLearn",
                    "assets/optimized/Elements.webp",
                    "assets/Elements.jpg",
                    5
                ),
                (
                    "The Experiment Digital",
                    "World Learning & U.S. Department of State",
                    "assets/optimized/TED.webp",
                    "assets/TED.png",
                    6
                )
            ]
            cur.executemany("""
                INSERT INTO certifications (title, issuer, full_image_url, fallback_image_url, display_order)
                VALUES (?, ?, ?, ?, ?)
            """, seed_certs)

        # 6. Seed Projects if empty
        cur.execute("SELECT COUNT(*) FROM projects")
        if cur.fetchone()[0] == 0:
            seed_projects = [
                (
                    "nabu-bookstore",
                    "Nabu Bookstore Platform",
                    "Nabu is an AI-powered bookstore platform that uses large language models (LLMs) and intelligent recommendation systems to help users discover books, explore personalized reading experiences, and find nearby bookstores through smart, data-driven search.",
                    "Web Application",
                    "assets/optimized/nabu_showcase.webp",
                    "",
                    json.dumps([]),
                    json.dumps([
                        {"label": "Built at", "value": "Fintech Hackathon by Makers | Zain Iraq"},
                        {"label": "Result", "value": "3rd place"}
                    ]),
                    1,
                    1
                ),
                (
                    "aimo-3rd-edition",
                    "AI Mathematics Olympiads 3rd Edition",
                    "A mathematics-specialized reasoning model built on top of OpenAI GPT-OSS-20B and fine-tuned on approximately 200,000 high-quality mathematical reasoning samples focused on olympiad-style and AIMO-style problem solving.",
                    "Large Language Model",
                    "assets/optimized/AIMO_showcase.webp",
                    "https://huggingface.co/Castial/gpt-oss-20b-aimo-bnb-bf16",
                    json.dumps(["Python", "Transformers", "Unsloth", "PyTorch", "PEFT and LoRA Configs"]),
                    json.dumps([
                        {"label": "Base model", "value": "OpenAI GPT-OSS-20B"},
                        {"label": "Training data", "value": "~200,000 reasoning samples"}
                    ]),
                    1,
                    2
                )
            ]
            cur.executemany("""
                INSERT INTO projects (slug, title, description, badge, image_url, link_url, tags, facts_json, is_published, display_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, seed_projects)

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
