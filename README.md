# Developer Portfolio Template

A highly customizable, data-driven personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion. 

This template is built with a **"JSON-as-CMS"** architecture. This means you do not need to touch a single line of React code to personalize the website. All content, configuration, and data are pulled dynamically from JSON files.

## 🌟 Features

- **Zero-Code Content Management**: Entirely driven by `resume.json` and `site.json`.
- **Dynamic Light / Dark Theme**: Automatically detects OS preference with manual toggle support.
- **Typewriter Terminal**: Animated hero terminal with a classic Linux bash prompt.
- **Custom SVG Textures**: Procedurally generated, theme-adaptive fabric grid backgrounds.
- **Smooth Scrolling**: Physics-based smooth scroll powered by Lenis.
- **Framer Motion Animations**: Staggered content reveals and scroll-triggered transitions.
- **Auto-Generated Resume**: The `/resume` page automatically structures your JSON data into a clean, print-ready document and dynamically generates a PDF download button based on your name.

## 🛠 Customization Guide

To make this portfolio your own, you only need to edit two files in the `src/data/` directory.

### 1. `src/data/site.json` (Site Configuration)
This file controls the global layout and configuration of the site.

```json
{
  "nav": {
    "logo": "https://avatars.githubusercontent.com/u/your-github-id"
  },
  "terminal": {
    "prompt": "you@portfolio",
    "quotes": [
      "Building digital products.",
      "Writing clean code."
    ]
  },
  "footer": {
    "tagline": "Building digital experiences."
  }
}
```
- **`logo`**: You can use a URL (like your GitHub Avatar) or drop an image into the `/public` folder and use `"/your-logo.png"`.
- **`prompt`**: Customize the Linux bash prompt that appears in the Hero section.
- **`quotes`**: A list of strings that will rotate through the typewriter animation.

### 2. `src/data/resume.json` (Personal Content)
This file acts as the database for your portfolio. Edit this file to add your:
- Personal details (Name, Location, Summary, Links)
- Work Experience
- Education
- Featured Projects
- Skills

*Note: The Resume page (`/resume`) will automatically use the name provided in this file to format the PDF download file (e.g., `First_Last_Resume.pdf`).*

## 🚀 Getting Started

First, install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

```bash
npm run build
```
Deploy the output to Vercel, Netlify, or any Node.js hosting platform.

## 🎨 Design Credit

The visual design, layout structure, and styling of this portfolio is heavily inspired by [**Kartik Malik's Portfolio-v2**](https://github.com/kartikmalik0/Portfolio-v2). Key design elements adapted include the monospace typography, decorative dotted borders, and the overall monochrome hacker aesthetic. All implementation code, data architecture, and assets in this repository are uniquely built.
