const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Variacao = sequelize.define("Variacao", {
    pecaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Pecas', key: 'id' }
    },
    tamanho: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    },
    precoAjuste: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    tableName: 'Variacoes',
    freezeTableName: true,
    timestamps: true,
    indexes: [{ unique: true, fields: ['pecaId', 'tamanho', 'cor'] }]
});

module.exports = Variacao;