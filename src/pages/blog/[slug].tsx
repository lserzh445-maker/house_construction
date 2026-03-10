import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, User, ArrowLeft, Tag } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatDate } from '@/utils/formatPrice'
import { BLOG_POSTS } from '@/data/blog'
import type { BlogPost } from '@/types'

interface BlogPostPageProps {
  post: BlogPost
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <Layout
      title={`${post.title} — Блог ДомСтрой`}
      description={post.excerpt}
      canonical={`/blog/${post.slug}`}
      ogType="article"
    >
      <Breadcrumb items={[{ label: 'Блог', href: '/blog' }, { label: post.title, href: `/blog/${post.slug}` }]} />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Category + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="badge bg-primary text-white text-xs">{post.category}</span>
          <span className="flex items-center gap-1 text-xs text-neutral-medium">
            <User size={12} />{post.author}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-medium">
            <Clock size={12} />{post.readTime} мин
          </span>
          <span className="text-xs text-neutral-medium">{formatDate(post.publishedAt)}</span>
        </div>

        {/* Title */}
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-dark mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Cover image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-neutral-light">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        {/* Excerpt */}
        <p className="text-lg text-neutral-medium leading-relaxed mb-8 font-medium border-l-4 border-primary pl-4">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-neutral max-w-none mb-12">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h2 key={i} className="font-heading font-semibold text-xl text-neutral-dark mt-8 mb-3">
                  {paragraph.replace(/\*\*/g, '')}
                </h2>
              )
            }
            if (paragraph.startsWith('**')) {
              return (
                <p key={i} className="text-neutral-dark leading-relaxed mb-4 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
                  }}
                />
              )
            }
            return (
              <p key={i} className="text-neutral-medium leading-relaxed mb-4 whitespace-pre-line">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8 pt-6 border-t border-gray-100">
            <Tag size={14} className="text-neutral-medium" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-neutral-light rounded-full text-neutral-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
        >
          <ArrowLeft size={16} />
          Вернуться к блогу
        </Link>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = BLOG_POSTS.map((post) => ({ params: { slug: post.slug } }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const post = BLOG_POSTS.find((p) => p.slug === params?.slug)
  if (!post) return { notFound: true }
  return { props: { post }, revalidate: 3600 }
}
