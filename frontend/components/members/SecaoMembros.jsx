import { Trash2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function SecaoMembros({ titulo, membros, usuarioId, textoVazio, podeRemover, aoRemover }) {
    return (
        <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">{titulo}</h2>
            {membros.length === 0 ? (
                <p className="text-sm text-gray-500">{textoVazio}</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {membros.map((m) => (
                        <li key={m.id} className="flex items-center gap-3">
                            <Avatar nome={m.nome} src={m.foto} />
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {m.nome}
                                    {m.id === usuarioId && " (você)"}
                                </span>
                                <span className="text-sm text-gray-500">{m.email}</span>
                            </div>
                            {podeRemover(m) && (
                                <Button
                                    variant="icone"
                                    onClick={() => aoRemover(m.id)}
                                    aria-label={`Remover ${m.nome}`}
                                    title="Remover membro"
                                    className="ml-auto hover:bg-red-500 hover:text-gray-50 dark:hover:bg-red-500 dark:hover:text-gray-50"
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