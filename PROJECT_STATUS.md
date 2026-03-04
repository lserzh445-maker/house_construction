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
| 7 | Страница карточки проекта `/projects/[id]` — 16 элементов, 8 компонентов, SSR, Open Graph, JSON-LD | 2026-03-04 | — |

---

## ✅ шаг: 6 (Каталог) — завершён, ошибка исправлена

### Что было исправлено
- **Ошибка:** `Error serializing .fallbackData.data[3].videoUrl — undefined cannot be serialized as JSON`
- **Причина:** в `catalogFilter.ts` строка `videoUrl: p.videoUrl ?? undefined` конвертировала `null` → `undefined`, а Next.js не умеет сериализовать `undefined` в `getServerSideProps`
- **Исправление:** убрали `?? undefined`, тип в `types/index.ts` изменён с `string?` на `string | null | undefined`

---

## ✅ шаг: 7 (Карточка проекта) — завершён

### Что реализовано
- **`/projects/[id].tsx`** полностью переписан — все 16 элементов
- **Галерея** (`ProjectGallery`): Swiper + thumbs + fullscreen lightbox
- **Инфопанель**: h1, артикул, бейджи, рейтинг, 6 характеристик, переключатель комплектации, цена с ипотекой
- **CTA**: «Заказать расчёт» (открывает CallForm), «Калькулятор», Избранное + Сравнение (из Zustand)
- **Соцсети** (`ShareButtons`): Telegram / WhatsApp / ВК / копировать ссылку
- **Описание** + **Планы этажей** (`ProjectPlans`): изображения + lightbox + PDF-ссылки
- **Видео**: YouTube embed (lazy, без autoplay)
- **Характеристики** (таблица) + **Технические характеристики** (расширено)
- **Отзывы** (`ProjectReviews`): из `project.reviews`, пагинация, YouTube видеоотзывы
- **FAQ** (`ProjectFAQ`): 7 вопросов, accordion с анимацией
- **Дополнительные услуги** (`ProjectServices`): 4 карточки-ссылки
- **Финансирование** (`ProjectFinancing`): банки-партнёры + мини-калькулятор платежа
- **Похожие проекты** (`ProjectSimilar`): алгоритм по стилю/категории/площади
- **Footer CTA**: зелёный блок с двумя кнопками
- **Open Graph** + **JSON-LD** (`schema.org/Product`) в `<Head>`
- **SSR**: `getProjectById()` / `getSimilarProjects()` из `catalogFilter.ts` — реальные данные из JSON
- **404**: `notFound: true` если проект не найден
- **Fix**: HeroSection.tsx — `{...fadeIn}` → `variants={fadeIn}`

## ✅ Шаг 8: Формы обратной связи - завершен
### Что реализовано
  - ✅ Zod схемы (4 формы)
  - ✅ CallForm.tsx (Заказать звонок)
  - ✅ QuoteForm.tsx (Получить расчет)
  - ✅ ConsultationForm.tsx (Консультация)
  - ✅ ProjectForm.tsx (Индивидуальный проект)
  - ✅ FormModal.tsx (модальное окно)
  - ✅ Интеграция на все страницы
  - ✅ Тестирование всех форм
  - Коммит: "feat: implement forms (call, quote, consultation, project)"

## 🔄 В ПРОЦЕССЕ:

---

## ⏭️ Следующие шаги

| Шаг | Описание | Статус |
|-----|----------|--------|
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

_Последнее обновление: 2026-03-04 (Шаг 7)_
