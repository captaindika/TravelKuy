const Admin = require('express').Router()
const multer = require('multer')
const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')
const TokenMid = require('../middleware/Auth')
const AuthControl = require('../controllers/Auth')

Admin.post('/create', AdminControl.createAdmin)
Admin.post('/login', AuthControl.login)
Admin.get('/users', TokenMid.checkToken, UserControl.read)
Admin.get('/agent', TokenMid.checkToken, AdminControl.read)

module.exports = Admin