# SignEasy

SignEasy is a Next.js app for creating legal/business documents from templates, filling placeholders, drawing signatures, and generating downloadable PDFs.

## Features

- Create documents from markdown templates in `templates/`
- Fill template placeholders like `{{client_name}}`, `{{date}}`, etc.
- Draw signatures directly in the browser using a canvas input
- Render signatures into the generated PDF
- Preview merged markdown before PDF export
- Save generated documents in MongoDB (when configured)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- `pdf-lib` for PDF generation
- NextAuth + MongoDB adapter

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with the variables you need:

```bash
# Auth
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# GitHub auth (optional)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Email auth (optional)
SMTP_URL=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=no-reply@example.com

# Database (optional but recommended)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/signeasy
```

3. Run locally:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## How To Add Template Fields

Template files live in `templates/*.md` and use placeholder syntax:

```md
This Agreement is between {{your_name}} and {{client_name}} on {{date}}.
```

Any placeholder in `{{placeholder_name}}` automatically appears as an input field in the Create form.

## Signature Canvas Usage

To make a signature field appear as a drawing canvas, include `signature` in the placeholder name.

Examples:

- `{{client_signature}}`
- `{{freelancer_signature}}`
- `{{approver_signature}}`

When users open the template form:

- normal placeholders render as text inputs
- signature placeholders render as canvas pads
- users can draw with mouse, touch, or trackpad
- clicking `Clear` resets the signature

On PDF generation:

- signature images are embedded directly into the PDF
- signature placeholders are not printed as base64 text

## Where To Add/Modify Templates

- `templates/contract.md`
- `templates/nda.md`
- `templates/license.md`

Add new `.md` files in the same folder to create additional templates.

## Useful API Endpoints

- `POST /api/generate-pdf` - generate PDF from template + field values
- `POST /api/generate-pdf-from-text` - generate PDF from custom markdown text
- `GET /api/templates` - list templates
- `GET /api/templates/[id]` - fetch template text
- `GET /api/debug/env` - debug env variable setup in development

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
