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

export async function fetchComAutenticacao(endpoint, opcoes = {}) {
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

    if (!resposta.ok) {
        throw new Error('Erro na requisição ou token expirado.');
    }

    return resposta.json();
}