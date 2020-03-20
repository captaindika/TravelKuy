const UserModel = require('../models/Users')
const AuthModel = require('../models/Auth')

// package
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

module.exports = {
  registerAgent: async function (req, res) {
    const { id, username } = req.body
    if (await AuthModel.createVerificationCode(id, uuid())) {
      const code = await AuthModel.getVerificationCode(username)
      const data = {
        success: true,
        msg: 'request code success',
        code
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'request code couldn\'t be generate'
      }
      res.send(data)
    }
  },
  create: async function (req, res) {
    const picture = (req.file && req.file.filename) || null
    const { username, password, roleId } = req.body
    const encryptPass = bcrypt.hashSync(password)
    const results = await UserModel.createUser(picture, username, encryptPass, roleId)
    delete req.body.password
    const data = {
      success: true,
      msg: `Username ${username} has been created`,
      data: { id: results, ...req.body }
    }
    res.send(data)
  },
  read: async function (req, res) {
    let { page, limit, search, sort } = req.query
    page = parseInt(page) || 1
    limit = parseInt(limit) || 5

    let key = search && Object.keys(search)[0]
    let value = search && Object.values(search)[0]
    search = (search && { key, value }) || { key: 'id', value: '' }

    key = sort && Object.keys(sort)[0]
    value = sort && Object.values(sort)[0]
    search = (sort && { key, value }) || { key: 'id', value: '' }
    const conditions = { page, perPage: limit, search, sort }
    if (req.user.roleId !== 1) {
      const data = {
        success: false,
        msg: 'You\'re not allowed to access this feature'
      }
      res.send(data)
    }
    const results = await UserModel.getAllUsers(conditions)
    results.forEach(function (o, i) {
      results[i].picture = process.env.APP_USER_PICTURE.concat(results[i].picture)
    })
    conditions.totalData = await UserModel.getTotalUsers(conditions)
    conditions.totalPage = Math.ceil(conditions.totalData / conditions.perPage)
    delete conditions.search
    delete conditions.sort
    delete conditions.limit
    const data = {
      success: true,
      data: results,
      pageInfo: conditions
    }
    res.send(data)
  },
  update: async function (req, res) {
    const picture = (req.file && req.file.filename) || null
    const { id } = req.params
    const { username, password } = req.body
    const encryptedPass = bcrypt.hashSync(password)
    const results = await UserModel.updateUser(id, picture, username, encryptedPass)
    delete req.body.password
    if (results) {
      const data = {
        success: true,
        msg: `User with id ${id} has been updated`,
        data: { id, ...req.body }
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'There is no data can be updated'
      }
      res.send(data)
    }
  },
  delete: async function (req, res) {
    const { id } = req.params
    const results = await UserModel.deleteUser(id)
    if (results) {
      const data = {
        success: true,
        msg: `Users with id ${id} has been deleted`
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'There is no data can be deleted'
      }
      res.send(data)
    }
  }
}
