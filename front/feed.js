// Curtir
document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("liked");
        btn.textContent = btn.classList.contains("liked") ? "👍 Curtido" : "👍 Curtir";
    });
});

// Salvar
document.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("saved");
        btn.textContent = btn.classList.contains("saved") ? "⭐ Salvo" : "⭐ Salvar";
    });
});

// Seguir
document.querySelectorAll(".btn-seguir").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.textContent = btn.textContent === "Seguir" ? "Seguindo" : "Seguir";
    });
});

// Comentários
document.querySelectorAll(".enviar-comentario").forEach(btn => {
    btn.addEventListener("click", (e) => {

        const container = e.target.closest(".comentarios");
        const input = container.querySelector("input");
        const lista = container.querySelector(".lista-comentarios");

        if(input.value.trim() !== ""){
            const novoComentario = document.createElement("p");
            novoComentario.textContent = "Você: " + input.value;
            lista.appendChild(novoComentario);
            input.value = "";
        }
    });
});
