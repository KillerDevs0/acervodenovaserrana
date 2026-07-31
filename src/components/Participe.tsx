import { useState } from 'react'
import { CONTATO } from '../data'
import FormularioMemoria from './FormularioMemoria'

export default function Participe() {
  const [formularioAberto, setFormularioAberto] = useState(false)

  return (
    <section id="participe" className="py-28 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-6">Faça Parte</p>
        <h2
          className="font-serif font-bold leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
        >
          Você tem uma história para compartilhar?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
          O acervo é construído colaborativamente. Se você, sua família ou comunidade possui fotos,
          vídeos, cartas ou relatos sobre a história de Nova Serrana, entre em contato com a
          Secretaria de Cultura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Abre o formulário; o envio vai para a fila de curadoria, não ao acervo. */}
          <button
            type="button"
            onClick={() => setFormularioAberto(true)}
            className="bg-accent text-accent-foreground px-10 py-4 font-semibold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
          >
            Enviar Memória
          </button>
          {/*
            "Falar com a Secretaria" é contato direto, sem passar por curadoria:
            um `mailto` com assunto pronto resolve e não depende do banco.
          */}
          <a
            href={`mailto:${CONTATO.email}?subject=${encodeURIComponent('Acervo Cultural — contato')}`}
            className="inline-flex items-center justify-center border border-foreground/25 text-foreground px-10 py-4 font-semibold uppercase tracking-widest text-xs hover:border-foreground/50 transition-colors"
          >
            Falar com a Secretaria
          </a>
        </div>
      </div>

      {formularioAberto && <FormularioMemoria aoFechar={() => setFormularioAberto(false)} />}
    </section>
  )
}
