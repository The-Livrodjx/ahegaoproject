const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser");
const authUser = require("./middlewares/authUser")
const { uuid } = require('uuidv4')
const multer = require('multer')
const app = express();

const PORT = process.env.PORT || 6969

const connection = require("./database/database")

const Category = require("./categories/Category");
const categoriesController = require("./categories/CategoriesController");

const User = require("./users/User");
const usersController = require("./users/UsersController")

const Media = require("./medias/Media")
const mediasController = require("./medias/MediasController")

const __rootpath = __dirname

connection.
    authenticate()
    .then(() => console.log("Conexão com o banco de dados feita com sucesso"))
    .catch(err => {
        console.log(err)
    })

let timeToExpire = (Date.now() + (60 * 60 * 1000))

app.use(session({
    secret: "MKVSKGNSDGNÇLKJBDMMÇLKBFD", cookie: { maxAge: timeToExpire}
}))
    

app.set("view engine", 'ejs');

app.use(express.static("public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', usersController)
app.use('/', categoriesController)
app.use('/', mediasController)

app.get("/", authUser, (req, res) => {

    Media.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 8,
        include: [{model: Category}]
    }).then(medias => {

        if(req.session.user) {

            User.findOne({
                where: {
                    name: req.session.user.name
                }
            }).then(user => {

                Category.findAll().then(categories => {

                    res.render("index", {categories: categories, medias: medias, user: user});
                })
            })
        }
    })
})

app.get("/watch/:slug", authUser, (req, res) => {

    let slug = req.params.slug

    if(isNaN(slug) && slug !== undefined) {
        Media.findOne({
            where: {
                slug: slug
            }
        }).then(media => {

            if(media !== undefined && media !== null) {
                Category.findAll().then(categories => {

                    res.render("media", {media: media, categories: categories})
                })
            }
            else {
                res.redirect("/")
            }
    

        }).catch(err => {
            res.redirect("/")
        })
    }
    else {
        res.redirect("/")
    }
})

app.get('/category/:slug', authUser,  (req, res) => {

    let slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Media}]

    }).then(category => {
        if(category !== undefined) {
            
            if(req.session.user) {

                User.findOne({
                    where: {
                        name: req.session.user.name
                    }
                }).then(user => {
                    Category.findAll().then(categories => {
                
                        res.render('index', {categories: categories, medias: category.medias, user: user})
                    })
                })
            }
            else {
                res.redirect('/')
            }
        }
        else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

app.get('/watch', authUser, (req, res) => {
    let id = req.query.id

    if(id !== undefined) {
        Media.findOne({
            where: {
                id: id
            }
        }).then(media => {

            if(media !== undefined && media !== null) {
                Category.findAll().then(categories => {

                    res.render("media", {media: media, categories: categories})
                })
            }
            else {
                res.redirect("/")
            }
    

        }).catch(err => {
            res.redirect("/")
        })
    }
    else {
        res.redirect("/")
    }
})

app.listen(PORT, () => {console.log(`Server listening at port: ${PORT}`)})
