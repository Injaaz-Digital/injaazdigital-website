'use strict';

const path = require('node:path');
const { writeFile } = require('node:fs/promises');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

const argument = (name) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

async function run() {
  const output = path.resolve(argument('--output') || path.join(process.cwd(), '.tmp', 'booking-legacy-export.json'));
  const context = await compileStrapi();
  const strapi = await createStrapi(context).load();
  try {
    const [steppers, leads, meetings, calendarSetting] = await Promise.all([
      strapi.db.query('plugin::booking.stepper').findMany({ populate: { questions: true }, orderBy: { id: 'asc' } }),
      strapi.db.query('api::lead.lead').findMany({ populate: { sessions: true }, orderBy: { id: 'asc' } }),
      strapi.db.query('api::meeting.meeting').findMany({ populate: { lead: true }, orderBy: { id: 'asc' } }),
      strapi.db.query('api::calendar-setting.calendar-setting').findOne({}),
    ]);

    const snapshot = {
      schemaVersion: 1,
      source: 'injaaz-cal-strapi-v5',
      exportedAt: new Date().toISOString(),
      steppers,
      leads,
      meetings,
      calendarSetting: calendarSetting || null,
    };
    await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`, { mode: 0o600 });
    console.log(JSON.stringify({ event: 'booking-legacy-exported', output, steppers: steppers.length, leads: leads.length, meetings: meetings.length }));
  } finally {
    await strapi.destroy();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
