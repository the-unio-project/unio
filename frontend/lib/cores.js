const CINZA = "#6b7280";
const HEX = /^#[0-9a-fA-F]{6}$/;

export function estiloDaCor(hex) {
    const cor = HEX.test(hex) ? hex : CINZA;
    return { backgroundColor: `${cor}26`, color: cor };
}

export function corSolida(hex) {
    const cor = HEX.test(hex) ? hex : CINZA;
    const r = parseInt(cor.slice(1, 3), 16);
    const g = parseInt(cor.slice(3, 5), 16);
    const b = parseInt(cor.slice(5, 7), 16);
    const brilho = (r * 299 + g * 587 + b * 114) / 1000;
    return { backgroundColor: cor, color: brilho >= 150 ? "#141414" : "#ffffff" };
}