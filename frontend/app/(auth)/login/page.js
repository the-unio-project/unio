"use client";

import {useState} from 'react';
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import Input from '@/components//ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email.includes('@')) {
            setErro('Email inválido');
            return;
        }

        if (!senha) {
            setErro('Senha não pode ser vazia');
            return;
        }

        if (senha.length < 6) {
            setErro('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            await login(email, senha);
            router.push('/dashboard');

        } catch (err) {
            setErro(err.message);
            return;
        }
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