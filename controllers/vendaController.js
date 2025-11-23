// boutique-app/controllers/vendaController.js

const { Venda, Variacao, Peca, Colecao } = require("../models");
const { Op } = require('sequelize');
const sequelize = require('sequelize');

module.exports = {
    // -------------------------------------------------------------------
    // MÉTODO 1: CRIAR VENDA (CREATE) - Rota POST /venda/add
    // -------------------------------------------------------------------
    criar: async (req, res) => {
        const t = await Venda.sequelize.transaction(); // Inicia uma transação

        try {
            const { variacaoId, quantidade, cliente } = req.body;
            const quantidadeInt = parseInt(quantidade);

            // 1. Busca a Variação (SKU) e a Peça associada
            const variacao = await Variacao.findOne({
                where: { id: variacaoId },
                include: [{ model: Peca, as: 'peca' }], // Necessário para pegar o precoBase
                transaction: t // Inclui na transação
            });

            if (!variacao) {
                await t.rollback();
                return res.status(404).json({ success: false, message: 'Variação (Tamanho/Cor) não encontrada.' });
            }
            if (variacao.estoque < quantidadeInt) {
                await t.rollback();
                return res.status(400).json({ success: false, message: `Estoque insuficiente! Apenas ${variacao.estoque} unidades disponíveis.` });
            }

            // 2. Calcular Preços
            // Usa precoAjuste da variação se existir, senão usa precoBase da peça.
            const precoUnitario = variacao.precoAjuste || variacao.peca.precoBase; 
            const precoTotal = precoUnitario * quantidadeInt;
            
            // 3. Registrar a Venda
            await Venda.create({
                variacaoId: parseInt(variacaoId),
                quantidade: quantidadeInt,
                precoUnitario,
                precoTotal,
                cliente,
                dataVenda: new Date()
            }, { transaction: t });

            // 4. BAIXA DE ESTOQUE (Atualização crítica)
            await variacao.update({ 
                estoque: variacao.estoque - quantidadeInt 
            }, { transaction: t });
            
            // 5. Confirma a transação
            await t.commit(); 
            res.json({ success: true, message: 'Venda registrada e estoque atualizado.' });

        } catch (error) {
            await t.rollback(); // Desfaz todas as operações em caso de erro
            console.error('Erro ao registrar venda:', error);
            res.status(500).json({ success: false, message: 'Falha ao registrar venda: ' + error.message });
        }
    },

    // -------------------------------------------------------------------
    // MÉTODO 2: LISTAR VENDAS (READ) - Rota GET /venda/
    // -------------------------------------------------------------------
    listar: async (req, res) => {
        try {
            const vendas = await Venda.findAll({
                include: [{
                    model: Variacao,
                    as: 'variacao',
                    include: [{
                        model: Peca, // Inclui a Peça para saber qual item foi vendido
                        as: 'peca'
                    }]
                }],
                order: [['dataVenda', 'DESC']]
            });

            // Lógica simples de estatísticas
            const valorTotal = vendas.reduce((sum, v) => sum + v.precoTotal, 0);

            res.json({
                vendas,
                estatisticas: {
                    totalVendas: vendas.length,
                    valorTotal: valorTotal,
                }
            });
        } catch (error) {
            console.error('Erro ao listar vendas:', error);
            res.status(500).json({ error: 'Erro ao listar vendas' });
        }
    },
    
    // -------------------------------------------------------------------
    // MÉTODO 3: RELATÓRIO (READ) - Rota GET /venda/relatorio
    // -------------------------------------------------------------------
    relatorio: async (req, res) => {
        // Implementação para gerar relatórios por data, similar ao seu projeto anterior
        // Usará o parâmetro `req.query` (dataInicio, dataFim) para filtrar
        res.status(501).send("Relatório de Vendas: Funcionalidade a ser implementada com filtros de data.");
    }
};