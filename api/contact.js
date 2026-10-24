// In-memory rate limiting (max 5 requests per 10 minutes per IP)
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = ipRateMap.get(ip) || [];
  const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (valid.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRateMap.set(ip, valid);
    return true;
  }
  valid.push(now);
  ipRateMap.set(ip, valid);
  return false;
}

/**
 * Vercel Serverless Function — POST /api/contact
 * Envia mensagens do portfólio para Discord Webhook e/ou Resend Email API.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Origin verification (CSRF mitigation)
  const origin = req.headers.origin || req.headers.referer || '';
  if (origin) {
    const isAllowed =
      origin.includes('michael.dev.br') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('vercel.app');
    if (!isAllowed) {
      return res.status(403).json({ ok: false, error: 'Forbidden origin' });
    }
  }

  // Rate limiting by client IP
  const clientIp =
    String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown')
      .split(',')[0]
      .trim();

  if (isRateLimited(clientIp)) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({ ok: false, error: 'Muitas tentativas. Aguarde alguns minutos.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const name = String(body.name || '').trim().slice(0, 120);
    const contact = String(body.contact || '').trim().slice(0, 160);
    const topic = String(body.topic || 'Projeto Web / Full Stack').trim().slice(0, 80);
    const message = String(body.message || '').trim().slice(0, 3000);
    const honeypot = String(body.website || '').trim();

    // Anti-bot honeypot
    if (honeypot) {
      return res.status(200).json({ ok: true });
    }

    if (!name || !contact || !message) {
      return res.status(400).json({ ok: false, error: 'Campos obrigatórios ausentes.' });
    }

    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.CONTACT_EMAIL || 'contato@michael.dev.br';

    if (!discordWebhook && !resendKey) {
      return res.status(503).json({ ok: false, reason: 'unconfigured' });
    }

    const tasks = [];

    // 1. Discord Webhook (Rich Embed Roxo)
    if (discordWebhook) {
      tasks.push(
        fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'michael.dev.br · Portfólio 3D',
            allowed_mentions: { parse: [] },
            embeds: [
              {
                title: `✦ Nova mensagem — ${topic}`,
                color: 0xa855f7,
                fields: [
                  { name: '👤 Nome', value: name, inline: true },
                  { name: '📬 Contato', value: contact, inline: true },
                  { name: '🏷️ Categoria', value: topic, inline: true },
                  { name: '💬 Mensagem', value: message },
                ],
                footer: { text: 'Enviado via michael.dev.br' },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        }),
      );
    }

    // 2. Resend Email API (opcional)
    if (resendKey) {
      tasks.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfólio Michael Silva <onboarding@resend.dev>',
            to: [notifyEmail],
            subject: `[michael.dev.br] ${topic} — ${name}`,
            html: `
              <div style="font-family:sans-serif;background:#07040f;color:#f4effe;padding:28px;border-radius:16px;border:1px solid #4c1d95">
                <h2 style="color:#c4b5fd;margin:0 0 16px">✦ Nova mensagem no portfólio</h2>
                <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
                <p><strong>Contato:</strong> ${escapeHtml(contact)}</p>
                <p><strong>Assunto:</strong> ${escapeHtml(topic)}</p>
                <hr style="border:0;border-top:1px solid #2e1065;margin:16px 0"/>
                <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>
              </div>
            `,
          }),
        }),
      );
    }

    const results = await Promise.allSettled(tasks);
    const anySuccess = results.some((r) => r.status === 'fulfilled' && r.value.ok);

    if (!anySuccess) {
      return res.status(502).json({ ok: false, error: 'Falha ao entregar notificação.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Erro interno.' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
