# 🚀 Roadmap — AI Multi-Agent Orchestrator

## 📌 Contexto

Projeto focado na construção de um sistema de **orquestração de múltiplos agentes com IA**, utilizando LangGraph.

O sistema evoluiu de um workflow orchestrator para um:

> 🧠 **AI Operating System pessoal**, capaz de rotear intenções para agentes especializados.

**Disponibilidade:** ~5h/semana
**Status atual:** MVP técnico funcional (engine + agentes + fallback)

---

# 🎯 Objetivo do MVP (Atualizado)

Construir um sistema capaz de:

* Receber input do usuário (CLI → futuramente UI)
* Rotear a intenção para o agente correto
* Executar agentes especializados
* Utilizar IA com fallback entre modelos
* Manter estado básico por agente
* Permitir evolução para interface web

---

# 🧩 Estrutura do Projeto

## Componentes principais

* Engine de execução (LangGraph)
* Sistema de agentes (modular)
* Router (orquestrador de agentes)
* Nodes (IA + HTTP + lógica)
* Camada de LLM com fallback
* Persistência (em evolução)
* Interface (CLI → Web futuramente)

---

# 🤖 Arquitetura (Nova)

```text
User Input
   ↓
Router Agent
   ↓
Seleciona:
   - Investment Agent
   - Career Agent
   - General Agent (fallback)
   ↓
Execução via LangGraph
   ↓
Resposta
```

---

# 🗓️ Planejamento por Sprints

## 🟢 Sprint 1 (Semana 1–2)

**Objetivo: Setup + Base do Projeto**

* [x] Definir stack (Node.js + LangGraph)
* [x] Setup do projeto
* [x] Estrutura de pastas
* [x] Hello World com LangGraph
* [x] Definir modelo de estado inicial

**Entrega:** Projeto rodando com grafo simples

---

## 🟢 Sprint 2 (Semana 3–4)

**Objetivo: Engine básica de execução**

* [x] Criar executor de workflow
* [x] Implementar nodes:

  * [x] Node de IA
  * [x] Node HTTP
* [x] Criar fluxo fixo

**Entrega:** Execução ponta a ponta

---

## 🟡 Sprint 3 (Semana 5–6)

**Objetivo: Estrutura dinâmica**

* [ ] Definir formato JSON de workflow
* [ ] Parser → LangGraph
* [ ] Validação

**Entrega:** Workflows dinâmicos

---

## 🟡 Sprint 4 (Semana 7–8)

**Objetivo: Persistência e estado**

* [ ] Persistência (SQLite ou DynamoDB)
* [ ] Controle de execução
* [ ] Logs estruturados

**Entrega:** Execuções rastreáveis

---

## 🔵 Sprint 5 (Semana 9–10)

**Objetivo: IA avançada + robustez**

* [x] Integração com múltiplos modelos
* [x] Fallback entre providers
* [x] Tratamento de erro (rate limit, retry)
* [ ] Melhorar prompts
* [ ] Adicionar contexto/memória

**Entrega:** Sistema resiliente com IA

---

## 🔴 Sprint 6 (Semana 11–12)

**Objetivo: Multi-agent system (NOVO FOCO)**

* [ ] Criar Router Agent
* [ ] Implementar routing (inicialmente rule-based)
* [ ] Criar agentes especializados:

  * [ ] Investment Agent
  * [ ] Career Agent
  * [ ] General Agent (fallback)
* [ ] Definir contratos entre agentes

**Entrega:** Sistema multi-agente funcional

---

## 🟣 Sprint 7 (Semana 13–14)

**Objetivo: Memória e contexto**

* [ ] Persistência de dados do usuário:

  * [ ] Portfolio de investimentos
  * [ ] Perfil profissional (currículo)
* [ ] Leitura desses dados nos agentes
* [ ] Atualização controlada via IA

**Entrega:** Agentes com memória real

---

## 🟠 Sprint 8 (Semana 15–16)

**Objetivo: Interface (Frontend MVP)**

* [ ] Criar API (Express/Fastify)
* [ ] Criar frontend simples (chat)
* [ ] Conectar UI → Router → Agents
* [ ] Exibir respostas

**Entrega:** Sistema utilizável via UI

---

# 📍 Status Atual do Projeto

✔️ Engine de execução funcionando
✔️ Agents funcionando
✔️ Integração com LLM funcionando
✔️ Fallback entre modelos implementado
✔️ Execução ponta a ponta validada

---

# ⚠️ Riscos (Atualizados)

* Crescimento descontrolado do escopo
* Complexidade do LangGraph
* Routing incorreto entre agentes
* Falta de consistência na memória
* Dependência de modelos free (rate limits)

---

# ✅ Critérios de sucesso do MVP (Atualizado)

* Roteamento correto entre agentes
* Pelo menos 2 agentes funcionais
* Uso real de contexto (portfolio/currículo)
* Fallback de modelos funcionando
* Interface mínima utilizável

---

# 🚀 Próximos passos (pós-MVP)

* Router com LLM (não só rule-based)
* UI mais avançada (multi-agent view)
* Observabilidade (logs, tracing)
* Sistema de plugins de agentes
* Deploy (AWS / container)
