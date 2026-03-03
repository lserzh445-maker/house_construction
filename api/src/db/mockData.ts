/**
 * Mock data — replaces a real database during development.
 * When Prisma + PostgreSQL are connected, delete this file and use
 * the real PrismaClient queries in repository.ts instead.
 */

import type { Project, Review } from '../types'

// ─── Projects ────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'fin-d5',
    name: 'Финский дом Д-5',
    slug: 'fin-d5',
    description:
      'Классический двухэтажный каркасный дом в финском стиле с просторной верандой и рациональной планировкой. Идеален для семьи из 3–4 человек. Высокая теплоэффективность — подходит для сибирского климата.',
    price: { basePrice: 8_160_000, withFinishing: 9_792_000, turnkey: 11_448_000 },
    characteristics: {
      area: 85, size: '7×8', floors: 2, bedrooms: 2, bathrooms: 1,
      material: 'Брус 150×100 мм', insulation: 'Минвата 150 мм',
      roofing: 'Металлочерепица', buildingTime: '4–6 недель',
    },
    images: ['/images/projects/fin-d5/1.jpg', '/images/projects/fin-d5/2.jpg'],
    floorPlans: ['/plans/fin-d5-floor1.pdf'],
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    category: 'two-story', style: 'finnish', features: ['terrace'],
    rating: 4.9, reviewCount: 28, isPopular: true, isNew: false,
    createdAt: '2024-03-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'fin-d8',
    name: 'Финский дом Д-8',
    slug: 'fin-d8',
    description:
      'Просторный двухэтажный финский дом с тремя спальнями, гардеробной и открытой верандой. Панорамное остекление второго этажа создаёт ощущение единения с природой.',
    price: { basePrice: 10_800_000, withFinishing: 12_960_000, turnkey: 15_120_000 },
    characteristics: {
      area: 108, size: '9×9', floors: 2, bedrooms: 3, bathrooms: 2,
      material: 'Брус 200×100 мм', insulation: 'Минвата 200 мм',
      roofing: 'Металлочерепица', buildingTime: '5–7 недель',
    },
    images: ['/images/projects/fin-d8/1.jpg', '/images/projects/fin-d8/2.jpg'],
    floorPlans: ['/plans/fin-d8-floor1.pdf', '/plans/fin-d8-floor2.pdf'],
    category: 'two-story', style: 'finnish', features: ['terrace', 'balcony'],
    rating: 4.8, reviewCount: 15, isPopular: true, isNew: false,
    createdAt: '2024-05-01T00:00:00Z', updatedAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'canadian-k2',
    name: 'Канадский К-2',
    slug: 'canadian-k2',
    description:
      'Двухэтажный дом канадской технологии по SIP-панелям. Сверхнизкое потребление энергии, высокая прочность конструкции. Возводится за рекордные 3 недели.',
    price: { basePrice: 9_500_000, withFinishing: 11_400_000, turnkey: 13_300_000 },
    characteristics: {
      area: 95, size: '8×9', floors: 2, bedrooms: 3, bathrooms: 1,
      material: 'SIP-панели 174 мм', insulation: 'ПСБ-С 25 150 мм',
      roofing: 'Мягкая черепица', buildingTime: '3–4 недели',
    },
    images: ['/images/projects/canadian-k2/1.jpg', '/images/projects/canadian-k2/2.jpg'],
    floorPlans: ['/plans/canadian-k2-floor1.pdf'],
    category: 'two-story', style: 'canadian', features: ['terrace'],
    rating: 4.8, reviewCount: 19, isPopular: true, isNew: false,
    createdAt: '2024-04-01T00:00:00Z', updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'canadian-k5',
    name: 'Канадский К-5',
    slug: 'canadian-k5',
    description:
      'Большой двухэтажный дом канадского типа для большой семьи. Четыре спальни, два санузла, просторная кухня-гостиная и утеплённый гараж на два автомобиля.',
    price: { basePrice: 13_000_000, withFinishing: 15_600_000, turnkey: 18_200_000 },
    characteristics: {
      area: 130, size: '10×10', floors: 2, bedrooms: 4, bathrooms: 2,
      material: 'SIP-панели 174 мм', insulation: 'ПСБ-С 25 150 мм',
      roofing: 'Мягкая черепица', buildingTime: '5–6 недель',
    },
    images: ['/images/projects/canadian-k5/1.jpg'],
    floorPlans: ['/plans/canadian-k5-floor1.pdf', '/plans/canadian-k5-floor2.pdf'],
    category: 'two-story', style: 'canadian', features: ['terrace', 'garage'],
    rating: 4.7, reviewCount: 9, isPopular: false, isNew: false,
    createdAt: '2024-06-01T00:00:00Z', updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 'modern-s1',
    name: 'Современный С-1',
    slug: 'modern-s1',
    description:
      'Стильный одноэтажный дом в современном стиле с открытой планировкой кухни-гостиной. Большие окна, плоская кровля с уклоном, терраса — идеальный вариант для молодой пары.',
    price: { basePrice: 5_460_000, withFinishing: 6_552_000, turnkey: 7_644_000 },
    characteristics: {
      area: 65, size: '8×9', floors: 1, bedrooms: 2, bathrooms: 1,
      material: 'Брус 150×50 мм', insulation: 'Эковата 200 мм',
      roofing: 'Мягкая черепица', buildingTime: '3–4 недели',
    },
    images: ['/images/projects/modern-s1/1.jpg', '/images/projects/modern-s1/2.jpg'],
    floorPlans: ['/plans/modern-s1-floor1.pdf'],
    category: 'one-story', style: 'modern', features: ['terrace', 'balcony'],
    rating: 4.8, reviewCount: 14, isPopular: true, isNew: false,
    createdAt: '2024-07-01T00:00:00Z', updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'modern-s3',
    name: 'Современный С-3',
    slug: 'modern-s3',
    description:
      'Одноэтажный дом с мансардой в современном минималистичном стиле. Объёмный тёплый мансардный этаж увеличивает жилую площадь без существенного роста стоимости.',
    price: { basePrice: 8_820_000, withFinishing: 10_584_000, turnkey: 12_348_000 },
    characteristics: {
      area: 98, size: '9×10', floors: 2, bedrooms: 3, bathrooms: 1,
      material: 'Брус 150×100 мм', insulation: 'Эковата 200 мм',
      roofing: 'Металлочерепица', buildingTime: '4–5 недель',
    },
    images: ['/images/projects/modern-s3/1.jpg'],
    floorPlans: ['/plans/modern-s3-floor1.pdf', '/plans/modern-s3-floor2.pdf'],
    category: 'with-mansard', style: 'modern', features: ['terrace'],
    rating: 4.9, reviewCount: 7, isPopular: false, isNew: true,
    createdAt: '2025-09-01T00:00:00Z', updatedAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'barn-b2',
    name: 'Барнхаус Б-2',
    slug: 'barn-b2',
    description:
      'Стильный дом в стиле барнхаус с характерными высокими потолками и большими окнами. Двухскатная крыша с крутым уклоном формирует выразительный архитектурный образ.',
    price: { basePrice: 10_780_000, withFinishing: 12_936_000, turnkey: 15_092_000 },
    characteristics: {
      area: 110, size: '9×11', floors: 2, bedrooms: 3, bathrooms: 2,
      material: 'Брус 200×100 мм', insulation: 'Минвата 200 мм',
      roofing: 'Металлочерепица', buildingTime: '5–7 недель',
    },
    images: ['/images/projects/barn-b2/1.jpg', '/images/projects/barn-b2/2.jpg'],
    floorPlans: ['/plans/barn-b2-floor1.pdf'],
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    category: 'two-story', style: 'barnhouse', features: ['terrace', 'sauna'],
    rating: 4.9, reviewCount: 22, isPopular: true, isNew: false,
    createdAt: '2024-02-01T00:00:00Z', updatedAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'barn-b4',
    name: 'Барнхаус Б-4',
    slug: 'barn-b4',
    description:
      'Флагманский барнхаус с баней-сауной, котельной и гаражом. Для тех, кто хочет получить всё в одном проекте — комфорт, стиль и функциональность.',
    price: { basePrice: 14_700_000, withFinishing: 17_640_000, turnkey: 20_580_000 },
    characteristics: {
      area: 150, size: '10×12', floors: 2, bedrooms: 4, bathrooms: 2,
      material: 'Брус 200×100 мм', insulation: 'Минвата 250 мм',
      roofing: 'Металлочерепица', buildingTime: '6–8 недель',
    },
    images: ['/images/projects/barn-b4/1.jpg'],
    floorPlans: ['/plans/barn-b4-floor1.pdf', '/plans/barn-b4-floor2.pdf'],
    category: 'two-story', style: 'barnhouse', features: ['terrace', 'sauna', 'garage', 'boiler-room'],
    rating: 4.7, reviewCount: 6, isPopular: false, isNew: false,
    createdAt: '2024-08-01T00:00:00Z', updatedAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 'eco-e1',
    name: 'Эконом Е-1',
    slug: 'eco-e1',
    description:
      'Компактный одноэтажный дом для бюджетного строительства. Оптимальная планировка при минимальной площади — всё необходимое без лишнего.',
    price: { basePrice: 3_780_000, withFinishing: 4_536_000, turnkey: 5_292_000 },
    characteristics: {
      area: 45, size: '6×7', floors: 1, bedrooms: 1, bathrooms: 1,
      material: 'Брус 150×50 мм', insulation: 'Минвата 150 мм',
      roofing: 'Металлочерепица', buildingTime: '2–3 недели',
    },
    images: ['/images/projects/eco-e1/1.jpg'],
    floorPlans: ['/plans/eco-e1-floor1.pdf'],
    category: 'one-story', style: 'modern', features: [],
    rating: 4.6, reviewCount: 31, isPopular: false, isNew: false,
    createdAt: '2023-01-01T00:00:00Z', updatedAt: '2025-10-01T00:00:00Z',
  },
  {
    id: 'family-f1',
    name: 'Семейный Ф-1',
    slug: 'family-f1',
    description:
      'Просторный финский дом для большой семьи. Четыре спальни, два санузла, большая кухня с островом и отдельная гостиная. Тёплая терраса для отдыха в любую погоду.',
    price: { basePrice: 12_000_000, withFinishing: 14_400_000, turnkey: 16_800_000 },
    characteristics: {
      area: 120, size: '10×10', floors: 2, bedrooms: 4, bathrooms: 2,
      material: 'Брус 200×100 мм', insulation: 'Минвата 200 мм',
      roofing: 'Металлочерепица', buildingTime: '6–8 недель',
    },
    images: ['/images/projects/family-f1/1.jpg', '/images/projects/family-f1/2.jpg'],
    floorPlans: ['/plans/family-f1-floor1.pdf', '/plans/family-f1-floor2.pdf'],
    category: 'two-story', style: 'finnish', features: ['terrace', 'balcony'],
    rating: 4.8, reviewCount: 11, isPopular: false, isNew: false,
    createdAt: '2024-09-01T00:00:00Z', updatedAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'cottage-k7',
    name: 'Коттедж К-7',
    slug: 'cottage-k7',
    description:
      'Представительный двухэтажный коттедж канадского типа с 5 спальнями. Выполнен в стиле современной усадьбы — просторные комнаты, высокие потолки, архитектурные акценты.',
    price: { basePrice: 17_550_000, withFinishing: 21_060_000, turnkey: 24_570_000 },
    characteristics: {
      area: 180, size: '12×12', floors: 2, bedrooms: 5, bathrooms: 3,
      material: 'SIP-панели 224 мм', insulation: 'ПСБ-С 25 200 мм',
      roofing: 'Мягкая черепица', buildingTime: '7–9 недель',
    },
    images: ['/images/projects/cottage-k7/1.jpg'],
    floorPlans: ['/plans/cottage-k7-floor1.pdf', '/plans/cottage-k7-floor2.pdf'],
    category: 'two-story', style: 'canadian', features: ['terrace', 'garage', 'balcony'],
    rating: 4.9, reviewCount: 4, isPopular: false, isNew: true,
    createdAt: '2025-10-01T00:00:00Z', updatedAt: '2026-02-20T00:00:00Z',
  },
  {
    id: 'mansard-m3',
    name: 'Мансардный М-3',
    slug: 'mansard-m3',
    description:
      'Барнхаус с мансардой — хит сезона. Характерный облик с высокой двускатной кровлей, три спальни, сауна и просторная гостиная с камином. Для тех, кто ценит атмосферу.',
    price: { basePrice: 9_600_000, withFinishing: 11_520_000, turnkey: 13_440_000 },
    characteristics: {
      area: 98, size: '8×10', floors: 2, bedrooms: 3, bathrooms: 1,
      material: 'Брус 150×100 мм', insulation: 'Минвата 200 мм',
      roofing: 'Металлочерепица', buildingTime: '5–6 недель',
    },
    images: ['/images/projects/mansard-m3/1.jpg', '/images/projects/mansard-m3/2.jpg'],
    floorPlans: ['/plans/mansard-m3-floor1.pdf', '/plans/mansard-m3-floor2.pdf'],
    category: 'with-mansard', style: 'barnhouse', features: ['terrace', 'sauna'],
    rating: 4.8, reviewCount: 16, isPopular: false, isNew: false,
    createdAt: '2024-10-01T00:00:00Z', updatedAt: '2026-01-25T00:00:00Z',
  },
]

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const REVIEWS: Review[] = [
  {
    id: 'rev-1', projectId: 'fin-d5', author: 'Иван Петров', rating: 5,
    date: '2026-01-15',
    text: 'Отличный дом! Построили за 5 недель, всё строго по договору. Качество материалов на высшем уровне. Уже прошла первая зима — дом тёплый, расходы на отопление минимальные. Всем рекомендую!',
    helpful: 24, isApproved: true,
    videoUrl: 'https://www.youtube.com/embed/placeholder',
  },
  {
    id: 'rev-2', projectId: 'barn-b2', author: 'Мария Сидорова', rating: 5,
    date: '2025-12-20',
    text: 'Очень довольна результатом. Менеджер всегда был на связи, присылал фото каждые 2–3 дня. Никаких скрытых доплат — всё по смете. Дом превзошёл все ожидания по качеству отделки.',
    helpful: 18, isApproved: true,
  },
  {
    id: 'rev-3', projectId: 'canadian-k2', author: 'Алексей Козлов', rating: 5,
    date: '2025-11-05',
    text: 'Строили дом в ноябре — никаких проблем с зимним строительством. Бригада профессиональная, работают слаженно. Сдали на 3 дня раньше срока. Гарантийный паспорт получили при сдаче.',
    helpful: 31, isApproved: true,
  },
  {
    id: 'rev-4', projectId: 'modern-s1', author: 'Ольга Новикова', rating: 4,
    date: '2025-10-12',
    text: 'В целом очень довольна. Небольшие задержки на этапе инженерных систем, но команда оперативно решила все вопросы. Дом тёплый и красивый. Взяли ипотеку через их партнёра — одобрили быстро.',
    helpful: 11, isApproved: true,
  },
  {
    id: 'rev-5', projectId: 'modern-s1', author: 'Дмитрий Соколов', rating: 5,
    date: '2025-09-28',
    text: 'Второй год живём в доме — всё отлично. Зимой тепло при минус 25, летом не жарко. Отделка держится, ничего не трескается и не расходится. Буду рекомендовать всем знакомым.',
    helpful: 42, isApproved: true,
    videoUrl: 'https://www.youtube.com/embed/placeholder',
  },
  {
    id: 'rev-6', projectId: 'eco-e1', author: 'Сергей Лебедев', rating: 5,
    date: '2025-09-01',
    text: 'Брали самый бюджетный вариант, но качество удивило. Работали чисто и аккуратно. Небольшой дом для дачи получился отличным. Рекомендую, если нужно быстро и недорого.',
    helpful: 19, isApproved: true,
  },
  {
    id: 'rev-7', projectId: 'fin-d8', author: 'Наталья Воронова', rating: 5,
    date: '2025-08-15',
    text: 'Выбирали дом долго — в итоге остановились на Финском Д-8. Три спальни, просторная гостиная — всё как мы хотели. Строили 7 недель (чуть дольше плана из-за погоды), но результат шикарный.',
    helpful: 14, isApproved: true,
  },
  {
    id: 'rev-8', projectId: 'barn-b2', author: 'Павел Кузнецов', rating: 5,
    date: '2025-07-22',
    text: 'Барнхаус — это лучшее, что мы могли выбрать. Дом производит впечатление: соседи постоянно спрашивают, где заказывали. Все коммуникации работают безупречно, тепло и тихо.',
    helpful: 28, isApproved: true,
    videoUrl: 'https://www.youtube.com/embed/placeholder',
  },
  {
    id: 'rev-9', projectId: 'canadian-k2', author: 'Светлана Романова', rating: 4,
    date: '2025-06-10',
    text: 'Технология SIP-панелей действительно даёт результат — платёж за отопление вдвое ниже, чем в старом кирпичном доме. Небольшие замечания по отделке устранили по гарантии без вопросов.',
    helpful: 9, isApproved: true,
  },
  {
    id: 'rev-10', projectId: 'fin-d5', author: 'Андрей Морозов', rating: 5,
    date: '2025-05-30',
    text: 'Второй дом заказываем у этой компании — первый поставили нам в 2022 году. Качество стабильное, бригады работают слаженно. Отдельно хочу отметить удобство работы с менеджером.',
    helpful: 37, isApproved: true,
  },
  {
    id: 'rev-11', projectId: 'mansard-m3', author: 'Виктория Белова', rating: 5,
    date: '2025-04-18',
    text: 'Мансардный М-3 — это сказка. Живём уже 8 месяцев. Камин, сауна, высокие потолки в гостиной — ощущение, что живёшь в альпийском шале. Спасибо команде за работу!',
    helpful: 22, isApproved: true,
  },
  {
    id: 'rev-12', projectId: 'family-f1', author: 'Игорь Тихонов', rating: 4,
    date: '2025-03-05',
    text: 'Большой семейный дом — 4 спальни, все счастливы. Немного затянулось с инженерными системами (сантехника), но в целом компания ответственная. Рекомендую.',
    helpful: 7, isApproved: true,
  },
  {
    id: 'rev-13', projectId: 'eco-e1', author: 'Елена Захарова', rating: 5,
    date: '2025-02-14',
    text: 'Маленький, но идеальный дом для дачи. Сделали всё точно по смете, приехали вовремя. Очень приятная команда. Буду рекомендовать всем.',
    helpful: 13, isApproved: true,
  },
  {
    id: 'rev-14', projectId: 'barn-b4', author: 'Константин Орлов', rating: 5,
    date: '2025-01-20',
    text: 'Заказали Барнхаус Б-4 с полным пакетом: гараж, сауна, котельная. Работа выполнена качественно. Дом большой, но нагревается быстро — утепление 250 мм делает своё дело.',
    helpful: 6, isApproved: true,
  },
  {
    id: 'rev-15', projectId: 'canadian-k5', author: 'Марина Федорова', rating: 5,
    date: '2024-12-10',
    text: 'Самый большой дом из линейки — на 130 м² и с гаражом. Вся семья (6 человек) в восторге. Планировка продуманная, ничего лишнего, всё нужное. Живём полгода — нет никаких нареканий.',
    helpful: 5, isApproved: true,
  },
  {
    id: 'rev-16', projectId: 'modern-s3', author: 'Антон Николаев', rating: 5,
    date: '2026-02-01',
    text: 'Новинка Современный С-3 — покупали одними из первых. Архитектурное решение с мансардой — отличный выбор! Мансарда получилась тёплой и светлой. Строили 5 недель, всё чётко.',
    helpful: 3, isApproved: true,
  },
  {
    id: 'rev-17', projectId: 'fin-d5', author: 'Юлия Смирнова', rating: 5,
    date: '2026-01-28',
    text: 'Брали ипотеку через их партнёра — Сбер одобрил за 2 дня. Дом начали строить сразу после одобрения. 5 недель — и ключи у нас. Очень довольны скоростью и качеством.',
    helpful: 16, isApproved: true,
  },
  {
    id: 'rev-18', projectId: 'barn-b2', author: 'Роман Волков', rating: 4,
    date: '2025-11-12',
    text: 'Дом нравится. Из минусов — перед сдачей обнаружили небольшой скол на наличнике, заменили по гарантии без дополнительных вопросов. В остальном — всё супер.',
    helpful: 8, isApproved: true,
  },
  {
    id: 'rev-19', projectId: 'cottage-k7', author: 'Тимур Алиев', rating: 5,
    date: '2026-02-15',
    text: 'Купили Коттедж К-7 — самый большой в линейке. Пять спален, три санузла, большая кухня. Качество для такого масштаба — выше всяких похвал. Прекрасные специалисты.',
    helpful: 2, isApproved: true,
  },
  {
    id: 'rev-20', projectId: 'fin-d8', author: 'Галина Попова', rating: 5,
    date: '2025-10-05',
    text: 'Долго выбирала между разными компаниями — остановилась здесь из-за прозрачного договора и хороших отзывов. Не пожалела ни разу. Дом готов, живём и радуемся!',
    helpful: 21, isApproved: true,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeAvgRating(reviews: Review[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
}
