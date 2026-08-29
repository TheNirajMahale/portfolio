# Niraj Mahale — Portfolio

Personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## Design Credit

The visual design and styling of this portfolio is inspired by [**Kartik Malik's Portfolio-v2**](https://github.com/kartikmalik0/Portfolio-v2). Key design elements adapted include the monospace typography, decorative border lines with plus (+) markers, animated grid decoration, and the overall monochrome aesthetic. All content and data are my own.

## Features

- **Dark / Light theme** toggle with localStorage persistence
- **Monospace typography** (Roboto Mono) for headings and UI elements
- **Animated grid** decoration between hero and content sections
- **Framer Motion** stagger animations and scroll-triggered reveals
- **Responsive** mobile-first layout with hamburger menu
- **Print-ready** resume page at `/resume`
- Data-driven — all content sourced from `resume.json`

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev)
- [Lucide Icons](https://lucide.dev)
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deploy

```bash
npm run build
```

Deploy the output to [Vercel](https://vercel.com), Netlify, or any Node.js hosting platform.
