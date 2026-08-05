'use client'

import { useState } from 'react'
import { CMS_BLOCK_REGISTRY } from '@/features/cms/blocks/registry'
import { FAKE_BLOCKS, BLOCK_META } from '@/features/cms/fake-data'
import MainLayout from '@/shared/layout/MainLayout'
import { X } from 'lucide-react'

function EmptyBlock({ block }) {
  return (
    <section className="section">
      <div className="layout-content-narrow">
        <div className="rounded-[32px] border border-dashed border-[rgba(8,66,153,0.2)] bg-[#f8fbff] p-8 text-center">
          <p className="text-sm text-[#4f6a89]">
            Preview not available — <code className="rounded bg-[#edf4f8] px-2 py-0.5 text-xs font-mono text-[#084299]">{block.__component}</code> requires live data or special context.
          </p>
        </div>
      </div>
    </section>
  )
}

const SKIP_COMPONENTS = new Set(['blocks.book-call'])

export default function DemoPage() {
  const [selected, setSelected] = useState(null)
  const [locale, setLocale] = useState('en')
  const isArabic = locale === 'ar'

  const entries = Object.entries(FAKE_BLOCKS).filter(
    ([key]) => !SKIP_COMPONENTS.has(key)
  )

  const handleSelect = (key) => {
    setSelected((prev) => (prev === key ? null : key))
  }

  const handleNavigate = (url) => {
    if (url) window.location.assign(url)
  }

  const renderBlock = (componentKey) => {
    const fakeData = FAKE_BLOCKS[componentKey]
    if (!fakeData) return <EmptyBlock block={{ __component: componentKey }} />

    const renderFn = CMS_BLOCK_REGISTRY[componentKey]
    if (!renderFn) return <EmptyBlock block={{ __component: componentKey }} />

    try {
      return renderFn({
        block: fakeData,
        index: 0,
        locale,
        route: '/demo',
        onNavigate: handleNavigate,
      })
    } catch {
      return <EmptyBlock block={{ __component: componentKey }} />
    }
  }

  return (
    <MainLayout
      locale={locale}
      activePath="/demo"
      navItems={[]}
      servicesLabel=""
      serviceLinks={[]}
      cta={null}
      footerData={null}
      showLanguageSwitcher={false}
      onLocaleChange={setLocale}
      onNavigate={handleNavigate}
      onPrefetch={() => {}}
      mainClassName="pt-0"
      showFooter={false}
      showBlur={false}
    >
      <div className="min-h-screen bg-[#f8fafc]">
        <header className="border-b border-[#dce3e9] bg-white">
          <div className="layout-container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="premium-geist text-2xl font-semibold tracking-[-0.03em] text-[#0b1728]">
                  Block Components Demo
                </h1>
                <p className="mt-1 text-sm text-[#5b6c7c]">
                  Click any block card to preview it rendered with fake data —{' '}
                  <code className="rounded bg-[#edf4f8] px-1.5 py-0.5 text-xs font-mono text-[#084299]">
                    {entries.length} blocks
                  </code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLocale((prev) => (prev === 'en' ? 'ar' : 'en'))}
                className="rounded-full border border-[#d5dee7] bg-white px-4 py-2 text-sm font-medium text-[#0a2546] transition-colors hover:bg-[#f4f8fb]"
              >
                {isArabic ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        </header>

        <main className="layout-container py-8">
          {!selected ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {entries.map(([key], index) => {
                const number = index + 1
                const meta = BLOCK_META[key]
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(key)}
                    className="group relative overflow-hidden rounded-2xl border border-[#dce3e9] bg-white p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#084299]/30 hover:shadow-[0_8px_30px_rgba(8,66,153,0.1)]"
                  >
                    <span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0b1728] text-[11px] font-semibold text-white">
                      {number}
                    </span>

                    <span className="ml-8 inline-flex rounded-full bg-[#edf4f8] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#084299]">
                      {key.startsWith('section') ? 'Section' : 'Block'}
                    </span>

                    <h3 className="premium-geist mt-3 text-base font-semibold tracking-[-0.01em] text-[#111820]">
                      {meta?.name || key}
                    </h3>

                    {meta?.description ? (
                      <p className="mt-1.5 text-xs leading-5 text-[#596a7a]">
                        {meta.description}
                      </p>
                    ) : null}

                    <code className="mt-3 block text-[10px] font-mono text-[#8a9aa8]">
                      {key}
                    </code>

                    <span className="absolute right-3 top-3 text-[10px] font-medium text-[#084299] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Preview →
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#084299] transition-colors hover:text-[#062d6b]"
                  >
                    <span aria-hidden="true">&larr;</span> Back to all blocks
                  </button>
                  <h2 className="premium-geist mt-2 text-xl font-semibold tracking-[-0.02em] text-[#0b1728]">
                    {BLOCK_META[selected]?.name || selected}
                  </h2>
                  <code className="mt-1 inline-block rounded bg-[#edf4f8] px-2 py-0.5 text-xs font-mono text-[#084299]">
                    {selected}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d5dee7] text-[#596a7a] transition-colors hover:bg-[#f4f8fb]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#dce3e9] bg-white shadow-[0_4px_24px_rgba(8,41,89,0.06)]">
                <div className="border-b border-[#dce3e9] bg-[#f8fafc] px-4 py-2">
                  <p className="text-[11px] font-mono text-[#8a9aa8]">
                    {'<'} rendered with fake data {'/>'}
                  </p>
                </div>
                <div className="block-preview">{renderBlock(selected)}</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  )
}
