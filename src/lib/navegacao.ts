import type { AbaAcervo } from '../data'

/**
 * Navegação por hash entre as seções do site.
 *
 * O menu do topo e o rodapé apontavam para `href="#"`, que não leva a lugar
 * algum. Em vez de rolagem programática, cada destino virou um `id` de seção e
 * um link de verdade: o navegador cuida da rolagem (o CSS já tem
 * `scroll-behavior: smooth`), o endereço fica compartilhável e o link continua
 * funcionando com o meio do mouse ou "abrir em nova aba".
 *
 * As três abas do Acervo não são seções próprias — `#historias` leva à seção do
 * acervo e pede que ela troque de aba. Como o estado da aba vive dentro de
 * `Acervo`, a comunicação é pelo próprio hash: o Nav navega, o Acervo escuta.
 */

export const ABAS_ACERVO: AbaAcervo[] = ['documentarios', 'historias', 'fotografias']

/** `id` da seção do acervo — onde as abas moram. */
export const ID_ACERVO = 'acervo'

export function ehAbaAcervo(valor: string): valor is AbaAcervo {
  return (ABAS_ACERVO as string[]).includes(valor)
}

/** Hash atual sem `#`, ou string vazia. */
export function hashAtual(): string {
  return typeof window === 'undefined' ? '' : decodeURIComponent(window.location.hash.replace(/^#/, ''))
}

/**
 * Rola até uma seção compensando o cabeçalho fixo.
 *
 * O Nav é `fixed` com 4rem de altura, então o alvo padrão do navegador fica
 * escondido atrás dele. Usamos `scroll-margin-top` no CSS para as seções; esta
 * função existe para os casos em que o hash já é o atual e o navegador não
 * dispara rolagem nenhuma (clicar duas vezes no mesmo item do menu).
 */
export function rolarPara(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
