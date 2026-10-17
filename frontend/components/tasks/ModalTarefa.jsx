"use client";

import { useState } from "react";
import Input from '@/components/ui/Input';
import { X } from "lucide-react";
import { PRIORIDADES } from "@/lib/prioridades";
import { tagsMock } from "@/lib/mock";
import Modal from "@/components/ui/Modal";

export default function ModalTarefa({ tarefa, aoFechar, aoAtualizar }) {
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [descricao, setDescricao] = useState(tarefa.descricao ?? "");
    const [novaSubtarefa, setNovaSubtarefa] = useState("");

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

    return (
        <Modal aoFechar={fechar}>
            <div className="pr-10 mb-4">
                <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    onBlur={salvarTitulo}
                    className="w-full mb-4 text-2xl font-bold"
                />
            </div>
            <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
                id="status"
                value={tarefa.status}
                onChange={(e) => aoAtualizar(tarefa.id, { status: e.target.value })}
                className="border p-2 rounded mb-4"
            >
                <option value="A fazer">A fazer</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluída">Concluída</option>
            </select>

            <label htmlFor="prioridade" className="block text-gray-700 dark:text-gray-300 mb-2">Prioridade</label>
            <select
                id="prioridade"
                value={tarefa.prioridade}
                onChange={(e) => aoAtualizar(tarefa.id, { prioridade: e.target.value })}
                className="border p-2 rounded mb-4"
            >
                {Object.entries(PRIORIDADES).map(([valor, { rotulo }]) => (
                    <option key={valor} value={valor}>{rotulo}</option>
                ))}
            </select>

            <Input
                label="Data de vencimento"
                type="date"
                value={tarefa.dataVencimento}
                onChange={(e) => aoAtualizar(tarefa.id, { dataVencimento: e.target.value })}
                onClick={(e) => e.currentTarget.showPicker?.()}
            />
            <p className="block text-gray-700 dark:text-gray-300 mb-2">Tags</p>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                {tagsAplicadas.map((tag) => (
                    <span key={tag.id} className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${tag.cor}`}>
                        {tag.nome}
                        <button type="button" onClick={() => removerTag(tag.id)} aria-label={`Remover tag ${tag.nome}`}>
                            <X size={12} />
                        </button>
                    </span>
                ))}
                {tagsDisponiveis.length > 0 && (
                    <select
                        value=""
                        onChange={(e) => aplicarTag(Number(e.target.value))}
                        aria-label="Adicionar tag"
                        className="border p-1 rounded text-xs"
                    >
                        <option value="" disabled>+ Adicionar tag</option>
                        {tagsDisponiveis.map((tag) => (
                            <option key={tag.id} value={tag.id}>{tag.nome}</option>
                        ))}
                    </select>
                )}
            </div>
            <label htmlFor="descricao" className="block text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
            <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                onBlur={() => aoAtualizar(tarefa.id, { descricao })}
                className="border p-2 rounded mb-4 block w-full"
            />
            <p className="block text-gray-700 dark:text-gray-300">Subtarefas</p>
            {subtarefas.length === 0 ? (
                <p className="mb-2 ml-2 text-sm text-gray-500"> Nenhuma subtarefa adicionada ainda</p>
            ) : (
                <ul className="mb-2 flex flex-col gap-1 ml-2">
                    {subtarefas.map((sub) => (
                        <li key={sub.id} className="text-sm">{sub.titulo}</li>
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
                className="border p-2 rounded w-full text-sm"
            />
        </Modal>
    )
}