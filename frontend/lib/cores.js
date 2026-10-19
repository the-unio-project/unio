const CINZA = "#6b7280";
const HEX = /^#[0-9a-fA-F]{6}$/;

export function estiloDaCor(hex) {
    const cor = HEX.test(hex) ? hex : CINZA;
    return { backgroundColor: `${cor}26`, color: cor };
}