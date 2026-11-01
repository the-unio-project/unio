const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatarData(data) {
    if (!data) return "Sem data";
    const [, mes, dia] = data.split("-");
    return `${Number(dia)} ${MESES[Number(mes) - 1]}`;
}

export function formatarDataLista(data) {
    if (!data) return "-";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}