import Link from 'next/link';
import { request } from '@/lib/strapi/client';
import { normalizeValue } from '@/lib/strapi/normalizers';
import { updateMeetingStatusAction } from '@/features/book-call/server/admin-actions';

const fetchMeetings = async () => {
  const response = await request('/api/meetings', {
    sort: ['start:asc'],
    populate: {
      lead: true,
    },
    pagination: {
      pageSize: 100,
    },
  });

  const entries = Array.isArray(response?.data) ? response.data : [];
  return entries.map((entry) => normalizeValue(entry));
};

export default async function AdminMeetingsPage() {
  const meetings = await fetchMeetings();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#617894]">Internal Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Meetings</h1>
        </div>
        <Link className="text-sm text-[#0b5da8] underline" href="/admin/leads">View leads</Link>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[#d5e1ee] bg-white shadow-[0_16px_48px_rgba(8,41,89,0.08)]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f5f9fd] text-[#4d6784]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Meet Link</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id} className="border-t border-[#eef3f8] align-top text-[#17314d]">
                <td className="px-4 py-4">{meeting.start ? new Date(meeting.start).toLocaleString('en-GB') : '-'}</td>
                <td className="px-4 py-4">
                  <Link className="text-[#0b5da8] underline" href={`/admin/leads/${meeting.lead?.id}`}>
                    {meeting.lead?.name || meeting.lead?.fullName || 'Lead'}
                  </Link>
                </td>
                <td className="px-4 py-4">{meeting.lead?.email || '-'}</td>
                <td className="px-4 py-4">{meeting.status}</td>
                <td className="px-4 py-4">
                  {meeting.meetLink ? <a className="text-[#0b5da8] underline" href={meeting.meetLink} target="_blank" rel="noreferrer">Open Meet</a> : '-'}
                </td>
                <td className="px-4 py-4">
                  <form action={updateMeetingStatusAction} className="space-y-2">
                    <input type="hidden" name="meetingId" value={meeting.id} />
                    <input type="hidden" name="path" value="/admin/meetings" />
                    <select name="status" defaultValue={meeting.status} className="rounded-xl border border-[#d6e1ee] px-3 py-2">
                      {['scheduled', 'done', 'canceled', 'no_show', 'rescheduled'].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button className="block text-xs text-[#0b5da8] underline" type="submit">Update</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
