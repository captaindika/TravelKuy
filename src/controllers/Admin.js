const UserdModel = require('../models/UserDetails')
const UserModel = require('../models/Users')
const AdminModel = require('../models/Admin')
const AgentModel = require('../models/Agent')

// package
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

module.exports = {
  createAdmin: async function (req, res) {
    const username = process.env.USER_ADMIN
    const password = process.env.ADMIN_PASS
    const encryptedPass = bcrypt.hashSync(password)
    const name = process.env.ADMIN_NAME
    const phone = process.env.ADMIN_PHONE
    const email = process.env.ADMIN_EMAIL
    const money = 1000000000
    await UserModel.createAdmin(username, encryptedPass)
    await UserdModel.createAdminDetail(name, email, phone, money)
    const data = {
      success: true,
      msg: `Username ${username} has been created`
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
    const results = await AgentModel.getAllAgents(conditions)
    conditions.totalData = await AgentModel.getTotalAgents(conditions)
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
  createAgent: async function (req, res) {
    const { idUser, agentName } = req.body
    await AdminModel.createAgent(idUser)
    const checkAgentName = await AgentModel.checkAgentExist(agentName)
    if (checkAgentName !== 0) {
      const data = {
        success: false,
        data: `Agent '${agentName}' has been used`
      }
      res.send(data)
    } else {
      AgentModel.createAgent(idUser, agentName)
      const data = {
        success: true,
        msg: `${agentName} has been add into agent`
      }
      res.send(data)
    }
  }
}
