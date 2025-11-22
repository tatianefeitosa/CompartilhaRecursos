import multer from "multer";
import path from "path";

// configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // define a pasta onde os arquivos serão salvos
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    // define o nome do arquivo: data atual + nome original
    // exemplo: 17635422-imagem.png (isso evita arquivos duplicados)
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// configuração de limites
const limits = {
  fileSize: 5 * 1024 * 1024, // limite de 5MB por arquivo
};

// exporta a configuração pronta para usar nas rotas
export const upload = multer({ 
    storage: storage,
    limits: limits 
});