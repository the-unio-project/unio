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
As rotas de perfil abaixo exigem `Authorization: Bearer <access_token>`.

## Consultar meu perfil

`GET /me/`

Retorna o usuário identificado pelo token. Não recebe parâmetros nem corpo.

### Response — 200 OK

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "João",
  "email": "joao@example.com",
  "created_at": "2026-09-10T17:00:00Z",
  "nickname": "João",
  "bio": "Desenvolvedor",
  "profile_picture": null
}
```

## Atualizar meu perfil

`PUT /me/`

Exige os três campos abaixo. O usuário é identificado pelo token.

| Campo | Local | Tipo | Obrigatório |
|---|---|---|---|
| `nickname` | Query string | string | Sim |
| `bio` | Query string | string | Sim |
| `profile_picture` | Corpo multipart/form-data | arquivo | Sim |

Exemplo de URL: `/me/?nickname=Joao&bio=Desenvolvedor`.
Envie o arquivo no campo `profile_picture` do formulário multipart.
`nickname` e `bio` não são campos do corpo na implementação atual.
O arquivo deve ter extensão `.jpg`, `.jpeg` ou `.png`, tamanho maior que zero
 e no máximo 102400 bytes (100 KiB).

### Response — 200 OK

```json
{
  "message": "Profile updated successfully"
}
```

---

# Workspaces

Todas as rotas de workspace, membros e convites abaixo exigem
`Authorization: Bearer <access_token>`. Os identificadores de caminho
(`workspace_id`, `target_user_id` e `invite_token`) devem ser UUIDs.
Os exemplos usam identificadores fictícios.

Os papéis são serializados como números:

| Valor | Papel |
|---|---|
| 0 | MEMBER — membro |
| 1 | ADMIN — administrador |
| 2 | OWNER — proprietário |

As permissões de administrador também são atendidas pelo proprietário.
As respostas de sucesso das rotas abaixo usam `200 OK`, inclusive criações
 e exclusões, conforme o código atual.

## Criar workspace

`POST /workspaces/`

Corpo JSON com `name` obrigatório. O proprietário é o usuário autenticado,
que também é adicionado como membro com papel OWNER. `owner_id` e `logo_url`
não fazem parte do corpo de criação.

### Request — application/json

```json
{
  "name": "Projeto IFCE"
}
```

### Response — 200 OK

```json
{
  "Message": "Successfully created workspace!",
  "Workspace": {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Projeto IFCE",
    "owner_id": "11111111-1111-4111-8111-111111111111",
    "logo_url": "/assets/workspace.svg",
    "created_at": "2026-09-10T17:00:00Z"
  }
}
```

## Listar meus workspaces

`GET /workspaces/`

Não recebe parâmetros nem corpo. Retorna os workspaces dos quais o usuário
 autenticado participa. O campo do papel é `current_user_role`.

### Response — 200 OK

```json
[
  {
    "id": "22222222-2222-4222-8222-222222222222",
    "name": "Projeto IFCE",
    "owner_id": "11111111-1111-4111-8111-111111111111",
    "logo_url": "/assets/workspace.svg",
    "created_at": "2026-09-10T17:00:00Z",
    "current_user_role": 2
  }
]
```

## Consultar workspace

`GET /workspaces/{workspace_id}`

Recebe somente o UUID do workspace na URL. A implementação exige autenticação,
mas não verifica se o solicitante é membro nessa rota.

### Response — 200 OK

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "name": "Projeto IFCE",
  "owner_id": "11111111-1111-4111-8111-111111111111",
  "logo_url": "/assets/workspace.svg",
  "created_at": "2026-09-10T17:00:00Z"
}
```

Workspace inexistente retorna `404` com `detail: "No workspace found"`.

## Buscar tarefas do workspace

`GET /workspaces/{workspace_id}/search`

Exige participação no workspace. Não recebe corpo.

| Parâmetro | Local | Tipo | Obrigatório |
|---|---|---|---|
| `workspace_id` | Caminho | UUID | Sim |
| `q` | Query string | string | Não na assinatura atual; envie um texto para pesquisar |

Exemplo: `/workspaces/22222222-2222-4222-8222-222222222222/search?q=Implementar`.
A busca compara a similaridade do texto com os títulos das tarefas dos projetos
 do workspace (limiar de 0,85), sem paginação.

### Response — 200 OK

Retorna um array de tarefas; sem correspondências, retorna `[]`.
Cada tarefa contém os campos persistidos `id`, `task_id` (tarefa pai), `list_id`,
`project_id`, `title`, `description`, `term`, `priority`, `status_id` e `position`.
A rota não declara um schema de resposta próprio.

**Limitação atual:** embora `q` seja opcional na assinatura, o serviço de busca
não trata explicitamente `None`. O comportamento sem `q` não está garantido.

## Atualizar logo do workspace

`PATCH /workspaces/{workspace_id}/logo`

Exige papel ADMIN ou OWNER. Informe `workspace_id` na URL e o arquivo obrigatório
`logo` no corpo `multipart/form-data`.
São aceitas extensões `.jpg`, `.jpeg` e `.png`, com tamanho maior que zero
 e no máximo 102400 bytes (100 KiB).

### Response — 200 OK

```json
{
  "logo_url": "https://example.com/storage/workspaces/logo.png"
}
```

A URL acima é ilustrativa; a API retorna a URL pública gerada pelo armazenamento.
Os erros de validação do arquivo são os mesmos descritos na atualização do perfil.

## Excluir workspace

`DELETE /workspaces/{workspace_id}`

Exige papel OWNER. Não recebe corpo.

### Response — 200 OK

```json
{
  "message": "Workspace Projeto IFCE deletado com sucesso!",
  "id": "22222222-2222-4222-8222-222222222222"
}
```

---

# Workspace Members

## Criar convite

`GET /workspaces/{workspace_id}/create-invite`

Exige papel ADMIN ou OWNER. Não recebe corpo. Cria um convite para o workspace.
O campo `id` retornado é o `invite_token` usado para aceitar o convite.

### Response — 200 OK

```json
{
  "id": "33333333-3333-4333-8333-333333333333",
  "workspace_id": "22222222-2222-4222-8222-222222222222"
}
```

## Aceitar convite

`GET /workspaces/invite/{invite_token}`

Não recebe corpo. Adiciona o usuário autenticado como MEMBER no workspace do
convite. Não há expiração ou consumo do convite implementados nesse fluxo.
Os métodos `GET` de criação e aceite refletem a implementação atual.

### Response — 200 OK

```json
{
  "id": "44444444-4444-4444-8444-444444444444",
  "workspace_id": "22222222-2222-4222-8222-222222222222",
  "user_id": "55555555-5555-4555-8555-555555555555",
  "role": 0
}
```

Convite inexistente retorna `404` com `detail: "invalid invite"`.
Usuário que já participa retorna `409` com
`detail: "User already belongs to this workspace"`.

## Listar membros

`POST /workspaces/{workspace_id}/member/list`

Exige participação no workspace. Não recebe corpo, apesar do método `POST`.
Retorna os dados de perfil de cada usuário acrescidos de `role`.

### Response — 200 OK

```json
[
  {
    "id": "11111111-1111-4111-8111-111111111111",
    "name": "João",
    "email": "joao@example.com",
    "created_at": "2026-09-10T17:00:00Z",
    "nickname": "João",
    "bio": "Desenvolvedor",
    "profile_picture": null,
    "role": 2
  }
]
```

## Remover membro

`DELETE /workspaces/{workspace_id}/member/remove`

| Parâmetro | Local | Tipo | Obrigatório |
|---|---|---|---|
| `workspace_id` | Caminho | UUID | Sim |
| `target_user_id` | Query string | UUID | Sim |

Não recebe corpo. Exemplo:
`/workspaces/22222222-2222-4222-8222-222222222222/member/remove?target_user_id=55555555-5555-4555-8555-555555555555`.

ADMIN ou OWNER pode remover MEMBER. Somente OWNER pode remover ADMIN.
O proprietário não pode ser removido por essa rota.

### Response — 200 OK

A resposta é uma string JSON:

```json
"Workspace member deleted successfully"
```

## Alterar papel de membro

`PATCH /workspaces/{workspace_id}/members/{target_user_id}/role`

Os dois UUIDs são informados na URL. Não recebe corpo nem um campo `role`.
A operação alterna MEMBER para ADMIN ou ADMIN para MEMBER.
ADMIN ou OWNER pode promover MEMBER; somente OWNER pode rebaixar ADMIN.
O papel do proprietário não pode ser alterado por essa rota.

### Response — 200 OK

```json
"Workspace member role was changed"
```

## Erros de workspaces, membros e convites

Os erros são objetos JSON com campo `detail`, por exemplo:

```json
{
  "detail": "Insufficient Authorization"
}
```

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
