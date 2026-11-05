# API — Plataforma de Gerenciamento de Projetos

## Visão Geral

API REST desenvolvida utilizando FastAPI para uma plataforma de
gerenciamento de projetos.

### Tecnologias

- FastAPI
- SQLAlchemy
- PostgreSQL
- Docker
- Supabase
- React & Next.js (frontend)

### Base URL

Desenvolvimento:

http://localhost:8000

---

# Autenticação

A API utiliza tokens JWT para autenticação.
Os endpoints de cadastro e login são públicos.

## Cadastrar usuário

`POST /auth/register`

Content-Type: application/json

### Request

```json
{
  "name": "João",
  "email": "joao@example.com",
  "password": "Senha123!"
}
```

### Response — 200 OK

```json
{
  "Message": "Registration successful!"
}
```

O cadastro também gera um JWT, enviado no cookie `access_token`.

## Fazer login

`POST /auth/login`

Content-Type: application/json

### Request

```json
{
  "email": "joao@example.com",
  "password": "Senha123!"
}
```

### Response — 200 OK

```json
{
  "Message": "Login successful!"
}
```

O JWT é enviado no cookie `access_token`, não no corpo da resposta.
Sua validade é definida pela variável `AT_TIMEOUT`, em minutos.

## Acessar rotas protegidas

A validação exige o JWT no cabeçalho:

```http
Authorization: Bearer <access_token>
```

## Validação da senha

Cadastro e login exigem pelo menos oito caracteres, incluindo
uma letra, um número e um símbolo entre `@$!%*#?&`.
Apenas letras sem acento, números e esses símbolos são aceitos.

---

# Users

O cadastro é realizado por `POST /auth/register`, descrito em Autenticação.

## Consultar meu perfil

GET /me/

Retorna o perfil do usuário identificado pelo token. Não recebe `user_id`.

### Response — 200 OK

{
  "id": "uuid",
  "name": "João",
  "email": "joao@email.com"
}

---

# Workspaces

## Criar workspace

POST /workspaces/

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

GET /workspaces/

O usuário é identificado pelo token. Não recebe `user_id`.

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

## Criar convite

GET /workspaces/{workspace_id}/create-invite

Cria um convite para o workspace informado na URL. Exige autenticação
e a verificação de permissão de administrador do workspace.
Não recebe corpo de requisição.

## Aceitar convite

GET /workspaces/invite/{invite_token}

Aceita o convite para o usuário autenticado. O `invite_token` é informado
na URL. Não recebe corpo de requisição.

Os métodos `GET` acima correspondem à implementação atual.

---

# Projects

## Criar projeto

POST /workspaces/{workspace_id}/project/

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

POST /projects/{project_id}/lists/

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

POST /tasks/{task_id}/user/{user_id}

Os identificadores da tarefa e do usuário são informados na URL.
Não recebe corpo de requisição.

### Response — 201 Created

{
  "id": "uuid",
  "task_id": "uuid",
  "user_id": "uuid"
}

---

# Tags

## Criar tag

POST /projects/{project_id}/tags

A tag é criada no projeto informado na URL.

### Request

{
  "id": "uuid-da-tag",
  "name": "Backend",
  "color": "#FF5733"
}

---

## Adicionar tag à tarefa

POST /tasks/{task_id}/tags/{tag_id}

Os identificadores da tarefa e da tag são informados na URL.
Não recebe corpo de requisição.

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
