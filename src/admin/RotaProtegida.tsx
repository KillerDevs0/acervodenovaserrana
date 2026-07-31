import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './auth'

export default function RotaProtegida({ children }: { children: ReactNode }) {
  const { autenticado } = useAuth()
  const local = useLocation()

  if (!autenticado) {
    return <Navigate to="/admin/entrar" state={{ de: local.pathname }} replace />
  }
  return <>{children}</>
}
