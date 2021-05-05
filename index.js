const express = require("express");
const session = require("express-session")
const flash = require("express-flash")
const authUser = require("./middlewares/authUser")

const cors = require("cors")

const app = express();

const PORT = process.env.PORT || 6969

const connection = require("./database/database")

const hmtai = require("hmtai");

const DabiImages = require("dabi-images");
const DabiClient = new DabiImages.Client();

const Tag = require("./tags/Tag")
const tagsController = require("./tags/TagsController")

const User = require("./users/User");
const usersController = require("./users/UsersController")

const Media = require("./medias/Media")
const mediasController = require("./medias/MediasController")



app.use(cors());


// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, Accept,Authorization,Origin");
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
// });

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
app.use(flash())
app.use(express.json())
app.use(express.urlencoded({extended: false}));

app.use('/', usersController)
app.use('/', mediasController)
app.use('/', tagsController)

app.get("/", authUser, (req, res) => {

    Media.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 12,
        include: {model: User}
    }).then((medias) => {

        if(req.session.user) {

            User.findOne({
                where: {
                    name: req.session.user.name
                }
            }).then(user => {
    
                Tag.findAll().then(tags => {
                    
                    // User.findOne({
                    //     where: {
                    //         id:  medias[0].userId
                    //     }
                    // }).then(author => {
                    res.render("index", {tags: tags, medias: medias, user: user}); //, author: author.name}
                    // })
       
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
                Tag.findAll().then(tags => {

                    res.render("media", {media: media, tags: tags})
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

app.get('/tag/:slug', authUser,  (req, res) => {

    let slug = req.params.slug

    Tag.findOne({
        where: {
            slug: slug
        },
        include: [{model: Media, limit: 12, include: [{model: User}]}],

    }).then(tag => {
        if(tag !== undefined) {
            
            if(req.session.user) {

                User.findOne({
                    where: {
                        name: req.session.user.name
                    }
                }).then(user => {
                    Tag.findAll().then(tags => {
                
                        res.render('index', {tags: tags, medias: tag.medias, user: user})
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
            },
            include: {model: Tag}
        }).then(media => {

            if(media !== undefined && media !== null) {

                if(req.session.user !== undefined) {
                    User.findOne({
                        where: {name: req.session.user.name}
                    }).then(user => {
                        Tag.findAll().then(tags => {
                            
                            Media.findAll({
                                where: {tagId: media.tag.id},
                                limit: 8,
                                order: [['id', 'DESC']],
                                include: {model: User}
                            }).then(videosRecent => {

                                res.render("media", {media: media, tags: tags, user: user, title: media.tag.title, medias: videosRecent})
                            })
                        
                        })
                    })
            
                }

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

app.get("/page/:num", authUser, (req, res) => {
    
    let page = req.params.num 
    let offset = 0;

    if(isNaN(page) || page == 1) {
        offset = 0;
    }
    else {
        offset = (parseInt(page) - 1) * 12
    }

    Media.findAndCountAll({
        limit: 12,
        offset: offset,
        order: [
            ['id', 'DESC']
        ],
        include: {model: User}
    }).then((medias) => {

        var next;

        if(offset + 12 >= medias.count) {
            next = false;
        }
        else {
            next = true;
        }


        var result = {
            page: parseInt(page),
            next: next,
        }
        if(req.session.user) {
    
            User.findOne({
                where: {
                    name: req.session.user.name
                }
            }).then(user => {
        
                Tag.findAll().then(tags => {
                        
                
                    res.render("page", {tags: tags, medias: medias, user: user, result: result}); 
    
                })
            })
        }
            
            
    })
})

app.get("/testandoAPI", (req, res) => {

    DabiClient.nsfw.real.random().then(content => {
        res.send(`<img src="${content.url}" width="500px" height="500px"><br>
        <img src="${hmtai.neko()}" width="500px" height="500px">)
        <img src="${hmtai.nsfw.ahegao()}" width="500px" height="500px">
        <img src="${hmtai.nsfw.hentai()}" width="500px" height="500px">
        <img src="${hmtai.nsfw.masturbation()}" width="500px" height="500px">
        <img src="${hmtai.nsfw.tentacles()}" width="500px" height="500px">
        <img src="${hmtai.nsfw.yuri()}" width="500px" height="500px">
        <img src="${hmtai.nsfw.gif()}" width="500px" height="500px">`)
        // outputs data with image url, possible source and other stuff
    }).catch(error => {
        console.log(error);
        // outputs error
    });

    // const { HAnimeAPI } = require('hanime');
    // const apiHentai = new HAnimeAPI();

    // apiHentai.search('Masturbation').then(results => {

    //     apiHentai.get_video(results.videos[0]).then(video => {

    //         res.json(video)
    //     })
    // })


    // nhentai.exists('255565').then(dojin => {

    //     if(dojin !== undefined) {
    //         nhentai.getDoujin('255565').then(content => {


            

    //            res.send(content.pages[0])

    //         })
    //     }
        
    // })
    
    // res.send("<img src='https://hentaihaven.org/package/2017/12/HH-Kimekoi-Takane-no-Hana-to-Osananajimi-ga-Kimatta-Riyuu-Episode-2-DVD-80D6E29D.mp4_snapshot_12.30_2017.12.31_00.14.52-1024x576.png'>")
})


app.listen(PORT, () => {console.log(`Server listening at port: ${PORT}`)})
