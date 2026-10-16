# Regression Watch: Conectores Oficiais da Meta (Instagram & Threads)

> Identificador: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W003 | `requirements.md#RN-02` | Tokens de acesso da Meta devem ser criptografados com AES-256-GCM | Presença | Armazenamento de tokens em texto puro |
| W004 | `requirements.md#RF-03` | `getSocialConnector` deve resolver `instagram` e `threads` sem erro | Presença | Exceção de conector não encontrado |

---

## 2. Observações

- **RF-01**: Conector Instagram com suporte a container de mídia implementado e testado.
- **RF-02**: Conector Threads com limite de 500 caracteres implementado e testado.
- **RF-04**: Isolamento de falhas por canal no Worker BullMQ verificado.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
