const express = require("express");
const flash = require("express-flash")
const router = express.Router();
const bcrypt = require("bcryptjs")
const User = require("./User");
const Media = require("../medias/Media")
const authUser = require("../middlewares/authUser");



router.get("/login", (req, res) => {

    var errorMessage = req.flash("errorMessage")
    var errorMessage = (errorMessage == 0 || errorMessage == undefined) ? undefined : errorMessage

    res.render('users/login', {errorMessage})
})

router.post('/authenticate', (req, res) => {

    let email = req.body.email 
    let password = req.body.password;

    var errorMessage;
    
    if(email == undefined || email == "" || email.length < 10) {

        errorMessage = "Por favor, digite um email válido"
        req.flash("errorMessage", errorMessage)
        res.redirect("/login")

    }else if (password == undefined || password == "" || password.length < 3){
        errorMessage = "Por favor, digite uma senha válida"
        req.flash("errorMessage", errorMessage)
        res.redirect("/login")
    } 
    else {
        User.findOne({
            where: {email: email}
        }).then(user => {
    
            if(user !== undefined) {
    
                var correct = bcrypt.compareSync(password, user.password)
    
                if(correct) {
    
                    req.session.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
    
                    res.redirect("/")
                }
                else {
                    
                    errorMessage = "Email ou senha incorretos"
                    req.flash("errorMessage", errorMessage)
                    res.redirect("/login")
                }
            }
            else {
    
                errorMessage = "Email ou senha incorretos"
                req.flash("errorMessage", errorMessage)
    
                res.redirect("/login")
            }
        }).catch(err => {
    
            errorMessage = "Email ou senha incorretos"
            req.flash("errorMessage", errorMessage)
    
            res.redirect("/login")
        })
    }

})


router.get("/register", (req, res) => {

    res.render('users/create')
})

router.post("/saveuser", (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        where: {
            name: name
        }
    }).then(user => {
        
        if(user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                name: name,
                email: email,
                password: hash

            }).then(() => {
                res.redirect("/")
            }).catch(err => {

                res.redirect("/login")
            })

        }else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
    
})

router.get('/logout', (req, res) => {

    req.session.user = undefined;

    res.redirect('/login')
})

router.get('/profile/:user', authUser, (req, res) => {

    let user = req.params.user;

    if(user !== undefined && isNaN(user)) {
        
        User.findOne({
            where: {
                name: user
            }
        }).then(user => {

            var isTheSameUser;

            if(user.name == req.session.user.name) {

                isTheSameUser = true;

            } else {
                
                isTheSameUser = false;
            }

            Media.findAndCountAll({
                where: {
                    userId: user.id
                },
                limit: 3,
                order: [['id', 'DESC']]
            }).then(medias => {

                res.render('users/profile', {user: user,  isTheSameUser: isTheSameUser, medias: medias})

            }).catch(err => {
                res.redirect('/')
            })


        }).catch(err => {
            res.redirect('/')
        })
    }
    else {
        res.redirect('/')
    }
})

router.post('/profile/save', authUser, (req, res) => {

    let id = req.body.id;
    let name = req.body.name;
    let profileImage = req.body.profileImage;
    let quotation = req.body.quotation;
    
    let stillTheSame;

    req.session.user.name !== name ? stillTheSame = false : stillTheSame = true;
    
    User.update({name: name, profileImage: profileImage, quotation: quotation}, {where: {id: id}})
        .then(() => {
            
            if(stillTheSame) {
                res.redirect(`/`)
            }else {
                res.redirect('/login')
            }
    
        }).catch(err => {
            res.redirect('/')
        })
})
module.exports = router