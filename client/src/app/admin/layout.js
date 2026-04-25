import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }) {
  // SECURITY: ENABLE_INTERNAL_ADMIN only hides these MVP routes. Add real authentication and authorization before production.
  if (process.env.ENABLE_INTERNAL_ADMIN !== 'true') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f3f7fb] px-4 py-8 text-[#0a2546] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-[#d5e1ee] bg-[#fff9e8] px-5 py-4 text-sm text-[#5b4a12]">
          Internal admin MVP only. These routes are isolated behind `ENABLE_INTERNAL_ADMIN`, but they do not replace real authentication.
        </div>
        {children}
      </div>
    </div>
  );
}
