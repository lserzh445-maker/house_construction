# Architecture Overview

## Project Structure

```
house_construction/
├── src/                          # Next.js Frontend (Pages Router)
│   ├── pages/                    # Route-based pages
│   │   ├── _app.tsx             # Global app wrapper
│   │   ├── _document.tsx        # HTML document shell
│   │   ├── index.tsx            # Home page /
│   │   ├── catalog/index.tsx    # Catalog /catalog
│   │   ├── projects/[id].tsx    # Project detail /projects/:id
│   │   ├── about.tsx            # About /about
│   │   ├── blog/index.tsx       # Blog /blog
│   │   ├── contacts.tsx         # Contacts /contacts
│   │   ├── calculator.tsx       # Calculator /calculator
│   │   ├── reviews.tsx          # Reviews /reviews
│   │   ├── faq.tsx              # FAQ /faq
│   │   ├── financing.tsx        # Financing /financing
│   │   ├── services.tsx         # Services /services
│   │   ├── portfolio.tsx        # Portfolio /portfolio
│   │   ├── promotions.tsx       # Promotions /promotions
│   │   └── privacy.tsx          # Privacy policy /privacy
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx       # Page wrapper + SEO head
│   │   │   ├── Header.tsx       # Sticky header with nav
│   │   │   └── Footer.tsx       # Footer with links
│   │   ├── ui/
│   │   │   └── Button.tsx       # Generic button component
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx  # Project card with price/specs
│   │   │   └── FilterPanel.tsx  # Sidebar filter panel
│   │   ├── home/
│   │   │   └── HeroSection.tsx  # Full-width hero banner
│   │   └── forms/
│   │       └── CallForm.tsx     # React Hook Form + Zod call form
│   ├── types/index.ts           # TypeScript interfaces
│   ├── utils/
│   │   ├── cn.ts               # Tailwind class merge utility
│   │   └── formatPrice.ts      # Price/date/area formatters
│   ├── lib/api.ts               # Axios API client
│   └── styles/globals.css       # Tailwind + global styles
│
├── backend/                      # Node.js Backend (Express)
│   ├── src/
│   │   ├── server.ts            # Express server entry point
│   │   ├── routes/
│   │   │   ├── index.ts        # Route aggregator
│   │   │   ├── projects.ts     # /api/projects
│   │   │   ├── contacts.ts     # /api/contacts
│   │   │   ├── reviews.ts      # /api/reviews
│   │   │   ├── blog.ts         # /api/blog
│   │   │   └── calculator.ts   # /api/calculator
│   │   ├── middleware/
│   │   │   └── errorHandler.ts # Global error handler
│   │   └── types/index.ts      # Backend TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── public/                       # Static assets
├── docs/                         # Documentation
├── .github/workflows/ci.yml      # CI/CD pipeline
├── docker-compose.yml            # Local dev with Postgres + Redis
├── Dockerfile                    # Frontend production image
├── package.json                  # Frontend dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Custom colors + fonts
├── next.config.js                # Next.js config
└── .env.example                  # Environment variables template
```

## Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | Next.js 14, React 18, TypeScript |
| Styling     | Tailwind CSS, globals.css     |
| Forms       | React Hook Form + Zod         |
| HTTP Client | Axios                         |
| State       | React useState / Zustand      |
| Backend     | Node.js, Express, TypeScript  |
| Validation  | Zod (shared schema)           |
| Database    | PostgreSQL (planned)          |
| Cache       | Redis (planned)               |
| CI/CD       | GitHub Actions                |
| Containers  | Docker + docker-compose       |

## Color Palette

| Name      | Hex       | Usage                    |
|-----------|-----------|--------------------------|
| Primary   | #1B5E20   | Main brand (dark green)  |
| Secondary | #0288D1   | Trust, links (blue)      |
| Accent    | #FF9100   | CTA buttons (orange)     |
| Neutral   | #424242   | Body text                |
| Light     | #F5F5F5   | Page backgrounds         |

## API Endpoints

| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| GET    | /api/projects                 | List projects         |
| GET    | /api/projects/:id             | Project detail        |
| GET    | /api/projects/:id/similar     | Similar projects      |
| POST   | /api/contacts/call            | Call request form     |
| POST   | /api/contacts/quote           | Quote request form    |
| POST   | /api/contacts/consultation    | Book consultation     |
| POST   | /api/contacts/custom-project  | Custom project form   |
| GET    | /api/reviews                  | List reviews          |
| GET    | /api/reviews/project/:id      | Reviews by project    |
| GET    | /api/blog                     | List blog posts       |
| GET    | /api/blog/:slug               | Blog post detail      |
| POST   | /api/calculator/calculate     | Calculate price       |
| GET    | /health                       | Health check          |

## Getting Started

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Copy env files
cp .env.example .env
cp backend/.env.example backend/.env

# 4. Run frontend
npm run dev        # http://localhost:3000

# 5. Run backend (in another terminal)
npm run api:dev    # http://localhost:4000  (runs from backend/)

# 6. OR run everything with Docker
docker-compose up
```
