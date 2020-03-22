const Auth = require('express').Router()
const multer = require('multer')
const AuthController = require('../controllers/Auth')
const AuthToken = require('../middleware/Auth')
const storage = multer.diskStorage({
  destination: 'files/',
  filename: function (req, file, cb) {
    cb(null, `${Date.now}-${file.originalname}`)
  }
})

const upload = multer({ storage })
Auth.post('/picture', upload.single('picture'), AuthController.register)

Auth.post('/register', AuthController.register)
Auth.get('/activate', AuthController.verify)
Auth.post('/login', AuthController.login)
Auth.post('/forgot-password', AuthController.forgetPass)
Auth.get('/user', AuthToken.checkToken, function (req, res) {
  res.send(req.user)
})

module.exports = Auth
