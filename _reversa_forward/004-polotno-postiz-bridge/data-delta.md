# Delta de Modelo de Dados: Ponte Polotno ➔ Postiz

> Feature: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  

## 1. Alterações no Banco de Dados

- **Prisma Schema**: Nenhuma alteração. Os arquivos transferidos são persistidos na tabela `Media` do Postiz utilizando os campos existentes (`id`, `name`, `path`, `organizationId`).
- **Migrações**: Nenhuma migração de banco necessária.

## 2. Contrato de Carga Útil MCP (JSON)

- Objeto de entrada da ferramenta `export_to_postiz`:
  - `designId`: string (obrigatório)
  - `format`: enum ('png', 'jpeg', 'pdf')
  - `token`: string (obrigatório)
  - `apiUrl`: string (opcional)
  - `pageId`: string (opcional)
  - `fileName`: string (opcional)
- Objeto de saída:
  - `success`: boolean
  - `uploaded`: array com `{ pageIndex: number, media: object }`
  - `total`: number
