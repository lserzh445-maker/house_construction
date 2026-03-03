import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card, CardImage } from '@/components/ui/Card'
import { formatDate } from '@/utils/formatPrice'
import { fadeInUp, stagger, viewport } from '@/lib/animations'
import type { BlogPost } from '@/types'

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface LatestBlogProps {
  posts?: BlogPost[]
  className?: string
}

/* ─── Mock posts ─────────────────────────────────────────────────────── */
const DEFAULT_POSTS: BlogPost[] = [
  {
    id: '1', slug: 'kak-vybrat-karkasnyi-dom',
    title: 'Как выбрать каркасный дом: 10 критериев и частые ошибки',
    excerpt: 'Разбираем ключевые параметры: площадь, планировку, материалы, утеплитель и комплектацию. Чего избегать при покупке.',
    content: '', image: '/images/blog/1.jpg',
    publishedAt: '2026-02-20', author: 'Алексей Петров',
    category: 'Выбор дома', readTime: 8, tags: ['выбор', 'советы'],
  },
  {
    id: '2', slug: 'karkas-vs-brus-sravnenie',
    title: 'Каркасный дом vs брус vs газобетон: честное сравнение',
    excerpt: 'Детально сравниваем три технологии по стоимости, теплоэффективности, скорости строительства и сроку службы.',
    content: '', image: '/images/blog/2.jpg',
    publishedAt: '2026-02-10', author: 'Мария Иванова',
    category: 'Технологии', readTime: 12, tags: ['сравнение', 'технологии'],
  },
  {
    id: '3', slug: 'ipoteka-karkasnyi-dom-2026',
    title: 'Ипотека на каркасный дом в 2026 году: актуальные условия',
    excerpt: 'Какие банки дают ипотеку на каркасные дома, какие документы нужны и как получить одобрение быстро.',
    content: '', image: '/images/blog/3.jpg',
    publishedAt: '2026-01-28', author: 'Анна Смирнова',
    category: 'Финансирование', readTime: 6, tags: ['ипотека'],
  },
]

/* ─── Component ──────────────────────────────────────────────────────── */
export default function LatestBlog({ posts, className = '' }: LatestBlogProps) {
  const data = posts ?? DEFAULT_POSTS

  return (
    <section className={`section-padding bg-neutral-light ${className}`} aria-labelledby="blog-title">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <motion.span variants={fadeInUp} className="text-accent font-semibold text-sm uppercase tracking-widest">
              Блог
            </motion.span>
            <motion.h2 variants={fadeInUp} id="blog-title" className="section-title mt-1 mb-0">
              Полезные статьи
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-2">
              Советы по выбору, строительству и обустройству каркасного дома
            </motion.p>
          </div>
          <motion.div variants={fadeInUp}>
            <Link href="/blog" className="btn-outline text-sm px-5 py-2.5 min-h-0 h-10 whitespace-nowrap">
              Все статьи <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {data.map((post) => (
            <motion.div key={post.id} variants={fadeInUp}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col">
                  {/* Image */}
                  <CardImage aspectRatio="16/9">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => {}}
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="text-[11px]">{post.category}</Badge>
                    </div>
                  </CardImage>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading font-semibold text-base text-neutral-dark group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-neutral-medium text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-neutral-medium pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User size={11} />{post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />{post.readTime} мин
                        </span>
                      </div>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                      Читать статью <ArrowRight size={13} />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
