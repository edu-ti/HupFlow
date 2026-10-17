# Investigação Técnica: Encurtador de Links & Rastreamento UTM por Canal

> Identificador: `027-hupflow-custom-shortlinks-utm`  
> Data: `2026-10-16`  

---

## 1. Arquitetura de Redirecionamento & Desempenho

1. **Redirecionamento HTTP 302 vs 301**:
   - Para links com telemetria de cliques em tempo real, deve ser utilizado o status **HTTP 302 (Found)** ou **HTTP 307 (Temporary Redirect)**.
   - O uso de HTTP 301 (Permanent) faz com que navegadores façam cache agressivo no cliente, impedindo que cliques subsequentes do mesmo dispositivo cheguem ao servidor e sejam contabilizados.
2. **Geração de Slugs Seguros em Base62**:
   - Um alfabeto de 62 caracteres (`[a-zA-Z0-9]`) com 6 posições oferece $62^6 \approx 56.8$ bilhões de combinações possíveis.
   - Isso elimina qualquer risco de esgotamento e garante que os slugs sejam extremamente curtos, ideais para o limite de caracteres do X/Twitter.
3. **Injeção Transparente de Parâmetros UTM**:
   - O algoritmo deve validar se a URL original já possui query parameters (ex: `?ref=banner`) e anexar as tags UTM respeitando o delimitador `&` ou `?`, sem corromper âncoras `#` de fragmento de URL.
4. **Isolamento Multitenant na Gestão**:
   - Slugs personalizados (ex: `blackfriday`) são indexados no banco; a resolução de redirecionamento é pública pelo slug, mas a edição e telemetria são restritas à organização proprietária do link.
