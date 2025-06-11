function mostrarPagina(id, event) {
    document.querySelectorAll(".pagina").forEach((pagina) => {
        pagina.classList.remove("ativa");
    });
    document.getElementById(id).classList.add("ativa");

    document.querySelectorAll("nav button").forEach((btn) => {
        btn.classList.remove("ativo");
    });

    event.currentTarget.classList.add("ativo");
}
