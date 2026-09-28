const API_URL = 'http://localhost:8000';

export async function login(email, senha) {
let resposta;

    try {
        resposta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {"content-type": "application/json"},
            credentials: 'include',
            body: JSON.stringify({ email, senha })
        });
    } catch (erroDeRede) {
        throw new Error('Não foi possivel conectar ao servidor.');
    }

    if(!resposta.ok) {
        throw new Error('Email ou senha inválidos.');
    }

    return resposta.json();

}

export async function cadastro(nome, email, senha) {
    let resposta;

    try {
        resposta = await fetch(`${API_URL}/cadastro`, {
            method: 'POST',
            headers: {"content-type": "application/json"},
            credentials: 'include',
            body: JSON.stringify({ nome, email, senha })
        });
    } catch (erroDeRede) {
        throw new Error('Não foi possível conectar ao servidor.');
    }

    if (!resposta.ok) {
        throw new Error('Falha ao fazer cadastro.');
    }

    return resposta.json();
}