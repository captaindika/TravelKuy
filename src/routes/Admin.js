const Admin = require('express').Router()
const multer = require('multer')
const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')
const TokenMid = require('../middleware/Auth')
const AuthControl = require('../controllers/Auth')
const UserdControl = require('../controllers/UserDetail')

Admin.post('/create', AdminControl.createAdmin)
Admin.post('/login', AuthControl.login)
Admin.post('/agent', AdminControl.createAgent)
// get
Admin.get('/users', TokenMid.checkToken, UserControl.read)
Admin.get('/agent', TokenMid.checkToken, AdminControl.readAgent)
Admin.get('/bus', TokenMid.checkToken, AdminControl.readBus)
Admin.get('/user-detail', TokenMid.checkToken, AdminControl.readUserDetail)
Admin.get('/route', TokenMid.checkToken, AdminControl.readRoutes)
Admin.get('/schedule', TokenMid.checkToken, AdminControl.readSchedules)
Admin.get('/transaction', TokenMid.checkToken, AdminControl.readTransaction)
Admin.get('/detail', TokenMid.checkToken, UserdControl.getUserDetailByIdUser)

// create
Admin.post('/agent/add', TokenMid.checkToken, AdminControl.createAgent)
Admin.post('/bus/add', TokenMid.checkToken, AdminControl.createBus)
Admin.post('/route/add', TokenMid.checkToken, AdminControl.createRoutes)

// delete
Admin.delete('/route/delete', TokenMid.checkToken, AdminControl.deleteRoutes)
module.exports = Admin
