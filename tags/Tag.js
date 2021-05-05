const {Sequelize} = require("sequelize")
const connection = require("../database/database")

const Tag = connection.define("tags", {

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    slug: {
       type: Sequelize.STRING,
       allowNull: false 
    }
})

Tag.sync({force: false}).then(() => console.log("Tabela tags criada com sucesso")).catch(err => console.log(err))

module.exports = Tag