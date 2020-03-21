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
  }
}
