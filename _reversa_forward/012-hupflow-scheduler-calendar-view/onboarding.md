# Guia de Onboarding & Verificação Manual: Calendário Semanal

> Feature: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  

---

## 1. Objetivo do Teste

Validar a alternância entre a visão de Lista e a visão de Calendário Semanal no Dashboard, navegar entre semanas, verificar a distribuição dos cards de postagens por dia e testar a reprogramação de horário via modal.

---

## 2. Passo a Passo

1. **Acessar o Dashboard:**
   - Navegue até `http://localhost:3000/dashboard`.
   - Observe a nova opção no topo do painel: **"Lista de Fila"** e **"Calendário Semanal"**.

2. **Alternar para a Visão de Calendário:**
   - Clique em **"Calendário Semanal"**.
   - Observe a grade de 7 colunas (Segunda a Domingo) com o dia atual destacado.
   - Verifique os cards posicionados nos dias corretos com horário e ícones das redes.

3. **Navegar Entre Semanas:**
   - Clique nas setas `<` e `>` para avançar para a próxima semana ou voltar para a anterior.
   - Clique no botão **"Hoje"** para retornar instantaneamente à semana corrente.

4. **Reprogramar um Post Agendado:**
   - Clique no botão de editar (ou no card) de um post agendado.
   - No modal, selecione um novo dia ou horário (ex: altere das 09:30 para as 16:00).
   - Clique em **"Salvar Novo Horário"**.
   - Observe o card se mover para a nova posição no calendário com o horário atualizado.
