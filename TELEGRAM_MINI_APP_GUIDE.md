# Telegram Mini App Implementation Guide
## Restaurant Customer Facing App — Golden Fork

---

## 1. Current Codebase Analysis

### 1.1 Tech Stack
| Layer | Library | Reference |
|-------|---------|-----------|
| Framework | React 19.2.0 | [package.json](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/package.json#L12-L31) |
| Build Tool | Vite 7.2.4 | [vite.config.js](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/vite.config.js) |
| Router | React Router 7.10.0 | [App.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/App.jsx#L1-L74) |
| Styling | Tailwind CSS 4.1.17 | [index.css](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/index.css) |
| HTTP Client | Axios 1.13.2 | [useStartSession.js](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/hooks/useStartSession.js) |
| State | React Context API (3 providers) | See §1.3 |

### 1.2 Application Routes
Defined in [App.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/App.jsx#L26-L68):

| Path | Page | Purpose |
|------|------|---------|
| `/`, `/qr` | [Landing.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/pages/Landing.jsx) | QR session bootstrap via DataFetcherComponent |
| `/menu` | [Menu.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/pages/Menu.jsx) | Browse categories, search, add to cart |
| `/cart` | [Rcart.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/pages/Rcart.jsx) → [Cart.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/features/cart/components/Cart.jsx) | Review, qty adjust, kitchen notes |
| `/order`, `/tracking` | [Order.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/pages/Order.jsx) | Confirm + send to kitchen + live tracking |
| `/history` | OrderHistory.jsx | Past orders |
| `/bill` | Bill.jsx | Settlement view |
| `/favorites` | Favorites.jsx | Saved dishes |
| `/feedback` | Feedback.jsx | Post-visit rating |
| `/profile` | Profile.jsx | Customer CRM profile |

### 1.3 State Management Layer (Context Providers)
Wrapping order (outer → inner):

```
CustomerProvider            // login/logout, CRM profile, localStorage persistence
 └── CartProvider           // cartItems, add/update/remove, subtotal/totalCount
      └── BrowserRouter
           └── FilteredMenuProvider   // QR session → sessionToken → menu fetch
```

| Context | File | Key Storage Keys |
|---------|------|-----------------|
| CustomerContext | [CustomerContext.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/CustomerContext.jsx) | `currentCustomer` |
| CartContext | [CartContext.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/CartContext.jsx) | `shoppingCart` |
| FilteredMenuContext | [FilteredMenuContext.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/FilteredMenuContext.jsx) | `qrSession`, `sessionToken`, `tableNumber`, `recentOrders` |

### 1.4 Session & Data Flow (Critical for TMA)
1. User opens `/?data=X&s=Y` (QR params) OR `/qr?...`
2. [FilteredMenuContext.initializeFromUrl()](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/FilteredMenuContext.jsx#L49-L123) extracts URL params
3. Calls [useStartSession.startSession()](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/hooks/useStartSession.js#L6-L66) → POST `/api/v1/sessions/start?data=&s=`
4. Backend returns `{ sessionToken, tableNumber, merchantId, branchId, expiresAt }`
5. Token stored in `localStorage`; passed as `Authorization: Bearer <token>` on all subsequent calls
6. [useFetchMenu()](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/hooks/useFetchMenu.js) fetches public menu once `isSessionReady === true`
7. Order placed via [Order.executeOrderPlacement()](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/pages/Order.jsx#L24-L109) → POST `/api/v1/orders` with Bearer token

### 1.5 Backend API Endpoints (from [url.js](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/url/url.js))
```
Local:  http://localhost:8000
Prod:   https://restaurant-bo.onrender.com

POST   /api/v1/sessions/start?data=&s=           → Start QR table session
GET    /api/v1/menu/public                        → Fetch public menu (auth header)
POST   /api/v1/orders                             → Place order (auth header)
GET    /api/v1/customer/my-orders                 → Order history
POST   /api/v1/customer/login                     → Customer CRM login
GET    /api/v1/customer/me                        → Customer profile
POST   /api/v1/feedback                           → Submit feedback
```

---

## 2. Telegram Mini App (TMA) Overview

### 2.1 What Changes
| Aspect | Web (Current) | Telegram Mini App |
|--------|---------------|-------------------|
| Entry Point | QR code → `https://domain/?data=X&s=Y` | Inline button in Telegram bot → `t.me/bot?startattach=table_123` or Menu button |
| Router | `BrowserRouter` (pushState) | **Must use `HashRouter`** (WebView doesn't support history API fully) |
| Auth | URL params + localStorage | **Telegram InitData** (signed user + payload) + optional QR params |
| Nav controls | Browser back/forward | **BackButton** API + **MainButton** API (bottom sticky CTA) |
| Haptics | None | **HapticFeedback** on add-to-cart, errors, success |
| Theme | Fixed CSS vars | Sync with **`themeParams`** (follow TG's light/dark) |
| Storage | `localStorage` only | **CloudStorage** (cross-device sync) + localStorage fallback |
| Viewport meta | Standard | **Viewport expansion**, safe-area-insets for notch |
| Share/Invite | N/A | **`web_app_switch_inline_query`**, share links |
| Payments | Pay at table | **Telegram Stars / Invoices** (optional) |

### 2.2 Telegram WebApp SDK Methods We'll Use
```javascript
window.Telegram.WebApp
  ├── .ready()                    // Signal app loaded (hides loader)
  ├── .expand()                   // Expand to full height
  ├── .close()                    // Close mini app
  ├── .initData                   // Signed user data + start_param
  ├── .initDataUnsafe             // Unsigned, for UI only
  ├── .user                       // { id, first_name, last_name, username, photo_url, language_code }
  ├── .startParam                 // Value after t.me/bot?startattach=THIS or ?startapp=THIS
  ├── .themeParams                // { bg_color, text_color, hint_color, link_color, button_color, button_text_color, secondary_bg_color }
  ├── .colorScheme                // "light" | "dark"
  ├── .setHeaderColor(color)      // Match top bar to theme
  ├── .setBackgroundColor(color)  // Sets WebView bg
  ├── .enableClosingConfirmation()// Show "are you sure?" on swipe down
  ├── BackButton                 // .show() .hide() .onClick(cb)
  ├── MainButton                 // .text, .color, .show(), .hide(), .onClick(cb), .showProgress()
  ├── HapticFeedback             // .impactOccurred(style), .notificationOccurred(type), .selectionChanged()
  ├── CloudStorage               // .setItem(k,v,cb), .getItem(k,cb), .removeItem(k,cb), .getKeys(cb)
  ├── shareToStory(media, params)// Share dish to TG Story (if available)
  └── switchInlineQuery(query, choose_chat_types) // Send order as inline msg
```

---

## 3. Step-by-Step Implementation

### Step 0 — BotFather Setup (Do this FIRST)
Before writing any code:

1. Open Telegram → find **`@BotFather`** → `/newbot`
   - Name: `Golden Fork`
   - Username: `GoldenForkBot` (must end in `bot`)
2. Save the **bot token** (e.g., `7123456789:AAH...`). You'll need it for backend validation.
3. `/newapp` (or `/mybots` → your bot → **Bot Settings → Menu Button**)
   - Paste your **HTTPS deployed URL** (see Step 6). Mini Apps REQUIRE HTTPS.
   - Upload 640×360 px header image
4. **Optional**: `/setdomain` → confirm domain whitelisting for WebApp.

### Step 1 — Inject Telegram WebApp SDK
Modify [index.html](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/index.html) — add the official SDK script **before** your `main.jsx`:

```html
<!doctype html>
<html lang="en" class="light">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <!-- TMA CRITICAL: viewport-fit=cover removes notch gaps; disallow user scaling -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no"
    />
    <!-- Prevent iOS WebView from telephoto zoom on focus -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>Golden Fork - Digital Dining & Menu</title>
    <!-- Google Fonts & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    <!-- TELEGRAM WEB APP SDK (official, from Telegram CDN) -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
  </head>
  <body class="bg-[#faf9f6] text-[#1a1c1a] antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 2 — Create a TMA Service & Hook Layer
Create 3 new files:

#### File A: `src/telegram/tma.js` (Service Singleton)
```javascript
// Telegram Mini App service wrapper — guards against running outside Telegram
// Safe to import everywhere; degrades gracefully to normal browser mode.

const isTMA = typeof window !== "undefined" && !!window.Telegram?.WebApp;

export const tg = isTMA ? window.Telegram.WebApp : null;

// ---------- Lifecycle ----------
export function initTelegramApp() {
  if (!tg) return { isTelegram: false };
  tg.ready();                 // Hide TG loader spinner
  tg.expand();                // Full height (removes the swipeable bottom sheet on first open)
  try { tg.enableClosingConfirmation(); } catch {}  // Warn user before closing with filled cart
  return { isTelegram: true, user: tg.initDataUnsafe.user || null, startParam: tg.startParam || null };
}

// ---------- Theme (reactive) ----------
export function syncThemeWithTelegram(setTheme) {
  if (!tg) return;
  const apply = () => {
    const scheme = tg.colorScheme; // "light" | "dark"
    document.documentElement.classList.toggle("dark", scheme === "dark");
    // Pass Tailwind CSS vars to the document from TG themeParams
    const tp = tg.themeParams || {};
    const r = document.documentElement.style;
    if (tp.bg_color)        r.setProperty("--tg-bg", tp.bg_color);
    if (tp.text_color)      r.setProperty("--tg-text", tp.text_color);
    if (tp.hint_color)      r.setProperty("--tg-hint", tp.hint_color);
    if (tp.button_color)    r.setProperty("--tg-btn", tp.button_color);
    if (tp.button_text_color) r.setProperty("--tg-btn-text", tp.button_text_color);
    if (tp.secondary_bg_color) r.setProperty("--tg-surface", tp.secondary_bg_color);
    try { tg.setHeaderColor(tp.bg_color || (scheme === "dark" ? "#1a1c1a" : "#faf9f6")); } catch {}
    try { tg.setBackgroundColor(tp.bg_color || (scheme === "dark" ? "#1a1c1a" : "#faf9f6")); } catch {}
    if (setTheme) setTheme(scheme);
  };
  apply();
  tg.onEvent?.("themeChanged", apply);
  return () => tg.offEvent?.("themeChanged", apply);
}

// ---------- BackButton ----------
export function showBackButton(handler) {
  if (!tg) return () => {};
  const bb = tg.BackButton;
  bb.show();
  bb.onClick(handler);
  return () => {
    bb.hide();
    bb.offClick(handler);
  };
}

// ---------- MainButton (bottom sticky CTA) ----------
export const MainBtn = {
  set(opts = {}) {
    if (!tg) return;
    const mb = tg.MainButton;
    if (opts.text !== undefined)   mb.text = opts.text;
    if (opts.color !== undefined)  mb.color = opts.color || tg.themeParams?.button_color || "#005136";
    if (opts.textColor !== undefined) mb.textColor = opts.textColor || "#ffffff";
    if (opts.disabled !== undefined)  mb.isActive = !opts.disabled;
    if (opts.visible)  mb.show();
    else               mb.hide();
    if (opts.progress !== undefined) {
      if (opts.progress) mb.showProgress(true);
      else               mb.hideProgress();
    }
  },
  onClick(handler) {
    if (!tg) return () => {};
    tg.MainButton.onClick(handler);
    return () => tg.MainButton.offClick(handler);
  },
};

// ---------- Haptic Feedback ----------
export const Haptic = {
  impact(style = "light") { if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred(style); },   // light|medium|heavy|rigid|soft
  notify(type = "success") { if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred(type); }, // error|success|warning
  select() { if (tg?.HapticFeedback) tg.HapticFeedback.selectionChanged(); }, // wheel-picker tick
};

// ---------- CloudStorage wrapper with Promise API ----------
// Fallbacks to localStorage when outside TG (so app still works in browser/debug)
function promisify(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
  });
}

export const CloudStore = {
  async getItem(key) {
    if (!tg?.CloudStorage) return localStorage.getItem(key);
    try {
      const res = await promisify(tg.CloudStorage.getItem.bind(tg.CloudStorage), key);
      return res ?? localStorage.getItem(key);
    } catch { return localStorage.getItem(key); }
  },
  async setItem(key, value) {
    localStorage.setItem(key, value);
    if (!tg?.CloudStorage) return true;
    try { return await promisify(tg.CloudStorage.setItem.bind(tg.CloudStorage), key, value); }
    catch { return false; }
  },
  async removeItem(key) {
    localStorage.removeItem(key);
    if (!tg?.CloudStorage) return true;
    try { return await promisify(tg.CloudStorage.removeItem.bind(tg.CloudStorage), key); }
    catch { return false; }
  },
};

// ---------- Utilities ----------
export function closeMiniApp() { tg?.close(); }

export function shareToTelegram(text, extra = {}) {
  if (!tg) return;
  try {
    // Fallback to universal share URL
    const url = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  } catch {}
}
```

#### File B: `src/telegram/useTelegramInit.js` (Hook — validates InitData via backend)
```javascript
import { useEffect, useState } from "react";
import { tg, CloudStore } from "./tma";

// Decide if we need to call backend, and merge TG user with customer session.
// Also: extract table_number from startParam (BotFather menu button deep link)
export function useTelegramInit() {
  const [state, setState] = useState({
    ready: false,
    isTelegram: !!tg,
    user: null,
    tableNumberFromTg: null,
    initDataSigned: null,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!tg) {
        if (!cancelled) setState(s => ({ ...s, ready: true }));
        return;
      }

      // 1. Extract table number from deep link (bot?startattach=t_T12 or startapp=T12)
      // Accepts patterns: t_T12, table_T12, T12, 12
      let tableNumberFromTg = null;
      const sp = tg.startParam || "";
      const match = sp.match(/(?:t(?:able)?_)?([A-Za-z]?\d+[A-Za-z]?)/i);
      if (match) tableNumberFromTg = match[1].toUpperCase().startsWith("T") ? match[1] : `T-${match[1]}`;

      // 2. Migrate localStorage to CloudStorage (1-time first run)
      try {
        const migrated = await CloudStore.getItem("__migrated");
        if (!migrated) {
          const KEYS = ["shoppingCart", "currentCustomer", "qrSession", "sessionToken", "tableNumber", "recentOrders"];
          for (const k of KEYS) {
            const v = localStorage.getItem(k);
            if (v) await CloudStore.setItem(k, v);
          }
          await CloudStore.setItem("__migrated", "1");
        }
      } catch {}

      // 3. Pass raw signed InitData up to backend for server-side validation
      // The backend should verify the HMAC-SHA256 signature against the bot token
      // BEFORE trusting `user.id`. We just stash it here; backend call is in your login hook.
      if (!cancelled) {
        setState({
          ready: true,
          isTelegram: true,
          user: tg.initDataUnsafe.user || null,
          tableNumberFromTg,
          initDataSigned: tg.initData, // forward this to your backend!
        });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
```

#### File C: `src/telegram/useTelegramNav.js` (Routing helpers + BackButton)
```javascript
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { showBackButton } from "./tma";

// Auto-hide/show TMA BackButton based on current route depth.
// Pages on root (/, /menu, /cart) hide it; subpages show it.
export function useTelegramBackButton({ overrideShow = null } = {}) {
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (overrideShow !== null) {
      return showBackButton(() => navigate(overrideShow));
    }
    const topLevel = ["/", "/qr", "/menu", "/cart", "/favorites", "/history", "/profile"].includes(loc.pathname);
    if (topLevel) return () => {};
    return showBackButton(() => navigate(-1));
  }, [loc.pathname, navigate, overrideShow]);
}
```

### Step 3 — Patch `main.jsx` + `App.jsx` to Wire Up TMA
#### File: [main.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/main.jsx)
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initTelegramApp, syncThemeWithTelegram } from './telegram/tma'

// --- MUST RUN BEFORE REACT MOUNTS ---
// Prevents the "white flash" before theme applies
const { isTelegram } = initTelegramApp();
if (isTelegram) syncThemeWithTelegram(); // apply TG theme immediately

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

#### File: [App.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/App.jsx) — Replace BrowserRouter with HashRouter + Wrap Init Hook
```javascript
import { useEffect } from "react";
import {
  HashRouter as Router,     // <-- WAS: BrowserRouter; TMA WebViews break with pushState
  Routes,
  Route,
} from "react-router-dom";

import Menu from "./pages/Menu";
import Landing from "./pages/Landing";
import { CartProvider } from "./context/CartContext";
import Rcart from "./pages/Rcart";
import HeaderAll from "./components/HeaderAll";
import BottomNavBar from "./components/BottomNavBar";
import { FilteredMenuProvider } from "./context/FilteredMenuContext";
import Order from "./pages/Order";
import OrderHistory from "./pages/OrderHistory";
import Bill from "./pages/Bill";
import Favorites from "./pages/Favorites";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import { CustomerProvider, CustomerContext } from "./context/CustomerContext";

import { useTelegramInit } from "./telegram/useTelegramInit";
import { useTelegramBackButton } from "./telegram/useTelegramNav";
import { Haptic } from "./telegram/tma";

// Optional: if HeaderAll/BottomNavBar are not needed inside Telegram because TG
// provides its own BackButton/Menu button, conditionally render them.
function Shell({ children }) {
  const tgInit = useTelegramInit();
  useTelegramBackButton();

  // Auto-login CustomerContext when Telegram user + InitData validated by backend
  useEffect(() => {
    if (!tgInit.ready || !tgInit.isTelegram || !tgInit.user) return;
    // --- Deeper integration: call backend /api/v1/customer/login-telegram
    // with initDataSigned. For now, eagerly hydrate CustomerContext so the
    // order shows a real name instead of "Guest".
    const ev = new CustomEvent("tg:user-ready", { detail: tgInit });
    window.dispatchEvent(ev);
  }, [tgInit.ready, tgInit.isTelegram, tgInit.user]);

  // Also: pass tableNumberFromTg into FilteredMenuContext via Context below.

  const showChrome = !tgInit.isTelegram; // hide custom nav-chrome *inside* TG

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] dark:bg-[#121312] text-[#1a1c1a] dark:text-[#f5f5f4]">
      {showChrome && <HeaderAll />}
      <div className="flex-1">{children}</div>
      {showChrome && <BottomNavBar />}
    </div>
  );
}

function App() {
  // Tap haptic on every route transition: subtle "tick"
  useEffect(() => {
    try { window.__tg_haptic_primed = true; } catch {}
  }, []);

  return (
    <CustomerProvider>
      <CartProvider>
        <Router>
          <FilteredMenuProvider>
            <Shell>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/qr" element={<Landing />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Rcart />} />
                <Route path="/order" element={<Order />} />
                <Route path="/tracking" element={<Order />} />
                <Route path="/history" element={<OrderHistory />} />
                <Route path="/bill" element={<Bill />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="*"
                  element={
                    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-[#efeeeb] text-[#005136] rounded-2xl flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[32px]">error</span>
                      </div>
                      <h2 className="text-xl font-bold mb-1">Page Not Found</h2>
                      <p className="text-xs mb-4">The requested page does not exist.</p>
                      <a
                        href="#/menu"
                        onClick={(e) => { e.preventDefault(); Haptic.select(); location.hash = "#/menu"; }}
                        className="px-4 py-2 bg-[#005136] text-white font-semibold text-xs rounded-xl"
                      >
                        Go to Menu
                      </a>
                    </div>
                  }
                />
              </Routes>
            </Shell>
          </FilteredMenuProvider>
        </Router>
      </CartProvider>
    </CustomerProvider>
  );
}

export default App;
```

### Step 4 — Upgrade Session Initialization for TG
Current flow reads `?data=&s=` from `window.location.search`. Inside TMA the URL becomes `#/menu` (hash router) and the session info may come from `startParam` instead.

Patch [FilteredMenuContext.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/FilteredMenuContext.jsx) → `initializeFromUrl`:

```javascript
//  (Replace the existing initializeFromUrl body with this expanded version)
const initializeFromUrl = useCallback(async () => {
  setIsInitializing(true);
  setIsSessionReady(false);
  setSessionError(null);

  // --- TMA ADDITION: read BOTH hash query AND classic query AND TG startParam
  const hashQuery = new URLSearchParams(window.location.hash.split("?")[1] || "");
  const classicQuery = new URLSearchParams(window.location.search);
  const tgStart = window.Telegram?.WebApp?.startParam || "";

  // Helper: pick first non-empty from 3 sources
  const pick = (key) =>
    hashQuery.get(key) || classicQuery.get(key) ||
    (tgStart.startsWith(`${key}_`) ? tgStart.slice(`${key}_`.length) : null);

  const data = pick("data");
  const s = pick("s");
  const table = pick("table") || pick("tableNumber") || pick("t");

  // --- TMA ADDITION: if table number provided by TG deep-link but no QR data/sig,
  // store it immediately so UI shows "Table T-101" instead of asking to scan QR
  if (table) {
    setTableNumber(table);
    localStorage.setItem("tableNumber", table);
  }

  // ... rest of the existing initializeFromUrl body continues unchanged ...
}, [startSession]);
```

### Step 5 — Upgrade CustomerContext to Auto-Login Telegram User
Modify [CustomerContext.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/CustomerContext.jsx):

Add this effect INSIDE `CustomerProvider` body, after `useMemo`:

```javascript
// Inside CustomerProvider:
useEffect(() => {
  const handler = (e) => {
    const tg = e.detail; // { user, initDataSigned }
    if (!tg?.user) return;
    const u = tg.user;
    // Only populate if the user has NOT already logged in with CRM
    setCustomer(prev => {
      if (prev && prev.id && !prev.__fromTelegram) return prev; // keep CRM session
      return {
        id: `tg_${u.id}`,
        name: [u.first_name, u.last_name].filter(Boolean).join(" ") || "Telegram User",
        phone: prev?.phone || null,   // keep phone if user provided it
        email: prev?.email || null,
        photoUrl: u.photo_url || null,
        language: u.language_code || "en",
        telegramId: u.id,
        username: u.username || null,
        initDataSigned: tg.initDataSigned, // <-- backend MUST use this to validate HMAC!
        loyaltyPoints: prev?.loyaltyPoints ?? 120,
        savedAt: new Date().toISOString(),
        __fromTelegram: true,
      };
    });
  };
  window.addEventListener("tg:user-ready", handler);
  return () => window.removeEventListener("tg:user-ready", handler);
}, []);
```

### Step 6 — Haptic Feedback on Key Actions
Sprinkle these calls into existing components for native-feeling UX:

| Location | Action | Call |
|----------|--------|------|
| **CartContext.handleAddToCart** | Item added | `Haptic.impact("medium")` |
| **CartContext.handleAddCustomizedItem** | Custom item added | `Haptic.impact("rigid")` |
| **CartContext.handleUpdateQuantity(change)** | +1 or -1 | `Haptic.select()` |
| **Order.executeOrderPlacement success** | Order sent | `Haptic.notify("success")` |
| **Order.executeOrderPlacement catch** | Order failed | `Haptic.notify("error")` |
| **FilteredMenuContext setActiveCategory** | Switch category tab | `Haptic.select()` |
| **ItemCustomizerModal save** | Confirm customization | `Haptic.impact("light")` |

Example — inside [CartContext.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/context/CartContext.jsx) at the bottom of `handleAddCustomizedItem`:
```javascript
import { Haptic } from "../telegram/tma";
// ... inside the cb, after setCartItems(...):
Haptic.impact("rigid");
```

### Step 7 — Use MainButton on Order Screen (Optional Polish)
In [Order.jsx](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/src/pages/Order.jsx), hide the inline send button and use TMA's bottom MainButton when inside TG:

```javascript
import { MainBtn, Haptic } from "../telegram/tma";

// Add effect after `executeOrderPlacement` is defined:
useEffect(() => {
  MainBtn.set({
    text: submitting
      ? "Sending Order to Kitchen…"
      : `Send Order to Kitchen • ${(totalSum * 1.15).toFixed(2)} ETB`,
    color: "#005136",
    disabled: submitting || cartItems.length === 0 || !!confirmedOrder,
    progress: submitting,
    visible: !confirmedOrder && cartItems.length > 0,
  });
  const off = MainBtn.onClick(() => {
    Haptic.impact("heavy");
    executeOrderPlacement();
  });
  return () => { off(); MainBtn.set({ visible: false }); };
}, [totalSum, submitting, cartItems.length, confirmedOrder]);
```

Then conditionally hide the in-page `<button onClick={executeOrderPlacement}>` wrapper when inside TG:
```jsx
{!window.Telegram?.WebApp && (
  <button onClick={executeOrderPlacement} disabled={submitting} ...>
```

### Step 8 — Backend Validation of InitData (CRITICAL — Security)
Your backend at `localhost:8000` **must** validate `initData` before trusting `telegramId` for logins, loyalty, or CRM linkage.

Add a backend endpoint `POST /api/v1/customer/validate-telegram` (pseudo-code, adapt to FastAPI/Express/Django):

```python
# Python / FastAPI example
import hmac, hashlib, urllib.parse, time
from fastapi import HTTPException

BOT_TOKEN = os.environ["TG_BOT_TOKEN"]

def validate_telegram_init_data(init_data: str) -> dict:
    # 1. Parse & sort alphabetically all fields EXCEPT `hash`
    params = dict(urllib.parse.parse_qsl(init_data))
    hash_received = params.pop("hash", "")
    sorted_items = sorted(params.items())
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_items)

    # 2. Compute HMAC-SHA256 of secret key (which itself is HMAC of BOT_TOKEN with literal "WebAppData")
    secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    hash_computed = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if hash_computed != hash_received:
        raise HTTPException(401, "Invalid Telegram signature")

    # 3. Reject stale initData (default TG signs once per open; auth_date ~600s shelf-life)
    auth_date = int(params.get("auth_date", 0))
    if time.time() - auth_date > 86_400:  # 24h grace (tune as needed)
        raise HTTPException(401, "Telegram auth expired")

    return params  # safe to use `user.id`, `user.username`, etc.
```

Call this from your existing `/api/v1/customer/login` or a dedicated `/login-telegram` endpoint that returns the same JWT/customer payload shape as your QR login.

### Step 9 — Build & Deploy (HTTPS Required!)
Update your [package.json](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/package.json) build to ensure a clean relative base:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --host --port 4173",
    "lint": "eslint ."
  }
}
```

Then in [vite.config.js](file:///c:/Users/HP/Dev/projects/Restaurant_App/Restaurant_customer_facing_app/vite.config.js) set `base: "./"` so HashRouter + static assets resolve correctly on any host path:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2020",
    outDir: "dist",
  },
  server: {
    host: true,       // so you can test LAN from phone
    port: 5173,
  },
})
```

#### Local Debug with Real Telegram (before HTTPS deploy)
Option A — Use **ngrok** to expose local Vite:
```bash
npm run dev
# Another terminal:
ngrok http 5173
# Copy https://abc-123.ngrok-free.app → paste in @BotFather as Menu Button URL
```

Option B — Chrome DevTools + CSP bypass for quick testing:
```
chrome://inspect → Port forward 5173 → inspect WebView from a real device connected via USB.
```

#### Deployment Targets (all give free HTTPS)
- **Vercel** (recommended — drop-and-drag `dist/` folder or `vercel --prod`)
- **Netlify** → same flow
- **GitHub Pages** → enable Pages on `dist/` artifact
- **Cloudflare Pages**

Paste the final HTTPS URL into BotFather → `/mybots` → your bot → **Bot Settings → Menu Button → Configure menu button → "Open Web App"**.

### Step 10 — Test Checklist
Open the app via Telegram on your phone (tap the Menu Button on your bot):

- [ ] No white flash on open; theme matches TG (light or dark)
- [ ] No double-bottom-nav (custom `BottomNavBar` hidden inside TG)
- [ ] Back button appears on `/order`, `/bill`, `/feedback`, `/profile`
- [ ] "Add to cart" → medium buzz; changing qty → light tick
- [ ] Place order → success buzz; error scenario → error buzz
- [ ] Cart persists across close/re-open (CloudStorage sync)
- [ ] Deep link `https://t.me/YourBot?startattach=table_T23` auto-sets table T23
- [ ] `localStorage.getItem("currentCustomer")` shows the Telegram user's name
- [ ] Backend receives validated `initDataSigned` + creates/links CRM record

---

## 4. Feature Mapping: Existing → TMA-Enhanced
| Feature | Original | TMA Enhancement |
|---------|----------|-----------------|
| Table session | Web QR `?data=&s=` | TG deep-link `?startattach=data_sig` + same backend |
| Customer login | Phone OTP / form | **Auto-login via TG ID**, still allow CRM merge |
| Cart | localStorage only | **CloudStorage sync** (switch phone, cart travels) |
| "Call Waiter" modal | `CallAssistanceModal` | **Send message directly to the restaurant's TG bot chat** |
| Share dish | — | `shareToTelegram()` or `web_app_switch_inline_query` |
| Pay at table | — | **Optional**: Telegram Stars invoice via `openInvoice("TG_stars", …)` |
| Live order tracking | Static UI | **Real-time updates via TG Bot push message** + live UI |
| Post-meal feedback | `/feedback` page | **Bot delivers inline keyboard poll** after session ends |

---

## 5. Production Safety Notes
1. **Always validate InitData on backend** — never trust `window.Telegram.WebApp.user` for auth decisions.
2. **`startParam` max 64 chars** — keep table codes short (`T12`, `B3`). If you need to pass both `data` + `s` signature, pack them in Bot backend: use `startattach=session_XYZ` and do a lookup on your side.
3. **Telegram disables `alert()` / `confirm()`** — replace with modals using your existing UI.
4. **CORS**: Your backend must whitelist both `localhost:5173` (dev) and the deployed `https://` domain.
5. **HashRouter URLs break deep links from outside Telegram** — for external QR code flow, have a landing page (outside the SPA) that reads `?data=&s=` from query string, then redirects to `#/qr?data=X&s=Y`.
6. **Closing Confirmation**: Only enable `enableClosingConfirmation()` when the cart has ≥1 item. Otherwise it's annoying.
7. **Image Hotlink Protection**: If you serve dish images from a CDN, whitelist `*.t.me` referrers.

---

## 6. File Summary — What Changes
| File | Action |
|------|--------|
| `index.html` | Add `telegram-web-app.js` + upgrade viewport meta |
| `src/telegram/tma.js` | **NEW** — SDK service wrapper |
| `src/telegram/useTelegramInit.js` | **NEW** — Init hook, deep-link parse, CloudStorage migration |
| `src/telegram/useTelegramNav.js` | **NEW** — BackButton auto-manage |
| `src/main.jsx` | Call `initTelegramApp()` **before** React mount |
| `src/App.jsx` | Swap `BrowserRouter` → `HashRouter`; wrap with `<Shell>` using new hooks |
| `src/context/FilteredMenuContext.jsx` | Expand `initializeFromUrl` to also read hash-query + TG `startParam` |
| `src/context/CustomerContext.jsx` | Listen `tg:user-ready` event → auto-populate TG customer |
| `src/context/CartContext.jsx` | Haptic calls on add/update |
| `src/pages/Order.jsx` | (Optional) Use `MainBtn` instead of in-page CTA inside TG |
| `src/pages/Menu.jsx` | Haptic on category switch |
| `vite.config.js` | Add `base: "./"` |
| Backend (external) | Add `POST /api/v1/customer/validate-telegram` InitData HMAC validator |

---

## 7. Quick Reference: Typical Mini App User Flow inside Telegram

```
User opens TG
  → taps "Golden Fork" bot → Menu Button [Open Menu]
     → WebView opens at #/
        → initTelegramApp() + useTelegramInit fires
           → tableFromTg: extracted from startParam (e.g., T23)
           → user: { id, name, photo_url, language }
        → FilteredMenuContext.initializeFromUrl()
           → if startParam contained `data_...&s_...` → POST /sessions/start
              else if tableFromTg only → optimistic session until user orders
        → CustomerContext receives tg:user-ready event → name shows on Order page
     User browses /menu → taps "Add" → Haptic.impact + cart to CloudStorage
     User taps /order → MainBtn shows "Send Order to Kitchen • 345 ETB"
        → user presses MainBtn → Haptic.heavy → POST /orders (Bearer sessionToken + InitData for CRM link)
        → Haptic.notify("success") → Live tracking UI
     Bot separately pushes: "Your order for T23 has been accepted by the chef!" via standard TG message
     User finishes → /bill + /feedback → CloudStore cleared → closeMiniApp()
```

---

**End of Guide.** Start with Step 0 (BotFather), then Step 1 + Step 2, then build & expose via ngrok to validate the shell before wiring deeper integrations.
