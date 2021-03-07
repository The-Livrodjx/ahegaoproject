const Sequelize = require("sequelize");
const connection = require("../database/database")

const User = connection.define("users", {

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    profileImage: {
        type: Sequelize.STRING,
        defaultValue: "https://steamuserimages-a.akamaihd.net/ugc/948454029954307954/027516C3CCBE87F22D8259D8CB1315C9ABB100B1/",
        allowNull: false
    },

    quotation: {
        type: Sequelize.TEXT,
        defaultValue: "The user has not defined any quotations yet",
        allowNull: false
    }
})


User.sync({force: false}).then(() => console.log("Tabela Usuário criada"));

module.exports = User