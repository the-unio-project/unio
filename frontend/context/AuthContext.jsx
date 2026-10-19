"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { login, cadastro, removerToken, buscarPerfil, getAuthToken } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuarioAtual, setUsuarioAtual] = useState(null);

    async function carregarUsuario() {
        const perfil = await buscarPerfil();
        setUsuarioAtual(perfil);
    }

    async function fazerLogin(email, senha) {
        await login(email, senha);
        await carregarUsuario();
    }

    async function fazerCadastro(nome, email, senha) {
        await cadastro(nome, email, senha);
        await carregarUsuario();
    }

    useEffect(() => {
        if (!getAuthToken()) return;
        buscarPerfil()
            .then(setUsuarioAtual)
            .catch(() => setUsuarioAtual(null));
    }, []);

    function fazerLogout() {
        removerToken();
        setUsuarioAtual(null);
    }

    return (
        <AuthContext.Provider value={{ usuarioAtual, fazerLogin, fazerCadastro, fazerLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}