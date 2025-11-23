const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("boutique", "root", "123456789", {
    host: "localhost",
    dialect: "mysql",
    legging: false
});

module.exports = sequelize;