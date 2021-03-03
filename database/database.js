const { Sequelize } = require("sequelize")

const connection = new Sequelize('ahegao', 'root', '@Python123', {

    host: "localhost",
    dialect: "mysql",
    timezone: "-3:00"
})

module.exports = connection 