const express = require("express");
const authAdmin = require("../middlewares/authAdmin");
const authUser = require("../middlewares/authUser");
const slugify = require("slugify");
const router = express.Router();
const nhentai = require('nhentai-js')

const { uuid } = require('uuidv4')
const multer = require('multer')
const Tag = require("../tags/Tag")
const Media = require("./Media")
const User = require("../users/User")
const fs = require('fs')



router.get("/admin/medias", authAdmin, (req, res) => {

    Media.findAll().then(medias => {

        if(medias !== undefined) {
            
            res.render("admin/medias/index", {medias: medias})
        }

    })

})

router.get("/admin/medias/new", authAdmin, (req, res) => {

    Tag.findAll().then(tags => {

        res.render("admin/medias/new", {tags: tags})
    })
})

// const upload = multer({
//     storage: multer.diskStorage({
//       destination: 'public/uploads/',
//       filename(req, file, callback) {
     
//         return callback(null, file.fieldname = `${uuid()}-${path.extname(file.originalname)}`)
//       },
//     }),
// })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, file.fieldname = `${uuid()}-${file.originalname}`)
    },
});
  
var upload = multer({ storage: storage });
  
var uploadMultiple = upload.fields([{ name: 'media', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])





router.get("/newupload", authUser, (req, res) => {

    Tag.findAll().then(tags => {

        User.findOne({
            where: {id: req.session.user.id}
        }).then(user => {

            if(user !== undefined) {
                res.render("videos/new", {tags: tags, user: user})
            }
        })
        .catch(err => {
            res.redirect("/")
        })

    })
})

router.get("/view/" ,(req, res) => {
    let hentaiTag = req.query.tag

    if(hentaiTag !== null) {

        
        nhentai.exists(hentaiTag).then(dojin => {

            if(dojin !== undefined) {
                nhentai.getDoujin(hentaiTag).then(content => {


                

                   
                    // res.render('medias/tag', {content})
                    res.json(content)
                  
                }).catch(err => {
                    console.log(err)
                })
            }
            
        }).catch(err => {
            
            res.redirect('/')
        })
        
    }
    else {
        res.redirect("/")
    }

})

router.post('/uploadsave', authUser, uploadMultiple, function (req, res) {

    let title = req.body.title
    let tag = req.body.tag
    const filename  = req.files.media[0].fieldname
    const thumbnailFileName = req.files.thumbnail[0].fieldname
    let userId = req.body.id
    
    if(title !== null || undefined && tag !== null || undefined) {

        Media.findOne({
            where: {
                title: title
            }
        }).then(media => {

            if(media == undefined) {

                Media.create({
                    title: title,
                    slug: slugify(title),
                    path: `/uploads/${filename}`,
                    thumbnailPath: `/uploads/${thumbnailFileName}`,
                    tagId: tag,
                    userId: userId
                }).then(() => {
        
                    res.redirect("/profile/" + req.session.user.name)
                })
                .catch(err => {
                    res.redirect("/profile/" + req.session.user.name)
               })
            }
            else {
                res.redirect('/')
           }

        }).catch(err => {
            res.redirect('/newupload')
        })
    
    }

    else {
        res.redirect("/")
    }

    // return res.render('avatar', { image: `/uploads/${filename}`, size })

})

router.post('/medias/delete', authAdmin , (req, res) => {
    var id = req.body.id 
    var path = req.body.path 

    if(id != undefined) {

        if(!isNaN(id)) {
            Media.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                fs.unlink(`C:\\Users\\LivroDJX\\Desktop\\projetos\\ahegaoproject\\public${path}`, (err) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                  
                    //file removed
                })
                res.redirect('/admin/medias') 
            })

        } else {
            res.redirect('/admin/medias')  
        }

    }else {
        res.redirect('/admin/medias')
    }
})


module.exports = router