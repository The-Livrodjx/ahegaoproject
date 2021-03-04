const express = require("express");
const authAdmin = require("../middlewares/authAdmin");
const slugify = require("slugify")
const router = express.Router();
const { uuid } = require('uuidv4')
const multer = require('multer')
const Category = require("../categories/Category")
const Media = require("./Media")
const fs = require('fs')


const upload = multer({
    storage: multer.diskStorage({
      destination: 'public/uploads/',
      filename(req, file, callback) {
        const fileName = `${uuid()}-${file.originalname}`
  
        return callback(null, fileName)
      },
    }),
})


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

router.post('/uploadsave', upload.single('avatar'), function (req, res) {

    let title = req.body.title
    let category = req.body.category
    const { filename, size } = req.file
    
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
                    categoryId: category
                }).then(() => {
        
                    res.redirect("admin/medias/index")
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