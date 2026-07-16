# Devine Ora — Next.js Storefront + Premium Admin Panel

A complete, production-ready Next.js 14 (App Router + TypeScript) e-commerce project tailored for the **Devine Ora** brand:
a fast, SEO-optimized storefront and a full **admin panel** with dashboard analytics,
banner management with live preview, order & fulfillment management, products &
categories, SEO/pixel controls, and payment & courier integrations.

## Stack

- **Next.js 14** (App Router, Server Components, Route Handlers, `sitemap.ts` / `robots.ts`)
- **TypeScript** + **Tailwind CSS**
- **Prisma + MongoDB** (production-grade database for storing products, categories, orders, and settings)
- **JWT session auth** (`jose`) via HTTP-only cookie — no third-party auth vendor required
- **Recharts** for dashboard analytics

## 1. Install

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="mongodb+srv://<db_user>:<db_password>@cluster.mongodb.net/devineora?retryWrites=true&w=majority"
JWT_SECRET="generate-a-long-random-string-for-security"
ADMIN_EMAIL="admin@devineora.com"
ADMIN_PASSWORD="ChangeMe123!"
NEXT_PUBLIC_SITE_URL="https://www.devineora.com"
```

## 2. Set up the database

```bash
npx prisma generate
npx prisma db push
npm run seed
```

This updates your MongoDB schema, sets up your **admin login**, demo categories, collections
(`Best Offers`, `New Goods`), demo products, and default settings for SEO/pixels/payments/logistics.

## 3. Run

```bash
npm run dev
```

- Storefront: `http://localhost:3000`
- Admin login: `http://localhost:3000/adminlogin` (use the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`)

## What's included in the Admin Panel (`/admin/*`)

| Page | What it does |
|---|---|
| **Dashboard** | Revenue (7-day chart), pending/delivered orders, avg order value, order-status breakdown, top-selling products, low-stock alerts — all computed live from the database. |
| **Banners** | Full CRUD for homepage banners with **instant live preview** (gradient, image, copy, button, position, schedule) — changes reflect on the storefront immediately. |
| **Orders** | Filterable/searchable order list, order detail view, update order status, payment status, assign a courier + tracking number. |
| **Products** | Add/edit products: price, compare-at price, cost price, SKU, stock, multi-image upload, category, and **collections** (tag products into "New Goods", "Best Offers", etc. — create new collections inline). |
| **Categories** | CRUD with category images, ordering, active/hidden toggle. |
| **SEO & Pixels** | Global meta title/description/OG image, robots indexing toggle, auto sitemap — plus GA4, GTM, Meta Pixel, TikTok Pixel, Snap Pixel IDs, injected site-wide. |
| **Payments** | Payment gateways: **JazzCash**, **EasyPaisa**, **PayFast**, Bank Transfer, and Cash on Delivery — each with its own enable toggle, credentials, and sandbox/live mode. |
| **Logistics** | Courier integrations: **Leopards Courier**, **TCS**, **PostEx**, **M&P** — API credentials, default courier, and webhook endpoints for status sync. |
| **Settings** | Store name, tagline, support phone, currency, shipping message. |

Admin auth is a signed JWT stored in an HTTP-only cookie; `middleware.ts` protects
every `/admin/*` route and redirects unauthenticated visitors to `/adminlogin`.

## Project structure

```
src/
  app/
    page.tsx                     storefront home
    category/[slug]/page.tsx
    product/[slug]/page.tsx
    adminlogin/page.tsx
    admin/                       protected admin panel (see middleware.ts)
      dashboard/ orders/ products/ categories/ banners/ seo/ payments/ logistics/ settings/
    api/
      auth/                      login/logout
      admin/                     protected CRUD for banners/products/categories/orders/settings/upload
      checkout/route.ts          creates orders from the storefront cart
      webhooks/                  payment & courier webhook callbacks
  components/
    storefront/                  Header, Footer, HeroBanners, CategoryGrid, ProductGrid, PixelScripts
    admin/                       Sidebar, StatCard, BannerManager, ProductForm, OrdersTable, ...
  lib/                           prisma client, auth, settings, utils
prisma/
  schema.prisma
  seed.ts
```

