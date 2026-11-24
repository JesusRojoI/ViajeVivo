import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { translate } from '@/lib/translate';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'ViajeVivo <hello@viajevivo.com.mx>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@viajevivo.com.mx';

const BRAND = '#0B6E4F';
const LIME = '#B7F34C';
const INK = '#0B1F2A';

function headerHtml(subtitle?: string) {
  return `
    <div style="background-color:${INK};padding:38px 30px;text-align:center;border-bottom:5px solid ${LIME};">
      <h1 style="color:#ffffff;margin:0;font-size:30px;font-weight:900;letter-spacing:-1px;">Viaje<span style="color:${LIME};">Vivo</span></h1>
      ${subtitle ? `<p style="color:${LIME};font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin:9px 0 0;">${subtitle}</p>` : `<p style="color:${LIME};font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin:9px 0 0;">viajevivo.com.mx</p>`}
    </div>`;
}

function shell(inner: string, subtitle?: string) {
  return `<div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;color:${INK};max-width:600px;margin:auto;border:2px solid #e6ebe6;border-radius:16px;overflow:hidden;">${headerHtml(subtitle)}<div style="padding:38px 30px;background:#ffffff;">${inner}</div></div>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerName, email, phone, message, destination, locale, budget, startDate, travelers } = body;

    if (type !== 'CONTACT' && type !== 'QUOTE') {
      return NextResponse.json({ error: 'Tipo de correo no soportado' }, { status: 400 });
    }

    const tr = (text: string) => translate(text, locale);
    const greeting = `${tr('¡Hola')} ${customerName}!`;

    let subjectClient = '';
    let htmlClient = '';
    let subjectInternal = '';
    let htmlInternal = '';

    if (type === 'CONTACT') {
      subjectClient = tr('[ViajeVivo] Hemos recibido tu mensaje');
      subjectInternal = `[NUEVO MENSAJE DE CONTACTO] - ${customerName}`;

      const bodyText = tr('Hemos recibido tu mensaje con éxito. Nuestro equipo de expertos lo está analizando y nos pondremos en contacto contigo a la brevedad para ayudarte en tu próxima aventura.');
      const msgLabel = tr('Registro de tu mensaje');
      const noMsgText = tr('Sin mensaje adicional.');
      const btnText = tr('Explorar Rutas');
      const url = `https://viajevivo.com.mx/${locale || 'es'}/#experiencias`;

      htmlClient = shell(`
        <h2 style="color:${INK};margin-top:0;font-size:24px;font-weight:800;">${greeting}</h2>
        <p style="font-size:16px;line-height:1.6;color:#556;">${bodyText}</p>
        <div style="margin:30px 0;padding:24px;border-radius:12px;border:2px solid #e6ebe6;background:#f6faf6;border-left:4px solid ${LIME};">
          <p style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#889;margin:0 0 14px;">${msgLabel}</p>
          <p style="font-size:14px;font-style:italic;color:#445;margin:0;line-height:1.6;">"${message || noMsgText}"</p>
        </div>
        <div style="text-align:center;margin-top:38px;">
          <a href="${url}" style="display:inline-block;background-color:${BRAND};color:#ffffff;padding:15px 30px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">${btnText}</a>
        </div>`);

      htmlInternal = `
        <div style="font-family:Arial,sans-serif;color:#333;">
          <h2 style="color:${BRAND};">Nuevo Mensaje Web (ViajeVivo)</h2>
          <hr/>
          <p><strong>Nombre:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Mensaje:</strong></p>
          <p style="background:#f6faf6;padding:15px;border-radius:8px;border:1px solid #e6ebe6;">${message || 'Sin mensaje'}</p>
        </div>`;
    } else {
      subjectClient = `${tr('[ViajeVivo] Estamos diseñando tu ruta a')} ${destination}`;
      subjectInternal = `[NUEVA COTIZACIÓN] - ${destination} - ${customerName}`;

      const bodyText = tr('Hemos recibido tus coordenadas para <strong>{destination}</strong>. Nuestro equipo ya está orquestando tu itinerario a la medida y nos pondremos en contacto contigo muy pronto con una propuesta increíble.').replace('{destination}', destination);
      const conciergeTitle = tr('Servicio Concierge');
      const reqLabel = tr('Detalles de tu solicitud');
      const destLabel = tr('Destino:');
      const dateLabel = tr('Fecha de inicio:');
      const paxLabel = tr('Viajeros:');
      const budgetLabel = tr('Presupuesto estimado:');
      const specialReqLabel = tr('Requerimientos Especiales');

      htmlClient = shell(`
        <h2 style="color:${INK};margin-top:0;font-size:24px;font-weight:800;">${greeting}</h2>
        <p style="font-size:16px;line-height:1.6;color:#556;">${bodyText}</p>
        <div style="margin:30px 0;padding:24px;border-radius:12px;border:2px solid #e6ebe6;background:#f6faf6;border-left:4px solid ${LIME};">
          <p style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#889;margin:0 0 20px;">${reqLabel}</p>
          <div style="margin-bottom:12px;"><span style="font-size:13px;color:#888;font-weight:600;">${destLabel}</span><br/><span style="font-size:16px;color:${INK};font-weight:800;">${destination}</span></div>
          <div style="margin-bottom:12px;"><span style="font-size:13px;color:#888;font-weight:600;">${dateLabel}</span><br/><span style="font-size:16px;color:${INK};font-weight:800;">${startDate}</span></div>
          <div style="margin-bottom:12px;"><span style="font-size:13px;color:#888;font-weight:600;">${paxLabel}</span><br/><span style="font-size:16px;color:${INK};font-weight:800;">${travelers}</span></div>
          <div><span style="font-size:13px;color:#888;font-weight:600;">${budgetLabel}</span><br/><span style="font-size:16px;color:${BRAND};font-weight:800;">${budget || '—'}</span></div>
        </div>
        ${message ? `<div style="background:#f6faf6;padding:20px;border-radius:10px;border-left:4px solid ${LIME};margin-bottom:28px;">
          <p style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#889;margin:0 0 10px;">${specialReqLabel}</p>
          <p style="margin:0;font-size:14px;font-style:italic;color:#445;line-height:1.6;">"${message}"</p>
        </div>` : ''}`, conciergeTitle);

      htmlInternal = `
        <div style="font-family:Arial,sans-serif;color:#333;">
          <h2 style="color:${BRAND};">Nueva Cotización (ViajeVivo)</h2>
          <hr/>
          <p><strong>Cliente:</strong> ${customerName}</p>
          <p><strong>Destino:</strong> ${destination}</p>
          <p><strong>Fecha:</strong> ${startDate}</p>
          <p><strong>Viajeros:</strong> ${travelers}</p>
          <p><strong>Presupuesto:</strong> ${budget || '—'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          <hr/>
          <p><strong>Requerimientos Especiales:</strong></p>
          <p style="background:#f6faf6;padding:15px;border-radius:8px;border:1px solid #e6ebe6;">${message || 'Sin requerimientos'}</p>
        </div>`;
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: subjectClient,
      html: htmlClient,
    });

    if (error) {
      console.error('Error de Resend al enviar al cliente:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const internalMail = await resend.emails.send({
      from: EMAIL_FROM,
      to: [ADMIN_EMAIL],
      subject: subjectInternal,
      html: htmlInternal,
    });

    if (internalMail.error) {
      console.error('Error al enviar correo interno:', internalMail.error);
    }

    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    console.error('Error crítico en API Send:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error interno' }, { status: 500 });
  }
}
