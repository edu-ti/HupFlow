# Impacto no Legado — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## Avaliação de Risco e Convivência

1. **Código Legado**:
   - Zero impacto. O sistema legado Typebot/Evolution API não possui conceito de gerador de mockups de dispositivos nem renderização vetorial SVG de hardware.
   - Todo o código foi implementado de forma 100% isolada e Clean-Room dentro de `hupflow/src/lib/mockups/`, `hupflow/src/components/mockups/` e `hupflow/src/app/api/mockups/`.

2. **Banco de Dados**:
   - Apenas uma nova tabela (`device_mockups`) foi declarada no Drizzle ORM (`hupflow/src/lib/db/schema.ts`).
   - Nenhuma tabela preexistente foi alterada estruturalmente. Todas as queries respeitam a chave estrangeira de `organizations.id` com `onDelete: 'cascade'`.

3. **Performance e Memória**:
   - O gerador SVG produz vetores estritamente leves (< 15KB), sem carregamento de modelos 3D pesados (.GLB/.OBJ) que sobrecarregariam memória móvel ou GPU dos clientes.
