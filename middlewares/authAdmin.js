const authAdmin = (req, res, next) => {

    if(req.session.user == undefined ) {
        res.redirect("/login")
    }
    
    else if(req.session.user.name == "Livrodjx") {
        next();
    }

    else {
        res.redirect("/")
    }
}

module.exports = authAdmin;