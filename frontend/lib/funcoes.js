export const FUNCOES = {
    MEMBRO: 0,
    ADMINISTRADOR: 1,
    PROPRIETARIO: 2,
};

export function podeRemoverMembro(minhaFuncao, funcaoOutro) {
    if (minhaFuncao === FUNCOES.PROPRIETARIO) return funcaoOutro !== FUNCOES.PROPRIETARIO;
    if (minhaFuncao === FUNCOES.ADMINISTRADOR) return funcaoOutro === FUNCOES.MEMBRO;
    return false;
}

export function podeConvidar(minhaFuncao) {
    return minhaFuncao === FUNCOES.PROPRIETARIO || minhaFuncao === FUNCOES.ADMINISTRADOR;
}