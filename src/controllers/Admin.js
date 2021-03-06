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
    const { id } = req.params
    if (id) {
      if (req.user.roleId === 1) {
        if (await AgentModel.deleteAgentById(id)) {
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
    const { id } = req.params
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

    search = (search && { key: search.key, value: search.value }) || { key: 'name', value: '' }
    sort = (sort && { key:sort.key, value: sort.value }) || { key: 'id', value: 1 }
  
    if (req.user.roleId !== 1) {
      const data = {
        success: false,
        msg: 'You\'re not allowed to access this feature'
      }
      res.send(data)
    }
    const conditions = { page, perPage: limit, search, sort }
    const results = await AgentModel.getAllAgents(conditions)
    conditions.totalData = await AgentModel.getTotalAgents(conditions)
    console.log(conditions.totalData, conditions.perPage)
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
    const { idAgent, nameBuss, busSeat } = req.body
    if (req.user.roleId === 1) {
      const agent = await AgentModel.findAgentById(idAgent)
      if (agent) { // check if id is agent or not
        await BussModel.CreateBus(idAgent, nameBuss, busSeat)
        const data = {
          success: true,
          msg: `Car ${nameBuss} created with id agent ${idAgent}`
        }
        res.send(data)
      } else {
        const data = {
          success: false,
          msg: 'Id agent not found, register it first'
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
  updateBus: async function (req, res) {
    const { idAgent, name, size } = req.body
    const { id } = req.params
    if (req.user.roleId === 1) {
      const infoAgent = await AgentModel.findAgentById(idAgent)
      if (infoAgent) {
        const infoBuss = await BussModel.findBusById(id)
        if (infoBuss) {
          await BussModel.updateBussAdmin(id, idAgent, name, size)
          const info = await BussModel.findBusById(id)
          const data = {
            success: true,
            msg: 'Bus updated',
            info
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'Id buss not found, check it again'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Id agent not found, register first'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'U cant access this feature'
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
    search = (search && { key, value }) || { key: 'car_name', value: '' }

    key = sort && Object.keys(sort)[0]
    value = sort && Object.values(sort)[0]
    sort = (sort && { key, value }) || { key: 'id', value: 0 }
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
    search = (search && { key, value }) || { key: 'name', value: '' }

    key = sort && Object.keys(sort)[0]
    value = sort && Object.values(sort)[0]
    sort = (sort && { key, value }) || { key: 'id', value: '' }
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
    console.log('search:', search)

    let key = search && Object.keys(search)[0]
    let value = search && Object.values(search)
    console.log('val',req.query)
    search = (search && { key, value }) || { key: 'start', value: '' }

    key = sort && Object.keys(sort)[0]
    value = sort && Object.values(sort)[0]
    sort = (sort && { key, value }) || { key: 'id', value: '' }
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
    search = (search && { key:search.key, value:search.value }) || { key: 'schedules.price', value: '' }

    key = sort && Object.keys(sort)[0]
    value = sort && Object.values(sort)[0]
    sort = (sort && { key:sort.key, value:sort.value }) || { key: 'schedules.id', value: 1 }
    const conditions = { page, perPage: limit, search, sort }
    console.log(typeof sort.value)
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
    sort = (sort && { key, value }) || { key: 'id', value: '' }
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
  readTransactionDetail: async function (req, res) {
    if (req.user.roleId === 1) {
      let { page, limit, search, sort } = req.query
      page = parseInt(page) || 1
      limit = parseInt(limit) || 5

      let key = search && Object.keys(search)[0]
      let value = search && Object.values(search)[0]
      search = (search && { key, value }) || { key: 'user_details.name', value: '' }

      key = sort && Object.keys(sort)[0]
      value = sort && Object.values(sort)[0]
      sort = (sort && { key, value }) || { key: 'transactions.id', value: 0 }
      const conditions = { page, perPage: limit, search, sort }
      const results = await TransactionModel.getTransactionDetail(conditions)
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
    } else {
      const data = {
        success: false,
        msg: 'u cant access this feature'
      }
      res.send(data)
    }
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
    const { id } = req.params
    if (req.user.roleId === 1) {
      if (RouteModel.deleteRoute(id)) {
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
      let { start, end } = req.body
      const { id } = req.params
      console.log(id)
      const info = await RouteModel.getRouteById(id)
      console.log(info)
      start = start || info.start
      end = end || info.end
      const results = await RouteModel.updateRoute(id, start, end)
      if (results) {
        const info = await RouteModel.getRouteById(id)
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
    let { idUser, name } = req.body
    const { id } = req.params
    const a = await AgentModel.checkUserHasAgent(idUser)
    if (req.user.roleId === 1) {
      if (idUser) {
        if (a === 0) {
          name = name || 'Agent'
          AdminModel.createAgent(idUser)
          AgentModel.deleteAgentById(id) // cause on delete cascade so i delete and make new one
          AgentModel.createAgent(idUser, name)
          const data = {
            success: true,
            msg: 'agent updated'
          }
          res.send(data)
        } else {
          const info = await AgentModel.findAgentById(id)
          name = name || info.name
          AgentModel.updateAgent(id, idUser, name)
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
  },
  createSchedules: async function (req, res) {
    if (req.user.roleId === 1) {
      let { idBus, idRoute, price, departureTime, arriveTime, departureDate } = req.body
      const infoBus = await BussModel.findBusById(idBus)
      const infoRoute = await RouteModel.getRouteById(idRoute)
      // Define price on your own definition by route
      switch (infoRoute.id) {
        case 1:
          price = price || 100000
          break
        case 2:
          price = price || 200000
          break
        case 3:
          price = price || 300000
          break
        default:
          price = price || 150000
      }
      if (infoBus && infoRoute) {
        const results = await ScheduleModel.createSchedule(req.user.id, idBus, idRoute, price, departureTime, arriveTime, departureDate)
        if (results) {
          const data = {
            success: true,
            msg: 'Schedule created'
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'U missing the parameter on req.body'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: `id Bus ${idBus} / id route ${idRoute} not found`
        }
        res.send(data)
      }
    } else {
      const data = {
        success: true,
        msg: 'U cant access this feature'
      }
      res.send(data)
    }
  },
  getScheduleAdminMade: async function (req, res) {
    if (req.user.roleId === 1) {
      const results = await ScheduleModel.getScheduleByIdAdmin(req.user.id)
      const data = {
        success: true,
        results
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'U cant access this feature'
      }
      res.send(data)
    }
  },
  updateSchedule: async function (req, res) {
    if (req.user.roleId === 1) {
      const { idRoute, idBus, departureTime, arriveTime, departureDate, price } = req.body
      const { id } = req.params
      const checkIdSchedule = await ScheduleModel.getScheduleById(id)
      const checkIdBus = await BussModel.findBusById(idBus)
      const checkRoute = await RouteModel.getRouteById(idRoute)
      if (checkIdSchedule) {
        if (idRoute && idBus && departureTime && arriveTime && departureDate) {
          if (checkIdBus && checkRoute) {
            await ScheduleModel.updateSchedule(id, req.user.id, idBus, idRoute, departureTime, arriveTime, departureDate, price)
            const result = await ScheduleModel.getScheduleById(id)
            const data = {
              success: true,
              result
            }
            res.send(data)
          } else {
            const data = {
              success: false,
              msg: 'id bus / id route cant found'
            }
            res.send(data)
          }
        } else {
          const data = {
            success: false,
            msg: 'Enter idRoute, idBus, departureTime, ArriveTime, departureDate'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Your id schedule not found'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'U cant access this feature'
      }
      res.send(data)
    }
  },
  deleteSchedule: async function (req, res) {
    if (req.user.roleId === 1) {
      const { id } = req.params
      const checkSchedule = await ScheduleModel.getScheduleById(id)
      console.log(checkSchedule)
      if (checkSchedule) {
        const deleteSchedule = ScheduleModel.deleteSchedule(id, req.user.id)
        if (deleteSchedule) {
          const data = {
            success: true,
            msg: 'Schedule deleted'
          }
          res.send(data)
        } else {
          const data = {
            success: false,
            msg: 'U cant delete schedule from anothe admin'
          }
          res.send(data)
        }
      } else {
        const data = {
          success: false,
          msg: 'Id Schedule cant be found'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'U cant access this feature'
      }
      res.send(data)
    }
  },
  getTotalBus: async function (req, res) {
    if (req.user.roleId === 1) {
      const total = await BussModel.getTotalBusses()
      if (total) {
        const data = {
          success: true,
          msg: total
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'U cant access this feature'
      }
      res.send(data)
    }
  },
  getBusForSchedule: async function (req, res) {
    if (req.user.roleId === 1) {
      const result = await BussModel.getBusForAddSchedule()
      const data = {
        success: true,
        data: result
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'U cant access this feature'
      }
      res.send(data)
    }
  }
}
