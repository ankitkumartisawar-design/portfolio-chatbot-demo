# ReplyPilot — Chatbot + Lead Capture (Demo)

A working, responsive customer-support demo with **local FAQ responses**, chat history, guided enquiry form and lead CSV export. An **optional private Node backend** can connect a real AI API model; the static GitHub Pages version remains a rule-based FAQ chatbot.

## Functionality
- FAQ responses to free-text queries about digital services, pricing, timeline, SEO, e-commerce, maintenance and automation
- Suggested question chips and searchable conversation history by scrolling
- Optional real AI-backed responses via `server.mjs` (private server-side API key)
- Demo lead capture with name, email, service, project request
- Demo enquiries saved only to current browser `localStorage`; export CSV
- Responsive layout and clear AI/FAQ mode labels
- XSS-safe chat rendering (`textContent`) and basic server input limits

## Run without AI (free, no key)
Just open `index.html` in the browser. All FAQ, message history and lead-capture features work.

## Optional real AI mode (developer demo)

Requires Node.js 20+ and a valid OpenAI API key with billing/credits. From this folder:

**Windows PowerShell:**
```powershell
$env:OPENAI_API_KEY="YOUR_API_KEY"
node server.mjs
```

**macOS/Linux:**
```bash
OPENAI_API_KEY="YOUR_API_KEY" node server.mjs
```

Visit `http://localhost:3000`. The page detects `/api/status` and enables real AI replies. API calls go to the server, never directly from the frontend. Keep secrets **outside Git and the browser**; do not commit `.env` or keys.

You can optionally change models using environment variable `OPENAI_MODEL`. API call costs are billed by the provider; AI performance requires additional testing before production.

## GitHub Pages
Create public repository `portfolio-chatbot-demo`, upload `index.html`, `server.mjs`, `README.md`, and `.gitignore`, enable **Settings → Pages → Deploy from main / (root)**.

The deployed URL follows `https://YOUR_USERNAME.github.io/portfolio-chatbot-demo/`.

**GitHub Pages only runs the static FAQ demo.** It does not execute the Node server. For actual AI responses, deploy `server.mjs` separately on an appropriate Node-compatible host with configured secrets. Production applications need auth, rate limiting, abuse protection, privacy notices and secure lead storage.

## Honesty
This is a **fictional portfolio project**, not an actual customer-support deployment. It does not send messages to human agents or an external CRM.
