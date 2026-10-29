const API_URL = 'http://localhost:8000';
const COR_PADRAO_PROJETO = "#3b82f6";

export function getAuthToken() {
    if (typeof document === 'undefined') return null;

    const match = document.cookie.match(/(^| )access_token=([^;]+)/);
    if (!match) return null;

    return decodeURIComponent(match[2])
        .replace(/^"|"$/g, '')
        .replace(/^Bearer\s+/, '');
}

export async function login(email, senha) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ email, password: senha })
        });
    } catch (erroDeRede) {
        throw new Error('Não foi possível conectar ao servidor.');
    }

    if (!resposta.ok) {
        throw new Error(
            resposta.status === 400
                ? 'Email ou senha inválidos.'
                : 'Não foi possível entrar. Tente novamente.'
        );
    }

    return resposta.json().catch(() => null);
}

export async function cadastro(nome, email, senha) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ name: nome, email, password: senha })
        });
    } catch (erroDeRede) {
        throw new Error('Não foi possível conectar ao servidor.');
    }

    if (!resposta.ok) {
        throw new Error(
            resposta.status === 400
                ? 'Este e-mail já está cadastrado.'
                : 'Falha ao fazer cadastro. Tente novamente.'
        );
    }

    return resposta.json().catch(() => null);
}

export async function apiFetch(endpoint, opcoes = {}) {
    const token = getAuthToken();
    const headers = {
        "content-type": "application/json",
        ...opcoes.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const resposta = await fetch(`${API_URL}${endpoint}`, {
        ...opcoes,
        credentials: 'include',
        headers,
    });

    if (resposta.status === 401) {
        removerToken();
        window.location.href = '/login';
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!resposta.ok) {
        const erro = new Error('Erro na requisição.');
        erro.status = resposta.status;
        throw erro;
    }

    return resposta.json().catch(() => null);
}

export function removerToken() {
    document.cookie = 'access_token=; Max-Age=0; path=/';
}

export function buscarPerfil() {
    return apiFetch('/me/');
}

function traduzirWorkspace(w) {
    return {
        id: w.id,
        nome: w.name,
        donoId: w.owner_id,
        logoUrl: w.logo_url,
    };
}

export async function listarWorkspaces() {
    const dados = await apiFetch('/workspaces/');
    return dados.map(traduzirWorkspace);
}

const ICONE_PADRAO_API = "https://example.com/";

function traduzirProjeto(p, workspaceId) {
    return {
        id: p.id,
        workspaceId,
        nome: p.name,
        descricao: p.description ?? "",
        cor: p.color,
        iconeUrl: p.icon_url === ICONE_PADRAO_API ? null : p.icon_url,
        arquivado: p.is_archived,
    };
}

export async function listarProjetos(workspaceId) {
    const dados = await apiFetch(`/workspaces/${workspaceId}/project/`);
    return dados.map((p) => traduzirProjeto(p, workspaceId));
}

function traduzirStatus(s) {
    return {
        id: s.id,
        projetoId: s.project_id,
        nome: s.name,
        cor: s.color,
    };
}

export async function listarStatus(projetoId) {
    const dados = await apiFetch(`/projects/${projetoId}/statuses`);
    return dados.map(traduzirStatus);
}

const PRIORIDADE_API = { low: "baixa", medium: "normal", high: "alta", urgent: "urgente" };

function traduzirTarefa(t, projetoId) {
    return {
        id: t.id,
        projetoId,
        titulo: t.title,
        descricao: t.description ?? "",
        prioridade: PRIORIDADE_API[t.priority] ?? "normal",
        dataVencimento: t.term ? t.term.slice(0, 10) : "",
        statusId: t.status_id,
        position: t.position,
        responsaveis: [],
    };
}

async function listarIdsResponsaveis(tarefaId) {
    const dados = await apiFetch(`/tasks/${tarefaId}/assignees`);
    return dados.map((u) => u.id);
}

export async function listarTarefas(projetoId) {
    const dados = await apiFetch(`/projects/${projetoId}/tasks`);
    const tarefas = dados.map((t) => traduzirTarefa(t, projetoId));

    //apagar quando o backend incluir o campo de responsáveis.
    return Promise.all(
        tarefas.map(async (tarefa) => ({
            ...tarefa,
            responsaveis: await listarIdsResponsaveis(tarefa.id),
        }))
    );
}

function traduzirMembro(m, workspaceId) {
    return {
        id: m.id,
        nome: m.name,
        email: m.email,
        workspaceId,
        foto: null,    // verificar com os designers/backend (precisa de url).
    };
}

export async function listarMembros(workspaceId) {
    const dados = await apiFetch(`/workspaces/${workspaceId}/member/list`, { method: 'POST' });
    return dados.map((m) => traduzirMembro(m, workspaceId));
}

export async function criarWorkspaceApi(nome) {
    const dados = await apiFetch('/workspaces/', {
        method: 'POST',
        body: JSON.stringify({ name: nome }),
    });
    return traduzirWorkspace(dados.Workspace);
}

export async function criarProjetoApi(workspaceId, dados) {
    const corpo = { name: dados.nome, color: dados.cor ?? COR_PADRAO_PROJETO };
    if (dados.descricao) corpo.description = dados.descricao;

    const projeto = await apiFetch(`/workspaces/${workspaceId}/project/`, {
        method: 'POST',
        body: JSON.stringify(corpo),
    });
    return traduzirProjeto(projeto, workspaceId);
}

export async function editarProjetoApi(projetoId, dados) {
    const projeto = await apiFetch(`/workspaces/project/${projetoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: dados.nome, description: dados.descricao }),
    });
    return traduzirProjeto(projeto, projeto.workspace_id);
}

export async function arquivarProjetoApi(projetoId) {
    const projeto = await apiFetch(`/workspaces/project/${projetoId}/archive`, { method: 'PATCH' });
    return traduzirProjeto(projeto, projeto.workspace_id);
}

export async function excluirProjetoApi(projetoId) {
    await apiFetch(`/workspaces/project/${projetoId}`, { method: 'DELETE' });
}

function dataDeHoje() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    return `${agora.getFullYear()}-${mes}-${dia}`;
}

export async function criarTarefaApi(projetoId, statusId, titulo) {
    const tarefa = await apiFetch(`/projects/${projetoId}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
            title: titulo,
            term: `${dataDeHoje()}T12:00:00Z`,
            status_id: statusId,
        }),
    });
    return traduzirTarefa(tarefa, projetoId);
}

const PRIORIDADE_PARA_API = { baixa: "low", normal: "medium", alta: "high", urgente: "urgent" };

export async function editarTarefaApi(tarefa) {
    await apiFetch(`/tasks/${tarefa.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: tarefa.titulo,
            description: tarefa.descricao,
            priority: PRIORIDADE_PARA_API[tarefa.prioridade],
            term: `${tarefa.dataVencimento || dataDeHoje()}T12:00:00Z`,
        }),
    });
}

export async function excluirTarefaApi(tarefaId) {
    await apiFetch(`/tasks/${tarefaId}`, { method: 'DELETE' });
}

export async function moverTarefaApi(tarefaId, statusId, posicao) {
    await apiFetch(`/tasks/${tarefaId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status_id: statusId, position: posicao }),
    });
}

export async function adicionarResponsavelApi(tarefaId, usuarioId) {
    await apiFetch(`/tasks/${tarefaId}/user/${usuarioId}`, { method: 'POST' });
}

export async function removerResponsavelApi(tarefaId, usuarioId) {
    await apiFetch(`/tasks/${tarefaId}/user/${usuarioId}`, { method: 'DELETE' });
}