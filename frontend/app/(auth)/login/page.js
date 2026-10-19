"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const { fazerLogin } = useAuth(); 

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
        setCarregando(true);

        try {
            await fazerLogin(email, senha);
            router.push('/dashboard');
        } catch (err) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }

    }

    return (
        <div className="flex items-center justify-center h-screen px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs w-full">

                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold dark:text-white">Faça login</h1>
                </div>
                
                <Input 
                    variant="filled"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                />

                <Input 
                    variant="filled"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Senha"
                />

                <div className="text-center -mt-1">
                    <Link href="/esqueci-senha" className="text-sm text-gray-700 underline hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                        Esqueceu a senha?
                    </Link>
                </div>
                
                {erro && <p className="text-red-500 text-sm font-medium text-center">{erro}</p>}
                
                <div className="text-center text-sm text-gray-800 mt-4 dark:text-gray-300">
                    Não tem uma conta?{' '}
                    <Link href="/cadastro" className="underline font-medium hover:text-black dark:hover:text-white transition-colors">
                        Criar uma conta
                    </Link>
                </div>

                <Button type="submit" variant="primary">
                    Entrar
                </Button>
            </form>
        </div>
    )
}