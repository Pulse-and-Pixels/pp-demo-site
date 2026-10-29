# Northstar — headless CMS demo

A demo website for **Northstar**, a fictional design and technology studio. It shows how to build a flexible, editor-friendly website with **Nuxt 4** and **Sanity**: every page is assembled from reusable sections, all content comes from the CMS, and editors can click any text on the live preview to edit it.

The demo has two independent projects:

| Project | Stack | Default URL |
| --- | --- | --- |
| [`pp-demo-site`](.) (this folder) | Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, `@nuxtjs/sanity`, Nuxt Image | http://localhost:3000 |
| [`pp-demo-studio`](../pp-demo-studio) | Sanity Studio v6, Presentation tool, Media plugin, TypeScript | http://localhost:3333 |

Both use Sanity project **`40bhay7m`**, dataset **`production`**, and API version **`2025-02-19`**.

```
                 published content (CDN, cached)          ┌──────────────────────┐
 Visitor ───▶ Nuxt SSR ─────────────────────────────────▶ │ apicdn.sanity.io     │
                 │                                        └──────────────────────┘
                 │ preview cookie only: drafts + token    ┌──────────────────────┐
 Editor in ───▶ Nuxt SSR / draft proxy ─────────────────▶ │ api.sanity.io        │
 Presentation      ▲    (token never leaves the server)   └──────────────────────┘
                   └── /preview/enable?secret=…  ◀── Sanity Studio (Presentation tool)
```

---

## Requirements

- Node.js **22.12 or newer**
- Yarn 4: run `corepack enable` once. The projects pin `yarn@4.17.0` via `packageManager`.
- A Sanity account with access to project `40bhay7m`. To seed content, log in with `npx sanity login` from the Studio folder.

## Quick start

```bash
# Terminal 1: Studio
cd pp-demo-studio
yarn install
cp .env.example .env          # defaults point at project 40bhay7m
yarn dev                      # http://localhost:3333

# Terminal 2: website
cd pp-demo-site
yarn install
cp .env.example .env          # add NUXT_SANITY_VISUAL_EDITING_TOKEN for preview
yarn dev                      # http://localhost:3000
```

The dataset has already been seeded. On a fresh dataset, run `yarn seed` in `pp-demo-studio` first (see [Seeding](#seeding-demo-content)).

## Environment variables

### `pp-demo-site/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `NUXT_PUBLIC_SANITY_PROJECT_ID` | no (default `40bhay7m`) | Sanity project ID |
| `NUXT_PUBLIC_SANITY_DATASET` | no (default `production`) | Dataset name |
| `NUXT_PUBLIC_SANITY_API_VERSION` | no (default `2025-02-19`) | Keep in sync with `pp-demo-studio/src/env.ts` |
| `NUXT_PUBLIC_SITE_URL` | in production | Public URL, used for canonical URLs, Open Graph, sitemap and robots.txt. Site settings → *Production URL* takes precedence. |
| `NUXT_SANITY_VISUAL_EDITING_TOKEN` | for preview | Sanity API token with the **Viewer** role. **Server-side only, never prefix it with `NUXT_PUBLIC_`.** Without it, the site builds as a public-only site with no preview routes or overlays. |
| `NUXT_SANITY_STUDIO_URL` | for preview | URL of the Studio that hosts the Presentation tool (default `http://localhost:3333`) |

> The visual editing token must be present at **build time** to enable the preview routes. Nuxt reads it into private server runtime config, so it is never sent to the browser. You can override it at runtime with the same variable.

### `pp-demo-studio/.env`

| Variable | Description |
| --- | --- |
| `SANITY_STUDIO_PROJECT_ID` | Sanity project ID (default `40bhay7m`) |
| `SANITY_STUDIO_DATASET` | Dataset (default `production`) |
| `SANITY_STUDIO_PREVIEW_URL` | Website URL loaded in the Presentation tool (default `http://localhost:3000`) |
| `SANITY_STUDIO_HOSTNAME` | Optional hostname for `yarn deploy` (`<hostname>.sanity.studio`) |

The seed script needs no token: it runs with your Sanity CLI login (`sanity exec --with-user-token`).

## Sanity project setup

The demo uses the existing project `40bhay7m`. There is no need to create a new project.

1. **Access**: you need at least the *Editor* role for the Studio, and *Administrator* to manage tokens and CORS.
2. **Viewer token for preview**: go to [sanity.io/manage](https://www.sanity.io/manage/project/40bhay7m/api) → **API** → **Tokens** → *Add API token*, choose the **Viewer** role, and paste it into `pp-demo-site/.env` as `NUXT_SANITY_VISUAL_EDITING_TOKEN`. A token named `pp-demo-site preview` was created for local development.

### Dataset setup

- The `production` dataset is **public**. Published documents can be read without a token, which lets the site use the API CDN with no credentials in the browser. Drafts and documents whose ID contains a `.` stay private.
- To use another dataset, create it with `npx sanity dataset create <name> --visibility public`, set both `.env` files to the new name, and run `yarn seed` in the Studio.
- If the dataset must be **private**, public pages need a server-side read token, which this demo doesn't configure.

### CORS configuration

Browsers can only query Sanity from allowed origins. These origins are configured for development:

| Origin | Credentials | Why |
| --- | --- | --- |
| `http://localhost:3333` | yes | Studio |
| `http://localhost:3000` | yes | Website (client-side navigation and live preview) |

Add your production origins in the same way:

```bash
cd pp-demo-studio
npx sanity cors add https://www.example.com --credentials
npx sanity cors list
```

## Seeding demo content

The seed script lives in the Studio project and is **idempotent**:

```bash
cd pp-demo-studio
yarn seed --dry-run   # show what would be created; writes nothing
yarn seed             # create missing demo documents and images
yarn seed:reset       # restore demo documents to their original content (asks you to type "reset")
```

- **What it creates:** site settings with navigation and footer, 4 pages (home, about, services, contact), 12 news articles, 4 news categories, 3 authors, 12 products, 4 product categories, 6 testimonials and 67 images.
- **Stable IDs:** every document has a stable ID with a `seed-` prefix (plus the `siteSettings` singleton). The script refuses to write anything else.
- **Never overwrites edits:** `yarn seed` uses `createIfNotExists`, so documents you have edited are left alone. Only `yarn seed:reset` replaces demo documents and discards their drafts.
- **Images:** generated locally from SVG with `sharp`. They are original abstract artwork, so there are no licensing concerns and no runtime dependency on third-party image hosts. Images are uploaded once: on rerun, existing assets are found by their SHA-1 hash. Each asset gets a title, alt text and a Media plugin tag (*Brand*, *Products*, *News*, *People*).

## Visual editing and draft preview

Visual editing uses the official integration built into `@nuxtjs/sanity` (`@sanity/core-loader`, `@sanity/visual-editing`, `@sanity/preview-url-secret`) together with the Studio's **Presentation tool**.

**How it works:**

1. The Presentation tool opens the site in an iframe through `/preview/enable?sanity-preview-secret=…`. The site validates the short-lived secret with the server-side Viewer token and sets an **httpOnly** `sanity-preview-id` cookie.
2. Only requests with a valid cookie get the `drafts` perspective, the authenticated **non-CDN** API, stega-encoded strings and `data-sanity` attributes. Draft queries from the browser go through `/_sanity/visual-editing/fetch`, a server proxy that adds the token and returns `403` without the cookie.
3. Inside Presentation, `useSanityQuery` subscribes to live updates, so edits appear instantly. Overlays let editors click any text to jump to its field. Content from referenced products, articles and testimonials opens *their* document.
4. Everyone else gets the `published` perspective from the API CDN, with no overlays and no stega. Pages are cacheable at the edge (`s-maxage=60, stale-while-revalidate=600`, `Vary: Cookie`). Preview responses are always `private, no-store`.

Images, sections, list items and other elements that stega cannot annotate get explicit `data-sanity` attributes from `createDataAttribute()`. These attributes also enable drag-and-drop reordering of page sections in the overlay.

### Verifying visual editing

The automated checks run against the dev server and use your Sanity CLI login:

```bash
yarn dev                    # terminal 1
yarn verify:preview         # draft isolation, cookies, proxy, stega, CDN
yarn verify:source-maps     # clicks on referenced content open the referenced document
```

`verify:preview` creates a temporary draft of the homepage and a preview secret, then deletes both.

Manual walkthrough (requires a Studio login):

1. Open http://localhost:3333 → **Visual editing** (Presentation tool). The site loads in the preview pane.
2. Hover the homepage hero heading and click it. The *Home* page opens with the hero's **Heading** field focused.
3. Type in the heading. The preview updates as you type.
4. In the document pane, drag *Page sections* into a new order, or drag sections directly in the preview. The layout updates immediately.
5. Navigate to **Products → Orbit Speaker** in the preview. The product document opens. Change the price or a specification and watch the page update.
6. Navigate to a news article and edit its title or body. The preview updates.
7. Open http://localhost:3000 in a private window. The public site still shows the **published** content and no overlays.
8. Publish the document. The public site picks up the change once the CDN refreshes (usually within seconds).

To leave preview mode in a normal browser tab, use the *Exit preview* button, or visit `/preview/disable`.

## Project structure

```
pp-demo-site/
├─ app/
│  ├─ assets/css/main.css      Tailwind 4 entry + Northstar design tokens (@theme)
│  ├─ components/
│  │  ├─ PageBuilder.vue       Maps Sanity _type → block component (code-split)
│  │  ├─ ContentPage.vue       Page fetched by slug and rendered by the page builder
│  │  ├─ blocks/               One component per page builder block
│  │  ├─ cards/                Product, news and testimonial cards
│  │  ├─ layout/               Header, footer, logo, preview bar
│  │  └─ ui/                   Buttons, links, images, rich text, sections, pagination…
│  ├─ composables/             useContent (CDN vs preview), usePageSeo, visual editing helpers
│  ├─ queries/                 GROQ query layer (fragments + one file per area)
│  ├─ types/sanity.ts          TypeScript interfaces for all query results
│  ├─ utils/                   Link resolution, formatting, image helpers
│  ├─ layouts/default.vue
│  ├─ pages/                   /, /[slug], /news, /news/[slug], /products, /products/[slug]
│  └─ error.vue
├─ server/
│  ├─ middleware/cache-headers.ts
│  └─ routes/                  sitemap.xml, robots.txt
├─ scripts/                    verify-preview.mjs, verify-source-maps.mjs
└─ nuxt.config.ts
```

### Adding a new page builder block

1. **Studio:** create `src/schemaTypes/blocks/myBlock.ts` with fields and a `preview`, then add it to `blocks` in `src/schemaTypes/blocks/index.ts`.
2. **Query:** if the block has images, links or references, add a `_type == "myBlock" => {…}` projection to `pageBuilderFields` in `app/queries/fragments.ts`.
3. **Types:** add an interface to `app/types/sanity.ts` and include it in the `PageBuilderBlock` union.
4. **Component:** create `app/components/blocks/MyBlock.vue` and register it in `PageBuilder.vue`. The `Record<BlockType, Component>` map makes TypeScript flag a missing registration.

Unknown block types are skipped for visitors and flagged with a notice in preview mode.

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Development server on port 3000 |
| `yarn build` | Production build (`.output/`) |
| `yarn preview` / `yarn start` | Run the production build |
| `yarn typecheck` | `nuxt typecheck` (vue-tsc) |
| `yarn verify:preview` | End-to-end draft preview check (dev server must be running) |
| `yarn verify:source-maps` | Check that visual editing resolves to the right documents |

## Deploying the website

The site is a server-rendered Nuxt app (Nitro `node-server` preset by default), so it runs on any Node host. On Vercel or Netlify it is auto-detected.

```bash
yarn build
node .output/server/index.mjs     # PORT=3000 by default
```

1. Set the environment variables above. In production, `NUXT_PUBLIC_SITE_URL` must be the public HTTPS URL.
2. For preview in production, set `NUXT_SANITY_VISUAL_EDITING_TOKEN` and `NUXT_SANITY_STUDIO_URL` (your deployed Studio URL) at **build time**. Preview needs **HTTPS**: the preview cookie is `SameSite=None; Secure` so it works inside the Studio iframe.
3. Add the site's origin to CORS (`npx sanity cors add https://… --credentials`).
4. In the Studio, set **Site settings → Default SEO → Production URL**.
5. Optionally put a CDN in front of the server. HTML responses already carry `s-maxage`/`stale-while-revalidate` and `Vary: Cookie`.

If you prefer a public-only build, leave out the token. The site then has no preview routes at all.

## Deploying the Studio

See [`pp-demo-studio/README.md`](../pp-demo-studio/README.md#deploying-the-studio). In short:

```bash
cd pp-demo-studio
SANITY_STUDIO_PREVIEW_URL=https://www.example.com SANITY_STUDIO_HOSTNAME=northstar-demo yarn deploy
```

Then set `NUXT_SANITY_STUDIO_URL=https://northstar-demo.sanity.studio` for the website and rebuild it.

## Limitations

- Products are for demonstration only: there is no cart, checkout or payment.
- The contact page shows contact details but has no form, because sending email would need a backend service.
- The automated preview checks reproduce the Presentation handshake. Click-to-edit overlays and live updates inside the Studio still need the manual walkthrough above, because they require an interactive Studio login.
- No linter is configured. Type safety is enforced with `yarn typecheck`.
