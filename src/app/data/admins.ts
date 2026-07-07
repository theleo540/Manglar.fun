import type { Admin, ServiceItem } from "@/types/admin";

/**
 * Datos de respaldo (fallback), usados solo si Supabase falla de verdad
 * (sin conexión, error de RLS, etc.). Vacíos a propósito — no se debe
 * mostrar información inventada como si fuera real. La fuente de verdad
 * es la tabla `admins`/`services` en Supabase; si falla, la UI debe verse
 * vacía (o con un estado de error), no con datos falsos.
 */
export const FALLBACK_ADMINS: Admin[] = [];

export const FALLBACK_SERVICES: ServiceItem[] = [];
