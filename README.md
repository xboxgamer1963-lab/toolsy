# Toolsy

Free online tools — calculators, converters, PDF, image and text utilities — built with Next.js and
monetized with Google AdSense. Every tool runs entirely in the browser: no backend, no uploads, near-zero
hosting cost.

## Tools (22)

| Category | Tools |
| --- | --- |
| Calculators | Percentage, Mortgage, Loan, Compound Interest, BMI, Age, Tip, Discount |
| Converters | Unit (length/weight/volume/area/speed/data), Temperature, Time Zone |
| PDF | Merge PDF, Split PDF, JPG to PDF |
| Image | Image Compressor, Image Resizer, Image Converter |
| Text & Dev | Word Counter, Case Converter, Password Generator, QR Code Generator, JSON Formatter |

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are statically generated)
npm run typecheck
```

## Project layout

```
lib/tools.ts            Tool registry: slug, SEO title/description, intro, how-to steps, FAQs
lib/site.ts             Site name + env-driven config (URL, AdSense IDs, contact email)
components/tools/*.tsx  The tool UIs (client components), code-split per page
app/[slug]/page.tsx     Tool page template: H1, tool, ads, how-to, FAQ, related tools, JSON-LD
app/category/[category] Category landing pages
app/sitemap.ts, robots.ts, ads.txt/route.ts
app/{about,contact,privacy,terms}   Pages AdSense reviewers expect
```

### Adding a tool

1. Add an entry to `tools` in `lib/tools.ts` (the content there becomes the page's SEO copy and FAQ schema).
2. Write the component in the matching `components/tools/<category>.tsx`.
3. Register it in `components/tools/index.tsx`.

The page, sitemap entry, category listing, footer link and structured data are generated automatically.

## Deploying

The easiest host is Vercel (free tier is plenty): import the repo, set the environment variables below,
and add your custom domain. Any Node host (`npm run build && npm start`) also works.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your domain, e.g. `https://www.toolsy.com` — used for canonical URLs and the sitemap |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Your publisher ID, e.g. `ca-pub-1234567890123456` |
| `NEXT_PUBLIC_ADSENSE_SLOT_TOP` / `_BOTTOM` | Optional manual ad unit IDs (otherwise use Auto ads) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the Contact and Privacy pages |

See `.env.example`.

## Launch checklist (Google + AdSense)

1. **Deploy on a custom domain** with `NEXT_PUBLIC_SITE_URL` set. AdSense doesn't approve `*.vercel.app` subdomains.
2. **Google Search Console**: verify the domain and submit `https://your-domain/sitemap.xml`.
3. **Apply to AdSense** once the site is indexed. Set `NEXT_PUBLIC_ADSENSE_CLIENT` and redeploy — this adds
   the AdSense script, the `google-adsense-account` verification meta tag, and serves `/ads.txt` automatically.
4. After approval, **turn on Auto ads** in the AdSense dashboard, or create display ad units and set the
   `SLOT_*` variables for the manual placements below the tool and after the FAQ.
5. **Privacy messaging**: in AdSense → Privacy & messaging, enable Google's consent message for EEA/UK
   visitors and the US state regulations message.
6. Replace the placeholder contact email and review `/privacy` and `/terms` for your situation.

Common reasons for AdSense rejection are "low value content" and missing policy pages — the per-tool
how-to and FAQ copy and the About/Privacy/Terms/Contact pages are there to address that. Adding a few
genuinely useful articles or guides (e.g. "How much house can I afford?") helps both approval and rankings.
