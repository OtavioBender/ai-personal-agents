# 🤖 Agents Architecture Guide

## 🎯 Objetivo
Definir padrões para criação e manutenção de agentes no projeto.

---

## 🧠 Princípios

- Simplicidade acima de tudo
- Evitar overengineering
- Separação clara entre core e agentes
- Nodes pequenos e reutilizáveis

---

## 🧩 Estrutura de um agente

Cada agente deve seguir:

agents/<agent_name>/

- index.ts → entrypoint
- graph.ts → definição do fluxo (LangGraph)
- prompt.ts → prompts utilizados
- schema.ts → tipos de entrada/saída
- nodes/ → nodes específicos do agente

---

## ⚙️ Regras de implementação

- NÃO duplicar nodes genéricos (usar core/nodes)
- NÃO colocar lógica de negócio no core
- Graph deve ser simples e legível
- Evitar loops complexos no início

---

## 🤖 Uso de LLM

- LLM deve atuar dentro dos nodes
- NÃO deve controlar diretamente o fluxo do sistema
- Sempre validar saídas da LLM

---

## 🚨 Anti-patterns

- Nodes gigantes
- Agentes com múltiplas responsabilidades
- Misturar infra com lógica de negócio
- Fluxos dinâmicos sem validação

---

## 📈 Evolução futura

- Geração automática de workflows via LLM
- UI visual
- Observabilidade

---

## 🧾 Commit Convention

Todos os commits DEVEM seguir o padrão Conventional Commits:

<type>: <short description>

Tipos permitidos:
- feat
- fix
- refactor
- chore
- docs
- test

Regras:
- mensagem em inglês
- descrição clara e objetiva
- usar bullet points no corpo quando necessário
- evitar commits genéricos como "update" ou "fix bug"

Exemplo:

feat: add router agent for multi-agent orchestration

- implement rule-based routing
- integrate with existing agents
- add basic intent classification