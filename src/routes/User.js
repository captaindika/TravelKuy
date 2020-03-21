const User = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthToken = require('../middleware/Auth')
const UserdControl = require('../controllers/UserDetail')

User.post('/login', AuthController.login)
User.get('/detail', AuthToken.checkToken, UserdControl.getUserDetailByIdUser)

module.exports = User
