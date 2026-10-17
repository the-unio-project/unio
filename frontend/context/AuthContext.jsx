"use client";

import { createContext, useContext, useState } from 'react';
import { login } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuarioAtual, setUsuarioAtual] = useState(null);

    async function fazerLogin(email, senha) {
        const dados = await login(email, senha);
        setUsuarioAtual(dados?.user ?? { email });
    }

    return (
        <AuthContext.Provider value={{ usuarioAtual, fazerLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}