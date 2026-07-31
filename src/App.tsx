import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Site from './Site'
import { ProvedorConteudo } from './store/content'
import { ProvedorAuth } from './admin/auth'
import RotaProtegida from './admin/RotaProtegida'
import LayoutAdmin from './admin/LayoutAdmin'
import Entrar from './admin/paginas/Entrar'
import VisaoGeral from './admin/paginas/VisaoGeral'
import Listagem from './admin/paginas/Listagem'
import Editor from './admin/paginas/Editor'

export default function App() {
  return (
    <ProvedorConteudo>
      <ProvedorAuth>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Site />} />
            <Route path="/admin/entrar" element={<Entrar />} />
            <Route
              path="/admin"
              element={
                <RotaProtegida>
                  <LayoutAdmin />
                </RotaProtegida>
              }
            >
              <Route index element={<VisaoGeral />} />
              <Route path=":colecao" element={<Listagem />} />
              <Route path=":colecao/:id" element={<Editor />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProvedorAuth>
    </ProvedorConteudo>
  )
}
