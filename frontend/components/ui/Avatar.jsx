function iniciais(nome) {
    if (!nome?.trim()) return "?";
    const partes = nome.trim().split(/\s+/);
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
}

const TAMANHOS = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-24 w-24 text-3xl",
};

export default function Avatar({ nome, src, tamanho = "md" }) {
    const base = `${TAMANHOS[tamanho]} rounded-full shrink-0`;

    if (src) {
        return <img src={src} alt={nome} title={nome} className={`${base} object-cover`} />;
    }

    return (
        <span
            title={nome}
            className={`${base} flex items-center justify-center bg-gray-200 text-gray-700 font-medium`}
        >
            {iniciais(nome)}
        </span>
    );
}