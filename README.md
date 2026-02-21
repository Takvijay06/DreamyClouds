# DreamyClouds

Frontend-only responsive web app for custom UV TF printed:
- Tumblers
- Mugs
- Bookmarks

## Tech Stack
- React + TypeScript
- Redux Toolkit
- Tailwind CSS
- React Router
- LocalStorage for temporary session persistence

## Features
- Mobile-first 4-step flow:
  1. Product selection
  2. Design selection
  3. Product preview (design overlay)
  4. Order summary + pricing + customer details
- WhatsApp redirection with encoded order details
- Manual UPI payment instructions
- No backend, no database, static-host friendly

## Run Locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Configure Business Details
Update these values in `src/pages/SummaryPage.tsx`:
- `BUSINESS_WHATSAPP_NUMBER`
- `BUSINESS_UPI_ID`

## Deploy
Deploy `dist/` on:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting provider
