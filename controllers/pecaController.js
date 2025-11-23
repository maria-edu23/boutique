// controllers/pecaController.js
const { Peca, Colecao, Variacao } = require("../models"); 
const path = require("path");
const fs = require("fs"); // Módulo nativo para manipulação de arquivos (remoção de imagem)

module.exports = {
    // -------------------------------------------------------------------
    // MÉTODO 1: LISTAR (READ) - Rota GET /
    // -------------------------------------------------------------------
    listar: async (req, res) => {
        try {
            // Busca todas as Peças, incluindo a Coleção e todas as Variações (SKUs)
            const pecas = await Peca.findAll({
                include: [
                    { model: Colecao, as: 'colecao' },
                    { model: Variacao, as: 'variacoes' }
                ],
                order: [['nome', 'ASC']]
            });
            
            // Busca todas as Coleções para popular o filtro/formulários
            const colecoes = await Colecao.findAll({
                order: [['nome', 'ASC']]
            });
            
            // Renderiza a view 'index.ejs' passando os dados
            res.render("index", { 
                pecas, 
                colecoes,
                appTitle: 'Boutique Gerenciamento'
            });
        } catch (error) {
            console.error('Erro ao listar peças:', error);
            res.status(500).send('Erro ao listar peças da boutique.');
        }
    },
    
    // -------------------------------------------------------------------
    // MÉTODO 2: CRIAR PEÇA (CREATE) - Rota POST /add
    // -------------------------------------------------------------------
    criar: async (req, res) => {
        try {
            const { nome, precoBase, colecaoId } = req.body;
            // Verifica se um arquivo foi enviado pelo Multer
            let imagem = req.file ? req.file.filename : null; 

            await Peca.create({ 
                nome, 
                precoBase, 
                imagem,
                colecaoId: colecaoId || null // Permite colecaoId ser null
            });
            res.redirect("/");
        } catch (error) {
            console.error('Erro ao criar peça:', error);
            res.status(500).send('Erro ao criar peça: ' + error.message);
        }
    },
    
    // -------------------------------------------------------------------
    // MÉTODO 3: EDITAR PEÇA (UPDATE) - Rota POST /edit/:id
    // -------------------------------------------------------------------
    editar: async (req, res) => {
        const { id } = req.params;
        const { nome, precoBase, colecaoId } = req.body;
        
        try {
            const pecaAtual = await Peca.findByPk(id);
            if (!pecaAtual) {
                return res.status(404).send('Peça não encontrada para edição.');
            }

            let imagem = pecaAtual.imagem;
            
            // Se um novo arquivo de imagem foi enviado, atualiza o nome
            if (req.file) {
                // Opcional: Remover imagem antiga do disco
                if (pecaAtual.imagem) {
                    const caminhoAntigo = path.join(__dirname, '..', 'public', 'uploads', pecaAtual.imagem);
                    if (fs.existsSync(caminhoAntigo)) {
                        fs.unlinkSync(caminhoAntigo);
                    }
                }
                imagem = req.file.filename;
            }

            await Peca.update(
                { 
                    nome, 
                    precoBase, 
                    imagem, 
                    colecaoId: colecaoId || null 
                },
                { where: { id } }
            );
            
            res.redirect("/");
        } catch (error) {
            console.error('Erro ao editar peça:', error);
            res.status(500).send('Erro ao editar peça: ' + error.message);
        }
    },

    // -------------------------------------------------------------------
    // MÉTODO 4: REMOVER PEÇA (DELETE) - Rota GET /delete/:id
    // -------------------------------------------------------------------
    remover: async (req, res) => {
        try {
            const { id } = req.params; 
            
            const peca = await Peca.findByPk(id);
            if (!peca) {
                return res.status(404).send('Peça não encontrada para remoção.');
            }

            // Opcional: Remover imagem do disco
            if (peca.imagem) {
                const caminhoImagem = path.join(__dirname, '..', 'public', 'uploads', peca.imagem);
                if (fs.existsSync(caminhoImagem)) {
                    fs.unlinkSync(caminhoImagem);
                }
            }

            // O Sequelize irá cuidar de remover as Variações relacionadas (Cascata) se
            // a relação foi configurada com onDelete: 'CASCADE' no model Variacao.js.
            // Se não foi configurado, você deve remover as Variações manualmente antes:
            // await Variacao.destroy({ where: { pecaId: id } }); 

            await Peca.destroy({ where: { id } }); 
            res.redirect("/"); 
        } catch (error) {
            console.error('Erro ao remover peça:', error);
            // Pode haver erro se existirem VENDAS relacionadas à VARIAÇÃO desta PEÇA.
            res.status(500).send('Erro ao remover peça. Verifique se existem Vendas associadas.');
        }
    },
    
    // -------------------------------------------------------------------
    // MÉTODO 5: ADICIONAR VARIAÇÃO (CREATE) - Rota POST /variacao/add
    // -------------------------------------------------------------------
    adicionarVariacao: async (req, res) => {
        try {
            const { pecaId, tamanho, cor, estoque, precoAjuste } = req.body;
            
            const pecaExiste = await Peca.findByPk(pecaId);
            if (!pecaExiste) {
                return res.status(404).send('Peça não encontrada para adicionar a variação.');
            }

            // Cria a Variação (SKU) com o estoque inicial
            await Variacao.create({
                pecaId: parseInt(pecaId),
                tamanho,
                cor,
                estoque: parseInt(estoque) || 0,
                // O preço ajuste é opcional e pode ser null
                precoAjuste: precoAjuste ? parseFloat(precoAjuste) : null
            });
            
            res.redirect("/");
        } catch (error) {
            console.error('Erro ao adicionar variação:', error);
            
            // Tratamento de erro de violação de restrição UNIQUE (pecaId, tamanho, cor)
            if (error.name === 'SequelizeUniqueConstraintError') {
                 res.status(400).send(`
                    <h2>Erro ao adicionar Variação</h2>
                    <p>Essa combinação de **Tamanho (${tamanho})** e **Cor (${cor})** já existe para esta peça.</p>
                    <p>Por favor, edite a variação existente para alterar o estoque.</p>
                    <a href="/" style="display: inline-block; padding: 10px 20px; background: #960d3d; color: #fff; text-decoration: none; margin-top: 20px; border-radius: 5px;">Voltar ao Catálogo</a>
                 `);
            } else {
                 res.status(500).send('Erro ao adicionar variação: ' + error.message);
            }
        }
    },
    
    // ... Aqui você adicionaria métodos para editar/remover Variações específicas ...
};