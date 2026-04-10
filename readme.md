# 🚀 Roadmap — AI Workflow Orchestrator

## 📌 Contexto

Projeto focado em construção de um orquestrador de workflows com agentes utilizando LangGraph 


# 🎯 Objetivo do MVP

Construir um sistema capaz de:

* Receber um input (webhook ou manual)
* Executar um fluxo definido
* Utilizar IA em etapas do fluxo
* Chamar APIs externas
* Persistir estado básico

---

# 🧩 Estrutura do Projeto

## Componentes principais

* Engine de execução (LangGraph)
* Definição de estado
* Nodes (IA + HTTP + lógica)
* Persistência
* Interface simples (CLI ou JSON)

---

# 🗓️ Planejamento por Sprints

## 🟢 Sprint 1 (Semana 1–2)

**Objetivo: Setup + Base do Projeto**

* [x] Definir stack (Node.js + LangGraph)
* [x] Setup do projeto
* [x] Estrutura de pastas
* [x] Hello World com LangGraph
* [x] Definir modelo de estado inicial

**Entrega:** Projeto rodando com um grafo simples

---

## 🟢 Sprint 2 (Semana 3–4)

**Objetivo: Engine básica de execução**

* [x] Criar executor de workflow
* [x] Implementar 2 nodes:

  * [x] Node de IA
  * [x] Node HTTP
* [x] Criar fluxo fixo (hardcoded)

**Entrega:** Fluxo funcional ponta a ponta

---

## 🟡 Sprint 3 (Semana 5–6)

**Objetivo: Estrutura dinâmica de workflows**

* [ ] Definir formato JSON de workflow
* [ ] Parser → LangGraph
* [ ] Validação de estrutura

**Entrega:** Criar workflows via JSON

---

## 🟡 Sprint 4 (Semana 7–8)

**Objetivo: Persistência e estado**

* [ ] Persistir execução (DynamoDB ou SQLite)
* [ ] Controle de step atual
* [ ] Logs básicos

**Entrega:** Execuções rastreáveis

---

## 🔵 Sprint 5 (Semana 9–10)

**Objetivo: Integração com IA (nível avançado)**

* [ ] Melhorar prompts dos nodes
* [ ] Adicionar contexto/memória
* [ ] Tratamento de erro/retry

**Entrega:** Fluxos mais inteligentes e resilientes

---

## 🔴 Sprint 6 (Semana 11–12)

**Objetivo: Agente gerador de workflows**

* [ ] Criar planner com LLM
* [ ] Gerar workflow a partir de texto
* [ ] Validação manual (supervisor)

**Entrega:** Input → workflow automático

---

# 🧠 Papel do Desenvolvedor

* Definir arquitetura
* Validar decisões da LLM
* Revisar código gerado
* Garantir simplicidade (evitar overengineering)

---

# ⚠️ Riscos

* Complexidade excessiva (LangGraph)
* Loops infinitos
* Falta de controle de estado

---

# ✅ Critérios de sucesso do MVP

* Executa workflows reais
* Integra com pelo menos 1 API externa
* Usa IA de forma útil
* Possui logs e rastreabilidade

---

# 🚀 Próximos passos (pós-MVP)

* UI visual (drag-and-drop)
* Multi-tenant
* Biblioteca de templates
* Observabilidade avançada

---

# 💡 Observação final

Com 5h semanais, o foco deve ser:

* Simplicidade
* Iteração rápida
* Evitar perfeccionismo

O objetivo não é perfeição — é aprendizado + algo funcional.
