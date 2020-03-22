const UserdModel = require('../models/UserDetails')
const AuthModel = require('../models/Auth')
const UserModel = require('../models/Users')
const AdminModel = require('../models/Admin')
const AgentModel = require('../models/Agent')
const BussModel = require('../models/Bus')
const RouteModel = require('../models/Route')
const ScheduleModel = require('../models/Schedule')
const TransactionModel = require('../models/Transaction')

// package
const bcrypt = require('bcryptjs')
// const uuid = require('uuid').v4

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
    const info = await AuthModel.getUserByUsername(username)
    const id = info.id
    console.log(info)
    await UserdModel.createAdminDetail(id, name, email, phone, money)
    const data = {
      success: true,
      msg: `Username ${username} has been created`
    }
    res.send(data)
  },
  deleteAgent: async function (req, res) {
    const { idAgent } = req.body
    if (idAgent) {
      if (req.user.roleId === 1) {
        if (await AgentModel.deleteAgentById(idAgent)) {
          const data = {
            success: true,
            msg: 'Agent has been removed'
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'Id agent not found'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'you cannot access this feature'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'Enter id agent'
      }
      res.send(data)
    }
  },
  getAgentByUser: async function (req, res) {
    const { id } = req.body
    if (req.user.roleId === 1) {
      const info = await AgentModel.findAgentByIdUser(id)
      if (info) {
        const data = {
          success: true,
          info
        }
        res.send(data)
      } else {
        const data = {
          success: false,
          msg: 'User id doesnt have agent'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'you cannot access this feature'
      }
      res.send(data)
    }
  },
  readAgent: async function (req, res) {
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
    const { idUser } = req.body
    if (req.user.roleId === 1) {
      if (!(idUser)) {
        const data = {
          success: false,
          msg: 'Enter the id user'
        }
        res.send(data)
      } else {
        const info = await UserModel.getUserById(idUser)
        const name = `${info.username} agent`
        if (info) {
          await AdminModel.createAgent(idUser)
          await AgentModel.createAgent(idUser, name)
          const data = {
            success: true,
            msg: `${idUser} has been an agent`
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'Id user not found'
          }
          res.send(data)
        }
      }
    } else {
      const data = {
        success: false,
        msg: 'you cannot access this feature'
      }
      res.send(data)
    }
  },
  createBusAdmin: async function (req, res) {
    const { idUser, nameBuss, busSeat } = req.body
    if (req.user.roleId === 1) {
      const agent = await AgentModel.findAgentByIdUser(idUser)
      if (agent) { // check if id is agent or not
        await BussModel.CreateBus(agent.id, nameBuss, busSeat)
        const data = {
          success: true,
          msg: `Car ${nameBuss} created with id agent ${agent.id}`
        }
        res.send(data)
      } else {
        const data = {
          success: false,
          msg: 'Your id is not agent, register it first'
        }
        res.send(data)
      }
      // const { idAgent, name, seat } = req.body
    // await BussModel.CreateBus(idAgent, name, seat)
    } else {
      const data = {
        success: false,
        msg: 'You cannot access this feature'
      }
      res.send(data)
    }
  },
  readBus: async function (req, res) {
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
    const results = await BussModel.getAllBusses(conditions)
    conditions.totalData = await BussModel.getTotalBusses(conditions)
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
  readUserDetail: async function (req, res) {
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
    const results = await UserdModel.getAllUserDetail(conditions)
    conditions.totalData = await UserdModel.getTotalUserDetail(conditions)
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
  readRoutes: async function (req, res) {
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
    const results = await RouteModel.getAllRoutes(conditions)
    conditions.totalData = await RouteModel.getTotalRoutes(conditions)
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
  readSchedules: async function (req, res) {
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
    const results = await ScheduleModel.getAllSchedules(conditions)
    conditions.totalData = await ScheduleModel.getTotalSchedules(conditions)
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
  readTransaction: async function (req, res) {
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
    const results = await TransactionModel.getAllTransaction(conditions)
    conditions.totalData = await TransactionModel.getTotalTransaction(conditions)
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
  createRoutes: function (req, res) {
    const { start, end } = req.body
    const idUser = req.user.id
    // console.log(req.user.roleId)
    if (req.user.roleId === 1) {
      RouteModel.createRoute(idUser, start, end)
      const data = {
        success: true,
        msg: `Route has been created by ${req.user.username}`
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'You cannot access this feature'
      }
      res.send(data)
    }
  },
  deleteRoutes: function (req, res) {
    const { idRoute } = req.body
    if (req.user.roleId === 1) {
      if (!RouteModel.deleteRoute(idRoute)) {
        const data = {
          success: true,
          msg: 'Route has been deleted'
        }
        res.send(data)
      } else {
        const data = {
          success: false,
          msg: 'id Route not found'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'You cannot access this feature'
      }
      res.send(data)
    }
  },
  updateRoutes: async function (req, res) {
    if (req.user.roleId === 1) {
      // console.log(req.user)
      let { idRoute, start, end } = req.body
      const info = await RouteModel.getRouteById(idRoute)
      console.log(info)
      start = start || info.start
      end = end || info.end
      const results = await RouteModel.updateRoute(idRoute, start, end)
      if (results) {
        const info = await RouteModel.getRouteById(idRoute)
        const data = {
          success: true,
          info
        }
        res.send(data)
      } else {
        const data = {
          success: false,
          msg: 'id Route can not found / enter start and end'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'You cannot access this feature'
      }
      res.send(data)
    }
    // RouteModel.updateRoute
  },
  updateAgent: async function (req, res) {
    let { idAgent, idUser, name } = req.body
    const a = await AgentModel.checkUserHasAgent(idUser)
    if (req.user.roleId === 1) {
      if (idUser) {
        if (a === 0) {
          name = name || 'Agent'
          AdminModel.createAgent(idUser)
          AgentModel.deleteAgentById(idAgent) // cause on delete cascade so i delete and make new one
          AgentModel.createAgent(idUser, name)
          const data = {
            success: true,
            msg: 'agent updated'
          }
          res.send(data)
        } else {
          const info = await AgentModel.findAgentById(idAgent)
          name = name || info.name
          AgentModel.updateAgent(idAgent, idUser, name)
          const data = {
            success: true,
            msg: 'agent updated'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Enter id user'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'You cannot access this feature'
      }
      res.send(data)
    }
  }
}
