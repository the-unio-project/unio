"use client";

import { useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ChevronRight, Plus, Pencil, LayoutDashboard, FolderKanban, Users, Settings } from "lucide-react";
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
    const pathname = usePathname();
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

    const estiloItem = (caminho) => {
        const ativo = pathname === caminho || pathname?.startsWith(caminho + "/");
        return `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${ativo
            ? "bg-white text-primary font-semibold"
            : "text-white/80 hover:bg-white/10 hover:text-white"
            }`;
    };

    return (
        <nav className="w-64 h-full shrink-0 overflow-y-auto rounded-3xl bg-primary p-4 pt-5 flex flex-col text-white">
            <Link href="/dashboard" className={estiloItem("/dashboard")}>
                <LayoutDashboard size={18} />
                Dashboard
            </Link>

            <div className="mt-6 flex items-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                <button
                    type="button"
                    onClick={() => setProjetosAberto(!projetosAberto)}
                    aria-expanded={projetosAberto}
                    className="flex flex-1 items-center gap-3 px-3 py-2 hover:cursor-pointer"
                >
                    <FolderKanban size={18} />
                    Projetos
                    <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${projetosAberto ? "rotate-90" : ""}`}
                    />
                </button>
                {workspaceAtual && (
                    <Button
                        variant="iconeClaro"
                        onClick={() => setModalAberto(true)}
                        aria-label="Criar projeto"
                        className="mr-2 hover:cursor-pointer"
                    >
                        <Plus size={16} />
                    </Button>
                )}
            </div>

            {projetosAberto &&
                (carregandoProjetos ? (
                    <p className="mt-2 ml-3 text-sm text-white/60">Carregando...</p>
                ) : erroProjetos ? (
                    <p className="mt-2 ml-3 text-sm text-alerta">{erroProjetos}</p>
                ) : projetos.length === 0 ? (
                    <p className="mt-2 ml-3 text-sm text-white/60">Nenhum projeto ainda</p>
                ) : (
                    <ul className="flex flex-col gap-1 list-none mt-2">
                        {projetos.map((projeto) => {
                            const linkProjeto = `/${workspaceAtual.id}/projetos/${projeto.id}`;
                            const ativo = pathname === linkProjeto;

                            return (
                                <li key={projeto.id} className="group flex items-center justify-between">
                                    <Link
                                        href={linkProjeto}
                                        className={`flex-1 truncate px-3 py-2 rounded-md transition-colors ${ativo
                                            ? "bg-white text-primary font-semibold"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        {projeto.nome}
                                    </Link>
                                    <Button
                                        variant="iconeClaro"
                                        onClick={() => setProjetoEditandoId(projeto.id)}
                                        aria-label={`Editar projeto ${projeto.nome}`}
                                        className="ml-1 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                ))}

            <div className="mt-6 pt-4 border-t border-white/10">
                <ul className="flex flex-col gap-1 list-none">
                    {workspaceAtual && (
                        <li>
                            <Link href={`/${workspaceAtual.id}/membros`} className={estiloItem(`/${workspaceAtual.id}/membros`)}>
                                <Users size={18} />
                                Membros
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link href="/configuracoes" className={estiloItem("/configuracoes")}>
                            <Settings size={18} />
                            Configurações
                        </Link>
                    </li>
                </ul>
            </div>

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