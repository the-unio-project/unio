import { useState, useEffect } from "react";
import { listarMinhasTarefas, listarVencendoHoje, listarAtrasadas } from "@/lib/api";

export default function useTarefasDashboard() {
    const [dados, setDados] = useState({ minhas: [], hoje: [], atrasadas: [] });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let foraDaTela = false;

        async function carregar() {
            try {
                const [minhas, hoje, atrasadas] = await Promise.all([
                    listarMinhasTarefas(),
                    listarVencendoHoje(),
                    listarAtrasadas(),
                ]);
                if (!foraDaTela) setDados({ minhas, hoje, atrasadas });
            } catch {
                if (!foraDaTela) setErro("Não foi possível carregar suas tarefas.");
            } finally {
                if (!foraDaTela) setCarregando(false);
            }
        }

        carregar();
        return () => { foraDaTela = true; };
    }, []);

    return { ...dados, carregando, erro };
}