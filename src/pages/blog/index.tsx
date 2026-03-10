import React from 'react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, ArrowRight } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { formatDate } from '@/utils/formatPrice'
import { BLOG_POSTS } from '@/data/blog'
import type { BlogPost } from '@/types'

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
  return { props: { posts: BLOG_POSTS } }
}
