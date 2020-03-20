// define a model
const AuthModel = require('../models/Auth')
const UserModel = require('../models/Users')

// package
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

module.exports = {
  register: async function (req, res) {
    const { username, password } = req.body
    const checkUser = await AuthModel.checkUsername(username)
    if (checkUser !== 0) {
      const data = {
        success: false,
        msg: 'Username already used'
      }
      res.send(data)
    } else {
      const encrypPass = bcrypt.hashSync(password)
      const results = await UserModel.createUser(null, username, encrypPass)
      if (results) {
        if (await AuthModel.createVerificationCode(results, uuid())) {
          const code = await AuthModel.getVerificationCode(username)
          const data = {
            success: true,
            msg: 'register success',
            code
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'Verification code couldn\'t be generate'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'register failed'
        }
        res.send(data)
      }
    }
  },
  verify: async function (req, res) {
    const { username, code } = req.query
    if (await AuthModel.verifyUser(username, code)) {
      const data = {
        success: true,
        msg: 'User activated succesfully'
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'User can\'t be activated'
      }
      res.send(data)
    }
  },
  login: async function (req, res) {
    const { username, password } = req.body
    const checkUser = await AuthModel.checkUsername(username)
    if (!checkUser) {
      const data = {
        success: false,
        msg: 'Wrong username'
      }
      res.send(data)
    } else {
      const info = await AuthModel.getUserByUsername(username)
      const checkPass = bcrypt.compareSync(password, info.password)
      if (checkPass) {
        if (await AuthModel.checkVerifiedUser) {
          if (await AuthModel.checkActivatedUser) {
            const payload = { username, roleId: info.role_id }
            const options = { expiresIn: '15m' }
            const key = process.env.APP_KEY
            const token = jwt.sign(payload, key, options)
            const data = {
              success: true,
              token
            }
            res.send(data)
          } else {
            const data = {
              success: false,
              msg: 'Username not active'
            }
            res.send(data)
          }
        } else {
          const data = {
            success: false,
            msg: 'Username not verified'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Wrong Password'
        }
        res.send(data)
      }
    }
  },
  forgetPass: async function (req, res) {
    const { username } = req.body
    const { code } = req.query
    console.log(code)
    if (!code) {
      const user = await AuthModel.checkUsername(username)
      if (user) {
        const info = await AuthModel.getUserByUsername(username)
        const generate = await AuthModel.createVerificationCode(info.id, uuid())
        const code = await AuthModel.getVerificationCode(username)
        if (generate) {
          const data = {
            success: true,
            msg: 'Verification code has been sent to email',
            code
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'Failed to generate verification code'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Username not found'
        }
        res.send(data)
      }
    } else {
      const { password } = req.body
      if (password === req.body.confirm_password) {
        const encrypPass = bcrypt.hashSync(password)
        if (await AuthModel.forgotPassword(code, encrypPass)) {
          const data = {
            success: true,
            msg: 'Your password has been reset'
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'failed to reset password'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Confirm password not match'
        }
        res.send(data)
      }
    }
  }
}
