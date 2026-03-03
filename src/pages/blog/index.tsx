import React from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, ArrowRight } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { formatDate } from '@/utils/formatPrice'
import type { BlogPost } from '@/types'

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1', slug: 'kak-vybrat-karkasnyi-dom', title: 'Как выбрать каркасный дом: 10 критериев и ошибок',
    excerpt: 'Разбираем главные параметры при выборе каркасного дома — от площади и планировки до выбора комплектации и материалов.',
    content: '', image: '/images/blog/1.jpg', publishedAt: '2026-02-20',
    author: 'Алексей Петров', category: 'Выбор дома', readTime: 8, tags: ['выбор', 'советы'],
  },
  {
    id: '2', slug: 'karkas-vs-brus-vs-kamen', title: 'Каркас vs брус vs камень: полное сравнение',
    excerpt: 'Сравниваем три самых популярных технологии строительства загородных домов по ключевым параметрам.',
    content: '', image: '/images/blog/2.jpg', publishedAt: '2026-02-15',
    author: 'Мария Иванова', category: 'Технологии', readTime: 12, tags: ['сравнение', 'технологии'],
  },
  {
    id: '3', slug: 'ipoteka-na-karkasnyi-dom-2026', title: 'Ипотека на каркасный дом: условия 2026',
    excerpt: 'Актуальные программы ипотечного кредитования для покупки каркасного дома. Ставки, требования, документы.',
    content: '', image: '/images/blog/3.jpg', publishedAt: '2026-02-10',
    author: 'Анна Смирнова', category: 'Финансирование', readTime: 6, tags: ['ипотека', 'финансирование'],
  },
  {
    id: '4', slug: 'podgotovka-uchastka', title: 'Подготовка земельного участка: пошаговая инструкция',
    excerpt: 'Что нужно сделать с участком перед началом строительства каркасного дома.',
    content: '', image: '/images/blog/4.jpg', publishedAt: '2026-02-05',
    author: 'Сергей Козлов', category: 'Строительство', readTime: 10, tags: ['участок', 'подготовка'],
  },
  {
    id: '5', slug: 'otoplenie-v-karkasnomy-dome', title: 'Отопление в каркасном доме: выбираем систему',
    excerpt: 'Газ, электро, тепловой насос или твердотопливный котёл — что лучше для каркасного дома.',
    content: '', image: '/images/blog/5.jpg', publishedAt: '2026-01-28',
    author: 'Алексей Петров', category: 'Инженерия', readTime: 9, tags: ['отопление', 'инженерия'],
  },
  {
    id: '6', slug: 'sezonnost-stroitelstva', title: 'Сезонность в строительстве: когда лучше строить?',
    excerpt: 'Можно ли строить каркасный дом зимой? Разбираем плюсы и минусы каждого сезона.',
    content: '', image: '/images/blog/6.jpg', publishedAt: '2026-01-20',
    author: 'Сергей Козлов', category: 'Строительство', readTime: 7, tags: ['сезонность', 'зима'],
  },
]

const CATEGORIES = ['Все', 'Выбор дома', 'Технологии', 'Финансирование', 'Строительство', 'Инженерия']

interface BlogPageProps {
  posts: BlogPost[]
}

export default function BlogPage({ posts }: BlogPageProps) {
  const [activeCategory, setActiveCategory] = React.useState('Все')

  const filtered = activeCategory === 'Все'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  return (
    <Layout
      title="Блог о строительстве каркасных домов — советы и статьи"
      description="Полезные статьи о каркасном строительстве: как выбрать дом, условия ипотеки, сравнение технологий, советы по отоплению и планировке."
      canonical="/blog"
    >
      {/* Header */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl mb-3">Блог</h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Полезные статьи о строительстве, выборе и обустройстве каркасного дома
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                activeCategory === cat
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-200 text-neutral-dark hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group card flex flex-col">
              <div className="relative aspect-video overflow-hidden bg-neutral-light">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={() => {}}
                />
                <span className="absolute top-3 left-3 badge bg-primary text-white text-xs">
                  {post.category}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-heading font-semibold text-base text-neutral-dark group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-neutral-medium text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-neutral-medium pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime} мин
                    </span>
                  </div>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                  Читать <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-10">
          <button className="btn-outline">Загрузить ещё статьи</button>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async () => {
  // TODO: replace with real API: await blogApi.getAll()
  return { props: { posts: MOCK_POSTS } }
}
