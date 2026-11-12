# Áudio implementado

`src/experience/audio/AudioManager.ts` sintetiza sons próprios provisórios por Web Audio. Não contém samples, música ou efeitos extraídos de terceiros. Não é uma trilha final aprovada.

AudioContext só é criado após escolha explícita no botão de som. Volume e escolha de ambiente podem ser lembrados, mas recarga não reinicia som automaticamente. UI permanece compreensível em silêncio; estado é exposto com `aria-pressed`, rótulo e feedback de indisponibilidade.

O ambiente combina osciladores suaves de 55/82,5/110 Hz e ruído filtrado criado em memória. `playCue('activate'|'navigate')` agenda envelopes no relógio do AudioContext. Mute aplica rampa no ganho mestre, cancela cues e suspende quando adequado. Ao ocultar a aba, suspende; retorno só retoma se o usuário já tiver habilitado som.

Geração de ambiente/fonte, cancelamento, release do último mount e promessas de resume concorrentes são tratados explicitamente. Um teste impede que um resume antigo reative som após mute.

**Verificado:** sete testes unitários de lifecycle e integração em navegador confirmando gesto, contexto running, fontes e ausência de autoplay após reload. Os unitários usam um contexto simulado; o teste Playwright usa a API real do Chromium. **Não verificado:** saída em alto-falantes, balanceamento artístico final, latência audiovisual física ou reprodução nos dispositivos do usuário.
