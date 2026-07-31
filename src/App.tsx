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
import Contribuicoes from './admin/paginas/Contribuicoes'

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
              {/*
                Fila de curadoria, não coleção do acervo — daí a rota própria
                em vez de entrar em `:colecao`. O React Router já prefere o
                segmento estático ao dinâmico; a ordem aqui é só legibilidade.
              */}
              <Route path="contribuicoes" element={<Contribuicoes />} />
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
