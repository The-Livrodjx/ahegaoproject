const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser");
const authUser = require("./middlewares/authUser")
const { uuid } = require('uuidv4')
const multer = require('multer')
const app = express();

const PORT = process.env.PORT || 6969

const connection = require("./database/database")

const User = require("./users/User");
const usersController = require("./users/UsersController")


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

const upload = multer({
    storage: multer.diskStorage({
      destination: 'public/uploads/',
      filename(req, file, callback) {
        const fileName = `${uuid()}-${file.originalname}`
  
        return callback(null, fileName)
      },
    }),
})

app.get("/", authUser, (req, res) => {
    res.render("index");
})


app.post('/avatar', upload.single('avatar'), function (req, res) {
    const { filename, size } = req.file
  
    return res.render('avatar', { image: `/uploads/${filename}`, size })
})

app.listen(PORT, () => {console.log(`Server listening at port: ${PORT}`)})