"use client";

import {useState} from 'react';
import Input from '@/components//ui/Input';
import Button from '@/components/ui/Button';

export default function CadastroPage() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (nome.trim() === '') {
            setErro('Nome é obrigatório');
            return;
        }

        if (!email.includes('@')) {
            setErro('Email inválido');
            return;
        }

        if (senha.trim () === '') {
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

        setErro('');
        console.log('Cadastro com:', nome, email, senha);
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 border rounded p-4">
                    <Input 
                        label="Nome Completo"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite seu nome completo"
                    />

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

                    <Input 
                        label="Confirmar Senha"
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="Confirme sua senha"
                    />
                    {confirmarSenha !== '' && confirmarSenha !== senha && (<p className="text-orange-500 text-sm">As senhas ainda não coincidem</p>)}
                {erro && <p className="text-red-500">{erro}</p>}
                <Button type="submit">
                    Cadastrar
                </Button>
            </form>
        </div>
    )
}