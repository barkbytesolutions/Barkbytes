# BarkBytes chatbot

A small Cloudflare Worker that powers the "Ask BarkBytes" chat on the landing page. It keeps the Gemini API key off the public site, answers only from the site's own copy in `src/data/content.ts`, and limits each visitor to 10 messages a minute.

## One-time setup

1. **Get a Gemini API key** at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Free-tier keys cost nothing; see *Cost* below.
2. **Install and log in to Cloudflare** (a free account is enough):
   ```bash
   cd worker
   npm install
   npx wrangler login
   ```
3. **Store the key as a secret.** It's encrypted on Cloudflare and never appears in this repo:
   ```bash
   npx wrangler secret put GEMINI_API_KEY
   ```
4. **Allow the live site.** `ALLOWED_ORIGINS` in `wrangler.toml` lists the sites that may call the chatbot. It only allows `http://localhost:5173` (Vite's dev server) for now, so append the live address, e.g. `"https://your-domain.ph,http://localhost:5173"`.
5. **Deploy:**
   ```bash
   npm run deploy
   ```
   Wrangler prints the Worker's address, something like `https://barkbytes-chat.<your-subdomain>.workers.dev`.
6. **Turn the chat on.** Set `VITE_CHAT_ENDPOINT` to that address plus `/chat` wherever the site is built: in your host's environment variables (Vercel, Netlify, …) for production, or in a git-ignored `.env.local` locally (copy `.env.example`):
   ```
   VITE_CHAT_ENDPOINT=https://barkbytes-chat.<your-subdomain>.workers.dev/chat
   ```
   Rebuild the site. The chat button stays hidden while this is empty.

## Updating what the bot knows

The Worker imports `src/data/content.ts` directly (see `src/knowledge.js`), so it knows whatever the page says. After editing the site's copy, run `npm run deploy` here again so the bot picks it up.

Bracketed placeholders like `[YOUR PRICE]` are never repeated to visitors; the bot says the team will confirm and points to the Contact form. Fill them in before launch and the bot will start quoting them.

## Trying it locally

Create `worker/.dev.vars` (git-ignored) containing `GEMINI_API_KEY=your-key`, then:

```bash
npm run dev                                                   # in worker/: Worker on http://127.0.0.1:8787
VITE_CHAT_ENDPOINT=http://127.0.0.1:8787/chat npm run dev     # in the repo root: site on http://localhost:5173
```

## Cost

It uses `gemini-flash-latest`, which always points to Google's newest Flash model; change `MODEL` in `wrangler.toml` to pin one. If that model is busy or fails before answering, the Worker retries once with `FALLBACK_MODEL` (`gemini-3.5-flash-lite`). On the free tier the chatbot costs nothing, but Google caps requests per minute and per day; when a busy day hits the cap, visitors see a polite "unavailable" message pointing to the Contact form. Google may use free-tier prompts to improve its products. With billing enabled, each question costs a fraction of a US cent.
