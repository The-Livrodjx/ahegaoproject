const authAdmin = (req, res, next) => {

    if(req.session.user.name == undefined) {
        res.redirect("/")
    }
    
    else if(req.session.user.name == "Livrodjx") {
        next();
    }

    else {
        res.redirect("/")
    }
}

module.exports = authAdmin;