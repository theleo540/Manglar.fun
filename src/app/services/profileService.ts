import type { Profile } from "@/types/profile";
import { FALLBACK_PROFILES } from "@/data/profile";
import { supabase } from "@/lib/supabase";

function fromRow(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    ownerEmail: row.owner_email as string,
    name: (row.name as string) ?? "",
    alias: (row.alias as string) ?? "",
    bio: (row.bio as string) ?? "",
    avatar: (row.avatar as string) ?? "",
    website: (row.website as string) ?? "",
    email: (row.email as string) ?? "",
    github: (row.github as string) ?? "",
    instagram: (row.instagram as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
    location: (row.location as string) ?? "",
    provider: (row.provider as string) ?? "",
  };
}

function toRow(updates: Partial<Profile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (updates.name !== undefined) row.name = updates.name;
  if (updates.alias !== undefined) row.alias = updates.alias;
  if (updates.bio !== undefined) row.bio = updates.bio;
  if (updates.avatar !== undefined) row.avatar = updates.avatar;
  if (updates.website !== undefined) row.website = updates.website;
  if (updates.email !== undefined) row.email = updates.email;
  if (updates.github !== undefined) row.github = updates.github;
  if (updates.instagram !== undefined) row.instagram = updates.instagram;
  if (updates.location !== undefined) row.location = updates.location;
  return row;
}

export const profileService = {
  /** Trae todos los perfiles públicos desde Supabase. Si falla, usa el respaldo local. */
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase.from("profiles").select("*").order("id", { ascending: true });
    if (error || !data) {
      if (error) console.warn("[profileService] usando datos de respaldo:", error.message);
      return [...FALLBACK_PROFILES];
    }
    return data.map(fromRow);
  },

  /**
   * Trae el perfil de un usuario normal (no-admin) por su email, y si no
   * existe todavía lo crea con lo que ya sabemos de su login (nombre,
   * avatar). Así cualquiera que entre con GitHub/Google/correo tiene un
   * perfil editable desde el primer momento, sin que un admin lo dé de alta.
   */
  async getOrCreateProfile(ownerEmail: string, defaults: { name: string; avatar?: string; provider?: string }): Promise<Profile> {
    const { data, error } = await supabase.from("profiles").select("*").eq("owner_email", ownerEmail).maybeSingle();
    if (!error && data) return fromRow(data);

    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({
        owner_email: ownerEmail,
        name: defaults.name,
        avatar: defaults.avatar ?? "",
        email: ownerEmail,
        provider: defaults.provider ?? "email",
      })
      .select()
      .single();

    if (createError || !created) {
      // Sin Supabase configurado (o sin la tabla), devolvemos un perfil en
      // memoria para que la pantalla igual funcione; no se podrá guardar
      // hasta que la tabla `profiles` exista.
      if (createError) console.warn("[profileService] no se pudo crear el perfil:", createError.message);
      return {
        id: ownerEmail,
        ownerEmail,
        name: defaults.name,
        alias: "",
        bio: "",
        avatar: defaults.avatar ?? "",
        website: "",
        email: ownerEmail,
        github: "",
        instagram: "",
        createdAt: "",
        location: "",
        provider: defaults.provider ?? "email",
      };
    }
    return fromRow(created);
  },

  /**
   * Actualiza el perfil identificado por ownerEmail.
   * RLS en Supabase garantiza que solo el usuario autenticado con ese mismo
   * email pueda escribir en esa fila.
   */
  async updateProfile(ownerEmail: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase.from("profiles").update(toRow(updates)).eq("owner_email", ownerEmail).select().single();
    if (error || !data) throw new Error(error?.message ?? "No se pudo actualizar el perfil");
    return fromRow(data);
  },
};