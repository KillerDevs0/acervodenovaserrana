/**
 * Aviso no lugar de uma seção do acervo que não tem o que exibir.
 *
 * As seções públicas liam o conteúdo e mapeavam direto sobre a lista, então
 * qualquer falha de leitura virava uma grade vazia — sem carregando, sem erro,
 * indistinguível de um acervo que ainda não foi preenchido. Para o visitante
 * isso parece um site quebrado; para quem mantém o acervo, esconde o problema.
 *
 * A mensagem de erro do Postgres não vai para a tela: não ajuda o visitante e
 * expõe nome de coluna. Fica no console, para quem estiver depurando.
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface Props {
  carregando: boolean
  erro: string | null
  /** Quantos registros a seção recebeu. Zero sem erro é acervo vazio. */
  total: number
  /** Como chamar o que falta, no plural: "documentários", "marcos". */
  rotulo: string
  children: ReactNode
}

export default function EstadoConteudo({ carregando, erro, total, rotulo, children }: Props) {
  // Num efeito, e não no corpo do render: o mapa re-renderiza a cada hover, e
  // logar ali repetiria a mesma linha dezenas de vezes.
  useEffect(() => {
    if (erro) console.error(`Falha ao carregar ${rotulo} do acervo:`, erro)
  }, [erro, rotulo])

  if (!carregando && !erro && total > 0) return <>{children}</>

  const mensagem = carregando
    ? 'Carregando o acervo…'
    : erro
      ? `Não foi possível carregar ${rotulo} agora. Tente recarregar a página em alguns instantes.`
      : `Ainda não há ${rotulo} publicados no acervo.`

  return (
    <div
      className="border border-border border-dashed p-14 text-center"
      role={erro ? 'alert' : undefined}
      aria-busy={carregando || undefined}
    >
      <p className="text-sm text-muted-foreground">{mensagem}</p>
    </div>
  )
}
