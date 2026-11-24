# ViajeVivo - Plataforma Transaccional

## Rutas del Proyecto
| Ruta | Descripción |
|------|-------------|
| / | Home |
| /experiencias | Catálogo de experiencias (JSON) |
| /experiencias/[id] | Detalle de experiencia |
| /carrito | Carrito de compras (localStorage) |
| /checkout | Proceso de pago con Octano |
| /cotizar | Formulario de cotización |
| /pago-folio | Pago de folio existente |
| /aviso-de-privacidad | Aviso de privacidad |
| /terminos-y-condiciones | Términos y condiciones |
| /politica-de-cancelacion | Política de reembolsos |

## Notas
- Catálogo local: `src/data/catalog.json` (sin base de datos).
- i18n: `src/i18n/*.json` (sin DeepL).
- Pagos: plugin Octano (`src/lib/octano.ts`).
- Correos: Resend + `EMAIL_FROM` / `ADMIN_EMAIL`.
