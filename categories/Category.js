const Sequelize = require("sequelize")

const connection = require("../database/database")

const Category = connection.define('categories', {

    id: {
        type: Sequelize.INT,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    slug: {
        type: Sequelize.STRING,
        allowNull: false 
    }
})

Category.sync({force: false}).then(() => console.log("Tabela Category criada"))

module.exports = Category