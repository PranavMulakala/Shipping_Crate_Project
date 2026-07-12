# BrokerDocs (mockup)

A front-end-only, clickable prototype of a freight-broker document tool (rate
confirmations + bills of lading) for customer-discovery demos. Not a product —
no backend, no database, no auth, no API calls. All data is hardcoded seed data
held in React state; refreshing the page resets to seed.

## Run

```bash
npm install
npm run dev
```

Then open the local URL Vite prints.

## Stack

Vite + React + TypeScript, Tailwind CSS, lucide-react, react-router-dom.

## Notes

- "Download PDF" uses the browser print dialog (`window.print()`) with print CSS
  so only the document prints.
- Rate confirmations enforce required terms (Detention, TONU, Double-Brokering):
  generating one with a required term missing raises a prominent warning first.
