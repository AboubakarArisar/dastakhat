<div align="center">

# Dastakhat

**دستخط** — *the Urdu word for "signature."*

Create a contract, sign your part, share a link — and let the other person sign theirs.
A tiny, friendly e‑signature app built for freelancers and creators who send their own paperwork.

</div>

---

## What is this, really?

Most freelancers don't need DocuSign. They need to send an NDA or a freelance contract to one
client, get it signed, and move on. That's the whole job — and that's all Dastakhat does.

You pick a template (or write your own), fill in the blanks, sign your own block, and hit
**Send for signature**. The app hands you a private link. Your client opens it, reads the document,
draws their signature, and clicks **Agree & Sign**. The moment both signatures are in, Dastakhat
stitches them into a clean PDF and makes it available to both of you.

No accounts to chase. No per‑seat pricing. It's free.

> **The one idea that makes it work:** a signature belongs to *one specific person*. The owner only
> ever signs the owner's block; the client only ever signs the client's. Nobody fills in both. That's
> the difference between "signing" and one person drawing two squiggles.

---

## Features

- 📝 **Ready‑made templates** — NDA, freelance contract, and licensing agreement, worded for creators.
- 🧩 **Guided fields** — placeholders like `{{client_name}}` become labelled inputs with examples and
  hints (no more guessing what "governing law" means).
- ✍️ **Hand‑drawn signatures** — sign with a mouse, trackpad, or finger; the signature is embedded
  straight into the PDF.
- 🤝 **True two‑party signing** — you sign during creation, your counterparty signs from a private,
  token‑based link. No login required for them.
- 🔗 **Shareable link first** — works immediately with zero setup. Email delivery turns on
  automatically once you configure SMTP.
- 📄 **Polished PDFs** — server‑side generation produces paginated, print‑ready documents.
- 🗂️ **Document library** — every document is saved with its status (Awaiting signature → Completed),
  scoped to your browser so you don't see other people's docs.
- ✏️ **Custom documents** — write anything in Markdown and download it as a PDF.
- 💾 **Works without a database** — falls back to a local JSON store if MongoDB isn't reachable.

---

## How the signing flow works

```
  ┌──────────────┐        ┌─────────────────────┐        ┌──────────────────┐
  │   YOU (owner)│        │     Dastakhat       │        │  CLIENT (signer) │
  └──────┬───────┘        └──────────┬──────────┘        └────────┬─────────┘
         │  fill fields + sign own   │                            │
         │  block, add their email   │                            │
         │ ─────────────────────────▶│  save request,             │
         │                           │  generate secret token     │
         │ ◀─ shareable /sign/<token>│                            │
         │                           │                            │
         │  send the link  ─────────────────────────────────────▶ │  open link
         │                           │                            │  review document
         │                           │ ◀───── draw signature ──── │  Agree & Sign
         │                           │  both signed →             │
         │                           │  merge signatures into PDF │
         │ ◀── status: Completed ────│ ──── completed PDF ──────▶ │
```

Each party's signature is recorded with a timestamp, which is what makes "both agreed" meaningful.

---

## Tech stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 16 (App Router)                           |
| UI           | React 19, TypeScript, Tailwind CSS v4             |
| PDF          | [`pdf-lib`](https://pdf-lib.js.org/)              |
| Email        | [`nodemailer`](https://nodemailer.com/) (optional)|
| Storage      | MongoDB via Mongoose — with a local JSON fallback |
| Auth         | NextAuth (wired up, but **disabled on the frontend** for now) |

---

## Getting started

### 1. Install

```bash
npm install   # or: pnpm install
```

### 2. Configure (all optional)

Create a `.env.local` in the project root. **Every variable here is optional** — the app runs out of
the box without any of them (links instead of emails, local file store instead of MongoDB).

```bash
# Database — if omitted/unreachable, documents are saved to .data/documents.json
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dastakhat

# Email delivery — if omitted, you just copy the shareable link instead
SMTP_URL=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=no-reply@dastakhat.app

# Production URL — used for absolute Open Graph image links
NEXT_PUBLIC_SITE_URL=https://dastakhat.app

# Auth (currently disabled on the frontend; only needed if you re-enable sign-in)
# NEXTAUTH_SECRET=run: openssl rand -base64 32
# NEXTAUTH_URL=http://localhost:3000
# GITHUB_ID=...
# GITHUB_SECRET=...
```

> ⚠️ **Never commit real secrets.** `.env*` is gitignored — keep your live SMTP password and DB
> credentials there, not in the README or in source.

### 3. Run

```bash
npm run dev
```

Open **http://localhost:3000**.

---

## Project structure

```
app/
  page.tsx                  # landing page (hero, features, pricing, FAQ)
  create/                   # "Create a document" — templates + custom docs
  documents/                # your document library (per-browser scoped)
  sign/[token]/             # public signing page for the counterparty
  product/                  # product overview page
  components/               # Navbar, Hero, ProductMockup, SignaturePad, ...
  api/
    documents/route.ts      # GET list / GET pdf / DELETE
    documents/send/route.ts # create a signing request, return a link
    sign/[token]/route.ts   # GET review / POST signature / PUT download
    generate-pdf-from-text/ # custom Markdown → PDF
    templates/              # list + fetch templates
lib/
  signers.ts                # template → signer mapping, field hints (the core config)
  db.ts                     # storage layer (Mongo + file fallback)
  pdfGenerator.ts           # pdf-lib document/signature rendering
  mailer.ts                 # nodemailer helpers (no-op without SMTP)
  clientId.ts               # anonymous per-browser owner key
templates/
  nda.md  contract.md  license.md
```

---

## Working with templates

Templates are plain Markdown in `templates/*.md`. Anything wrapped in `{{double_braces}}` becomes a
form field automatically:

```md
This Agreement is made on {{date}} between {{your_name}} and {{client_name}}.
```

Two conventions:

- A placeholder whose name contains **`signature`** (e.g. `{{client_signature}}`) renders as a
  **drawing pad** instead of a text input, and gets embedded into the PDF as an image.
- A placeholder that looks like a **date** (e.g. `{{start_date}}`) renders a date picker.

### Mapping who signs what

For the two‑party flow to know which signature belongs to whom, each template is described in
[`lib/signers.ts`](lib/signers.ts):

```ts
nda: {
  name: "Non-Disclosure Agreement",
  signers: [
    { role: "owner",        label: "Disclosing Party", signatureField: "disclosing_party_signature" },
    { role: "counterparty", label: "Receiving Party",  signatureField: "receiving_party_signature"  },
  ],
}
```

The same file holds **field hints** (friendly labels, example text, and which fields are optional).
To add a new template: drop a `.md` file in `templates/`, then add its entry to `TEMPLATE_CONFIG`.

---

## Storage: MongoDB with a safety net

Dastakhat tries MongoDB first. If `MONGODB_URI` is missing or the cluster is unreachable, it falls
back to a local JSON file at **`.data/documents.json`** (gitignored) so the whole flow still works in
development. When Mongo becomes reachable again, it switches back automatically — no code changes.

---

## A note on privacy & auth (read this)

Sign‑in is intentionally **turned off on the frontend** right now (the NextAuth code is still in the
repo, just not wired into the pages). To stop people from seeing each other's documents in the
meantime, each browser gets an **anonymous owner key** stored in `localStorage`, and the Documents
page only shows documents created from that browser.

**This is a UX boundary, not real security.** It keeps things tidy, but it's not tamper‑proof —
clearing site data resets it, and document IDs aren't access‑controlled. Real protection arrives with
proper sign‑in: at that point the `owner_key` simply becomes the authenticated user's ID and the same
filtering becomes genuinely secure.

---

## API reference

| Method   | Endpoint                       | Purpose                                              |
| -------- | ------------------------------ | ---------------------------------------------------- |
| `GET`    | `/api/templates`               | List available templates                             |
| `GET`    | `/api/templates/[id]`          | Fetch one template's raw text                        |
| `POST`   | `/api/documents/send`          | Create a signing request; returns a shareable link   |
| `GET`    | `/api/documents?ownerKey=`     | List documents for a browser key                     |
| `GET`    | `/api/documents?id=&inline=1`  | Stream the PDF (inline preview or download)           |
| `DELETE` | `/api/documents?id=`           | Delete a document                                    |
| `GET`    | `/api/sign/[token]`            | Load a document for the counterparty to review       |
| `POST`   | `/api/sign/[token]`            | Submit the counterparty's signature; finalize if last |
| `PUT`    | `/api/sign/[token]`            | Download the completed PDF via the signing link      |
| `POST`   | `/api/generate-pdf-from-text`  | Custom Markdown → PDF                                 |

---

## Branding / assets

The logo lives at `public/lightlogo.png` and shows everywhere automatically. To set up the favicon,
icons, and social share image, drop these files in:

- `app/favicon.ico` — browser tab (replace the placeholder)
- `app/icon.png` — 512×512 general icon
- `app/apple-icon.png` — 180×180 iOS icon
- `public/og.png` — 1200×630 social share image (referenced in `app/layout.tsx`)

---

## Roadmap

- [ ] **Real sign‑in** (the NextAuth groundwork is already here)
- [ ] **Paid Pro plan** — multi‑party signing, audit certificates, team workspaces
- [ ] Signing the **custom documents** flow (currently single‑party only)
- [ ] Rendered (not raw‑text) document preview on the signing page
- [ ] Per‑document download/delete access control (lands with auth)

---

## Scripts

```bash
npm run dev     # start the dev server
npm run build   # production build
npm run start   # run the production server
npm run lint    # ESLint
```

---

<div align="center">
Built for freelancers &amp; creators. Free to use.
</div>
