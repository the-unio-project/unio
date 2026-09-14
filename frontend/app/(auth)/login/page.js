"use client";

import {useState} from 'react';
import Input from '@/components//ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.includes('@')) {
            setErro('Email inválido');
            return;
        }

        setErro('');
        console.log('Login com:', email, senha);
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 border rounded p-4">
                    <Input 
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu email"
                    />

                    <Input 
                        label="Senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Digite sua senha"
                    />
                {erro && <p className="text-red-500">{erro}</p>}
                <Button type="submit" >
                    Entrar
                </Button>
            </form>
        </div>
    )
}