'use client';

import { useState } from 'react';
import type { AppLocale } from '@/lib/i18n/routing';

export default function ShareButtons({ title, slug, locale }: { title: string; slug: string; locale: AppLocale }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    const method = typeof navigator.share === 'function' ? 'native' : 'clipboard';
    if (method === 'native') await navigator.share({ title, url });
    else { await navigator.clipboard.writeText(url); setCopied(true); }
  };
  return <button type="button" onClick={share} className="rounded-full border border-[rgba(8,66,153,0.14)] px-4 py-2 text-sm text-[#0b4f8c] hover:bg-[#edf4fb]">{copied ? (locale === 'ar' ? 'تم النسخ' : 'Copied') : (locale === 'ar' ? 'مشاركة' : 'Share')}</button>;
}
