function salvarCookie(nome, dados) {
    const jsonStr = JSON.stringify(dados);
    const dataExpira = new Date();
    dataExpira.setTime(dataExpira.getTime() + (24 * 60 * 60 * 1000));
    document.cookie = nome + "=" + encodeURIComponent(jsonStr) + "; expires=" + dataExpira.toUTCString() + "; path=/; SameSite=Lax";
}

function lerCookie(nome) {
    const nomeChave = nome + "=";
    const cookiesArray = document.cookie.split(';');
    for(let i = 0; i < cookiesArray.length; i++) {
        let c = cookiesArray[i].trim();
        if (c.indexOf(nomeChave) === 0) {
            return JSON.parse(decodeURIComponent(c.substring(nomeChave.length, c.length)));
        }
    }
    return []; 
}
