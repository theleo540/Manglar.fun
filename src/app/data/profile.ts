import type { Profile } from "@/types/profile";

/**
 * Datos de respaldo (fallback), usados solo si Supabase falla de verdad.
 * Vacíos a propósito — no se debe mostrar información inventada (nombres,
 * bios, emails) como si fuera real. La fuente de verdad es la tabla
 * `profiles` en Supabase.
 */
export const FALLBACK_PROFILES: Profile[] = [];
