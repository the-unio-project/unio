"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { PRIORIDADES } from "@/lib/prioridades";
import { tagsMock } from "@/lib/mock";
import { listarComentarios, criarComentarioApi, excluirComentarioApi } from "@/lib/api";
import Input from '@/components/ui/Input';
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ModalConfirmacao from "@/components/ui/ModalConfirmacao";
import Avatar from "@/components/ui/Avatar";
import { toast } from "sonner";

export default function ModalTarefa({ tarefa, membros, statusDoProjeto, aoFechar, aoAtualizar, aoAdicionarResponsavel, aoRemoverResponsavel, aoExcluir, aoMover }) {
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [descricao, setDescricao] = useState(tarefa.descricao ?? "");
    const [novaSubtarefa, setNovaSubtarefa] = useState("");
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

    const [comentarios, setComentarios] = useState([]);
    const [carregandoComentarios, setCarregandoComentarios] = useState(true);
    const [textoComentario, setTextoComentario] = useState("");
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    useEffect(() => {
        listarComentarios(tarefa.id)
            .then(setComentarios)
            .catch(() => toast.error("Não foi possível carregar os comentários."))
            .finally(() => setCarregandoComentarios(false));
    }, [tarefa.id]);

    async function enviarComentario(e) {
        e.preventDefault();
        if (textoComentario.trim() === "" || enviandoComentario) return;

        setEnviandoComentario(true);
        try {
            await criarComentarioApi(tarefa.id, textoComentario.trim());
            const listaAtualizada = await listarComentarios(tarefa.id);
            setComentarios(listaAtualizada);
            setTextoComentario("");
        } catch (err) {
            toast.error("Não foi possível enviar o comentário.");
        } finally {
            setEnviandoComentario(false);
        }
    }

    async function apagarComentario(id) {
        try {
            await excluirComentarioApi(id);
            setComentarios((anteriores) => anteriores.filter((c) => c.id !== id));
        } catch (err) {
            toast.error("Falha ao apagar o comentário.");
        }
    }

    function salvarTitulo() {
        if (titulo.trim() === "") {
            setTitulo(tarefa.titulo);
            return;
        }
        aoAtualizar(tarefa.id, { titulo: titulo.trim() });
    }

    function fechar() {
        const tituloFinal = titulo.trim() === "" ? tarefa.titulo : titulo.trim();
        aoAtualizar(tarefa.id, { titulo: tituloFinal, descricao });
        aoFechar();
    }

    const subtarefas = tarefa.subtarefas ?? [];

    function adicionarSubtarefa() {
        if (novaSubtarefa.trim() === "") return;
        const nova = { id: Date.now(), titulo: novaSubtarefa.trim() };
        aoAtualizar(tarefa.id, { subtarefas: [...subtarefas, nova] });
        setNovaSubtarefa("");
    }

    const idsAplicados = tarefa.tags ?? [];
    const tagsProjeto = tagsMock.filter((tag) => tag.projetoId === tarefa.projetoId);
    const tagsAplicadas = tagsProjeto.filter((tag) => idsAplicados.includes(tag.id));
    const tagsDisponiveis = tagsProjeto.filter((tag) => !idsAplicados.includes(tag.id));

    function aplicarTag(tagId) {
        aoAtualizar(tarefa.id, { tags: [...idsAplicados, tagId] });
    }

    function removerTag(tagId) {
        aoAtualizar(tarefa.id, { tags: idsAplicados.filter((id) => id !== tagId) });
    }

    const idsResponsaveis = tarefa.responsaveis ?? [];
    const responsaveisAtuais = membros.filter((m) => idsResponsaveis.includes(m.id));
    const membrosDisponiveis = membros.filter((m) => !idsResponsaveis.includes(m.id));

    function adicionarResponsavel(usuarioId) {
        aoAdicionarResponsavel(tarefa.id, usuarioId);
    }

    function removerResponsavel(usuarioId) {
        aoRemoverResponsavel(tarefa.id, usuarioId);
    }

    return (
        <>
            <Modal
                aoFechar={fechar}
                largura="max-w-5xl"
                acoes={
                    <Button
                        variant="iconePerigo"
                        onClick={() => setConfirmandoExclusao(true)}
                        aria-label="Excluir tarefa"
                        title="Excluir tarefa"
                    >
                        <Trash2 size={18} />
                    </Button>
                }
            >
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 overflow-y-auto p-1 pr-3 flex flex-col">
                        <div className="mb-6">
                            <Input
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                onBlur={salvarTitulo}
                                className="w-full text-2xl font-bold"
                                maxLength={100}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 shrink-0">
                            <div>
                                <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    id="status"
                                    value={tarefa.statusId ?? ""}
                                    onChange={(e) => aoMover(tarefa.id, e.target.value)}
                                    className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent dark:bg-neutral-900 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    <option value="" disabled>Sem status</option>
                                    {statusDoProjeto.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="prioridade" className="block text-gray-700 dark:text-gray-300 mb-1">Prioridade</label>
                                <select
                                    id="prioridade"
                                    value={tarefa.prioridade}
                                    onChange={(e) => aoAtualizar(tarefa.id, { prioridade: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent dark:bg-neutral-900 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                >
                                    {Object.entries(PRIORIDADES).map(([valor, { rotulo }]) => (
                                        <option key={valor} value={valor}>{rotulo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
                            <div>
                                <label htmlFor="data-vencimento" className="block text-gray-700 dark:text-gray-300 mb-1">Data de vencimento</label>
                                <div className="flex items-center gap-2 max-w-[200px]">
                                    <Input
                                        id="data-vencimento"
                                        type="date"
                                        value={tarefa.dataVencimento}
                                        onChange={(e) => {
                                            if (e.target.value) aoAtualizar(tarefa.id, { dataVencimento: e.target.value });
                                        }}
                                        onClick={(e) => e.currentTarget.showPicker?.()}
                                    />
                                    {tarefa.dataVencimento && (
                                        <Button
                                            variant="icone"
                                            aria-label="Remover data"
                                            title="Remover data"
                                            onClick={() => aoAtualizar(tarefa.id, { dataVencimento: "" })}>
                                            <X size={16} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="block text-gray-700 dark:text-gray-300 mb-2">Tags</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {tagsAplicadas.map((tag) => (
                                        <span key={tag.id} className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm ${tag.cor}`}>
                                            {tag.nome}
                                            <button type="button" onClick={() => removerTag(tag.id)} className="hover:opacity-75" aria-label="Remover tag">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    {tagsDisponiveis.length > 0 && (
                                        <select
                                            value=""
                                            onChange={(e) => aplicarTag(Number(e.target.value))}
                                            className="border border-gray-300 dark:border-neutral-700 bg-transparent rounded-md p-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        >
                                            <option value="" disabled>+ Adicionar tag</option>
                                            {tagsDisponiveis.map((tag) => (
                                                <option key={tag.id} value={tag.id}>{tag.nome}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="block text-gray-700 dark:text-gray-300 mb-2">Responsáveis</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {responsaveisAtuais.map((m) => (
                                        <span key={m.id} className="flex items-center gap-1 rounded-md bg-gray-200 dark:bg-neutral-800 px-2 py-1 text-sm text-gray-700 dark:text-gray-200">
                                            {m.nome}
                                            <button type="button" onClick={() => removerResponsavel(m.id)} className="hover:text-erro" aria-label="Remover responsável">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    {membrosDisponiveis.length > 0 && (
                                        <select
                                            value=""
                                            onChange={(e) => adicionarResponsavel(e.target.value)}
                                            className="border border-gray-300 dark:border-neutral-700 bg-transparent rounded-md p-1.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                        >
                                            <option value="" disabled>+ Adicionar</option>
                                            {membrosDisponiveis.map((m) => (
                                                <option key={m.id} value={m.id}>{m.nome}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 shrink-0">
                            <label htmlFor="descricao" className="block text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                            <textarea
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                onBlur={() => aoAtualizar(tarefa.id, { descricao })}
                                className="w-full border border-gray-300 dark:border-neutral-700 bg-transparent dark:bg-neutral-900 rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none min-h-[100px]"
                                maxLength={100}
                                placeholder="Adicione uma descrição..."
                            />
                        </div>

                        <div className="mb-6 shrink-0">
                            <p className="block text-gray-700 dark:text-gray-300 mb-2">Subtarefas</p>
                            {subtarefas.length === 0 ? (
                                <p className="mb-3 text-sm text-gray-500">Nenhuma subtarefa adicionada ainda</p>
                            ) : (
                                <ul className="mb-3 flex flex-col gap-2">
                                    {subtarefas.map((sub) => (
                                        <li key={sub.id} className="text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                            {sub.titulo}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Input
                                value={novaSubtarefa}
                                onChange={(e) => setNovaSubtarefa(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") adicionarSubtarefa();
                                }}
                                placeholder="+ Adicionar subtarefa"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-[350px] flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-neutral-800 pt-6 md:pt-0 md:pl-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 shrink-0 pr-8">Comentários</h3>

                        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2 mb-4">
                            {carregandoComentarios ? (
                                <p className="text-sm text-gray-500 text-center py-4">Carregando...</p>
                            ) : comentarios.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">Nenhum comentário ainda.</p>
                            ) : (
                                comentarios.map((c) => {
                                    const autor = membros.find((m) => m.id === c.autorId);
                                    return (
                                        <div key={c.id} className="flex gap-3">
                                            <div className="shrink-0">
                                                <Avatar nome={autor?.nome} src={autor?.foto} tamanho="sm" />
                                            </div>
                                            <div className="flex-1 rounded-xl bg-gray-100 dark:bg-neutral-800 p-3">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {autor?.nome ?? "Usuário desconhecido"}
                                                    </span>
                                                    <button
                                                        onClick={() => apagarComentario(c.id)}
                                                        variant="iconePerigo"
                                                        className="text-gray-400 hover:text-erro transition-colors"
                                                        aria-label="Excluir"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                    {c.texto}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <form onSubmit={enviarComentario} className="shrink-0 flex flex-col gap-2 border-t border-gray-200 dark:border-neutral-800 pt-4">
                            <Input
                                variant="filled"
                                value={textoComentario}
                                onChange={(e) => setTextoComentario(e.target.value)}
                                placeholder="Escreva um comentário..."
                                className="py-2"
                            />
                            <Button type="submit" variant="primary" disabled={enviandoComentario || textoComentario.trim() === ""} className="w-full">
                                {enviandoComentario ? "Enviando..." : "Enviar"}
                            </Button>
                        </form>
                    </div>

                </div>
            </Modal>
            
            {confirmandoExclusao && (
                <ModalConfirmacao
                    titulo="Excluir tarefa"
                    mensagem={`A tarefa “${tarefa.titulo}” será excluída e não poderá ser recuperada.`}
                    aoConfirmar={async () => {
                        await aoExcluir(tarefa.id);
                        setConfirmandoExclusao(false);
                    }}
                    aoCancelar={() => setConfirmandoExclusao(false)}
                />
            )}
        </>
    )
}