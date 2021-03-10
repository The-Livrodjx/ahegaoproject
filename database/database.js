const { Sequelize } = require("sequelize")

const connection = new Sequelize('ahegao', 'root', '@Python123', {

    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true
    },
    timezone: '-3:00', // for writing to database
})

module.exports = connection 
