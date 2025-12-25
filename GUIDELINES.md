# AI Resume Tailor - Technical Guidelines & Project Summary

This document outlines the architecture, features, and implementation details of the **AI Resume Tailor** (Resume Copilot) application.

## 🚀 Overview

AI Resume Tailor is a high-performance web application designed to help job seekers bypass Applicant Tracking Systems (ATS) and resonate with hiring managers. It leverages the **Google Gemini 3** API to transform a user's base professional profile into a highly targeted resume for specific job postings.

---

## 🎨 Deep Dive: Templating & Theming

The application uses a **Decoupled Design Architecture**. This means the data (what you did) is entirely separate from the presentation (how it looks).

### 1. The Theme Object Model
Instead of hardcoding styles into the JSX, `ResumePreview.tsx` uses a centralized `themes` configuration object. Each theme is a collection of Tailwind CSS class strings mapped to specific UI components:

```typescript
const themes = {
  modern: {
    container: 'font-sans',
    headerGradient: 'bg-gradient-to-r from-purple-100 to-indigo-200',
    sectionTitle: 'text-xl font-bold border-b-2 border-slate-200',
    skillTag: 'bg-purple-100 text-purple-800',
    // ...
  },
  quantum: {
    container: 'bg-gray-900 text-gray-200 font-mono',
    headerBg: 'bg-gray-800',
    sectionTitle: 'text-cyan-400 border-gray-700',
    skillTag: 'bg-gray-700 text-cyan-300',
    // ...
  }
}
```

### 2. Layout Specialization
While most themes share a common structure, some require unique DOM trees.
- **Dynamic CSS Themes**: Standard themes (Modern, Executive, etc.) inject classes into a shared JSX structure.
- **Structural Templates**: Specialized layouts like `StructuredTemplate.tsx` or `Chronicle` (with its timeline logic) use custom JSX to handle complex visual elements like vertical timelines or two-column grids.

---

## 💾 Deep Dive: Output & Export Pipeline

To ensure the best experience for both human recruiters and automated bots (ATS), the app provides three distinct output formats.

### 1. High-Fidelity PDF Export
Located in `ResultsStep.tsx`, the PDF export uses a combination of **html2canvas** and **jsPDF**:
- **Step A (Rasterization)**: `html2canvas` takes the `resume-preview` DOM node and renders it to a high-density (2x scale) Canvas element.
- **Step B (Encapsulation)**: `jsPDF` creates an A4 document and injects the canvas image as a PNG.
- **Why?**: This ensures that even the most complex CSS (gradients, custom fonts, absolute positioning) appears exactly the same on every machine.

### 2. ATS-Optimized Plain Text
For older legacy systems that cannot parse PDFs, the `resumeToText` utility strips all formatting and produces a clean, hierarchical plain-text version of the career history.
- **Structure**: Uses standard ASCII headers (e.g., `--- WORK EXPERIENCE ---`) to help standard parsers identify sections.

### 3. Clipboard Integration
The "Copy as Text" feature uses the `navigator.clipboard` API, allowing users to instantly paste their tailored content into LinkedIn or company-specific application portals.

---

## 🛠 Tech Stack Recap

- **Frontend**: React (ES6+), TypeScript
- **Styling**: Tailwind CSS (CDN)
- **Backend/Database**: Firebase (Auth, Firestore, Storage)
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash for analysis, 2.5 Pro for generation)
- **PDF Generation**: `jsPDF` & `html2canvas`

## 📁 Project Structure

- `App.tsx`: The main controller managing the 9-step wizard.
- `services/geminiService.ts`: Schema-driven AI interaction.
- `components/ResumePreview.tsx`: The primary theme router.
- `components/StructuredTemplate.tsx`: Standard "safe" layout for formal roles.

---

*This project is built for speed, aesthetics, and maximum career impact.*