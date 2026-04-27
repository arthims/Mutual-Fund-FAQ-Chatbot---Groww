# Groww — Portfolio Dashboard (Lovable Demo)

A mobile-first, Groww-inspired portfolio dashboard with an in-app **ChatBolt**
assistant that answers mutual-fund questions and cites only official sources
(SEBI, AMFI, CAMS, Income Tax India, Groww Help).

Built with React 18 + Vite 5 + TypeScript + Tailwind CSS + shadcn/ui +
framer-motion. No backend — all data is mocked in components.

---

## Features

- **Portfolio dashboard** — summary card with current value, invested, returns,
  XIRR, and a holdings list rendered with smooth scroll-reveal animations.
- **Top tabs** — `Dashboard`, `Orders`, `SIPs`, `Watchlist`. Tabs swap the main
  panel content; state is lifted in `src/pages/Index.tsx`.
- **Orders** — recent buy/sell orders with status pills.
- **Watchlist** — `ICICIBANK`, `NIVABUPA`, `AXISBANK`, `MAXHEALTH`, `MUTHOOTFIN`,
  `TRANSRAIL` with exchange, price, and change.
- **Bottom nav** — `Stocks`, `Mutual Funds`, `Loans`. Selecting **Loans**
  renders a "Coming soon" placeholder.
- **Profile menu** — tap the avatar (top-left) to open a dropdown with a
  **Log out** action (toast-based, demo only).
- **ChatBolt assistant** — floating bolt button anchored inside the app frame.
  Ask about:
  - Expense ratio (TER)
  - Exit load
  - Minimum SIP amount
  - ELSS lock-in
  - Riskometer
  - Benchmark (TRI / tiered)
  - Downloading CAS / Groww statements

  Every scripted answer ships with **one official source link**. A **Clear**
  button in the chat header resets the conversation.

---

## Tech stack

| Layer          | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | React 18 + Vite 5 + TypeScript 5                    |
| Styling        | Tailwind CSS v3 (HSL design tokens in `index.css`)  |
| Components     | shadcn/ui (Radix primitives)                        |
| Animation      | framer-motion                                       |
| Icons          | lucide-react                                        |
| Routing        | react-router-dom                                    |
| Data fetching  | @tanstack/react-query (scaffolded)                  |
| Testing        | vitest + @testing-library/react                     |

No server, no database, no auth backend — this is a UI prototype.

---

## Project structure

```
src/
├── components/
│   ├── groww/
│   │   ├── PortfolioHeader.tsx   # Profile menu, search, top tabs
│   │   ├── SummaryCard.tsx       # Current/Invested/Returns/XIRR
│   │   ├── HoldingsList.tsx      # Mutual fund holdings
│   │   ├── OrdersList.tsx        # Recent orders
│   │   ├── Watchlist.tsx         # Stocks watchlist
│   │   ├── BottomNav.tsx         # Stocks / Mutual Funds / Loans
│   │   ├── ComingSoon.tsx        # Placeholder for Loans
│   │   └── ChatBolt.tsx          # Floating chat assistant
│   └── ui/                       # shadcn/ui primitives
├── pages/
│   ├── Index.tsx                 # Main app shell (mobile frame)
│   └── NotFound.tsx
├── hooks/                        # use-toast, use-mobile
├── lib/utils.ts                  # cn() helper
├── index.css                     # Tailwind layers + HSL tokens
├── App.tsx                       # Router + providers
└── main.tsx                      # Entry point
```

### Design tokens

All colors are defined as HSL variables in `src/index.css` (`--gain`, `--loss`,
`--bolt`, `--hairline`, etc.) and mapped in `tailwind.config.ts`. Use semantic
classes (`bg-gain`, `text-loss`, `bg-bolt-soft`) — never hard-code colors in
components.

---

## Getting started

### Prerequisites

- **Node.js** 18+ (20+ recommended)
- **npm**, **pnpm**, or **bun**

### Install

```bash
npm install
# or
bun install
```

### Run the dev server

```bash
npm run dev
```

The app is served at `http://localhost:8080` (see `vite.config.ts`). Open it in
a desktop browser — the app is rendered inside a mobile-sized frame for the
best experience.

### Other scripts

| Command                | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Start Vite dev server with HMR                  |
| `npm run build`        | Production build → `dist/`                      |
| `npm run build:dev`    | Build in development mode (sourcemaps, no min)  |
| `npm run preview`      | Preview the production build locally            |
| `npm run lint`         | Run ESLint over the project                     |
| `npm run test`         | Run vitest once (CI mode)                       |
| `npm run test:watch`   | Run vitest in watch mode                        |

---

## How to use the app

1. **Profile menu** — tap the green avatar (top-left) → choose **Log out** to
   trigger a sign-out toast (demo only — no real auth).
2. **Top tabs** — switch between `Dashboard` / `Orders` / `SIPs` / `Watchlist`.
3. **Bottom nav** — `Stocks` and `Mutual Funds` show the dashboard;
   `Loans` shows a "Coming soon" placeholder.
4. **ChatBolt** — tap the blue bolt button (bottom-right of the app frame).
   - Tap any suggestion chip, or type a question.
   - Each AI reply includes a single **official source link**.
   - Tap **Clear** in the chat header to reset the conversation.

### Adding a new ChatBolt answer

Edit `src/components/groww/ChatBolt.tsx`:

```ts
const SCRIPTED: Record<string, { text: string; source: { label: string; url: string } }> = {
  "Your new question?": {
    text: "Concise answer here.",
    source: { label: "Source name", url: "https://official-source.example" },
  },
  // …
};

const SUGGESTIONS = [
  "Your new question?",
  // …
];
```

Use only **official public pages** as sources (regulators, AMCs, the platform's
own help center).

---

## Customizing

- **Colors / theme** — edit HSL variables in `src/index.css`, then reference
  them via Tailwind tokens (`tailwind.config.ts`).
- **Holdings / orders / watchlist data** — each list is currently mocked
  inline in its component. Replace the arrays with a real data source (e.g.
  `react-query` against your API) without changing the rendering layer.
- **Auth** — the **Log out** action is a toast stub. Wire it to your real auth
  provider in `PortfolioHeader.tsx`.

---

## Deployment

The project is a static Vite build — `npm run build` produces a `dist/` folder
you can deploy to any static host (Netlify, Vercel, Cloudflare Pages, GitHub
Pages, S3+CloudFront, etc.).

On Lovable, click **Publish** in the top-right of the editor.

---

## Disclaimer

This is a **UI demo**. Numbers, holdings, orders, and quotes are mocked.
ChatBolt answers are scripted and intended for educational reference only — not
investment advice. Always verify information against the linked official source.

---

## License

MIT — use freely for learning and prototyping.
