const User = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthToken = require('../middleware/Auth')
const UserdControl = require('../controllers/UserDetail')
const UserControl = require('../controllers/User')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: 'files/',
  filename: function (req, file, cb) {
    cb(null, `${Date.now}-${file.originalname}`)
  }
})

const upload = multer({ storage })

User.patch('/update-picture', upload.single('picture'), AuthToken.checkToken, UserControl.update)

User.post('/login', AuthController.login)
User.post('/transaction/add', AuthToken.checkToken, UserControl.Transaction)
User.get('/detail', AuthToken.checkToken, UserdControl.getUserDetailByIdUser)
User.get('/schedule', UserControl.getScheduleForUser)
User.patch('/update', AuthToken.checkToken, UserdControl.updateUserDetail)
User.patch('/topup', AuthToken.checkToken, UserControl.topUp)
// User.post('/add-agent', AuthToken.checkToken, UserControl.createAgent)

module.exports = User
