import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, Phone, Calculator, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  {
    label: 'Каталог',
    href: '/catalog',
    children: [
      { label: 'Все проекты', href: '/catalog' },
      { label: 'Одноэтажные', href: '/catalog/one-story' },
      { label: 'Двухэтажные', href: '/catalog/two-story' },
      { label: 'С мансардой', href: '/catalog/with-mansard' },
      { label: 'Финские/Канадские', href: '/catalog/finnish' },
    ],
  },
  { label: 'Портфолио', href: '/portfolio' },
  { label: 'О компании', href: '/about' },
  { label: 'Услуги', href: '/services' },
  { label: 'Финансирование', href: '/financing' },
  { label: 'Отзывы', href: '/reviews' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакты', href: '/contacts' },
]

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }, [router.pathname])

  const phone = process.env.NEXT_PUBLIC_PHONE || '+7 (499) 123-45-67'
  const phoneRaw = process.env.NEXT_PUBLIC_PHONE_RAW || '74991234567'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-300',
        isScrolled ? 'shadow-md' : 'border-b border-gray-100'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Д</span>
            </div>
            <span className="font-heading font-bold text-lg text-primary hidden sm:block">
              {process.env.NEXT_PUBLIC_COMPANY_NAME || 'ДомСтрой'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                    router.pathname.startsWith(item.href) && item.href !== '/'
                      ? 'text-primary bg-primary-50'
                      : 'text-neutral-dark hover:text-primary hover:bg-neutral-light'
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>

                {item.children && openDropdown === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-neutral-dark hover:text-primary hover:bg-primary-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3">
            <a
              href={`tel:${phoneRaw}`}
              className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
            >
              <Phone size={17} />
              <span className="text-sm">{phone}</span>
            </a>
            <Link href="/calculator" className="btn-accent text-sm px-4 py-2 min-h-0 h-10">
              <Calculator size={16} />
              Рассчитать
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 xl:hidden">
            <a
              href={`tel:${phoneRaw}`}
              className="p-2.5 text-primary rounded-lg"
              aria-label="Позвонить"
            >
              <Phone size={22} />
            </a>
            <button
              className="p-2.5 text-neutral-dark rounded-lg hover:bg-neutral-light transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'py-3 px-4 text-base font-medium rounded-lg transition-colors',
                  router.pathname.startsWith(item.href) && item.href !== '/'
                    ? 'text-primary bg-primary-50'
                    : 'text-neutral-dark hover:text-primary hover:bg-neutral-light'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
              <a
                href={`tel:${phoneRaw}`}
                className="btn-outline text-center"
              >
                <Phone size={18} />
                {phone}
              </a>
              <Link href="/calculator" className="btn-accent text-center">
                <Calculator size={18} />
                Рассчитать стоимость
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
