const Sequelize = require("sequelize");
const connection = require("../database/database")

const User = require("../users/User")
const Tag = require("../tags/Tag")

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


Tag.hasMany(Media) // Relationship: Tag has many medias / tags tem muitas medias (videos, imagens)
Media.belongsTo(Tag) // Relationship: An media belongs to a tag / Uma media pertence a uma tag
Media.belongsTo(User) // Relationship: An media belongs to a user / Uma media pertence a um usuário
User.hasMany(Media)  // Relationship: An User has many media / Um usuário tem muitas medias



Media.sync({force: false}).then(() => console.log("Tabela Media criada"))

module.exports = Media