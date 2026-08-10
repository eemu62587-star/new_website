# Golden Pizza Cafe — Online Ordering Website

A static, front-end-only food ordering site for Golden Pizza Cafe (Bahal, Bhiwani). No build step, no backend — pure HTML/CSS/JS, ready for GitHub + Cloudflare Pages.

## Files
- `index.html` — page structure
- `css/styles.css` — design system + layout
- `js/menu-data.js` — menu items, prices, categories, cafe info (edit here to update the menu)
- `js/app.js` — cart, checkout, distance/delivery calc, WhatsApp order logic

## Deploying
1. Push this folder to a GitHub repo.
2. In Cloudflare Pages, create a new project from that repo.
3. Build command: none. Build output directory: `/` (project root).
4. Deploy — no environment variables needed.

## Things worth checking before going live
- **Delivery distance origin**: `CAFE_INFO.lat` / `CAFE_INFO.lng` in `js/menu-data.js` are set to Bahal's approximate town-centre coordinates (28.6297, 75.6178), since an exact pin for the cafe wasn't provided. Replace with the cafe's exact GPS coordinates (drop a pin on Google Maps and copy the lat/lng) for accurate auto-distance calculation. Manual distance entry always works as a fallback either way.
- **Price conflict**: one of the flyers you shared (image 5) lists older/different prices for Simple Burger (₹25), Aloo Tikki Burger (₹30), Fingerchips, Chowmin, and half/full Momos — these don't match the structured Menu A/B/C boards, which look like the current official menu. The site currently uses the Menu A/B/C prices (Veg Burger ₹39, Aloo Tikki Burger ₹49, Steam/Fried/Gravy Momos, French/Piri Piri/Cheese Fries, Chinese Noodle). Double-check which set is current and edit `js/menu-data.js` if needed.
- **Item photos**: no individual food photos were provided (only the promotional menu-board graphics), so each dish uses a simple icon tile instead of a stock photo, to avoid using images that aren't actually of your food. Swap in real photos any time by replacing the `icon` field usage in `js/app.js` / `menu-data.js` with `<img>` tags.
- **UPI QR code**: generated live via a free public QR API (api.qrserver.com) from your UPI ID — requires the visitor to be online, which they will be anyway to load the site.
