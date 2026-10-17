# Regression Watch — Feature 035: Evergreen Content Recycler & Smart Auto-Requeue

Pontos de vigilância de regressão para monitorar durante a evolução do motor de reciclagem de conteúdos perenes.

---

### W074: Republicação Acidental de Posts Sazonais ou Datados
- **Cenário de Risco**: Um post contendo referências a eventos passados ("Black Friday 2023", "amanhã", "nesta sexta") receber pontuação alta de perenidade e ser republicado fora de época.
- **Mecanismo de Proteção**:
  - `calculateEvergreenScore` aplica penalidade automática de `-30` pontos ao detectar expressões temporais efêmeras ou anos passados.
- **Verificação**:
  - Teste unitário em `evergreen.test.ts` garante que textos com termos efêmeros recebem score reduzido (`< 50`).

---

### W075: Saturação de Audiência por Cooldown Curto ou Repetição de Gancho
- **Cenário de Risco**: O mesmo post ser republicado em dias consecutivos ou com exatamente o mesmo texto de abertura.
- **Mecanismo de Proteção**:
  - `computeNextRecycleSlot` força `cooldownDays >= 7` dias.
  - `pickNextVariationForCycle` alterna deterministicamente entre os 3 ângulos (`contrarian`, `checklist`, `story_hook`) via `recycleCount % variations.length`.
- **Verificação**:
  - Testes unitários de elegibilidade e round-robin em `evergreen.test.ts`.
