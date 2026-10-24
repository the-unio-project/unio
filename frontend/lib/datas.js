const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatarData(dataIso) {
    if (!dataIso) return "";
    const [, mes, dia] = dataIso.split("-");
    return `${Number(dia)} ${MESES[Number(mes) - 1]}`;
}