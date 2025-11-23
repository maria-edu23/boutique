const Peca = require("./Peca");
const Colecao = require("./Colecao");
const Variacao = require("./Variacao");
const Venda = require("./Venda");

// Relacionamento Colecao <-> Peca (1:N)
Colecao.hasMany(Peca, { foreignKey: 'colecaoId', as: 'pecas' });
Peca.belongsTo(Colecao, { foreignKey: 'colecaoId', as: 'colecao' });

// Relacionamento Peca <-> Variacao (1:N)
Peca.hasMany(Variacao, { foreignKey: 'pecaId', as: 'variacoes' });
Variacao.belongsTo(Peca, { foreignKey: 'pecaId', as: 'peca' });

// Relacionamento Variacao <-> Venda (1:N) - Crucial para o estoque
Variacao.hasMany(Venda, { foreignKey: 'variacaoId', as: 'vendas' });
Venda.belongsTo(Variacao, { foreignKey: 'variacaoId', as: 'variacao' });

module.exports = {
    Peca,
    Colecao,
    Variacao,
    Venda
};