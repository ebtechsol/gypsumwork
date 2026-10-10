import { router, json, error, secrets, db } from '@appdeploy/sdk';
import { createHash } from 'node:crypto';

async function configuration() {
  try {
    const names = await secrets.listSecretNames();
    if (
      ![
        'ENQUIRY_WEBHOOK_URL',
        'ENQUIRY_WEBHOOK_TOKEN',
        'LAUNCH_APPROVED',
      ].every(n => names.includes(n))
    )
      return null;
    if ((await secrets.readSecret('LAUNCH_APPROVED')) !== 'true') return null;
    const url = await secrets.readSecret('ENQUIRY_WEBHOOK_URL');
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password)
      return null;
    return { url, token: await secrets.readSecret('ENQUIRY_WEBHOOK_TOKEN') };
  } catch {
    return null;
  }
}
export const handler = router({
  'GET /api/enquiry-status': [
    async () =>
      json({ configured: Boolean(await configuration()), uploads: false }),
  ],
  'POST /api/enquiries': [
    async ({ body, event }) => {
      if (
        !body ||
        typeof body !== 'object' ||
        Array.isArray(body) ||
        JSON.stringify(body).length > 15000
      )
        return error('Invalid enquiry.', 400);
      const raw = body as Record<string, unknown>;
      const limits: Record<string, number> = {
        name: 100,
        phone: 24,
        location: 120,
        service: 100,
        description: 4000,
        email: 254,
        property: 80,
        community: 120,
        area: 30,
        unit: 10,
        date: 20,
        website: 200,
      };
      const data: Record<string, string> = {};
      for (const key of Object.keys(limits)) {
        if (raw[key] !== undefined && typeof raw[key] !== 'string')
          return error('Invalid field format.', 400);
        data[key] = String(raw[key] || '').trim();
        if (data[key].length > limits[key])
          return error('A field exceeds the allowed length.', 400);
      }
      if (data.website) return error('Submission rejected.', 400);
      if (
        data.name.length < 2 ||
        !/^\+[0-9\s()-]{8,20}$/.test(data.phone) ||
        data.phone.replace(/\D/g, '').length < 8 ||
        !data.location ||
        !data.service ||
        data.description.length < 10
      )
        return error('Check required fields.', 400);
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        return error('Invalid email.', 400);
      if (
        data.area &&
        (!Number.isFinite(Number(data.area)) || Number(data.area) <= 0)
      )
        return error('Invalid area.', 400);
      if (!['m²', 'ft²'].includes(data.unit))
        return error('Invalid area unit.', 400);
      if (raw.files || raw.attachments)
        return error('Uploads are not enabled.', 400);
      const config = await configuration();
      if (!config)
        return error(
          'Enquiry delivery is not configured. Nothing has been sent.',
          503
        );
      const source = String(
        event?.requestContext?.http?.sourceIp ||
          event?.requestContext?.identity?.sourceIp ||
          'unknown'
      );
      const bucket = Math.floor(Date.now() / 3600000);
      const hash = createHash('sha256')
        .update(config.token + ':' + source + ':' + bucket)
        .digest('hex');
      const table = 'enquiry-rate-' + hash;
      const { items } = await db.list(table, { limit: 6 });
      if (items.length >= 5)
        return error('Submission limit reached. Please try again later.', 429);
      const [attempt] = await db.add(table, [{ at: Date.now() }]);
      if (!attempt)
        return error('Unable to process enquiry. Please retry later.', 503);
      try {
        delete data.website;
        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + config.token,
          },
          body: JSON.stringify({
            type: 'gypsum_project_enquiry',
            receivedAt: new Date().toISOString(),
            ...data,
          }),
          signal: AbortSignal.timeout(12000),
          redirect: 'error',
        });
        if (!response.ok)
          return error('Enquiry delivery failed. Please retry.', 502);
        const acknowledgement = await response.json();
        if (acknowledgement.accepted !== true)
          return error(
            'Delivery was not acknowledged. Please contact the company before retrying.',
            502
          );
        return json({ received: true });
      } catch {
        return error(
          'Delivery could not be confirmed. Please contact the company before retrying.',
          502
        );
      }
    },
  ],
});

