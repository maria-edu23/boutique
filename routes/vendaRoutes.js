// boutique-app/routes/vendaRoutes.js

const express = require("express");
const router = express.Router();
const vendaController = require("../controllers/vendaController");

// Rotas de Venda
router.get("/", vendaController.listar);     // GET /venda (Listar vendas e relatórios)
router.post("/add", vendaController.criar);  // POST /venda/add (Registrar uma nova venda)

// Rotas auxiliares (se você quiser edição/detalhe de venda)
router.get("/relatorio", vendaController.relatorio); // GET /venda/relatorio
// router.get("/:id", vendaController.obterDetalhe); // Para ver detalhes de uma venda

module.exports = router;