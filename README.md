# FYP E-Commerce — Fashion Storefront

> A full-featured, server-rendered fashion e-commerce storefront built with **Next.js 15 (App Router)** and powered by the **Shopify Storefront API**. It was developed as a Final Year Project (FYP) to demonstrate a production-style headless commerce architecture: server actions for data mutations, NextAuth-based authentication (Google OAuth + Shopify customer credentials), a persistent shopping cart, live product search/filtering, and a full customer account/profile/orders experience.

---

## Table of Contents

1. [Overview](#overview)
2. [Feature List](#feature-list)
3. [Tech Stack](#tech-stack)
4. [Minimum System Requirements](#minimum-system-requirements)
5. [Environment Setup](#environment-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running the App](#running-the-app)
6. [Project / File Structure](#project--file-structure)
7. [Architecture Notes](#architecture-notes)
8. [Available Scripts](#available-scripts)
9. [Demo Video](#demo-video)
10. [Contributing](#contributing)

---

## Overview

This project is a headless, storefront-style e-commerce web application for a clothing/fashion brand. Rather than building a custom backend for products, inventory, carts, and customer accounts, it uses **Shopify as a headless commerce backend** via the **Storefront GraphQL API**, while the entire customer-facing experience (browsing, search, cart, checkout hand-off, authentication, and account management) is built from scratch with Next.js, React, and Tailwind CSS.

Key characteristics:

- **Server Components + Server Actions** are used throughout for data fetching and mutations (`"use server"` files in `src/actions`), avoiding hand-rolled API routes for most operations.
- **Authentication** is handled by NextAuth, supporting both Google OAuth sign-in and Shopify customer email/password credentials, with a Shopify customer access token stored in an HTTP cookie and used to authorize subsequent Storefront API calls.
- **Cart state** is persisted client-side (cart ID in `localStorage`) and synced with a Shopify Cart object via GraphQL mutations, so the cart survives page reloads and can be handed off directly to Shopify Checkout.
- A **Prisma schema** (MySQL) is also included in the repo (`prisma/schema.prisma`) modeling Users, Products, Orders, Carts, Categories, and Sizes. It represents an earlier/alternate data-modeling pass for the project and is not currently wired into the live request path — all live product, cart, and customer operations go through the Shopify Storefront API. It's kept for reference and can be revived if the project moves off Shopify.

## Feature List

**Storefront / Catalog**
- Home page with Best Selling and Latest Arrivals product rails
- Product search with text query, product-type, price-range, and size filters, sorting (name, price low→high, price high→low), and infinite/paginated loading
- Individual product detail pages with image gallery, variant (size) selection, stock status, and discount pricing
- Category browsing

**Cart & Checkout**
- Persistent cart (create, add, update quantity, remove line items) backed by the Shopify Cart API
- Cart drawer/dialog UX ("Add to Cart" confirmation dialog)
- Checkout page with shipping address form and payment method selection (Cash on Delivery / Credit Card)
- Authenticated checkout hand-off to Shopify's hosted checkout, including buyer identity association so logged-in customers check out as themselves
- Timeout/error handling around checkout requests

**Authentication & Accounts**
- Email/password registration and login (backed by Shopify customer accounts)
- Google OAuth sign-in (auto-provisions a Shopify customer on first login)
- Forgot password / reset password flow
- Session management via NextAuth (JWT strategy)

**Customer Profile**
- View/update profile information (name, email)
- Update password
- Manage shipping address (create/update default address)
- Order history with line items, pricing, and status

**UI/UX**
- Fully responsive, accessible UI built on Radix UI primitives via shadcn/ui (~50 pre-built components: dialogs, drawers, dropdowns, forms, toasts, tables, carousels, etc.)
- Light/dark theme support (`next-themes`)
- Toast notifications (`sonner`)
- Loading skeletons and spinners for async data
- Static pages: About, Contact, Terms, Privacy

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 15** (App Router, React Server Components, Server Actions) | Enables server-first data fetching/mutations without a separate API layer, file-based routing with route groups for clean separation of public pages/layouts, and built-in image/font optimization. |
| UI Library | **React 18** | Industry-standard, pairs natively with Next.js's rendering model. |
| Language | **TypeScript** | Type safety across server actions, GraphQL response shapes, and component props reduces runtime errors in a data-heavy commerce app. |
| Styling | **Tailwind CSS 3** + `tailwind-merge` + `tailwindcss-animate` | Utility-first styling for fast, consistent UI development; animation and merge utilities keep class composition safe in shared components. |
| Component Primitives | **Radix UI** via **shadcn/ui** | Unstyled, accessible (WAI-ARIA compliant) primitives (dialogs, dropdowns, popovers, etc.) that are copied into the repo (not an opaque dependency), so components stay fully customizable. |
| Commerce Backend | **Shopify Storefront API** (GraphQL) via `graphql-request` / `axios` | Offloads product catalog, inventory, cart, checkout, and customer account management to a battle-tested, PCI-compliant commerce platform instead of reinventing it. |
| Authentication | **NextAuth.js** (Google provider + Credentials provider) | Standard, extensible auth solution for Next.js with first-class OAuth support and JWT session handling, bridged to Shopify customer access tokens. |
| ORM / Database (legacy schema) | **Prisma** + **MySQL** | Type-safe schema/migrations for the original relational data model (users, products, orders, carts); retained for reference/possible future use outside Shopify. |
| Forms & Validation | **React Hook Form** + **Zod** + `@hookform/resolvers` | Performant, minimally-re-rendering forms with schema-based validation shared between client and server actions. |
| Icons | **lucide-react**, **react-icons** | Consistent, tree-shakeable icon sets used across UI and shadcn components. |
| Misc UI utilities | `embla-carousel-react`, `recharts`, `cmdk`, `vaul`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `react-spinners`, `ldrs` | Power specific UI needs (carousels, charts, command palette, drawers, OTP inputs, date pickers, resizable panels, loading indicators) without building them from scratch. |
| Seeding | `@snaplet/seed`, `@faker-js/faker`, `tsx` | Generate realistic fake data for the Prisma/MySQL schema during local development. |

## Minimum System Requirements

These are recommended baseline specs for comfortably running the Next.js dev server, Prisma tooling, and a local/containerized MySQL instance (if using the Prisma schema) side by side:

| Resource | Minimum | Recommended |
|---|---|---|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8 GB+ |
| Disk Space | 2 GB free (repo + `node_modules` + build cache) | 5 GB+ free |
| Node.js | v18.18+ | v20 LTS |
| npm | v9+ | v10+ |
| OS | Linux, macOS, or Windows (WSL2 recommended) | — |
| Network | Outbound HTTPS access to your Shopify store domain and Google OAuth endpoints | — |
| Database (optional) | MySQL 8.x, if using the Prisma schema | — |

> The app itself has no GPU, background-job, or heavy compute requirements — resource needs are dominated by the Next.js/TypeScript build and dev server (Turbopack/webpack).

## Environment Setup

### Prerequisites

- Node.js 18.18+ and npm installed
- A Shopify store with the **Storefront API** enabled and a **Storefront Access Token**
- A **Google Cloud** OAuth 2.0 Client ID/Secret (for Google sign-in), with an authorized redirect URI of `http://localhost:3000/api/auth/callback/google` for local development
- (Optional, only if using the legacy Prisma schema) A running MySQL instance

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd fyp-ecom

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local   # or create .env.local manually — see variables below
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SHOPIFY_SHOP_URL` | Yes | Full Storefront GraphQL API endpoint, e.g. `https://your-store.myshopify.com/api/2024-10/graphql.json` |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` | Yes | Your Shopify store's `.myshopify.com` domain, e.g. `your-store.myshopify.com` |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | Storefront API access token (public/client-facing token, generated in Shopify Admin → Apps → Develop apps) |
| `SHOPIFY_STORE_DOMAIN` | Yes | Server-side reference to the store domain, used for post-registration redirects |
| `GOOGLE_ID` | Yes (for Google sign-in) | Google OAuth 2.0 Client ID |
| `GOOGLE_SECRET` | Yes (for Google sign-in) | Google OAuth 2.0 Client Secret |
| `NEXTAUTH_SECRET` | Yes | Random secret used by NextAuth to sign/encrypt JWTs and cookies (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Recommended | Base URL of the app, e.g. `http://localhost:3000` (required in production) |
| `DATABASE_URL` | Only if using Prisma | MySQL connection string, e.g. `mysql://user:password@localhost:3306/fyp_ecom`, used by `prisma/schema.prisma` |

> `.env*` files are git-ignored by default (see `.gitignore`) — never commit real secrets. Variables prefixed `NEXT_PUBLIC_` are exposed to the browser bundle; keep true secrets (`GOOGLE_SECRET`, `NEXTAUTH_SECRET`) without that prefix.

### Running the App

```bash
# Start the development server
npm run dev

# (Optional) Only if you intend to use the Prisma/MySQL schema:
npm run migrate   # runs `prisma migrate dev` and seeds fake data via @snaplet/seed

# Production build
npm run build
npm run start

# Lint
npm run lint
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project / File Structure

```
fyp-ecom/
├── prisma/
│   ├── schema.prisma          # Legacy relational data model (User, Product, Order, Cart, Category, Size)
│   ├── seed.ts                 # Faker-based seed script
│   └── migrations/             # SQL migration history
├── public/                     # Static assets (favicons, images)
├── src/
│   ├── actions/                 # Server Actions ("use server") — the app's data layer
│   │   ├── authentication.ts    #   register / login / forgot-password / reset-password
│   │   ├── cart.ts               #   create / add / update / remove cart lines, checkout auth
│   │   ├── products.ts           #   product search, categories, home rails, product detail
│   │   └── profile.ts            #   profile, password, address, order history
│   ├── app/
│   │   ├── api/auth/
│   │   │   ├── auth-options.ts          # NextAuth configuration (Google + Credentials providers)
│   │   │   └── [...nextauth]/route.ts   # NextAuth route handler
│   │   ├── (client-pages)/
│   │   │   ├── home/page.tsx            # Home page (best sellers, latest arrivals)
│   │   │   ├── layout.tsx               # Shared client layout (nav, sidebar, footer)
│   │   │   └── (pages)/
│   │   │       ├── about/                # About page
│   │   │       ├── account/              # Login, register, forgot/reset password
│   │   │       ├── cart/                 # Cart page + checkout/
│   │   │       ├── contact/              # Contact page
│   │   │       ├── item/[id]/            # Product detail page
│   │   │       ├── privacy/, terms/      # Static legal pages
│   │   │       ├── profile/              # Account/address/orders/password
│   │   │       └── search/               # Product search & filtering
│   │   ├── layout.tsx            # Root layout (fonts, providers)
│   │   ├── page.tsx               # Root entry point
│   │   └── providers.tsx          # SessionProvider, ThemeProvider, CartProvider composition
│   ├── components/
│   │   ├── product/product-item.tsx     # Product card used across home/search
│   │   ├── ui/                            # ~50 shadcn/ui components (button, dialog, drawer, form, table, toast, ...)
│   │   ├── client-app-sidebar.tsx        # Site navigation sidebar
│   │   ├── searchbar.tsx                 # Global search input
│   │   └── theme-provider.tsx            # Light/dark theme context
│   ├── contexts/
│   │   └── cart.tsx                # Cart React context (cart ID persistence + sync)
│   ├── db/
│   │   └── index.ts                # Prisma client singleton (legacy schema)
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Responsive breakpoint hook
│   │   └── use-toast.ts            # Toast notification hook
│   ├── lib/
│   │   └── utils.ts                # `cn()` class-merge helper and shared utilities
│   ├── types/
│   │   ├── index.ts                # Shared domain types (Product, Cart, Profile, Orders, ...)
│   │   └── next-auth.d.ts          # NextAuth session/JWT type augmentation
│   └── utils/
│       ├── formatDate.ts           # Date formatting helper
│       └── shopify.ts              # Shopify Storefront API client (axios + GraphQL)
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js config (remote image domains)
├── tailwind.config.ts             # Tailwind theme/tokens
├── tsconfig.json
└── package.json
```

## Architecture Notes

- **Data flow**: Client components call functions in `src/actions/*` (Next.js Server Actions), which call `storefront()` in `src/utils/shopify.ts` to execute GraphQL queries/mutations against Shopify. No custom REST API routes are needed for CRUD operations.
- **Auth flow**: `next-auth` issues its own session JWT, but the source of truth for commerce authorization is a Shopify **customer access token**, stored in an httpOnly-style cookie (`shopifyCustomerAccessToken`) and attached to Storefront API calls that need customer context (profile, orders, address, cart buyer identity).
- **Cart flow**: On first load, `CartProvider` (`src/contexts/cart.tsx`) either restores a cart by ID from `localStorage` or creates a new Shopify cart, then keeps it in sync as items are added/updated/removed.
- **Route groups**: `(client-pages)` and `(pages)` are Next.js route groups used purely for layout organization — they don't affect the URL structure.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run sdev` | Start dev server with Turbopack and experimental HTTPS |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run migrate` | Run Prisma migrations and sync seed data (legacy schema only) |

## Demo Video

[Here is the demo video of the project](https://drive.google.com/file/d/1q0mJ7Gsc_ohaSuSUVuksGnJY219CHNvy/view?usp=sharing)

## Contributing

1. Create a feature branch from `main`
2. Make your changes, following the existing TypeScript/Tailwind conventions
3. Run `npm run lint` before committing
4. Open a pull request with a clear description of the change
