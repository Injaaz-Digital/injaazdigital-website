import Link from 'next/link';
import { notFound } from 'next/navigation';
import { request } from '@/lib/strapi/client';
import { normalizeValue } from '@/lib/strapi/normalizers';
import { createLeadNoteAction, updateLeadStatusAction } from '@/features/book-call/server/admin-actions';

const fetchLead = async (id) => {
  try {
    const response = await request(`/api/leads/${id}`, {
      populate: {
        responses: {
          populate: {
            question: true,
          },
          sort: ['answeredAt:asc'],
        },
        meetings: {
          sort: ['start:desc'],
        },
        leadNotes: {
          sort: ['createdAt:desc'],
        },
      },
    });

    return normalizeValue(response?.data);
  } catch {
    return null;
  }
};

export default async function AdminLeadDetailPage({ params }) {
  const lead = await fetchLead(params.id);
  if (!lead) {
    notFound();
  }

  const meeting = Array.isArray(lead.meetings) ? lead.meetings[0] : null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">Lead Detail</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">{lead.name || lead.fullName || `Lead #${lead.id}`}</h1>
        </div>
        <Link className="text-sm text-[#0b5da8] underline" href="/admin/leads">Back to leads</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#d5e1ee] bg-white p-6 shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
            <h2 className="text-lg font-semibold">Lead identity</h2>
            <div className="mt-4 grid gap-3 text-sm text-[#17314d]">
              <p><strong>Email:</strong> {lead.email || '-'}</p>
              <p><strong>Phone:</strong> {lead.phone || '-'}</p>
              <p><strong>Company:</strong> {lead.companyName || '-'}</p>
              <p><strong>Website:</strong> {lead.websiteUrl || lead.website || '-'}</p>
            </div>
          </section>

          <section className="rounded-3xl border border-[#d5e1ee] bg-white p-6 shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
            <h2 className="text-lg font-semibold">Funnel</h2>
            <div className="mt-4 grid gap-3 text-sm text-[#17314d]">
              <p><strong>Source page:</strong> {lead.sourcePage || lead.sourcePath || '-'}</p>
              <p><strong>CTA source:</strong> {lead.ctaSource || '-'}</p>
              <p><strong>Score:</strong> {lead.score ?? 0}</p>
              <p><strong>Service interest:</strong> {lead.serviceInterest || '-'}</p>
            </div>
            <form action={updateLeadStatusAction} className="mt-4 flex flex-wrap items-center gap-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <input type="hidden" name="path" value={`/admin/leads/${lead.id}`} />
              <select name="status" defaultValue={lead.status || 'in_progress'} className="rounded-xl border border-[#d6e1ee] px-3 py-2 text-sm">
                {['in_progress','partial','completed','unqualified','qualified','booked','attended','no_show','proposal_needed','proposal_sent','closed_won','closed_lost'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button type="submit" className="text-sm text-[#0b5da8] underline">Update status</button>
            </form>
          </section>

          <section className="rounded-3xl border border-[#d5e1ee] bg-white p-6 shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
            <h2 className="text-lg font-semibold">Internal notes</h2>
            <form action={createLeadNoteAction} className="mt-4 space-y-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <select name="type" className="rounded-xl border border-[#d6e1ee] px-3 py-2 text-sm">
                <option value="general">general</option>
                <option value="call_note">call_note</option>
                <option value="follow_up">follow_up</option>
                <option value="proposal">proposal</option>
                <option value="decision">decision</option>
              </select>
              <textarea name="body" rows="4" className="block w-full rounded-2xl border border-[#d6e1ee] px-4 py-3 text-sm" placeholder="Add an internal note" />
              <button type="submit" className="text-sm text-[#0b5da8] underline">Save note</button>
            </form>
            <div className="mt-4 space-y-3 text-sm text-[#17314d]">
              {(lead.leadNotes || []).map((note) => (
                <div key={note.id} className="rounded-2xl border border-[#e8eef5] bg-[#f8fbff] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#617894]">{note.type || 'general'}</p>
                  <p className="mt-2 whitespace-pre-wrap">{note.body}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-[#d5e1ee] bg-white p-6 shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
            <h2 className="text-lg font-semibold">Answers</h2>
            <div className="mt-4 space-y-3 text-sm text-[#17314d]">
              {(lead.responses || []).map((response) => (
                <div key={response.id} className="rounded-2xl border border-[#e8eef5] bg-[#f8fbff] px-4 py-3">
                  <p className="font-medium">{response.questionTitle || response.question?.title || response.questionKey}</p>
                  <p className="mt-1 whitespace-pre-wrap text-[#516b89]">
                    {Array.isArray(response.answer) ? response.answer.join(', ') : String(response.answer || '-')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#d5e1ee] bg-white p-6 shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
            <h2 className="text-lg font-semibold">Meeting</h2>
            <div className="mt-4 grid gap-3 text-sm text-[#17314d]">
              <p><strong>Date:</strong> {meeting?.start ? new Date(meeting.start).toLocaleString('en-GB') : '-'}</p>
              <p><strong>Status:</strong> {meeting?.status || '-'}</p>
              <p><strong>Google Event ID:</strong> {meeting?.googleEventId || '-'}</p>
              <p><strong>Meet Link:</strong> {meeting?.meetLink ? <a className="text-[#0b5da8] underline" href={meeting.meetLink} target="_blank" rel="noreferrer">Open Meet</a> : '-'}</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
