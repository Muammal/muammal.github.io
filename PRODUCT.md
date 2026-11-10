# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Muammal A. Fadhil's personal engineering portfolio serves four audiences equally; none is secondary:

- **Recruiters and hiring managers** evaluating him for ML, LLM, or robotics roles (jobs and internships).
- **Graduate schools and research labs**: admissions committees, professors, and potential research collaborators judging research readiness.
- **Sponsors and partners** deciding whether to back AI Developers Festival (AI DevFest) or related community initiatives.
- **Freelance and consulting clients** looking for someone to build ML models, LLM systems, or agentic workflows.

Visitors typically arrive from a link (LinkedIn, GitHub, Hugging Face, Kaggle, a CV or an email) with limited time, and need to quickly decide whether he is credible and worth contacting.

## Product Purpose

A single public site that presents Muammal's projects, research, career milestones, capabilities, and credentials at the intersection of Machine Learning, Large Language Models, and Robotics.

Success means a visitor from any of the four audiences comes away with all three of these:

1. **Proof of technical depth**: real model work they can verify (e.g. the AIMO fine-tune on Hugging Face, Kaggle work).
2. **The builder-plus-leader picture**: hackathon results alongside founding and running AI DevFest.
3. **A clear path to contact**: sending a message through the contact form or by email.

## Positioning

A Data Scientist and ML Developer, currently a Bachelor's student in Artificial Intelligence & Robotics based in Baghdad, Iraq, who both ships specialised models (reasoning LLM fine-tunes, LLM gateways, recommendation engines) and leads the regional AI developer community as Founder & Executive Director of AI DevFest. His work bridges mathematical theory and physical application: LLMs, agentic AI, and robotics and control.

## Operating Context

- Public site served as static files from GitHub Pages (`muammal.github.io`), deployed by `.github/workflows/deploy.yml` on push to `main`.
- An optional FastAPI backend (`server/`, SQLite) powers a private admin area: `login.html` and `dashboard.html`, with tabs for Bio & Profile, Experience, Skills & Capabilities, Certifications, and Projects, plus image upload.
- The public page ships complete static HTML content and hydrates from `/api/content` and `/api/projects` when a backend is reachable (`api-config.js` resolves the API base URL).
- Public page sections: Hero, About, Work (projects), Experience, Capabilities/Services, Certifications, and Contact.

## Capabilities and Constraints

- **Must keep working as static GitHub Pages hosting.** The public site cannot depend on the backend to render; the FastAPI server is optional.
- **The admin CMS drives content.** Profile, experience, services, toolkit, certifications, and projects must stay editable from the dashboard. Design changes to the public page must keep the data shapes and hooks the CMS feeds.
- Plain HTML/CSS/JS front end (`index.html`, `styles.css`, `script.js`) with GSAP-based motion; no build step.
- Optimised WebP versions of images live in `assets/optimized/`.
- **Open decision:** the site currently ships dark-only (`data-theme="dark"`, latest commit). It was not confirmed as a binding brand commitment.
- **Open decision:** whether to support Arabic or right-to-left layout. The site is English-only today (`lang="en"`).

## Brand Commitments

- Name: **Muammal A. Fadhil** (short form "Muammal").
- Role line: Data Scientist & Machine Learning Developer; Bachelor's student in AI & Robotics; Founder & Executive Director, AI Developers Festival.
- Public profiles: LinkedIn, GitHub (`Muammal`), Hugging Face (`Castial`), Kaggle (`castial`).
- Public contact: `cas.dropmail@gmail.com` and the on-site contact form.

## Evidence on Hand

- **AIMO (AI Mathematics Olympiad, 3rd edition):** reasoning model fine-tuned from OpenAI GPT-OSS-20B on about 200,000 mathematical reasoning samples, published at `huggingface.co/Castial/gpt-oss-20b-aimo-bnb-bf16`. Image: `assets/AIMO_showcase.png`.
- **Nabu AI Bookstore Platform:** LLM-powered discovery and recommendation engine; 3rd place at the Fintech Hackathon. Images: `assets/nabu_showcase.png`, `assets/Fintech.jpg`.
- **Flow.ai LLM Gateway:** unified inference integration platform built at the GEW AI Hackathon. Image: `assets/GEW.jpg`.
- **AI DevFest:** community initiative with workshops for developers, researchers, and engineers. Image: `assets/aidevfest.jpg`.
- Other event and credential imagery in `assets/`: `AiDojo`, `Elements`, `IBM`, `TED`, `Million`, `acceleration`, `datacamp1`, `superhackathon`. Portraits: `ME`, `developer_portrait`.
- Technical toolkit (from README): PyTorch, Hugging Face Transformers, Unsloth, PEFT & LoRA, quantisation, Qwen, Ollama, Python, ROS, FastAPI, Linux, Docker, SQLite, mathematical modelling, data structures & algorithms.
- **Absent, do not fabricate:** testimonials, client names, employer endorsements, publication citations, metrics or benchmark scores beyond those stated above, and pricing or rates for services.

## Product Principles

1. **Verifiable over impressive.** Every claim should point to something a skeptical reviewer can check: a model card, a repository, a certificate, an event.
2. **Serve all four audiences without forking the site.** A recruiter, a professor, a sponsor, and a client should each find their proof quickly on the same page.
3. **Builder and leader, side by side.** Technical depth and community leadership are presented as one profile, not two separate stories.
4. **Contact is always one step away.** Whatever a visitor reads, the route to reaching Muammal stays obvious.
5. **Content lives in the CMS, the site stays static-safe.** Design serves editable content and never makes the public page depend on the backend.
