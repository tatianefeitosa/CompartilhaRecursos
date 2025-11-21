const API_URL = "http://localhost:3000/auth";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector(".login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // impede a página de recarregar

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const confirmar = document.getElementById("confirmar").value;
            const btnEntrar = document.querySelector(".btn-entrar");

            // 1. validação simples no fe
            if (senha !== confirmar) {
                alert("A senha e a confirmação não são iguais!");
                return;
            }

            // feedback visual
            const textoOriginal = btnEntrar.textContent;
            btnEntrar.textContent = "Criando conta...";
            btnEntrar.disabled = true;

            try {
                // 2. enviar para o be
                // não estou enviando a 'role', o back vai criar como ESTUDANTE por padrão
                const response = await fetch(`${API_URL}/registro`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome, email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Conta criada com sucesso! Faça login para continuar.");
                    window.location.href = "login.html"; // redireciona para o login
                } else {
                    // trata erros do zod (array) ou erros simples (string)
                    if (data.erro && Array.isArray(data.erro)) {
                        alert(`Erro: ${data.erro[0].message}`); // pega o primeiro erro da lista
                    } else {
                        alert(data.erro || "Erro ao criar conta");
                    }
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro ao conectar com o servidor.");
            } finally {
                btnEntrar.textContent = textoOriginal;
                btnEntrar.disabled = false;
            }
        });
    }
});