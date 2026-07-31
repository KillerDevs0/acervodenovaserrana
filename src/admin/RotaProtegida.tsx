import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './auth'

export default function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado, verificando } = useAuth()
  const local = useLocation()

  // Sem esperar a verificação, um recarregamento com sessão válida jogaria o
  // editor para o login antes de a sessão ser restaurada.
  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Verificando sessão…</p>
      </div>
    )
  }

  if (!autenticado) {
    return <Navigate to="/admin/entrar" state={{ de: local.pathname }} replace />
  }
  return <>{children}</>
}
