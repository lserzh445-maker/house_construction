import React, { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  url?: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => {
    if (url) return url
    if (typeof window !== 'undefined') return window.location.href
    return ''
  }

  const shareUrl = (platform: string) => {
    const pageUrl = encodeURIComponent(getUrl())
    const text = encodeURIComponent(title)

    const urls: Record<string, string> = {
      telegram:  `https://t.me/share/url?url=${pageUrl}&text=${text}`,
      whatsapp:  `https://wa.me/?text=${text}%20${pageUrl}`,
      vk:        `https://vk.com/share.php?url=${pageUrl}&title=${text}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400')
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center gap-1.5 text-sm text-gray-500">
        <Share2 size={15} />
        Поделиться:
      </span>

      {/* Telegram */}
      <button
        onClick={() => shareUrl('telegram')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9]/20 transition-colors"
        aria-label="Поделиться в Telegram"
      >
        Telegram
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => shareUrl('whatsapp')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#25D366]/10 text-[#1aab52] hover:bg-[#25D366]/20 transition-colors"
        aria-label="Поделиться в WhatsApp"
      >
        WhatsApp
      </button>

      {/* VK */}
      <button
        onClick={() => shareUrl('vk')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#4C75A3]/10 text-[#4C75A3] hover:bg-[#4C75A3]/20 transition-colors"
        aria-label="Поделиться ВКонтакте"
      >
        ВКонтакте
      </button>

      {/* Copy link */}
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        aria-label="Скопировать ссылку"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Скопировано!' : 'Скопировать'}
      </button>
    </div>
  )
}
