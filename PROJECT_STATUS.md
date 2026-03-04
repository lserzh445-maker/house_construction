# Статус проекта: Сайт каркасных домов

> **Обновляйте этот файл в конце каждой сессии и упоминайте его в начале следующей.**
> Пример старта новой сессии: «Продолжаем разработку. Смотри PROJECT_STATUS.md и CLAUDE.md».

---

## ✅ Выполнено

| Шаг | Описание | Дата | Коммит |
|-----|----------|------|--------|
| 1 | Структура проекта Next.js: папки, package.json, tsconfig.json, next.config.js, .env.example | — | first commit |
| 2 | Основные компоненты главной: Layout, Header, Footer, HeroSection, CompanyAbout, PopularProjects, Advantages, OrderProcess, ReviewsCarousel, ContactForm | — | two commit |
| 3 | API endpoints: /api/catalog, /api/projects/[id], /api/forms/call, /api/forms/quote, /api/calculator, /api/reviews | — | three commit |
| 4 | Mock-данные: 18 проектов в src/data/projects.json | — | three commit |
| 5 | Страницы-заглушки: about, blog, contacts, faq, financing, portfolio, promotions, privacy, reviews, services, calculator | — | three commit |
| 6 | Каталог с фильтрацией: FilterPanel, ProductCard, CompareBar, useCatalog, catalogFilter, catalogStore | — | разбираюсь с шестым шагом |
| 6-fix | Исправлена ошибка сериализации `videoUrl: undefined` в getServerSideProps каталога | 2026-03-04 | — |

---

## 🔄 Текущий шаг: 6 (Каталог) — завершён, ошибка исправлена

### Что было исправлено
- **Ошибка:** `Error serializing .fallbackData.data[3].videoUrl — undefined cannot be serialized as JSON`
- **Причина:** в `catalogFilter.ts` строка `videoUrl: p.videoUrl ?? undefined` конвертировала `null` → `undefined`, а Next.js не умеет сериализовать `undefined` в `getServerSideProps`
- **Исправление:** убрали `?? undefined`, тип в `types/index.ts` изменён с `string?` на `string | null | undefined`

---

## ⏭️ Следующие шаги

| Шаг | Описание | Статус |
|-----|----------|--------|
| 7 | Карточка проекта `/projects/[id]` — галерея, характеристики, видео, CTA, похожие проекты | ⏳ |
| 8 | Формы: CallForm, QuoteForm, ConsultationForm, ProjectForm (React Hook Form + Zod) | ⏳ |
| 9 | Калькулятор стоимости (интерактивный, real-time расчёт) | ⏳ |
| 10 | SEO: meta-теги, Schema.org JSON-LD, sitemap.xml, robots.txt | ⏳ |
| 11 | CI/CD: GitHub Actions (lint + build + deploy) | ⏳ |

---

## 📝 Ключевые параметры проекта

```
Tech Stack:    Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui
Цвета:         Primary #1B5E20 (зелёный), Secondary #0288D1 (голубой), Accent #FF9100 (оранжевый)
Шрифты:        Montserrat (заголовки), Inter (текст)
Данные:        src/data/projects.json (18 проектов, mock)
API:           /api/catalog, /api/projects/[id], /api/forms/*, /api/calculator, /api/reviews
Основной файл задания: CLAUDE.md
```

---

## 🔗 Структура репозитория

```
/src
  /components
    /layout      — Header, Footer, Layout
    /catalog     — FilterPanel, ProductCard, CompareBar
    /home        — HeroSection, CompanyAbout, PopularProjects, ...
    /forms       — (ещё не созданы)
  /pages
    /api         — catalog.ts, projects/[id].ts, forms/*, calculator.ts, reviews.ts
    /catalog     — index.tsx  ← (шаг 6, исправлен)
    /projects    — [id].tsx   ← (шаг 7, в очереди)
    index.tsx, about.tsx, blog.tsx, contacts.tsx, ...
  /data          — projects.json
  /hooks         — useCatalog.ts
  /lib           — catalogFilter.ts
  /store         — catalogStore.ts
  /types         — index.ts
  /utils         — cn.ts
```

---

_Последнее обновление: 2026-03-04_
