const API_URL = "http://localhost:3000/auth";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // não deixa a página recarregar

            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;
            const btnEntrar = document.querySelector(".btn-entrar");

            // feedback visual
            const textoOriginal = btnEntrar.textContent;
            btnEntrar.textContent = "Entrando...";
            btnEntrar.disabled = true;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    // salva o token
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("usuario", JSON.stringify(data.usuario));

                    // REDIRECIONAMENTO
                    const role = data.usuario.role.toUpperCase(); // garante que está em maiúsculo

                    if (role === "ADMIN") {
                        window.location.href = "oficial.html";
                    } else if (role === "ESTUDANTE") {
                        window.location.href = "estudante.html"; 
                    } else if (role === "PROFESSOR") {
                        window.location.href = "explorar.html"
                    } else {
                        window.location.href = "index.html";
                    }

                } else {
                    alert(data.erro || "Erro ao fazer login");
                }
            } catch (error) {
                console.error(error);
                alert("Erro ao conectar com o servidor.");
            } finally {
                btnEntrar.textContent = textoOriginal;
                btnEntrar.disabled = false;
            }
        });
    }
});