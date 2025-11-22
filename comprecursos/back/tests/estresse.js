const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJqb2FvQGVtYWlsLmNvbSIsInJvbGUiOiJlc3R1ZGFudGUiLCJpYXQiOjE3NjM3ODYxNjYsImV4cCI6MTc2Mzg3MjU2Nn0.QRPPAHP06WNlTDTgCSp8O54J-VN-gKs6e_rjeDW7QD8"; 

const URL = "http://localhost:3000/posts";
const CONCORRENCIA = 50;

// arquivo dummy temporário para teste
if (!fs.existsSync('teste.txt')) fs.writeFileSync('teste.txt', 'Conteudo de teste');

const enviarPost = async (i) => {
    const form = new FormData();
    form.append('texto', `Teste de Estresse ${i}`);
    form.append('arquivos', fs.createReadStream('teste.txt')); // simula arquivo

    try {
        const start = Date.now();
        await axios.post(URL, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        const duration = Date.now() - start;
        console.log(`✅ Req ${i}: Sucesso (${duration}ms)`);
        return { status: 'sucesso', duration };
    } catch (error) {
        console.log(`❌ Req ${i}: FALHOU - ${error.response?.data?.erro || error.message}`);
        return { status: 'erro', erro: error.message };
    }
};

const rodarTeste = async () => {
    console.log(`🔥 Iniciando Ataque: ${CONCORRENCIA} uploads simultâneos...`);
    
    // array de promessas (requisições simultâneas)
    const promessas = [];
    for (let i = 0; i < CONCORRENCIA; i++) {
        promessas.push(enviarPost(i));
    }

    // dispara tudo ao mesmo tempo
    const resultados = await Promise.all(promessas);

    const sucessos = resultados.filter(r => r.status === 'sucesso').length;
    const falhas = resultados.filter(r => r.status === 'erro').length;

    console.log("\n=== RESULTADO DO ESTRESSE ===");
    console.log(`Total: ${CONCORRENCIA}`);
    console.log(`Sucessos: ${sucessos} 🟢`);
    console.log(`Falhas: ${falhas} 🔴`);
    
    if (falhas > 0) {
        console.log("CONCLUSÃO: O Banco de Dados bloqueou ou o servidor não aguentou. Teoria confirmada!");
    } else {
        console.log("CONCLUSÃO: O sistema aguentou (talvez precisemos aumentar a carga).");
    }
};

rodarTeste();