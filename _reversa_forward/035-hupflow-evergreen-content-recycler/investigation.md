# Investigação Técnica: Evergreen Content Recycler & Smart Auto-Requeue

## 1. Pontuação Heurística de Conteúdo Perene (`calculateEvergreenScore`)
Para distinguir um post perene (Evergreen) de uma notícia passageira:
- **Base de Engajamento**: Pontuação proporcional ao `engagementRate` histórico (ex: 5% de engajamento contribui positivamente).
- **Bônus Estrutural**: Textos com listas numeradas, passos ou formato `carousel` recebem bônus de longevidade (+15 pts).
- **Penalidade Temporal (Anti-Datado)**: Expressões efêmeras como `ontem`, `amanhã`, `nesta sexta-feira`, `feliz natal`, `black friday` reduzem a nota (-25 pts), alertando o editor antes de colocar o post em piloto automático.

## 2. Prevenção de Fadiga Algorítmica (Cooldown + Rotação de Variações)
- Cada item possui `cooldownDays` (ex: 30 dias) e um array `variations` com 3 ângulos editoriais (`contrarian`, `checklist`, `story_hook`).
- A cada ciclo `recycleCount`, a variação selecionada para publicação alterna em round-robin (`variations[recycleCount % variations.length]`), garantindo que o texto nunca seja idêntico ao ciclo anterior.
