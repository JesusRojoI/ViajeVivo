import { NextResponse } from 'next/server';
import { translate } from '@/lib/translate';

/**
 * Compatibilidad con llamadas antiguas al endpoint de traducción.
 * Las traducciones salen de los diccionarios JSON (i18n), sin servicios externos.
 */
export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();
    return NextResponse.json({ translated: translate(String(text ?? ''), targetLang) });
  } catch {
    return NextResponse.json({ translated: '' }, { status: 400 });
  }
}
