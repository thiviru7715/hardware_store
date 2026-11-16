# Thilaka Hardware – project rules for AI agents (Antigravity, etc.)

## Stack
- `frontend/` – React 18 (Create React App) + Ant Design 5, HashRouter, deployed as a static site.
  - API client: `frontend/src/api.js` (base URL = Fly.io backend). Endpoint wrappers: `frontend/src/localStorageApi.js`.
  - Pages: `src/pages/*`, layout + menu: `src/components/MainLayout.js`, routes: `src/App.js`.
  - Theme: red gradient `#ef4444 → #f87171` (Inter font, see src/index.css), rounded cards (16px), mobile cards under 768px, desktop tables above.
- `backend/` – Express + `pg` on Neon PostgreSQL, deployed on Fly.io (`backend/fly.toml`).
  - Tables are created on startup in `backend/server.js` (`ensure...` functions) and mirrored in `backend/init.sql`.
  - Never commit `backend/.env` or print `DATABASE_URL`.

## Tool Shop (machinery) section
- Frontend page: `frontend/src/pages/MachineryPage.js` (route `/machinery`, menu label "Tool Shop").
- Backend routes: `backend/routes/machinery.js`, mounted at `/machinery`.
- Tables: `machinery` (one row per machine model) and `machinery_price_history` (every price change).
- `model` is the unique key used to match price updates (case-insensitive). Never change a machine's
  model code just to make a price update match — report the mismatch instead.
- Prices are in Sri Lankan Rupees (LKR), stored as DECIMAL(12,2). No currency symbols in CSV files.

## Updating machinery prices
- Source of truth for a price run: `backend/data/machinery-prices.csv`
  with header `model,price,quantity,name,brand,category` (only `model` and `price` are required;
  leave `quantity` empty to keep current stock).
- Always run a dry run first and show me the diff before applying:
  `cd backend && node scripts/update-machinery-prices.js data/machinery-prices.csv --dry-run`
- Apply only after I confirm:
  `cd backend && node scripts/update-machinery-prices.js data/machinery-prices.csv`
- Flag any price change bigger than ±20% and any model code that is "not in database" — ask before applying.
- Do not delete machines or price history.
