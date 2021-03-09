const Sequelize = require("sequelize");
const connection = require("../database/database")

const Category = require("../categories/Category")
const User = require("../users/User")

const Media = connection.define('medias', {

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },

    path: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    thumbnailPath: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Media) // Relationship: Category has many medias / categorias tem muitas medias (videos, imagens)
Media.belongsTo(Category) // Relationship: An media belongs to a category / Uma media pertence a uma categoria
Media.belongsTo(User) // Relationship: An media belongs to a user / Uma media pertence a um usuário
User.hasMany(Media)  // Relationship: An User has many media / Um usuário tem muitas medias



Media.sync({force: false}).then(() => console.log("Tabela Media criada"))

module.exports = Media