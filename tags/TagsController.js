const express = require('express')
const router = express.Router()
const authAdmin = require("../middlewares/authAdmin")
const slugify = require('slugify')
const Tag = require("./Tag")




router.get('/admin/tags', authAdmin ,(req, res) => {
    
    Tag.findAll().then(tags => {

        res.render('admin/tags/index', {tags})
    })
})


router.get('/admin/tags/new', authAdmin ,(req, res) => {
    res.render('admin/tags/new')
})

router.post('/tags/save',authAdmin ,(req, res) => {

    let title = req.body.title

    if(title != undefined) {

        Tag.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/tags/')
        })
    }else {
        res.redirect('/admin/tags/new')
    }
})


router.post('/tags/delete',authAdmin , (req, res) => {
    var id = req.body.id 

    if(id != undefined) {

        if(!isNaN(id)) {
            Tag.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/tags') 
            })

        } else {
            res.redirect('/admin/tags')  
        }

    }else {
        res.redirect('/admin/tags')
    }
})

router.get('/admin/tags/edit/:id', authAdmin ,(req, res) => {

    var id = req.params.id 

    if(isNaN(id)) {
        res.redirect('/admin/tags')
    }

    Tag.findByPk(id).then(tag => {

        if(tag != undefined) {

            res.render('admin/tags/edit', {tag})
        }else {
            res.redirect('/admin/tags')
        }
    }).catch(error => {
       res.redirect('/admin/tags')
    })
})

router.post("/tags/update", authAdmin ,(req, res) => {
 
    var id = req.body.id;
    var title = req.body.title 

    Tag.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/tags")
    })
})

module.exports = router;