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
3. Copiar `.env.example` a `.env.local` y completar las variables.
4. Instalar dependencias y ejecutar el entorno local.

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el navegador ni la subas al repositorio.

## Estado
Fundación técnica y modelo de acceso documentados. La interfaz, las rutas protegidas, la carga de comprobantes y el panel administrativo se implementan en las siguientes etapas.
