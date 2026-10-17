# Impacto no Legado — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## Avaliação de Risco e Convivência

1. **Código Legado**:
   - Zero impacto. O sistema legado Typebot/Evolution API é estritamente voltado a WhatsApp e não possui qualquer integração com TikTok Content Posting API ou YouTube Data API v3.
   - Todo o código foi implementado de forma 100% isolada e Clean-Room dentro de `hupflow/src/lib/vertical/`, `hupflow/src/components/vertical/` e `hupflow/src/app/api/vertical/`.

2. **Banco de Dados**:
   - Apenas uma nova tabela (`vertical_video_posts`) foi declarada no Drizzle ORM (`hupflow/src/lib/db/schema.ts`).
   - Nenhuma tabela preexistente foi alterada estruturalmente. Todas as queries respeitam a chave estrangeira de `organizations.id` com `onDelete: 'cascade'`.

3. **Performance e Memória**:
   - O validador de aspect ratio e duração roda no cliente e no endpoint `/api/vertical/validate`, evitando sobrecarga nos workers assíncronos (`BullMQ`) por rejeição precoce de mídias fora do padrão 9:16.
