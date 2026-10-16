const API_URL = 'http://localhost:8000';

export function getAuthToken() {
    if (typeof document === 'undefined') return null;
    
    const match = document.cookie.match(/(^| )access_token=([^;]+)/);
    return match ? match[2] : null;
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
        throw new Error('Email ou palavra-passe inválidos.');
    }

    return resposta.json();
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
        throw new Error('Falha ao fazer cadastro.');
    }

    return resposta.json();
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