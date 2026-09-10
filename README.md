# Developer Portfolio

A personal portfolio and resume website built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**.

All website content (projects, work experience, skills, and social links) is stored in simple JSON files, and the downloadable resume PDF is compiled directly from a plain-text YAML file. You can keep your portfolio updated and export clean resume PDFs without digging through React components or writing LaTeX code.

---

## ⚡ Features

### 1. Data-Driven Content
* **Update without touching code:** All portfolio information lives in `src/data/` (`resume.json`, `site.json`, `socials.json`).
* **Instant updates:** Adding a project, updating job experience, or adding new skills in your JSON file automatically updates the website layout.
* **Central config:** Nav links, contact details, site metadata, and terminal quotes are managed from one place.

### 2. Plain-Text Resume Engine (YAML $\to$ PDF)
* **No LaTeX syntax:** Write your resume in plain English inside [`resume/resume.yaml`](resume/resume.yaml). No backslashes, braces, or formatting commands to worry about.
* **Clean PDF output:** A small build script (`scripts/build-resume.mjs`) feeds your YAML into a LaTeX template and compiles it using [Tectonic](https://tectonic-typesetting.github.io/) into a clean, ATS-friendly PDF.
* **Easy section reordering:** Move sections up or down by rearranging the `section_order` list in `resume.yaml`:
  ```yaml
  section_order:
    - experience
    - projects
    - education
    - skills
  ```
* **Auto-sync with site:** Compiling outputs directly to [`public/resume.pdf`](public/resume.pdf), so the "Download Resume" button on your portfolio always serves your latest version.
* **Auto-compile on save:** Run `npm run watch:resume` to recompile the PDF automatically whenever you save `resume.yaml`.

### 3. Dedicated Web Resume Page (`/resume`)
* **Browser-friendly:** A clean `/resume` page showing your full background in an easy-to-read layout.
* **Print ready:** Includes a print stylesheet (`@media print`) so recruiters can print or save directly from their browser.
* **Direct download:** Quick button linked straight to your compiled PDF.

### 4. Social Preview Cards
* **Quick info on hover:** Hovering over social icons displays useful details:
  * **GitHub:** Shows your status, username, and top pinned projects.
  * **LinkedIn:** Shows your current headline, company, and direct connect link.
  * **Email:** Has a one-click button to copy your email address to the clipboard.

---

## 🛠 Tech Stack

| Layer | Tools |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend** | [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |
| **Scrolling** | [Lenis](https://lenis.darkroom.engineering/) |
| **Resume Compiler** | [Tectonic](https://tectonic-typesetting.github.io/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Directory Structure

```text
portfolio/
├── public/                      # Static files & compiled PDF
│   ├── resume.pdf               # Downloadable resume (auto-generated)
│   └── sounds/                  # Audio files
├── resume/                      # Plain-text resume source
│   └── resume.yaml              # Editable resume content & section order
├── scripts/                     # Utility scripts
│   └── build-resume.mjs         # YAML -> LaTeX PDF compiler
├── src/
│   ├── app/                     # Next.js pages & layout
│   │   ├── globals.css          # Global styles & theme colors
│   │   ├── layout.tsx           # Root layout & providers
│   │   ├── page.tsx             # Main portfolio homepage
│   │   └── resume/page.tsx      # Web resume page
│   ├── components/              # Page sections & UI widgets
│   │   ├── hero.tsx             # Intro section & social buttons
│   │   ├── experience.tsx       # Work history timeline
│   │   ├── projects.tsx         # Project cards & GitHub links
│   │   ├── skills.tsx           # Categorized skills
│   │   ├── education.tsx        # Education details
│   │   ├── nav.tsx              # Top navigation & theme toggle
│   │   ├── footer.tsx           # Footer & contact
│   │   └── providers/           # App providers (Theme, Scroll, Sound)
│   └── data/                    # Content JSON files
│       ├── site.json            # Nav items, terminal text, site links
│       ├── resume.json          # Bio, work history, skills, projects
│       └── socials.json         # GitHub, LinkedIn, and Email card info
└── temp/                        # Ignored folder
    └── resume.tex               # Standalone LaTeX template
```

---

## ⚙️ Commands

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Starts the local dev server on `http://localhost:3000` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run build:resume` | Compiles `resume/resume.yaml` into `public/resume.pdf` |
| `npm run watch:resume` | Watches `resume/resume.yaml` and recompiles on every save |

---

## 📝 How to Update Your Content

### Changing Website Information
* **Bio, Work Experience, Education, Skills:** Edit [`src/data/resume.json`](src/data/resume.json).
* **Social Links & Cards:** Edit [`src/data/socials.json`](src/data/socials.json).
* **Navbar, Title, Quotes:** Edit [`src/data/site.json`](src/data/site.json).

### Updating Your PDF Resume
1. Open [`resume/resume.yaml`](resume/resume.yaml).
2. Edit your text, job descriptions, dates, or skills.
3. (Optional) Reorder sections by moving items inside `section_order`.
4. Run:
   ```bash
   npm run build:resume
   ```
5. Your updated PDF is saved to [`public/resume.pdf`](public/resume.pdf) and ready for download on the site.

---

## 🚀 Deployment

The easiest way to host this is on [Vercel](https://vercel.com/new):
1. Push your repo to GitHub.
2. Import the repo in Vercel.
3. It detects Next.js automatically and deploys in seconds.
