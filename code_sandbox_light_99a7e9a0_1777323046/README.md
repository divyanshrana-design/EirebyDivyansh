# PM Éire — Project Management Guide for Irish SMEs & Charities

> Practical, accessible, AI-first project management guidance built specifically
> for small businesses and charities working in Ireland.

## ✨ Latest Updates (April 2026)

- **Fundamentals page rebuilt** — heavy text replaced with 5 animated Chart.js
  visualisations (project vs ops, time per phase, hybrid growth, time lost,
  skills radar), an embedded 12-minute YouTube walkthrough, and a brand-new
  4-step **decision game** ("Save Maeve's brunch project") that simulates
  trade-offs between time / budget / morale.
- **Methodologies page** — added an **interactive comparison hub**: click
  methodology pills to overlay them on a radar chart, switch to "Single deep
  dive" for bar comparisons, click any line/legend to focus its pros and cons.
  The 4-question picker is preserved unchanged.
- **References page (`references.html`)** — new appendix linking every cited
  source: research reports, methodology guides, AI/data-protection docs, PM
  tools, videos, Irish SME resources and recommended books. Linked from every
  page footer (not in the main navigation, as requested).
- **Home page kanban game** moved between "The 5 Phases" and "The Main Event"
  AI teaser sections.
- **Pink button hover bug fixed** — `.btn-primary` (e.g. "Start with AI for
  Business") now stays white on hover; only inline `<a>` text turns pink.

## 🎯 Project Goals

Most project management content online is written for Fortune 500s. **PM Éire** is
written for the realities of Irish small business: 4-person cafés in Galway,
charities in Limerick, 2-cofounder software shops in Dublin. It's:

- **Practical** — copy-paste prompts, templates, and workflows, not theory
- **AI-first** — the main focus is how small teams integrate AI into daily work
- **Budget-aware** — free and low-cost options flagged first
- **Irish-contextual** — GDPR, charity regulator, LEO references, Irish tone
- **Accessible** — semantic HTML, keyboard navigation, captions, transcripts
- **Multi-media** — written guides, video, audio, and downloadable templates

## 🎨 Design

- **Primary palette:** Pink + White (warm, approachable, not corporate)
- **Typography:** Fraunces (headings) + Inter (body) + JetBrains Mono (code)
- **Advanced scroll-driven animations** (using the 2026-standard
  `animation-timeline: scroll()` and `view()` APIs with JS fallback):
  - Multi-layer parallax background (grid, 4 blobs, sparkles — all moving at
    different speeds on scroll)
  - Scroll-timeline-driven reveals with blur-in and scale
  - Section heads that rise and defocus as they enter view
  - Phase timeline that "fills in" as you scroll past it
  - Kanban preview that drifts upward on scroll
  - Sparkles that twinkle and drift independently
- **Micro-interactions:**
  - Button ripple effect on click (Material-style)
  - Magnetic pull on primary CTAs (buttons bend toward the cursor)
  - 3D tilt on all cards (perspective rotates on mouse position)
  - Shimmer sweep across cards on hover
  - Cursor-following glow (eased follow, grows on hoverable elements)
  - Logo wobble-and-spin on hover
  - Nav link underline grow
  - Icon slides/rotations on button hover
  - Form focus-within ring glow
  - Link underline sweep on hover
  - Stat hover lift
  - Hero stats subtle shimmer sweep
- All animations respect `prefers-reduced-motion: reduce`

## ✅ Completed Features

### Home (`index.html`)
- Animated hero with counting stats and floating kanban preview
- "Why this guide" — 6 differentiation cards
- 4 learning paths (Fundamentals, Methodologies, AI Playbook, Tools)
- 5 phases animated timeline
- AI teaser with live chat typing demo
- Multi-media preview (read / watch / listen)
- Newsletter subscribe form with validation

### Fundamentals (`fundamentals.html`)
- Plain-English definition of project management
- PM vs. general management comparison table
- Why it matters in 2026 (with Irish context)
- Detailed walkthrough of all 5 phases with examples
- Project manager responsibilities and skills
- Common beginner mistakes

### Methodologies (`methodologies.html`)
- At-a-glance comparison table (Agile / Waterfall / Scrum / Kanban / Hybrid)
- Detailed breakdown of each methodology with "great for" and "watch out"
- **Interactive 4-question methodology picker** with rule-based recommendation

### AI for Your Business (`ai-for-business.html`) — **main event**
- Animated AI orb hero
- "Why now" stats (5–10h/week saved, €0 to start, etc.)
- **7 detailed "plays"** — real jobs Irish SMEs do, with copy-paste prompts
  - Planning / Communication / Meetings / Funding / Marketing / Ops / Strategy
- 6 AI-enabled PM tools comparison (ClickUp Brain, Notion AI, Zoho Zia, monday,
  Microsoft Copilot, Google Gemini)
- **Interactive 3-step AI tool finder** with personalised recommendations
- **Prompt library** — 30 filterable prompts across 6 categories with copy buttons
- GDPR / safety section with EU AI Act note
- 30-day AI rollout plan (week-by-week)

### Connect (`connect.html`)
- Sticky profile card with rotating text ring around the avatar, live "available" status dot with pulse
- Live local time in Dublin (updates every 30s)
- Social buttons with tooltips (Portfolio, LinkedIn, Email, GitHub, X)
- "What I can help with" service cards: Project rescue, AI rollout (featured), Fractional PM, Workshops
- Full contact form (**live email delivery via FormSubmit.co** → `ranadivyansh33@gmail.com`) with:
  - Topic choice chips (Project rescue / AI rollout / Fractional PM / Workshop / Other)
  - Character count on message field
  - Custom-styled GDPR consent checkbox
  - Loading / success button states
  - Validation with friendly error messages
  - Hidden honeypot field to block bots
  - **First-use activation:** on the very first form submission after deploy,
    FormSubmit sends a one-time confirmation email to `ranadivyansh33@gmail.com`.
    Click the "Confirm email" link in that message and every submission after that
    arrives straight in the inbox. No account, no API key, no backend needed.
- Contact sidebar with Email / LinkedIn / Book-a-call links and a quote card
- FAQ with 5 common pre-sales questions (animated open/close)
- Large pink CTA band at the bottom
- **Portfolio link:** https://divyanshranaa.my.canva.site/project-manager

### Tools & Resources (`tools.html`)
- 6 PM software cards with pricing and "best for" guidance
- Video placeholder with chapter list and captions notice
- **Audio player** with simulated playback, progress bar, click-to-seek,
  and expandable full transcript
- 8 downloadable template cards (charter, WBS, risk register, etc.)

## 🌐 Site Map / URIs

| Path | Description |
|------|-------------|
| `/index.html` | Landing page |
| `/fundamentals.html` | Chapter 1 — the basics |
| `/methodologies.html` | Chapter 2 — pick an approach |
| `/ai-for-business.html` | Chapter 3 — the main AI playbook |
| `/ai-for-business.html#playbook` | The 7 plays directly |
| `/ai-for-business.html#prompt-library` | 30-prompt filterable library |
| `/ai-for-business.html#finder` | Interactive AI tool finder |
| `/methodologies.html` (scroll) | Interactive methodology picker |
| `/tools.html` | Chapter 4 — tools, templates, video, audio |
| `/tools.html#video` | Video section |
| `/tools.html#audio` | Audio primer with transcript |
| `/connect.html` | Connect with Divyansh — profile, services, contact form, FAQ |
| `/connect.html#contact-form` | Jump directly to the contact form |
| `/references.html` | Sources & references — every cited stat, study, tool and book |
| `/fundamentals.html#phases` | The 5 phases interactive accordion |
| `/fundamentals.html#video` | Embedded YouTube fundamentals walkthrough |
| `/fundamentals.html#game` | Decision game: save Maeve's brunch project |

## 📂 File Structure

```
index.html                 Landing page
fundamentals.html          Chapter 1
methodologies.html         Chapter 2 (+ inline picker logic)
ai-for-business.html       Chapter 3 — AI playbook (main event)
tools.html                 Chapter 4 — tools/templates/video/audio
connect.html               Connect with Divyansh
references.html              Appendix — sources & references
css/
  ├── style.css              Global styles (pink+white, animations, micro-interactions)
  ├── ai.css                 AI page specific (orb, plays, finder)
  ├── connect.css            Connect page (profile card, form, services, FAQ)
  ├── game.css               Home page Kanban drag-drop game
  ├── fundamentals.css       Fundamentals page (charts, decision game, phase pills)
  └── methodologies.css      Methodologies page comparison hub
js/
  ├── main.js                Nav, scroll progress, reveals, stat counter, chat
  │                          typing demo, subscribe form, ripples, magnetic
  │                          buttons, 3D tilt, cursor glow
  ├── ai.js                  Copy buttons, tool finder, prompt library
  ├── connect.js             Local time, choice chips, contact form, validation
  ├── game.js                Home page drag-drop Kanban game logic
  ├── fundamentals.js        Chart.js charts + decision game state machine
  └── methodologies.js       Interactive methodology comparison (radar/bars)
images/
  ├── pm-handbook.jpg        Custom cover for the written guide card
  └── podcast-cover.jpg      Custom audio podcast cover
templates/                   Google-Docs / Google-Sheets style template pages
README.md                    This file
```

## 🛠 Technologies

- Pure HTML5, CSS3, vanilla JavaScript (no framework)
- Font Awesome 6 (via jsDelivr CDN) for icons
- Google Fonts: Fraunces, Inter, JetBrains Mono
- Intersection Observer API for scroll animations
- Clipboard API for copy-prompt functionality
- `prefers-reduced-motion` respected throughout

## 🚫 Features Not Yet Implemented

- Real video file for the 8-minute primer (currently a styled placeholder)
- Real MP3 audio file (player simulates playback — transcript is real)
- Live Google Docs/Sheets/Notion template links (currently placeholder links)
- Working newsletter backend (form validates and shows a thank-you message only)
- Blog / case studies section with real Irish SME stories
- Dark mode toggle
- Multi-language support (English / Gaeilge)

## 🗺 Recommended Next Steps

1. **Produce the 8-minute video** — script in place via the chapter list
2. **Record the 12-minute audio primer** — script is literally the transcript on `tools.html`
3. **Build out the template files** and host on Google Drive / Notion with public-copy links
4. **Add a "Case studies" section** — 3–5 short stories from real Irish SMEs
5. **Wire up the newsletter** — currently demo only; integrate with Mailchimp, Buttondown, etc.
6. **Add structured data (JSON-LD)** for SEO — especially Article and FAQPage schemas
7. **Consider a simple CMS** for blog posts (e.g. via the RESTful Table API)
8. **Accessibility audit** — run axe-core, test with screen readers
9. **Expand prompt library** — community submissions with voting
10. **Add Gaeilge version** of key pages

## 🚀 Deployment

To make this site live, go to the **Publish tab** for one-click deployment.

---

© 2026 PM Éire · Made with 💗 in Ireland
