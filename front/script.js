// Textos para animar
const textos1 = [
    "Monte seu cronograma de forma gratuita",
    "Organize sua rotina acadêmica com facilidade",
    "Acompanhe seu progresso em tempo real",
     "Interaja com professores e alunos",
    "Compartilhe conteúdos com a comunidade",
    "Descubra novas formas de estudar"
];

let t1 = 0;


function trocarTexto(id, textos, index) {
    const elemento = document.getElementById(id);
    elemento.style.opacity = 0;

    setTimeout(() => {
        elemento.textContent = textos[index];
        elemento.style.opacity = 1;
    }, 500);
}

// Alterna texto da seção 1
setInterval(() => {
    t1 = (t1 + 1) % textos1.length;
    trocarTexto("changingText1", textos1, t1);
}, 4000);

