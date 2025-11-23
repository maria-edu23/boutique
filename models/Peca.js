const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Peca = sequelize.define("Peca", {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precoBase: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate:{ min: 0 }
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    colecaoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Colecoes', key: 'id' }
    }
}, {
    tableName: 'Pecas',
    freezeTableName: true,
    timestamps: true
});

module.exports = Peca;