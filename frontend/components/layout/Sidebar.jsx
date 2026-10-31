"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ChevronRight, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ModalProjeto from "@/components/projects/ModalProjeto";

export default function Sidebar() {
    const {
        workspaceAtual, projetos: todosProjetos, projetosAtivos,
        criarProjeto, editarProjeto, arquivarProjeto, excluirProjeto, setWorkspaceLembrado,
        carregandoProjetos, erroProjetos
    } = useWorkspace();
    const params = useParams();
    const router = useRouter();
    const [projetosAberto, setProjetosAberto] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [projetoEditandoId, setProjetoEditandoId] = useState(null);

    const projetos = workspaceAtual ? projetosAtivos.filter((projeto) => projeto.workspaceId === workspaceAtual.id) : [];
    const projetoEditando = todosProjetos.find((p) => p.id === projetoEditandoId);

    async function salvarNovoProjeto(dados) {
        const novo = await criarProjeto(workspaceAtual.id, dados);
        setModalAberto(false);
        router.push(`/${workspaceAtual.id}/projetos/${novo.id}`);
    }

    async function salvarAlteracao(dados) {
        await editarProjeto(projetoEditandoId, dados);
        setProjetoEditandoId(null);
    }

    function sairProjetoAberto(id) {
        if (String(id) !== params.projectId) return;
        const outro = projetos.find((p) => p.id !== id);
        if (outro) {
            router.push(`/${workspaceAtual.id}/projetos/${outro.id}`);
        } else {
            setWorkspaceLembrado(workspaceAtual);
            router.push("/dashboard");
        }
    }

    async function arquivar() {
        await arquivarProjeto(projetoEditandoId);
        sairProjetoAberto(projetoEditandoId);
        setProjetoEditandoId(null);
    }

    async function excluir() {
        await excluirProjeto(projetoEditandoId);
        sairProjetoAberto(projetoEditandoId);
        setProjetoEditandoId(null);
    }

    return (
        <nav className="w-64 h-full shrink-0 overflow-y-auto p-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setProjetosAberto(!projetosAberto)}
                    className="flex items-center gap-2 font-semibold"
                >
                    Projetos
                    <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${projetosAberto ? "rotate-90" : ""}`}
                    />
                </button>
                {workspaceAtual && (
                    <Button variant="icone" onClick={() => setModalAberto(true)} aria-label="Criar projeto">
                        <Plus size={16} />
                    </Button>
                )}
            </div>

            {projetosAberto &&
                (carregandoProjetos ? (
                    <p className="mt-2 ml-2 text-sm text-gray-500">Carregando...</p>
                ) : erroProjetos ? (
                    <p className="mt-2 ml-2 text-sm text-red-500">{erroProjetos}</p>
                ) : projetos.length === 0 ? (
                    <p className="mt-2 ml-2 text-sm text-gray-500">Nenhum projeto ainda</p>
                ) : (
                    <ul className="flex flex-col gap-2 list-none mt-2 ml-2">
                        {projetos.map((projeto) => (
                            <li key={projeto.id} className="group flex items-center justify-between">
                                <Link href={`/${workspaceAtual.id}/projetos/${projeto.id}`}>
                                    {projeto.nome}
                                </Link>
                                <Button
                                    variant="icone"
                                    onClick={() => setProjetoEditandoId(projeto.id)}
                                    aria-label={`Editar projeto ${projeto.nome}`}
                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100"
                                >
                                    <Pencil size={14} />
                                </Button>
                            </li>
                        ))}
                    </ul>
                ))}

            <ul className="flex flex-col gap-4 list-none mt-4">
                <li>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                {workspaceAtual && (
                    <li>
                        <Link href={`/${workspaceAtual.id}/membros`}>Membros</Link>
                    </li>
                )}
                <li>
                    <Link href="/configuracoes">Configurações</Link>
                </li>
            </ul>

            {modalAberto && (
                <ModalProjeto
                    aoFechar={() => setModalAberto(false)}
                    aoSalvar={salvarNovoProjeto}
                />
            )}
            {projetoEditando && (
                <ModalProjeto
                    projeto={projetoEditando}
                    aoFechar={() => setProjetoEditandoId(null)}
                    aoSalvar={salvarAlteracao}
                    aoArquivar={arquivar}
                    aoExcluir={excluir}
                />
            )}
        </nav>
    );
}