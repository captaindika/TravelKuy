const Auth = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthToken = require('../middleware/Auth')

Auth.post('/register', AuthController.register)
Auth.get('/activate', AuthController.verify)
Auth.post('/login', AuthController.login)
Auth.post('/forgot-password', AuthController.forgetPass)
Auth.get('/user', AuthToken.checkToken, function (req, res) {
  res.send(req.user)
})

module.exports = Auth
