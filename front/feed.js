const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    verificarAutenticacao();
    carregarPosts();
    configurarFormularioPost();
});

function verificarAutenticacao() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const greeting = document.getElementById("user-greeting");
    if(greeting && usuario.nome) {
        greeting.textContent = `Olá, ${usuario.nome}! O que vamos compartilhar?`;
    }
}

// --- LÓGICA DE POSTS ---

async function carregarPosts() {
    const token = localStorage.getItem("token");
    const feedLista = document.getElementById("feed-lista");

    try {
        const response = await fetch(`${API_URL}/feed`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Erro ao carregar feed");

        const posts = await response.json();
        feedLista.innerHTML = ""; 

        posts.forEach(post => {
            const html = gerarHTMLPost(post);
            feedLista.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        console.error(error);
        feedLista.innerHTML = "<p>Não foi possível carregar o feed.</p>";
    }
}

function gerarHTMLPost(post) {
    const isProfessor = post.usuario?.role === 'professor' || post.usuario?.role === 'admin';
    const classeTipo = isProfessor ? 'oficial' : 'estudante';
    const textoTipo = isProfessor ? 'Publicação Oficial' : 'Estudante';
    const imgPerfil = isProfessor ? 'img/professor1.png' : 'img/aluno2.png';
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");

    const euCurti = post.likes && post.likes.some(like => like.usuarioId === usuarioLogado.id);
    const textoBotaoLike = euCurti ? "👍 Curtido" : "👍 Curtir";
    const classeBotaoLike = euCurti ? "like-btn liked" : "like-btn";

    // HTML dos comentários
    let comentariosHTML = "";
    if(post.comments && post.comments.length > 0) {
        post.comments.forEach(c => {
            comentariosHTML += `<p class="comentario-item"><strong>${c.usuario?.nome || 'Anônimo'}:</strong> ${c.texto}</p>`;
        });
    }

    // HTML dos links
    let linksHTML = '';
    if (post.links && Array.isArray(post.links)) {
        post.links.forEach(link => {
            linksHTML += `<a href="${link}" target="_blank" class="anexo-item">🔗 ${link}</a>`;
        });
    }

    return `
    <div class="post-card" id="post-${post.id}">
        <div class="post-header">
            <img src="${imgPerfil}" class="post-user-img">
            <div>
                <h3 class="user-name">${post.usuario?.nome || 'Usuário'}</h3>
                <p class="user-type ${classeTipo}">${textoTipo}</p>
            </div>
        </div>

        <p class="post-text">${post.texto}</p>

        <div class="post-anexos">
            ${linksHTML}
            ${post.arquivo ? `<a href="${API_URL}/uploads/${post.arquivo}" class="anexo-item" target="_blank">📄 Ver Anexo</a>` : ''}
        </div>

        <div class="post-actions">
            <button class="${classeBotaoLike}" onclick="toggleLike(${post.id})">
                ${textoBotaoLike} (${post.likes?.length || 0})
            </button>
            <button class="comment-btn" onclick="focarComentario(${post.id})">💬 Comentar</button>
        </div>

        <div class="comentarios">
            <div class="lista-comentarios" id="lista-comentarios-${post.id}">
                ${comentariosHTML}
            </div>
            <div class="input-comentario-area">
                <input type="text" id="input-comentario-${post.id}" placeholder="Escreva um comentário...">
                <button class="enviar-comentario" onclick="enviarComentario(${post.id})">Enviar</button>
            </div>
        </div>
    </div>
    `;
}

// --- LÓGICA DE CURTIR (LIKE) ---

window.toggleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/likes/${postId}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            // recarrega os posts para atualizar o número de likes
            carregarPosts(); 
        } else {
            console.error("Erro ao curtir");
        }
    } catch (error) {
        console.error(error);
    }
};

// --- LÓGICA DE COMENTAR ---

window.focarComentario = (postId) => {
    document.getElementById(`input-comentario-${postId}`).focus();
};

window.enviarComentario = async (postId) => {
    const input = document.getElementById(`input-comentario-${postId}`);
    const texto = input.value;
    const token = localStorage.getItem("token");

    if (!texto.trim()) return;

    try {
        const response = await fetch(`${API_URL}/comments/${postId}`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto })
        });

        if (response.ok) {
            input.value = ""; // limpa o campo
            carregarPosts(); // atualiza para mostrar o novo comentário
        } else {
            alert("Erro ao comentar");
        }
    } catch (error) {
        console.error(error);
    }
};

// --- LÓGICA DE CRIAR POST  ---

function configurarFormularioPost() {
    const form = document.getElementById("form-criar-post");
    if(!form) return;

    const inputFile = document.getElementById("arquivo-post");
    const spanArquivo = document.getElementById("nome-arquivo");

    inputFile.addEventListener('change', (e) => {
        if(e.target.files[0]) spanArquivo.textContent = e.target.files[0].name;
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const texto = document.getElementById("texto-post").value;
        const linksRaw = document.getElementById("links-post").value;
        const arquivo = inputFile.files[0];
        const token = localStorage.getItem("token");
        const btnSubmit = form.querySelector("button[type=submit]");

        const formData = new FormData();
        formData.append("texto", texto);
        if (linksRaw) {
            const linksArray = linksRaw.split(',').map(l => l.trim());
            formData.append("links", JSON.stringify(linksArray));
        }
        if (arquivo) {
            formData.append("arquivos", arquivo);
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando...";

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                form.reset();
                spanArquivo.textContent = "";
                carregarPosts();
            } else {
                alert("Erro ao criar post");
            }
        } catch (error) {
            alert("Erro de conexão");
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Publicar";
        }
    });
}