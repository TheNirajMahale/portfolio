# Niraj Mahale — Developer Portfolio

A clean, fast, personal portfolio and resume website built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **TypeScript**.

Design heavily inspired by [Uday Kiran's portfolio](https://udaykiran.dev).

---

## ⚡ Features

- **Tech Stack Grid:** Clean, responsive icon grid inspired by [udaykiran.dev](https://udaykiran.dev).
- **Data-Driven:** Keep all portfolio information (projects, work history, skills, contacts) in straightforward JSON files without touching layout code.
- **Dedicated Web Resume (`/resume`):** A clean, print-friendly `/resume` page ready for recruiters and offline saving.
- **ATS Resume Compiler:** Optional plain-text YAML resume (`resume/resume.yaml`) compiled into PDF via Tectonic.
- **Interactive Details:** Smooth scrolling with Lenis, theme toggle (Dark/Light), audio feedback, and social hover cards.

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Frontend:** React 19 & TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React & React Icons
- **Smooth Scroll:** Lenis
- **Animations:** Motion

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Directory Structure

```text
portfolio/
├── public/               # Static assets (avatar, icons, sounds, resume PDF)
│   ├── avatar.jpg        # Profile picture
│   └── resume.pdf        # Downloadable resume
├── resume/               # Plain-text YAML resume source
│   └── resume.yaml
├── scripts/              # Build scripts (e.g. build-resume.mjs)
├── src/
│   ├── app/              # Next.js App Router (layout, homepage, resume page)
│   ├── components/       # UI sections (hero, about, experience, projects, skills, footer)
│   │   ├── providers/    # Theme, sound, and smooth-scroll providers
│   │   └── ui/           # Shared UI primitives and components
│   ├── data/             # Content data
│   │   ├── resume.json   # Bio, experience, education, skills, projects
│   │   ├── site.json     # Navigation, hero config, footer pitch
│   │   └── socials.json  # GitHub, LinkedIn, email data
│   └── lib/              # Utility helpers
```

---

## 📝 Customizing Your Data

All your details live in `src/data/`:
- **Bio, Experience, Skills & Education:** [`src/data/resume.json`](src/data/resume.json)
- **Navigation, Avatar & Site Config:** [`src/data/site.json`](src/data/site.json)
- **Social Links:** [`src/data/socials.json`](src/data/socials.json)
- **Profile Picture:** Replace `public/avatar.jpg` and update `avatar` in `site.json`

---

## 🙏 Credits & Acknowledgments

- Design and layout inspired by [Uday Kiran](https://udaykiran.dev).
- Built with ❤️ by [Niraj Mahale](https://github.com/TheNirajMahale).
