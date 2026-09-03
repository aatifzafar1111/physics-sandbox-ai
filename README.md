# Physics Sandbox AI

🧠 ROLE

You are a senior front-end engineer and UI/UX designer specializing in AI web apps and interactive tools. Build a single-page web application interface for an AI-powered Physics Simulation platform. The result must feel like a premium, modern SaaS tool or digital laboratory — clean, highly functional, and slick.

📥 INPUTS 

APP NAME:        PhysicsAI (or choose a cool placeholder)

CORE FUNCTION:   A text-to-3D physics simulation educational tool.

STYLE:           [leave blank → AI picks | or pick one below]

COLOR MODE:      [auto | manual: primary=#hex, bg=#hex, accent=#hex]

MUST INCLUDE:    A large 3D canvas area, a prompt input bar, and a collapsible sidebar for AI explanations.

🎨 STYLE LIBRARY (AI picks if blank)

Match the style to a modern AI web tool. Examples:

Dark Lab (Recommended): Deep charcoal/black backgrounds, subtle glowing accents (blue/purple), highly technical mono fonts, glassmorphism panels. Best for a complex, pro-level feel.

Light Academic: Clean off-white background, crisp sans-serif fonts, high-contrast borders, blue accents. Best for an accessible, classroom-friendly vibe.

Neo-Brutalist Tech: Stark white/black, thick borders, bright neon accents (yellow/green), visible grid lines. Best for a raw, experimental developer feel.

If STYLE is blank → default to "Dark Lab". Tell the user which you chose and why.

🌈 COLOR HANDLING

If COLOR MODE = auto: derive a 4-token palette from the chosen style. Use oklch() only.

--background, --foreground, --panel-bg, --accent

Ensure WCAG AA minimum contrast. 

Always define tokens in src/styles.css. Never hardcode colors in components.

🏗️ APP STRUCTURE & LAYOUT (Crucial for Functionality)

1. App Shell: Full viewport height (100vh), no vertical scrolling for the whole page (hidden overflow).

2. Top Navbar: Minimal. App logo on the left, a "New Simulation" button on the right.

3. Main Viewport (The Canvas): Takes up the majority of the screen. Include a placeholder `<div>` or `<canvas>` styled to look like an active 3D rendering zone (maybe a subtle grid background or crosshairs to imply 3D space). 

4. The Prompt Bar: A floating, prominent input bar at the bottom center of the viewport (similar to ChatGPT or Midjourney interfaces). It needs a text input field, a "Generate" button (with an icon), and a subtle loading state.

5. Explanation Sidebar: A right-side panel (occupying ~25-30% of the screen width) that holds the AI's step-by-step explanation. Include placeholder text for a physics concept, styled nicely with headers, bullet points, and timestamp tags.

⚙️ TECH & INTERACTIVITY

React + TypeScript + Tailwind v4 (semantic tokens in src/styles.css).

Use Lucide React for crisp, modern icons.

Build the 3D Canvas area as an isolated component so a developer can easily inject Three.js or Cannon.js code into it later.

Include a simple toggle state to show/hide the Explanation Sidebar.

Mobile: Stack the layout. Canvas on top, Prompt Bar fixed to the bottom, Sidebar hidden behind a toggle button.

✅ QUALITY BAR

The layout must feel like a software application, not a scrolling website.

Panels and sidebars should have subtle drop shadows or borders to distinguish them from the background.

Inputs and buttons must have clear hover and focus/active states.

Do not use generic "Lorem Ipsum" — write real, physics-related placeholder copy (e.g., "Prompt: Simulate a pendulum with a mass of 5kg and no air resistance...").

🚫 NEVER

Build a scrolling marketing page. This is a 100vh locked web app.

Skip the style/color decision — always state what you chose.

Hardcode colors outside src/styles.css.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/25a2835e-cd38-46c3-ab4f-821967d14dcb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
