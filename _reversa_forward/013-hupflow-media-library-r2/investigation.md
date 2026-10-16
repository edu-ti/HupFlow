# Investigação Técnica: Upload Direto Cloudflare R2 / S3 via Presigned URLs

> Feature: `013-hupflow-media-library-r2`  
> Data: `2026-10-15`  

---

## 1. Por que Upload Direto no Storage vs Proxy no Servidor?

Muitos sistemas SaaS iniciam implementando rotas de API como `POST /api/upload` que recebem `multipart/form-data` no servidor Next.js. Em produção, isso gera graves gargalos:
1. **Timeouts em Funções Serverless / Edge:** Provedores como Vercel têm limites estritos de payload (geralmente 4.5 MB) e timeouts de 10 a 60 segundos. O envio de um vídeo de 50MB ou um PDF de 20MB estoura esse limite imediatamente.
2. **Duplo Tráfego de Banda:** O binário viaja do navegador para o servidor do Next.js e depois do servidor para o bucket, duplicando a latência e o consumo de dados.
3. **Consumo de Memória RAM:** Buffers de arquivos no Node.js sobrecarregam a instância e limitam o número de uploads concorrentes.

## 2. A Solução Clean-Room do HupFlow

Implementamos o padrão ouro da indústria: **Presigned PUT URLs**.
```
[ Navegador ] ──( 1. POST /api/media/presign )──► [ HupFlow Next.js Backend ]
              ◄──( 2. Retorna Presigned PUT URL )───
              
[ Navegador ] ──( 3. PUT direto do binário )──────► [ Cloudflare R2 / AWS S3 ]
              
[ Navegador ] ──( 4. POST /api/media/confirm )──► [ HupFlow Next.js Backend ]
                                                 ( Registra na tabela `media` )
```

## 3. Compatibilidade S3 API (AWS SDK Client S3)
O Cloudflare R2 implementa a API padrão do S3. Utilizando `@aws-sdk/client-s3` e `@aws-sdk/s3-request-presigner` (ambos sob licença **Apache-2.0** totalmente permissiva):
- Geração de comando `PutObjectCommand` assinado.
- Validação de `ContentType` assinado, garantindo que o cliente não consiga enviar binários executáveis com uma URL pré-assinada de imagem.
- Chave de isolamento: `organizations/${orgId}/${year}/${month}/${uuid}-${sanitizedName}`.
- Modo Fallback para Desenvolvimento Local / Offline com simulação de upload imediato quando credenciais de produção não estiverem configuradas.
