# Regression Watch: Biblioteca de Mídias & Upload Cloudflare R2 / S3

> Identificador: `013-hupflow-media-library-r2`  
> Data: `2026-10-15`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W009 | `requirements.md#RN-02` | Prefixos de objetos no bucket devem conter o ID da organização para isolamento multi-tenant | Presença | Chave de upload gerada sem `organizations/<orgId>/` |
| W010 | `requirements.md#RN-03` | Arquivos fora dos tipos MIME permitidos ou acima do limite de tamanho devem ser rejeitados | Presença | Presigned URL gerada para formatos proibidos (ex: `.exe`, `.sh`) ou arquivos acima de 25MB (imagem/PDF) / 100MB (vídeo) |

---

## 2. Observações

- **RF-01**: Validação de MIME types testada via suíte unitária `validation.test.ts`.
- **RF-02**: Sanitização de filename testada contra directory traversal (`../../etc/passwd` -> `etc_passwd`).
- **RF-03**: Geração de Presigned URL com fallback mock em ambiente sem chaves de storage.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
