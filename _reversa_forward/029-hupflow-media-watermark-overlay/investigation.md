# Investigação Técnica: Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador da Feature: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  

---

## 1. Desafios Arquiteturais

1. **Posicionamento Responsivo e Não-destrutivo**:
   - Mídias de redes sociais variam de aspecto quadrado (1:1, 1080x1080 no Feed), retrato (4:5, 1080x1350 no Instagram), vertical (9:16, 1080x1920 em Stories/Reels) a paisagem (16:9, 1200x675 no LinkedIn/X).
   - O cálculo das coordenadas `(x, y)` precisa ser independente da resolução absoluta, operando de forma proporcional com margens em pixels normalizados.

2. **Tipos de Marca d'Água**:
   - `logo`: Ícone ou marca gráfica com canal alfa (PNG/SVG).
   - `text`: Tipografia com o `@handle` da empresa (ex: `@hupflow`).
   - `combined`: Logotipo seguido pelo handle com espaçamento harmônico e contraste dinâmico.

3. **Integração com o Brand Kit Existente**:
   - O HupFlow já possui um subsistema de Brand Kits (`hupflow/src/lib/brand/`). Quando o usuário ainda não tiver customizado o selo de marca d'água, o sistema deve automaticamente buscar o `logoUrl` e o `handle` configurados no Brand Kit padrão do workspace como fallback inteligente.

4. **Multi-Tenancy**:
   - Tabela `watermark_settings` vinculada à `organization_id` com restrição de unicidade por organização (1 configuração ativa por workspace com suporte a sobrescrita).
