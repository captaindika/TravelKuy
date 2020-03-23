const User = require('express').Router()
const AuthController = require('../controllers/Auth')
const AuthToken = require('../middleware/Auth')
const AdminControl = require('../controllers/Admin')
const UserdControl = require('../controllers/UserDetail')
const UserControl = require('../controllers/User')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: 'files/',
  filename: function (req, file, callbck) {
    callbck(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  fileFilter: function (req, file, callbck) {
    fileCheck(file, callbck)
  }
}).single('picture')

function fileCheck (file, callbck) {
  const typeFile = /jpeg|jpg|png|gif/
  const extName = typeFile.test(path.extname(file.originalname).toLowerCase())
  console.log(extName)
  const mimetype = typeFile.test(file.mimetype)
  console.log(mimetype)
  if (mimetype && extName) {
    return callbck(null, true)
  } else {
    return callbck(null, false)
  }
}

function filterPicture (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.send('Error: File too large')
      console.log(err)
    } else {
      if (req.file === undefined) {
        res.send('Error: no file selected')
      } else {
        res.send('File uploaded')
      }
    }
  })
}

// User.post('/upload', filterPicture)

User.patch('/update', filterPicture, AuthToken.checkToken, UserControl.update)
User.post('/register', filterPicture, AuthController.register)

User.post('/login', AuthController.login)
User.post('/transaction/add', AuthToken.checkToken, UserControl.Transaction)
User.get('/detail', AuthToken.checkToken, UserdControl.getUserDetailByIdUser)
User.get('/schedule', AdminControl.readSchedules)
User.get('/transaction', AuthToken.checkToken, UserControl.getTransactionbyUser)
User.patch('/update', AuthToken.checkToken, UserdControl.updateUserDetail)
User.patch('/topup', AuthToken.checkToken, UserControl.topUp)
// User.post('/add-agent', AuthToken.checkToken, UserControl.createAgent)\
// test count
// User.get('/count-schedule', UserControl.countSchedule)
// User.get('/count-seat', UserControl.countSeat)

module.exports = User
