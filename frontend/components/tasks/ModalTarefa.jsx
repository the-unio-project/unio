"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { PRIORIDADES } from "@/lib/prioridades";
import { tagsMock } from "@/lib/mock";
import Input from '@/components/ui/Input';
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ModalConfirmacao from "@/components/ui/ModalConfirmacao";
import ComentariosTarefa from "@/components/tasks/ComentariosTarefa";

const CLASSE_SELECT =
    "w-full rounded-md bg-campo p-2 text-sm text-carvao focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800 dark:text-gray-100";
const CLASSE_SELECT2 =
    "rounded-full bg-campo px-3 py-1.5 text-sm text-carvao focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800 dark:text-gray-100";

export default function ModalTarefa({ tarefa, membros, statusDoProjeto, aoFechar, aoAtualizar, aoAdicionarResponsavel, aoRemoverResponsavel, aoExcluir, aoMover }) {
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [descricao, setDescricao] = useState(tarefa.descricao ?? "");
    const [novaSubtarefa, setNovaSubtarefa] = useState("");
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

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
                largura="max-w-4xl"
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
                <div className="grid gap-6 md:h-[calc(90vh-3rem)] md:grid-cols-[minmax(0,1fr)_20rem] md:grid-rows-[minmax(0,1fr)]">
                    <div className="flex min-w-0 flex-col md:overflow-y-auto md:p-1 md:pr-3">
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
                                <label htmlFor="status" className="mb-1 block text-sm font-semibold">Status</label>
                                <select
                                    id="status"
                                    value={tarefa.statusId ?? ""}
                                    onChange={(e) => aoMover(tarefa.id, e.target.value)}
                                    className={CLASSE_SELECT}
                                >
                                    <option value="" disabled>Sem status</option>
                                    {statusDoProjeto.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="prioridade" className="mb-1 block text-sm font-semibold">Prioridade</label>
                                <select
                                    id="prioridade"
                                    value={tarefa.prioridade}
                                    onChange={(e) => aoAtualizar(tarefa.id, { prioridade: e.target.value })}
                                    className={CLASSE_SELECT}
                                >
                                    {Object.entries(PRIORIDADES).map(([valor, { rotulo }]) => (
                                        <option key={valor} value={valor}>{rotulo}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 shrink-0">
                            <div>
                                <label htmlFor="data-vencimento" className="mb-1 block text-sm font-semibold">Data de vencimento</label>
                                <div className="flex items-center gap-2 max-w-50">
                                    <Input
                                        id="data-vencimento"
                                        variant="filled"
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
                                <p className="mb-1 block text-sm font-semibold">Tags</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {tagsAplicadas.map((tag) => (
                                        <span key={tag.id} className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${tag.cor}`}>
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
                                            className={CLASSE_SELECT2}
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
                                <p className="mb-1 block text-sm font-semibold">Responsáveis</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    {responsaveisAtuais.map((m) => (
                                        <span key={m.id} className="flex items-center gap-1 rounded-full bg-campo px-3 py-1 text-sm text-carvao dark:bg-neutral-800 dark:text-gray-100">
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
                                            className={CLASSE_SELECT2}
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
                            <label htmlFor="descricao" className="mb-1 block text-sm font-semibold">Descrição</label>
                            <textarea
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                onBlur={() => aoAtualizar(tarefa.id, { descricao })}
                                className="min-h-25 w-full rounded-md border border-carvao bg-transparent p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-500 dark:text-gray-100"
                                maxLength={100}
                                placeholder="Adicione uma descrição..."
                            />
                        </div>

                        <div className="mb-6 shrink-0">
                            <p className="mb-1 block text-sm font-semibold">Subtarefas</p>
                            {subtarefas.length === 0 ? (
                                <p className="mb-3 text-sm text-neutral-500">Nenhuma subtarefa adicionada ainda</p>
                            ) : (
                                <ul className="mb-3 flex flex-col gap-2">
                                    {subtarefas.map((sub) => (
                                        <li key={sub.id} className="flex items-center gap-2 text-sm">
                                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400"></span>
                                            {sub.titulo}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <Input
                                variant="filled"
                                value={novaSubtarefa}
                                onChange={(e) => setNovaSubtarefa(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") adicionarSubtarefa();
                                }}
                                placeholder="+ Adicionar subtarefa"
                            />
                        </div>
                    </div>

                    <div className="flex min-h-0 flex-col border-t border-neutral-200 pt-6 dark:border-neutral-800 md:border-l md:border-t-0 md:pt-0 md:pl-6">
                        <ComentariosTarefa tarefaId={tarefa.id} membros={membros} />
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