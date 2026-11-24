import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CartItem } from '@/lib/types';
import { processOctanoPayment } from '@/lib/octano';
import { translate } from '@/lib/translate';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'ViajeVivo <hello@viajevivo.com.mx>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@viajevivo.com.mx';

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);

const BRAND = '#0B6E4F';
const LIME = '#B7F34C';
const INK = '#0B1F2A';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { locale, contactInfo, billingInfo, orderNotes, cart, cardInfo, formattedTotal, manualFolioData } = body;
    const tr = (text: string) => translate(text, locale);

    const tempReferenceId = `REF-${Date.now()}`;
    const finalAmountToCharge = manualFolioData ? manualFolioData.amount : cart.total;

    // 1. PROCESAR EL PAGO CON OCTANO
    const [expiryMonth, expiryYear] = String(cardInfo.expiry || '').split('/');
    const paymentResult = await processOctanoPayment({
      amount: Number(Number(finalAmountToCharge).toFixed(2)),
      currency: 'MXN',
      description: 'ViajeVivo booking',
      orderId: tempReferenceId,
      card: {
        number: cardInfo.number,
        name: cardInfo.name,
        month: expiryMonth,
        year: expiryYear,
        cvv: cardInfo.cvv,
      },
      customer: {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName || tr('Sin apellido'),
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: billingInfo.direccion || tr('Sin Especificar'),
        city: billingInfo.localidad || tr('Ciudad de México'),
        state: billingInfo.estado || 'CDMX',
        postalCode: billingInfo.codigo_postal || '00000',
        country: 'MX',
      },
      metadata: {
        ip: '127.0.0.1',
        notes: orderNotes || undefined,
      },
    });

    if (!paymentResult.success) {
      console.error('DETALLE DEL RECHAZO OCTANO:', paymentResult.error, paymentResult.details);
      throw new Error(paymentResult.details || `Pago declinado por Octano (${paymentResult.status})`);
    }

    // 2. CORREO AL CLIENTE (textos desde diccionarios i18n en JSON)
    const subjectClient = tr('Confirmación de Compra - ¡Gracias por viajar con ViajeVivo!');
    const greeting = `${tr('¡Hola')} ${contactInfo.firstName}!`;
    const confirmationText = tr('Tu reservación ha sido confirmada.');
    const totalLabel = tr('TOTAL PAGADO:');
    const quoteLabel = tr('Pago de Cotización');
    const folioLabel = 'Folio';
    const qtyLabel = tr('Cant.');
    const priceLabel = tr('Precio');
    const experienceLabel = tr('Experiencia');
    const detailsLabel = tr('Detalles de Contacto y Facturación');
    const phoneLabel = tr('Teléfono:');
    const addressLabel = tr('Dirección:');
    const notesLabel = tr('Notas:');

    const itemsHtml = !manualFolioData
      ? cart.items.map((item: CartItem) => `
          <tr style="border-bottom:1px solid #eef2ef;">
            <td style="padding:18px 0;">
              <p style="margin:0;font-weight:800;font-size:16px;color:${INK};">${translate(item.experience.title, locale)}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#667;">📅 ${item.date} <br>✨ ${translate(item.levelName, locale)}</p>
            </td>
            <td style="padding:18px 0;text-align:center;color:#444;">${item.people}</td>
            <td style="padding:18px 0;text-align:right;font-weight:800;color:${INK};">${formatPrice(item.totalPrice)}</td>
          </tr>`).join('')
      : `
          <tr style="border-bottom:1px solid #eef2ef;">
            <td style="padding:18px 0;">
              <p style="margin:0;font-weight:800;font-size:16px;color:${INK};">${quoteLabel}</p>
              <p style="margin:6px 0 0;font-size:13px;color:#667;">${folioLabel}: ${manualFolioData.folio}</p>
            </td>
            <td style="padding:18px 0;text-align:center;">1</td>
            <td style="padding:18px 0;text-align:right;font-weight:800;color:${INK};">${formatPrice(manualFolioData.amount)}</td>
          </tr>`;

    const htmlClient = `
      <div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;max-width:600px;margin:auto;color:${INK};border:2px solid #e6ebe6;border-radius:16px;overflow:hidden;">
        <div style="background-color:${INK};padding:38px 30px;text-align:center;border-bottom:5px solid ${LIME};">
          <h1 style="color:#ffffff;margin:0;font-size:30px;font-weight:900;letter-spacing:-1px;">Viaje<span style="color:${LIME};">Vivo</span></h1>
          <p style="color:${LIME};font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin:8px 0 0;">viajevivo.com.mx</p>
        </div>
        <div style="padding:38px 30px;background:#ffffff;">
          <h2 style="color:${INK};margin-top:0;font-size:24px;font-weight:800;">${greeting}</h2>
          <p style="font-size:16px;line-height:1.6;color:#556;">${confirmationText}</p>
          <table style="width:100%;border-collapse:collapse;margin:28px 0;">
            <thead>
              <tr style="border-bottom:2px solid #e9efea;text-align:left;">
                <th style="padding:12px 0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#889;">${experienceLabel}</th>
                <th style="padding:12px 0;font-size:11px;font-weight:800;text-transform:uppercase;color:#889;text-align:center;">${qtyLabel}</th>
                <th style="padding:12px 0;font-size:11px;font-weight:800;text-transform:uppercase;color:#889;text-align:right;">${priceLabel}</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="background:#f6faf6;border-radius:12px;padding:24px;text-align:right;border-left:4px solid ${LIME};">
            <span style="font-size:13px;font-weight:800;color:#667;letter-spacing:1px;">${totalLabel}</span>
            <span style="font-size:28px;font-weight:900;color:${BRAND};display:block;margin-top:5px;">${formattedTotal}</span>
          </div>
          <div style="padding:24px;border:2px solid #e6ebe6;border-radius:12px;margin-top:28px;">
            <h3 style="margin:0 0 18px;font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${INK};">${detailsLabel}</h3>
            <p style="margin:8px 0;font-size:14px;color:#444;"><strong>Email:</strong> ${contactInfo.email}</p>
            <p style="margin:8px 0;font-size:14px;color:#444;"><strong>${phoneLabel}</strong> ${contactInfo.phone}</p>
            <p style="margin:8px 0;font-size:14px;color:#444;"><strong>${addressLabel}</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}, ${billingInfo.pais}</p>
            ${orderNotes ? `<p style="margin:8px 0;font-size:14px;color:#444;border-top:1px dashed #ccc;padding-top:10px;"><strong>${notesLabel}</strong> ${orderNotes}</p>` : ''}
          </div>
        </div>
      </div>`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [contactInfo.email],
      subject: subjectClient,
      html: htmlClient,
    });

    // 3. NOTIFICACIÓN INTERNA (forward a ADMIN_EMAIL)
    const subjectInternal = `[NUEVA VENTA] - ${formattedTotal} - ${contactInfo.firstName} ${contactInfo.lastName || ''}`.trim();
    const htmlInternal = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="color:${BRAND};">¡Nueva Venta Registrada! (Vía Octano)</h2>
        <p>Pago procesado correctamente en ViajeVivo (viajevivo.com.mx).</p>
        <hr/>
        <p><strong>Monto Total:</strong> ${formattedTotal}</p>
        <p><strong>ID Transacción (Octano):</strong> ${paymentResult.transactionId || paymentResult.reference || tempReferenceId}</p>
        <p><strong>Autorización:</strong> ${paymentResult.authorizationNumber || 'N/A'}</p>
        <hr/>
        <h3>Datos del Cliente:</h3>
        <p><strong>Nombre:</strong> ${contactInfo.firstName} ${contactInfo.lastName || ''}</p>
        <p><strong>Email:</strong> ${contactInfo.email}</p>
        <p><strong>Teléfono:</strong> ${contactInfo.phone}</p>
        <p><strong>Dirección:</strong> ${billingInfo.direccion}, ${billingInfo.localidad}, ${billingInfo.estado}, ${billingInfo.codigo_postal}</p>
        <p><strong>Notas:</strong> ${orderNotes || 'Sin notas'}</p>
        <hr/>
        <h3>Detalle del Pedido:</h3>
        <ul>
          ${!manualFolioData
            ? cart.items.map((item: CartItem) => `<li>${item.experience.title} (x${item.people}) - ${formatPrice(item.totalPrice)}</li>`).join('')
            : `<li>Pago Manual de Folio: ${manualFolioData.folio}</li>`}
        </ul>
      </div>`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: [ADMIN_EMAIL],
      subject: subjectInternal,
      html: htmlInternal,
    });

    return NextResponse.json({
      success: true,
      status: paymentResult.status,
      transactionId: paymentResult.transactionId || paymentResult.reference || tempReferenceId,
    });
  } catch (error: unknown) {
    console.error('Error capturado en Backend:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}
