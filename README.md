# ViajeVivo

Réplica de la plataforma de viajes **Tripnova**, adaptada a la marca **ViajeVivo** (`viajevivo.com.mx`).

## Arranque

```bash
npm run dev      # http://localhost:4022
npm run build
npm start        # http://localhost:4022
```

## Cambios principales respecto a Tripnova

- **Sin Supabase**: el catálogo (7 categorías y 41 experiencias con precios) vive en `src/data/catalog.json` y se consume desde `src/lib/catalog.ts`.
- **Sin DeepL**: las traducciones es/en están en archivos JSON (`src/i18n/*.json`) y se cargan con i18next/react-i18next. Los textos legales también están en `legal-es.json` / `legal-en.json`.
- **Sin Etomin**: el pago se procesa con el plugin de **Octano** (`src/lib/octano.ts`) y se muestra la imagen `public/octano.png`.
- **Correo**: Resend con `EMAIL_FROM` y aviso automático a `ADMIN_EMAIL` en cada envío.
- **Identidad nueva**: logo vectorial en `public/logo-viajevivo.svg`, paleta «Selva Cítrica» (esmeralda, lima, tinta azul-verde sobre crema) y diseño editorial de líneas finas, esquinas rectas y tipografías Fraunces + Plus Jakarta Sans.

## Imágenes

Todas las fotos se sirven desde `public/images/` (ya no hay hotlinks externos). Son fotografías de **Pexels** bajo la [Pexels License](https://www.pexels.com/license/): uso comercial gratuito, sin atribución obligatoria. El detalle foto por foto está en `IMAGE_CREDITS.md`. El logo y `octano.png` se conservan sin cambios.

## Dependencias y seguridad

- Todas las dependencias directas están en sus últimas versiones: Next 16.4.6, React 19.3.1, Tailwind CSS 4.3.5, ESLint 10.15.0, Biome 2.6.9, TypeScript 6.0.3, etc.
- `npm audit` reporta **0 vulnerabilidades** (`npm audit fix` resolvió el último aviso de `brace-expansion`).
- Se eliminaron dependencias que no se usaban (axios, Embla, dropdown-menu, react-grab, i18next-resources-to-backend, tailwindcss-animate).
- **Excepción:** TypeScript se fija en `6.0.3` (la última versión 6) porque `typescript-eslint` aún no soporta TS 7. El resto de paquetes sí están en su versión más reciente.
- El lint usa una configuración plana propia con ESLint 10 + `typescript-eslint` + `eslint-plugin-react-hooks`. Se eliminó `eslint-config-next`: sus plugins (`import`, `jsx-a11y`, `react`) solo declaran soporte hasta ESLint 9 y provocaban conflictos de peer en `npm install`. Ahora `npm install` termina sin advertencias.
- Next 16 usa `src/proxy.ts` (antes `middleware.ts`) y Tailwind 4 configura el tema desde `globals.css` con `@theme inline`.

## Variables de entorno (6)

Copiar `.env.example` a `.env`:

```env
OCTANO_BASE_URL=https://pagos.octanopayments.com/api/v1
OCTANO_EMAIL=proyectos.octanopayments@tekcomit.net
OCTANO_PASSWORD=<TU_PASSWORD_OCTANO>
RESEND_API_KEY=<TU_API_KEY_RESEND>
EMAIL_FROM=ViajeVivo <hello@viajevivo.com.mx>
ADMIN_EMAIL=hello@viajevivo.com.mx
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/es`, `/en` | Inicio |
| `/[locale]/experiencias` | Catálogo filtrable |
| `/[locale]/experiencias/[id]` | Detalle y reserva |
| `/[locale]/carrito` | Carrito (localStorage `ViajeVivo-cart`) |
| `/[locale]/checkout` | Pago con Octano |
| `/[locale]/cotizar` | Solicitud de cotización |
| `/[locale]/pago-folio` | Pago de folio existente |
| `/[locale]/aviso-de-privacidad`, `/terminos-y-condiciones`, `/politica-de-cancelacion` | Textos legales |
