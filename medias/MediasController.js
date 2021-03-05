const express = require("express");
const authAdmin = require("../middlewares/authAdmin");
const slugify = require("slugify");
const router = express.Router();
const { uuid } = require('uuidv4')
const multer = require('multer')
const Category = require("../categories/Category")
const Media = require("./Media")
const fs = require('fs')



router.get("/admin/medias", authAdmin, (req, res) => {

    Media.findAll().then(medias => {

        if(medias !== undefined) {
            
            res.render("admin/medias/index", {medias: medias})
        }

    })

})

router.get("/admin/medias/new", authAdmin, (req, res) => {

    Category.findAll().then(categories => {

        res.render("admin/medias/new", {categories: categories})
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

router.post('/uploadsave', uploadMultiple, function (req, res) {

    let title = req.body.title
    let category = req.body.category
    const filename  = req.files.media[0].fieldname
    const thumbnailFileName = req.files.thumbnail[0].fieldname

    
    if(title !== null || undefined && category !== null || undefined) {

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
                    categoryId: category
                }).then(() => {
        
                    res.redirect("admin/medias")
                })
                .catch(err => {
                    res.redirect('/admin/medias')
                })
            }
            else {
                res.redirect('/admin/medias')
            }

        }).catch(err => {
            res.redirect('/admin/medias/new')
        })
    
    }

    else {
        res.redirect("/")
    }

   
    // return res.render('avatar', { image: `/uploads/${filename}`, size })

    res.redirect("/admin/medias")

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