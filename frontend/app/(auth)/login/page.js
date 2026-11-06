"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
            setErro('E-mail inválido');
            return;
        }

        if (!senha) {
            setErro('A senha não pode estar vazia');
            return;
        }
        setCarregando(true);
        setErro('');

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
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="relative hidden flex-col items-center justify-center gap-12 bg-primary p-8 md:flex">
                <Image
                    src="/logo.svg"
                    alt="UNIO"
                    width={350}
                    height={150}
                    className="h-auto w-auto max-w-full"
                    priority
                />
                <div className="absolute bottom-8 left-8">
                    <Image
                        src="/frase.svg"
                        alt="Unindo Pessoas e Projetos"
                        width={200}
                        height={60}
                        className="h-auto w-auto max-w-full"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center justify-center bg-white px-4 dark:bg-neutral-950">
                <div className="w-full max-w-sm">
                    <div className="mb-12 flex justify-center">
                        <Image
                            src="/logotiny.svg"
                            alt="UNIO"
                            width={75}
                            height={40}
                            className="h-auto w-full max-w-18.75 object-contain block dark:hidden"
                            priority
                        />
                        <Image
                            src="/logotiny-dark.svg"
                            alt="UNIO"
                            width={75}
                            height={40}
                            className="h-auto w-full max-w-18.75 object-contain hidden dark:block"
                            priority
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                        {erro && <p className="text-center text-sm font-medium text-erro">{erro}</p>}

                        <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Não tem uma conta?{' '}
                            <Link href="/cadastro" className="font-semibold text-primary underline transition-colors hover:text-primary-hover">
                                Criar uma conta
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={carregando}
                            className="mt-6 w-full uppercase tracking-wide hover:cursor-pointer"
                        >
                            {carregando ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}