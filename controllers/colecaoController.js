// boutique-app/controllers/colecaoController.js

const { Colecao } = require("../models");

module.exports = {
    // Lista todas as coleções (útil para popular filtros via AJAX)
    listar: async (req, res) => {
        try {
            const colecoes = await Colecao.findAll({
                order: [['nome', 'ASC']]
            });
            res.json(colecoes);
        } catch (error) {
            console.error('Erro ao listar coleções:', error);
            res.status(500).json({ error: 'Erro ao listar coleções' });
        }
    },

    // Cria uma nova Coleção (Ex: Inverno 2025)
    criar: async (req, res) => {
        const { nome, descricao } = req.body;
        try {
            await Colecao.create({ nome, descricao });
            res.redirect("/"); // Volta para a página principal
        } catch (error) {
            console.error('Erro ao criar coleção:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                 res.status(400).send(`
                     <h2>Erro ao criar Coleção</h2>
                     <p>A coleção "<strong>${nome}</strong>" já existe.</p>
                     <a href="/" style="display: inline-block; padding: 10px 20px; background: #960d3d; color: #fff; text-decoration: none;">Voltar</a>
                 `);
            } else {
                 res.status(500).send('Erro ao criar coleção: ' + error.message);
            }
        }
    },
    
    // Edita uma Coleção existente
    editar: async (req, res) => {
        const { id } = req.params;
        const { nome, descricao } = req.body;
        try {
            await Colecao.update(
                { nome, descricao },
                { where: { id } }
            );
            res.redirect("/");
        } catch (error) {
            console.error('Erro ao editar coleção:', error);
            res.status(500).send('Erro ao editar coleção: ' + error.message);
        }
    },

    // Remove uma Coleção
    remover: async (req, res) => {
        try {
            const { id } = req.params;
            // Se houverem peças associadas a esta coleção, a remoção pode falhar 
            // devido à restrição de chave estrangeira (a menos que configurado CASCADE).
            await Colecao.destroy({ where: { id } });
            res.redirect("/");
        } catch (error) {
            console.error('Erro ao remover coleção:', error);
            res.status(500).send('Erro ao remover coleção. Verifique se existem peças associadas.');
        }
    }
};