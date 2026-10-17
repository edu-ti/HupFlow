# Interfaces de API — Feature 050: Produção & Healthcheck

## 1. `GET /api/health`
- **Público / Monitoramento de Cargas / K8s Liveness & Readiness**: Não requer autenticação para permitir checagem por Load Balancers (AWS ALB, Cloudflare, Traefik, Docker Healthcheck).
- **Resposta Sucesso (HTTP 200)**:
  ```json
  {
    "status": "healthy",
    "version": "1.0.0-cleanroom",
    "milestone": "50-features-complete",
    "uptimeSeconds": 1420,
    "timestamp": "2026-10-17T16:55:00Z",
    "services": {
      "database": { "status": "up", "latencyMs": 4 },
      "cache": { "status": "up", "latencyMs": 1 },
      "storage": { "status": "up", "provider": "cloudflare_r2_or_minio" }
    },
    "featuresCount": 50,
    "environment": "production"
  }
  ```

## 2. `GET /api/system/status`
- **Permissão**: `admin+`
- **Retorno**: Detalhamento com uso de memória RAM (Heap, RSS), lista das 50 features ativas e checklist de conformidade Clean-Room.
