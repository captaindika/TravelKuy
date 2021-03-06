const Admin = require('express').Router()
// const multer = require('multer')
const UserControl = require('../controllers/User')
const AdminControl = require('../controllers/Admin')
const TokenMid = require('../middleware/Auth')
const AuthControl = require('../controllers/Auth')
const UserdControl = require('../controllers/UserDetail')
const AgenControl = require('../controllers/Agent')

Admin.post('/create', AdminControl.createAdmin)
Admin.post('/login', AuthControl.login)
Admin.get('/env', function(req,res) {
  res.send(process.env.ADMIN_PASS)
})

// get
Admin.get('/users', TokenMid.checkToken, UserControl.read)
Admin.get('/agent', TokenMid.checkToken, AdminControl.readAgent)
Admin.get('/agent/userId/:id', TokenMid.checkToken, AdminControl.getAgentByUser)
Admin.get('/bus', TokenMid.checkToken, AdminControl.readBus)
Admin.get('/total-bus', TokenMid.checkToken, AdminControl.getTotalBus)
Admin.get('/user-detail', TokenMid.checkToken, AdminControl.readUserDetail)
Admin.get('/route', TokenMid.checkToken, AdminControl.readRoutes)
Admin.get('/schedule', TokenMid.checkToken, AdminControl.readSchedules)
Admin.get('/schedule-by-admin', TokenMid.checkToken, AdminControl.getScheduleAdminMade)
Admin.get('/transaction', TokenMid.checkToken, AdminControl.readTransaction)
Admin.get('/transaction-detail', TokenMid.checkToken, AdminControl.readTransactionDetail)
Admin.get('/detail', TokenMid.checkToken, UserdControl.getUserDetailByIdUser)
Admin.get('/bus/outjoin', TokenMid.checkToken, AdminControl.getBusForSchedule)

// create
Admin.post('/agent/add', TokenMid.checkToken, AdminControl.createAgent)
Admin.post('/bus/add', TokenMid.checkToken, AdminControl.createBusAdmin)
Admin.post('/route/add', TokenMid.checkToken, AdminControl.createRoutes)
Admin.post('/schedule/add', TokenMid.checkToken, AdminControl.createSchedules)
// Admin.post('/schedule/add', )

// delete
Admin.delete('/route/delete/:id', TokenMid.checkToken, AdminControl.deleteRoutes)
Admin.delete('/agent/delete/:id', TokenMid.checkToken, AdminControl.deleteAgent)
Admin.delete('/bus/delete/:id', TokenMid.checkToken, AgenControl.deleteBuss)
Admin.delete('/schedule/delete/:id', TokenMid.checkToken, AdminControl.deleteSchedule)

// update
Admin.patch('/route/update/:id', TokenMid.checkToken, AdminControl.updateRoutes)
Admin.patch('/agent/update/:id', TokenMid.checkToken, AdminControl.updateAgent)
Admin.patch('/bus/update/:id', TokenMid.checkToken, AdminControl.updateBus)
Admin.patch('/schedule/update/:id', TokenMid.checkToken, AdminControl.updateSchedule)
module.exports = Admin
