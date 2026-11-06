import { Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function SecaoMembros({ titulo, membros, usuarioId, textoVazio, podeRemover, aoRemover }) {
    return (
        <section className="rounded-xl bg-white p-5 shadow-sm dark:bg-neutral-900">
            <h2 className="mb-3">
                <span className="inline-block rounded-lg bg-info px-3 py-1 text-lg font-semibold text-carvao">
                    {titulo}
                </span>
            </h2>
            {membros.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{textoVazio}</p>
            ) : (
                <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
                    {membros.map((m) => (
                        <li key={m.id} className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-primary/10">
                            <Avatar nome={m.nome} src={m.foto} />
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {m.nome}
                                    {m.id === usuarioId && " (você)"}
                                </span>
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">{m.email}</span>
                            </div>
                            {podeRemover(m) && (
                                <Button
                                    variant="iconePerigo"
                                    onClick={() => aoRemover(m.id)}
                                    aria-label={`Remover ${m.nome}`}
                                    title="Remover membro"
                                    className="ml-auto hover:cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}