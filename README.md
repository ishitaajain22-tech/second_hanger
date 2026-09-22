# Dobara — Peer-to-Peer Pre-Loved Fashion Marketplace (MVP Prototype)

A polished, front-end-only MVP for an AI-first second-hand fashion marketplace in India.
Buy, sell, swap and get styled — all data is realistic mock/seed data, and every "AI"
feature (Listing Assistant, Wardrobe Visualizer, Wardrobe Changer, Outfit Stylist, Smart
Fit Match) is a simulated interaction (loading states + deterministic logic), so it runs
entirely in the browser with no backend or API keys required.

## Tech stack
- React 18 + Vite 5
- react-router-dom for routing
- Hand-rolled SVG "Garment" renderer (no external clothing images/assets — everything is
  generated at runtime from color/pattern/type/fit props, so recoloring & restyling is real)
- lucide-react icons
- Plain CSS (styles.css) — no Tailwind/UI kit dependency
- State: a single React Context + localStorage persistence (src/store.jsx) — no Redux needed

## Feature map
- `/` — Landing page
- `/browse` — Marketplace grid with NL-ish search, filters (size/brand/color/condition/price)
- `/product/:id` — Product detail, offers, swap proposals, Smart Fit Match, Complete the Look
- `/sell` — AI Listing Assistant (upload → simulated analysis → editable AI title/desc/price)
- `/closet` — AI Wardrobe Visualizer (digital closet, "scan wardrobe" simulation)
- `/closet/:id` — AI Wardrobe Changer (recolor/repattern/refit + "AI looks" suggestions)
- `/stylist` — AI Outfit Stylist (closet + marketplace combined into full outfits)
- `/impact` — Sustainability dashboard (CO2e/water/waste, levels, earnings)
- `/dashboard` — Listings, Orders, Offers & Swaps, Wishlist, Earnings, Messages, Measurements
- `/seller/:id` — Seller profile with Trust Score breakdown + reviews

## Running locally
See setup steps below.
