---
description: Update Tool Shop machinery prices (and optionally stock) from a supplier price list
---

1. Ask me for the new price source if I haven't given one (a supplier PDF/Excel/photo of a price list, or pasted text).
2. Fetch the current machinery list: `curl -s https://hardware-store-api.fly.dev/machinery` and note each machine's `model`, `name` and `price`.
3. Match every supplier line to an existing `model`. If a supplier line has no matching model, list it separately as "new / unmatched" — do not invent model codes.
4. Write the matched rows to `backend/data/machinery-prices.csv` with header `model,price,quantity,name,brand,category`. Prices in LKR as plain numbers (no "Rs.", no commas). Leave `quantity` empty unless I gave stock counts.
5. Run the dry run and show me the output as a table (model, old price, new price, % change):
   `cd backend && node scripts/update-machinery-prices.js data/machinery-prices.csv --dry-run`
6. Highlight changes larger than ±20% and all unmatched models. Wait for my confirmation.
7. After I confirm, apply: `cd backend && node scripts/update-machinery-prices.js data/machinery-prices.csv`
8. Report how many prices were updated and anything that was not found.
