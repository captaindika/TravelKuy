const UserdModel = require('../models/UserDetails')
const AuthModel = require('../models/Auth')
module.exports = {
  getUserDetailByIdUser: async function (req, res) {
    const info = await AuthModel.getUserByUsername(req.user.username)
    const detail = await UserdModel.getUserDetailByIdUser(info.id)
    if (detail) {
      const data = {
        success: true,
        detail
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'detail not created'
      }
      res.send(data)
    }
  },
  updateUserDetail: async function (req, res) {
    const info = await UserdModel.getUserDetailByIdUser(req.user.id)
    // console.log(info.id_user)
    const { name, email, phone } = req.body
    const newName = name || info.name
    const newEmail = email || info.email
    const newPhone = phone || info.phone
    UserdModel.updateUserDetailByIdUser(info.id_user, newName, newEmail, newPhone)
    const newDetail = await UserdModel.getUserDetailByIdUser(info.id_user)
    const data = {
      success: true,
      msg: 'update success',
      newDetail
    }
    res.send(data)
  }
}
