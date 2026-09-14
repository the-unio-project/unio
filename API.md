# API — Plataforma de Gerenciamento de Projetos

## Visão Geral

API REST desenvolvida utilizando FastAPI para uma plataforma de
gerenciamento de projetos.

### Tecnologias

- FastAPI
- SQLAlchemy
- PostgreSQL
- Docker
- Zitadel
- React (frontend)

### Base URL

Desenvolvimento:

http://localhost:8000

---

# Autenticação

> A autenticação ainda será definida.

---

# Users

## Criar usuário

POST /users

### Request

{
  "name": "João",
  "email": "joao@email.com",
  "password": "senha"
}

### Response — 201 Created

{
  "id": "uuid",
  "name": "João",
  "email": "joao@email.com"
}

---

## Buscar usuário

GET /users/{user_id}

### Response — 200 OK

{
  "id": "uuid",
  "name": "João",
  "email": "joao@email.com"
}

---

# Workspaces

## Criar workspace

POST /workspaces

### Request

{
  "name": "Projeto IFCE",
  "owner_id": "uuid",
  "logo_url": null
}

### Response — 201 Created

{
  "id": "uuid",
  "name": "Projeto IFCE",
  "owner_id": "uuid",
  "logo_url": null,
  "created_at": "2026-09-10T17:00:00Z"
}

---

## Listar workspaces do usuário

GET /users/{user_id}/workspaces

### Response — 200 OK

[
  {
    "id": "uuid",
    "name": "Projeto IFCE",
    "role": "owner"
  }
]

---

# Workspace Members

## Adicionar membro

POST /workspaces/{workspace_id}/members

### Request

{
  "user_id": "uuid",
  "role": "member"
}

### Response — 201 Created

{
  "id": "uuid",
  "user_id": "uuid",
  "workspace_id": "uuid",
  "role": "member"
}

---

# Projects

## Criar projeto

POST /workspaces/{workspace_id}/projects

### Request

{
  "name": "Projeto Web",
  "description": "Plataforma de gerenciamento",
  "color": "#4287f5",
  "icon_url": null
}

### Response — 201 Created

{
  "id": "uuid",
  "workspace_id": "uuid",
  "name": "Projeto Web",
  "description": "Plataforma de gerenciamento",
  "color": "#4287f5",
  "icon_url": null,
  "created_at": "2026-09-10T17:00:00Z"
}

---

# Lists

## Criar lista

POST /projects/{project_id}/lists

### Request

{
  "name": "To Do"
}

### Response — 201 Created

{
  "id": "uuid",
  "project_id": "uuid",
  "name": "To Do"
}

---

# Tasks

## Criar tarefa

POST /lists/{list_id}/tasks

### Request

{
  "title": "Implementar autenticação",
  "description": "Implementar login da aplicação",
  "term": "2026-09-20T23:59:59Z",
  "priority": "high",
  "status": "pending"
}

### Response — 201 Created

{
  "id": "uuid",
  "list_id": "uuid",
  "title": "Implementar autenticação",
  "description": "Implementar login da aplicação",
  "term": "2026-09-20T23:59:59Z",
  "priority": "high",
  "status": "pending"
}

---

# Task Assignees

## Atribuir usuário a uma tarefa

POST /tasks/{task_id}/assignees

### Request

{
  "user_id": "uuid"
}

### Response — 201 Created

{
  "id": "uuid",
  "task_id": "uuid",
  "user_id": "uuid"
}

---

# Tags

## Criar tag

POST /tags

### Request

{
  "id": "uuid-da-tag",
  "name": "Backend",
  "color": "#FF5733"
}

---

## Adicionar tag à tarefa

POST /tasks/{task_id}/tags

### Request

{
  "tag_id": "uuid"
}

---

## Remover tag de uma tarefa

DELETE /tasks/{task_id}/tags/{tag_id}

# Enums

## TaskPriority

| Valor | Descrição |
|---|---|
| `low` | Prioridade baixa |
| `medium` | Prioridade média |
| `high` | Prioridade alta |
| `urgent` | Prioridade urgente |

## TaskStatus

| Valor | Descrição |
|---|---|
| `pending` | Tarefa pendente |
| `done` | Tarefa concluída |

---

# Status HTTP

| Código | Significado |
|---|---|
| 200 | Requisição realizada com sucesso |
| 201 | Recurso criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Recurso não encontrado |
| 409 | Conflito |
| 422 | Dados enviados inválidos |
| 500 | Erro interno |
