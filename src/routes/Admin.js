const Admin = require('express').Router()
const multer = require('multer')
const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')
const TokenMid = require('../middleware/Auth')
const AuthControl = require('../controllers/Auth')

Admin.post('/create', AdminControl.createAdmin)
Admin.post('/login', AuthControl.login)
// get
Admin.get('/users', TokenMid.checkToken, UserControl.read)
Admin.get('/agent', TokenMid.checkToken, AdminControl.readAgent)
Admin.get('/bus', TokenMid.checkToken, AdminControl.readBus)
Admin.get('/user-detail', TokenMid.checkToken, AdminControl.readUserDetail)

// create
Admin.post('/agent/add', TokenMid.checkToken, AdminControl.createAgent)
Admin.post('/bus/add', TokenMid.checkToken, AdminControl.createBus)
module.exports = Admin
