type LogLevel = 'info' | 'warn' | 'error';

const REDACTED_KEYS = /token|secret|password|cookie|email|phone|answer|meetingLink|meetLink|notes?/i;

const sanitize = (fields: Record<string, unknown>) => Object.fromEntries(
  Object.entries(fields).map(([key, value]) => [key, REDACTED_KEYS.test(key) ? '[REDACTED]' : value]),
);

const write = (level: LogLevel, message: string, fields: Record<string, unknown> = {}) => {
  const payload = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...sanitize(fields) });
  if (level === 'error') console.error(payload);
  else if (level === 'warn') console.warn(payload);
  else console.info(payload);
};

export const cmsLogger = {
  info: (message: string, fields?: Record<string, unknown>) => write('info', message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => write('warn', message, fields),
  error: (message: string, fields?: Record<string, unknown>) => write('error', message, fields),
};
