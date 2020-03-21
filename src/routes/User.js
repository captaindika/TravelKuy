const User = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthToken = require('../middleware/Auth')
const UserdControl = require('../controllers/UserDetail')
const UserControl = require('../controllers/User')

User.post('/login', AuthController.login)
User.get('/detail', AuthToken.checkToken, UserdControl.getUserDetailByIdUser)
User.patch('/update', AuthToken.checkToken, UserdControl.updateUserDetail)
User.post('/add-agent', AuthToken.checkToken, UserControl.createAgent)

module.exports = User
