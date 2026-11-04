"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { atualizarPerfilApi, baixarFotoAtual } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function PaginaPerfil({ usuario }) {
    const { recarregarUsuario } = useAuth();
    const [nickname, setNickname] = useState(usuario.nickname ?? "");
    const [bio, setBio] = useState(usuario.bio ?? "");
    const [fotoNova, setFotoNova] = useState(null);
    const [previa, setPrevia] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const alterado =
        nickname.trim() !== (usuario.nickname ?? "") ||
        bio.trim() !== (usuario.bio ?? "") ||
        fotoNova !== null;

    function escolherFoto(e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;
        setFotoNova(arquivo);
        setPrevia(URL.createObjectURL(arquivo));
    }

    function descartar() {
        setNickname(usuario.nickname ?? "");
        setBio(usuario.bio ?? "");
        setFotoNova(null);
        setPrevia(null);
        setErro("");
    }

    async function salvar(e) {
        e.preventDefault();
        if (salvando) return;
        if (!fotoNova && !usuario.profile_picture) {
            setErro("Você precisa escolher uma foto de perfil.");
            return;
        }

        setSalvando(true);
        setErro("");
        try {
            const foto = fotoNova ?? (await baixarFotoAtual(usuario.profile_picture));
            await atualizarPerfilApi({ nickname: nickname.trim(), bio: bio.trim(), foto });
            await recarregarUsuario();
            setFotoNova(null);
            setPrevia(null);
            toast.success("Perfil atualizado.");
        } catch {
            setErro("Não foi possível atualizar o perfil.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <form
            onSubmit={salvar}
            className="flex max-w-xl flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-neutral-900"
        >
            <div className="flex items-center gap-4">
                <Avatar nome={nickname} src={previa ?? usuario.profile_picture} tamanho="lg" />
                <label
                    htmlFor="foto-perfil"
                    className="cursor-pointer rounded-lg border border-carvao px-4 py-2 text-sm font-medium text-carvao transition hover:bg-primary/10 dark:border-neutral-500 dark:text-neutral-200"
                >
                    Trocar foto
                </label>
                <input
                    id="foto-perfil"
                    type="file"
                    accept="image/*"
                    onChange={escolherFoto}
                    className="sr-only"
                />
            </div>

            <Input
                variant="filled"
                label="Nome"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
            />

            <Input variant="filled" label="E-mail" value={usuario.email} disabled />

            <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Biografia
                </label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl bg-campo px-4 py-3 text-carvao placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-800 dark:text-white"
                    rows={3}
                />
            </div>

            {erro && <p className="text-sm text-erro">{erro}</p>}

            <div className="flex justify-end gap-3">
                <Button type="button" variant="contorno" onClick={descartar} disabled={!alterado || salvando}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={!alterado || nickname.trim() === "" || salvando}>
                    {salvando ? "Salvando..." : "Salvar edições"}
                </Button>
            </div>
        </form>
    );
}