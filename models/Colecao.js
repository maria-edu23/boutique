const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Colecao = sequelize.define("Colecao", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Colecoes',
    freezeTableName: true,
    timestamps: true
});

module.exports = Colecao;