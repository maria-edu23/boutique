const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Venda = sequelize.define("Venda", {
    variacaoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Variacoes', key: 'id' }
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 }
    },
    precoUnitario: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    precoTotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    cliente: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DataVenda: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'VendasBoutique',
    freezeTableName: true,
    timestamps: true
});

module.exports = Venda;