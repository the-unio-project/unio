"use client";

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuarioAtual, setUsuarioAtual] = useState(null);

    return (
        <AuthContext.Provider value={{ usuarioAtual, setUsuarioAtual }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}