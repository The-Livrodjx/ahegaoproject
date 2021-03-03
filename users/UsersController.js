const express = require("express");
const session = require("express-session")
const router = express.Router();
const bcrypt = require("bcryptjs")
const User = require("./User")


router.get("/login", (req, res) => {

    res.render('users/login')
})

router.post('/authenticate', (req, res) => {

    let email = req.body.email 
    let password = req.body.password;

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
                res.redirect("/login")
            }
        }
        else {
            res.redirect("/login")
        }
    }).catch(err => {
        res.redirect("/login")
    })
})


router.get("/users/create", (req, res) => {

    res.render('users/create')
})

router.post("/saveuser", (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        where: {
            email: email
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

module.exports = router