import Link from 'next/link';
import { request } from '@/lib/strapi/client';
import { normalizeValue } from '@/lib/strapi/normalizers';
import { updateLeadStatusAction } from '@/features/book-call/server/admin-actions';

const LEAD_STATUSES = [
  'in_progress',
  'partial',
  'completed',
  'unqualified',
  'qualified',
  'booked',
  'attended',
  'no_show',
  'proposal_needed',
  'proposal_sent',
  'closed_won',
  'closed_lost',
];

const fetchLeads = async () => {
  const response = await request('/api/leads', {
    sort: ['createdAt:desc'],
    populate: {
      meetings: {
        fields: ['id', 'start', 'status', 'meetLink'],
      },
      responses: {
        fields: ['id', 'questionKey', 'questionTitle', 'answer'],
      },
    },
    pagination: {
      pageSize: 100,
    },
  });

  const entries = Array.isArray(response?.data) ? response.data : [];
  return entries.map((entry) => normalizeValue(entry));
};

export default async function AdminLeadsPage() {
  const leads = await fetchLeads();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">Internal Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Leads</h1>
        </div>
        <Link className="text-sm text-[#0b5da8] underline" href="/admin/meetings">View meetings</Link>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#d5e1ee] bg-white shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f5f9fd] text-[#4d6784]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Service Interest</th>
              <th className="px-4 py-3">Source Page</th>
              <th className="px-4 py-3">Meeting</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const bookedMeeting = Array.isArray(lead.meetings) ? lead.meetings[0] : null;
              return (
                <tr key={lead.id} className="border-t border-[#eef3f8] align-top text-[#17314d]">
                  <td className="px-4 py-4 font-medium">{lead.name || lead.fullName || 'Unnamed lead'}</td>
                  <td className="px-4 py-4">{lead.email || '-'}</td>
                  <td className="px-4 py-4">{lead.phone || '-'}</td>
                  <td className="px-4 py-4">
                    <form action={updateLeadStatusAction} className="space-y-2">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="path" value="/admin/leads" />
                      <select name="status" defaultValue={lead.status || 'in_progress'} className="rounded-xl border border-[#d6e1ee] px-3 py-2">
                        {LEAD_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button className="block text-xs text-[#0b5da8] underline" type="submit">Update</button>
                    </form>
                  </td>
                  <td className="px-4 py-4">{lead.score ?? 0}</td>
                  <td className="px-4 py-4">{lead.serviceInterest || '-'}</td>
                  <td className="px-4 py-4">{lead.sourcePage || lead.sourcePath || '-'}</td>
                  <td className="px-4 py-4">
                    {bookedMeeting?.start ? new Date(bookedMeeting.start).toLocaleString('en-GB') : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <Link className="block text-[#0b5da8] underline" href={`/admin/leads/${lead.id}`}>View details</Link>
                      {bookedMeeting?.meetLink ? (
                        <a className="block text-[#0b5da8] underline" href={bookedMeeting.meetLink} target="_blank" rel="noreferrer">Open Meet</a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
