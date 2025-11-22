const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    verificarAutenticacao();
    carregarPerfil();
    carregarMeusPosts();
    configurarModal();
});

function verificarAutenticacao() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

function carregarPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    
    const nomeEl = document.querySelector(".profile-name h2");
    if (nomeEl && usuario.nome) nomeEl.textContent = usuario.nome;

}

function configurarModal() {
    const btnNovo = document.querySelector(".btn.primary"); // botão "+ nova publicação"
    const modal = document.getElementById("modal-post");
    const btnFechar = document.getElementById("btn-fechar-modal");
    const form = document.getElementById("form-criar-post");
    const inputFile = document.getElementById("arquivo-post");
    const spanArquivo = document.getElementById("nome-arquivo");

    // abrir
    btnNovo.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // fechar
    btnFechar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // mostrar nome do arquivo
    inputFile.addEventListener('change', (e) => {
        if(e.target.files[0]) spanArquivo.textContent = e.target.files[0].name;
    });

    // enviar Post
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

        btnSubmit.textContent = "Enviando...";
        btnSubmit.disabled = true;

        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                alert("Publicação criada com sucesso!");
                modal.style.display = "none";
                form.reset();
                spanArquivo.textContent = "";
                carregarMeusPosts(); // atualiza a lista
            } else {
                alert("Erro ao publicar");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão");
        } finally {
            btnSubmit.textContent = "Publicar";
            btnSubmit.disabled = false;
        }
    });
}

async function carregarMeusPosts() {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const listaPosts = document.querySelector(".posts");

    try {
        const response = await fetch(`${API_URL}/posts`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const posts = await response.json();

        listaPosts.innerHTML = "";

        // filtra apenas os posts que tem o ID do usuário logado
        const meusPosts = posts.filter(p => p.usuario && p.usuario.id === usuario.id);

        if (meusPosts.length === 0) {
            listaPosts.innerHTML = "<p style='text-align:center; color:#666;'>Nenhuma publicação ainda.</p>";
            return;
        }

        meusPosts.forEach(post => {
            const html = `
            <div class="post-card" style="position: relative;">
                
                <button onclick="deletarPost(${post.id})" 
                        style="position: absolute; top: 15px; right: 15px; border: none; background: none; cursor: pointer; font-size: 1.2em;" 
                        title="Excluir publicação">
                    🗑️
                </button>

                <span class="post-icon">📄</span>
                <div>
                    <h3>${post.texto ? post.texto.substring(0, 50) : 'Sem texto'}...</h3>
                    <p class="posted">
                        ${post.arquivo ? '📎 Com anexo' : ''} 
                        ${post.links ? '🔗 Com links' : ''}
                    </p>
                </div>
            </div>
            `;
            listaPosts.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        console.error("Erro ao carregar posts", error);
    }
}

// --- LÓGICA DE DELETAR POST ---
window.deletarPost = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta publicação? Essa ação não pode ser desfeita.")) {
        return;
    }

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Post excluído com sucesso!");
            carregarMeusPosts(); // recarrega a lista para sumir com o post
        } else {
            const err = await response.json();
            alert("Erro: " + (err.erro || "Não foi possível excluir"));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão");
    }
};