# Regression Watch: Editor TipTap & Preview Realista Multicanal

> Identificador: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W005 | `requirements.md#RF-02` | `PlatformPreview` deve renderizar mockups fiéis para as 4 redes suportadas | Presença | Ausência ou falha na renderização de preview de rede ativa |
| W006 | `requirements.md#RF-04` | Bloqueio de agendamento caso caracteres excedam limite da rede ativa | Presença | Permissão de envio de post que viole os limites de caracteres |

---

## 2. Observações

- **RF-01**: Toolbar de formatação (Bold, Italic, Listas, Emojis) implementada e validada.
- **RF-02**: Componente `PlatformPreview` renderiza mockups com avatares, textos formatados e botões nativos de engajamento.
- **RF-03**: Galeria de mídias anexadas permite visualizar carrosséis e imagens vinculadas ao post.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
