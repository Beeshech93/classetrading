# ClasseTrading

Plataforma privada de formación en trading.

## Modelo comercial
- Acceso: US$200 por 30 días.
- Pago único, sin renovación automática.
- El alumno registra un comprobante o referencia de pago.
- Un administrador verifica el pago y activa manualmente el acceso.
- La membresía vence automáticamente según `ends_at`; el alumno debe pagar nuevamente para renovar.

## Stack
- Next.js + TypeScript + Tailwind CSS
- Supabase Auth, PostgreSQL y Storage
- Vercel

## Estructura prevista
- `app/`: páginas y rutas de la aplicación.
- `components/`: componentes compartidos.
- `lib/supabase/`: clientes Supabase.
- `supabase/schema.sql`: tablas, políticas RLS y funciones.
- `docs/`: arquitectura y flujos operativos.

## Configuración
1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/schema.sql` en SQL Editor.
3. Ejecutar `supabase/admin-review.sql`, `supabase/admin-profiles-policy.sql`, `supabase/security-hardening.sql`, `supabase/storage.sql` y `supabase/payment-integrity-hardening.sql`.
4. Registrar tu cuenta desde `/register`; después ejecutar `supabase/bootstrap-admin.sql` en SQL Editor sustituyendo `YOUR_ADMIN_EMAIL@example.com` por tu correo.
5. Ejecutar `supabase/pocket-option-curriculum.sql` para cargar los cursos iniciales (revisar el contenido antes de publicarlo).
6. Copiar `.env.example` a `.env.local` y completar las variables.
7. Ejecutar `npm install` y `npm run dev`.

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el navegador ni la subas al repositorio.

## Estado
MVP en construcción: landing page, registro, login, recuperación de contraseña, dashboard de alumno, solicitud e historial de pagos con carga privada de comprobantes, catálogo y detalle de cursos protegidos, gestión administrativa de cursos/lecciones, calendario y gestión de clases Zoom, cola de revisión administrativa y workflow CI. Pendientes: traducciones completas, pruebas de integración en Supabase real, políticas finales de almacenamiento multimedia y despliegue.
