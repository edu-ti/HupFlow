# Guia de Onboarding & Verificação Manual: Conectores Meta

> Feature: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  

---

## 1. Objetivo do Teste

Validar a presença dos conectores de Instagram e Threads no HupFlow, testar a seleção de canais no Compositor de Posts e confirmar a execução via worker do BullMQ com registro de status independente.

---

## 2. Passo a Passo

1. **Acessar Contas Conectadas:**
   - Acesse `http://localhost:3000/accounts`.
   - Verifique se os cards de integração de **Instagram** e **Threads** estão presentes e ativos na seção de redes disponíveis.

2. **Testar Seleção no Compositor:**
   - Acesse `http://localhost:3000/composer`.
   - Clique nos botões de seleção de rede para marcar **Instagram** e **Threads**.
   - Alterne para a aba do **Instagram** e verifique se o limite de 2.200 caracteres é exibido.
   - Alterne para a aba do **Threads** e verifique se o limite de 500 caracteres é exibido.

3. **Testar Agendamento Multicanal:**
   - Redija um texto de teste.
   - Clique em **"Agendar com BullMQ"**.
   - Verifique a mensagem de sucesso informando que o job de agendamento foi registrado com delayed job e idempotência.
