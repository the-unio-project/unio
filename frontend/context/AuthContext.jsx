"use client";

import { createContext, useContext, useState } from 'react';
import { login, cadastro } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuarioAtual, setUsuarioAtual] = useState(null);

    async function fazerLogin(email, senha) {
        const dados = await login(email, senha);
        setUsuarioAtual(dados?.user ?? { email });
    }

    async function fazerCadastro(nome, email, senha) {
        await cadastro(nome, email, senha);
        setUsuarioAtual({ name: nome, email });
    }

    return (
        <AuthContext.Provider value={{ usuarioAtual, fazerLogin, fazerCadastro }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}