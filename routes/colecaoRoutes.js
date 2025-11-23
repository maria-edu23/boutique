// boutique-app/routes/colecaoRoutes.js

const express = require("express");
const router = express.Router();
const colecaoController = require("../controllers/colecaoController");

// Rotas de Coleção (CRUD simples, geralmente usado via AJAX ou formulário direto)
router.get("/listar", colecaoController.listar); // GET /colecao/listar (via AJAX)
router.post("/add", colecaoController.criar);    // POST /colecao/add
router.post("/edit/:id", colecaoController.editar); // POST /colecao/edit/1
router.get("/delete/:id", colecaoController.remover); // GET /colecao/delete/1

module.exports = router;