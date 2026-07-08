export interface Profile {
  id: string;          // slug corto, ej. "leo", "pablo" — usado para el selector
  ownerEmail: string;   // email de GitHub del dueño — controla quién puede editar
  name: string;
  alias: string;
  bio: string;
  avatar: string;
  website: string;
  email: string;        // email de contacto público
  github: string;
  instagram: string;
  createdAt: string;
  location: string;
  provider: string;  // "github" | "google" | "email"
}