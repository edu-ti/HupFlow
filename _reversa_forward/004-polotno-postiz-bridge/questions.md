# Dúvidas e Premissas Assumidas: 004-polotno-postiz-bridge

## 1. Dúvidas Convertidas em Premissas

### D01: Endpoint e Comunicação de Rede
- **Dúvida**: Qual endereço e porta padrão utilizar para comunicação entre o Polotno Studio (Electron) e o Postiz Backend?
- **Premissa Assumida**: A ferramenta aceita o parâmetro opcional `apiUrl` (ex.: `http://localhost:3000`), com fallback para a variável de ambiente `process.env.POSTIZ_API_URL` ou `http://localhost:3000`, permitindo funcionamento tanto em desenvolvimento local quanto em ambientes de produção/Docker.
