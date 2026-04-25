'use server';

import { revalidatePath } from 'next/cache';
import { requestJson } from '@/lib/strapi/client';

const assertAdminEnabled = () => {
  if (process.env.ENABLE_INTERNAL_ADMIN !== 'true') {
    throw new Error('Admin dashboard is disabled.');
  }
};

export async function updateLeadStatusAction(formData) {
  assertAdminEnabled();
  const leadId = Number(formData.get('leadId'));
  const status = String(formData.get('status') || '').trim();
  const path = String(formData.get('path') || '/admin/leads');

  if (!leadId || !status) {
    return;
  }

  await requestJson(`/api/leads/${leadId}`, {
    method: 'PUT',
    body: {
      data: { status },
    },
  });

  revalidatePath('/admin/leads');
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(path);
}

export async function createLeadNoteAction(formData) {
  assertAdminEnabled();
  const leadId = Number(formData.get('leadId'));
  const body = String(formData.get('body') || '').trim();
  const type = String(formData.get('type') || 'general').trim();

  if (!leadId || !body) {
    return;
  }

  await requestJson('/api/lead-notes', {
    method: 'POST',
    body: {
      data: {
        lead: leadId,
        body,
        type,
        createdByName: 'Internal admin',
      },
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateMeetingStatusAction(formData) {
  assertAdminEnabled();
  const meetingId = Number(formData.get('meetingId'));
  const status = String(formData.get('status') || '').trim();
  const path = String(formData.get('path') || '/admin/meetings');

  if (!meetingId || !status) {
    return;
  }

  await requestJson(`/api/meetings/${meetingId}`, {
    method: 'PUT',
    body: {
      data: { status },
    },
  });

  revalidatePath('/admin/meetings');
  revalidatePath(path);
}
