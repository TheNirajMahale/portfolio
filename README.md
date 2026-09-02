# Developer Portfolio Template

A highly customizable, data-driven personal portfolio website built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Motion**, and **Radix UI**.

This template is built on a **"JSON-as-CMS"** architecture — all content, profile metadata, projects, experience, and configuration are pulled dynamically from JSON files in `src/data/`. You can fully personalize the portfolio without modifying any React or styling code.

---

## 🌟 Features

- **Zero-Code Content Management**: Entirely driven by `site.json`, `resume.json`, and `socials.json`.
- **Interactive Social Hover Cards**: Accessible profile popovers powered by Radix UI & Motion for **GitHub** (pinned repositories, active beacon, handle), **LinkedIn** (headline, skills, education, connect CTA), and **Email** (one-click clipboard copy with visual feedback).
- **Dynamic Light / Dark Theme**: Native **View Transitions API** circular ripple animation, OS preference auto-detection, and local storage persistence.
- **Typewriter Terminal**: Animated hero terminal with a classic Linux bash prompt and customizable rotating quotes.
- **Custom SVG Textures**: Procedurally generated, theme-adaptive fabric grid backgrounds.
- **Physics-Based Smooth Scrolling**: Butter-smooth inertial scrolling powered by **Lenis**.
- **Fluid Motion & Stagger Animations**: Entry reveals, blur transitions, and hover physics powered by **Motion**.
- **Auto-Generated Resume Page**: The `/resume` route formats your JSON data into a clean, print-ready document (`@media print`) and generates a PDF download button based on your name.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Custom Properties |
| **Motion & Animation** | [Motion](https://motion.dev/) (`motion/react`) |
| **Primitives** | [Radix UI Hover Card](https://www.radix-ui.com/primitives/docs/components/hover-card) |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) |
| **Icons** | [Lucide React](https://lucide.dev/) & Custom SVG Monograms |

---

## 📁 Project Structure

```text
portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css          # Theme CSS variables & global styling
│   │   ├── layout.tsx           # Root layout with fonts & providers
│   │   ├── page.tsx             # Main single-page portfolio layout
│   │   └── resume/page.tsx      # Printable, ATS-ready resume view
│   ├── components/
│   │   ├── hero.tsx             # Hero section with social triggers
│   │   ├── animated-grid.tsx    # Terminal typewriter animation
│   │   ├── experience.tsx       # Work experience timeline
│   │   ├── projects.tsx         # Featured project cards
│   │   ├── skills.tsx           # Categorized skill badges
│   │   ├── education.tsx        # Education milestones
│   │   ├── footer.tsx           # Footer with upward social hover cards
│   │   ├── nav.tsx              # Navigation bar with theme toggle
│   │   └── ui/
│   │       ├── social-hover-card.tsx # Radix UI + Motion hover card
│   │       ├── icons.tsx        # Brand SVG icons
│   │       └── section.tsx      # Section wrapper with decorative lines
│   └── data/
│       ├── site.json            # Global site configuration & terminal quotes
│       ├── resume.json          # Main resume content (bio, jobs, education)
│       └── socials.json         # Profile hover card content (GitHub, LinkedIn, Email)
├── public/                      # Static assets and images
└── package.json
```

---

## 🛠 Customization Guide

To make this portfolio your own, simply update the three JSON files in `src/data/`:

### 1. `src/data/site.json` (Site Configuration)
Controls the global layout, metadata, hero illustration, audio assets, and terminal animation.

```json
{
  "siteUrl": "https://your-portfolio.com",
  "nav": {
    "logo": "/logo.png"
  },
  "hero": {
    "avatar": "/developer-avatar.png",
    "avatarAlt": "Your Name - Coding illustration"
  },
  "audio": {
    "bgMusicSrc": "/sounds/ambient-piano.mp3",
    "bgMusicVolume": 0.18,
    "clickSoundSrc": "/sounds/click.mp3",
    "clickVolume": 0.3
  },
  "terminal": {
    "prompt": "you@portfolio",
    "quotes": [
      "Building digital products.",
      "Writing clean code.",
      "Designing robust systems."
    ]
  },
  "footer": {
    "tagline": "Building digital experiences."
  }
}
```

- **`siteUrl`**: Base URL for metadata and Open Graph links.
- **`nav.logo`**: Path to your logo in `/public` or an external URL.
- **`hero.avatar`**: Path to your avatar/illustration in `/public`.
- **`audio`**: Custom audio file paths and default volume levels for background ambient music and UI click sounds.
- **`terminal.prompt` & `quotes`**: Terminal username and rotating typewriter quotes.

---

### 2. `src/data/resume.json` (Resume & Portfolio Content)
Acts as your personal database for the portfolio and `/resume` page:

- **`personal`**: Name, email, phone, location, relocation preference, and bio summary.
- **`experience`**: Array of roles with title, company, duration, and bulleted highlights.
- **`education`**: Institution names, degrees, durations, and grades/scores.
- **`projects`**: Featured projects with GitHub links and highlight summaries.
- **`skills`**: Key-value object of technical skill categories (e.g. Languages, Frameworks, Databases, Tools, Concepts). **All categories added here are dynamically rendered into cards on the site.**

---

### 3. `src/data/socials.json` (Social Profile Hover Cards & Links)
Controls the social triggers and rich preview popovers in the hero and footer:

```json
{
  "github": {
    "platform": "GitHub",
    "name": "Your Name",
    "username": "YourHandle",
    "handle": "@YourHandle",
    "bio": "Your short GitHub bio.",
    "status": "Active builder",
    "url": "https://github.com/YourHandle",
    "featuredRepositoriesTitle": "Featured Projects",
    "badge": "Public",
    "featuredRepositories": [
      { "name": "project-one", "tech": "Spring Boot", "url": "https://github.com/..." },
      { "name": "project-two", "tech": "Flutter", "url": "https://github.com/..." }
    ],
    "ctaText": "View GitHub Profile"
  },
  "linkedin": {
    "platform": "LinkedIn",
    "name": "Your Name",
    "headline": "Software Engineer",
    "company": "Your Company",
    "role": "Software Engineer",
    "education": "Degree · Institution",
    "location": "City, Country",
    "skills": ["Flutter", "Node.js", "Spring Boot"],
    "url": "https://linkedin.com/in/yourprofile",
    "ctaText": "Connect on LinkedIn"
  },
  "email": {
    "platform": "Email",
    "name": "Your Name",
    "address": "your.email@example.com",
    "label": "Direct Contact",
    "statusBadge": "Available",
    "copyButtonText": "Copy",
    "copiedButtonText": "Copied!",
    "sendMailButtonText": "Send Mail"
  }
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## ☁️ Deployment

The easiest way to deploy this portfolio is with [Vercel](https://vercel.com/new):

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and deploy your portfolio with optimized edge caching.

---

## 🎨 Design Credit

The visual design, layout structure, and aesthetic of this portfolio is inspired by [**Kartik Malik's Portfolio-v2**](https://github.com/kartikmalik0/Portfolio-v2). Key design elements adapted include the monospace typography, decorative dotted borders, and the monochrome aesthetic. All component implementations, social hover card architectures, and data structures are uniquely built.
