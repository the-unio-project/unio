"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cadastro } from "@/lib/api";
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CadastroPage() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        if (nome.trim() === '') {
            setErro('Nome é obrigatório');
            return;
        }

        if (!email.includes('@')) {
            setErro('Email inválido');
            return;
        }

        if (senha.trim() === '') {
            setErro('Senha é obrigatória');
            return;
        }

        if (senha.length < 6) {
            setErro('Senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas não coincidem');
            return;
        }

        try {
            await cadastro(nome, email, senha);
            router.push('/login');
        } catch (err) {
            setErro(err.message);
            return;
        }
    }

    return (
        <div className="flex items-center justify-center h-screen px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs w-full">
                
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold dark:text-white">Criar Conta</h1>
                </div>

                <Input 
                    variant="filled"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome Completo"
                />

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

                <Input 
                    variant="filled"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirmar Senha"
                />
                
                {confirmarSenha !== '' && confirmarSenha !== senha && (
                    <p className="text-orange-500 text-sm text-center">As senhas ainda não coincidem</p>
                )}

                {erro && <p className="text-red-500 text-sm font-medium text-center">{erro}</p>}

                <div className="text-center text-sm text-gray-800 mt-2 dark:text-gray-300">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="underline font-medium hover:text-black dark:hover:text-white transition-colors">
                        Entrar
                    </Link>
                </div>

                <Button type="submit" variant="primary">
                    Cadastrar
                </Button>
            </form>
        </div>
    )
}