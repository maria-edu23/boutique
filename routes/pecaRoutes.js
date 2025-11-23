// routes/pecaRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const pecaController = require("../controllers/pecaController");

// Configuração do Multer (salvar na pasta public/uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


// Rotas de Peças (Produto Principal)
router.get("/", pecaController.listar); 
router.post("/add", upload.single("imagem"), pecaController.criar);
router.post("/edit/:id", upload.single("imagem"), pecaController.editar);
router.get("/delete/:id", pecaController.remover);

// Rotas de Variação (Novo)
// Exemplo: Formulário para adicionar variação
router.post("/variacao/add", pecaController.adicionarVariacao); 

module.exports = router;