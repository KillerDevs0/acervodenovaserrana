import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase compartilhado.
 *
 * As duas variáveis vêm de `.env.local` (veja `.env.example`). A anon key é
 * pública por natureza — quem proteje o banco são as policies de RLS definidas
 * em `supabase/migrations/0001_estrutura_inicial.sql`, não o segredo da chave.
 */

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Falso quando o `.env.local` não foi configurado — a app cai no modo local. */
export const supabaseConfigurado = Boolean(url && anonKey)

if (!supabaseConfigurado) {
  console.warn(
    'Supabase não configurado: copie .env.example para .env.local e preencha as chaves. ' +
      'Enquanto isso, o conteúdo do acervo é lido e salvo apenas neste navegador.',
  )
}

export const supabase = supabaseConfigurado
  ? createClient(url as string, anonKey as string)
  : null
