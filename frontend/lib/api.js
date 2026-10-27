const API_URL = 'http://localhost:8000';

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

    return resposta.json();
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