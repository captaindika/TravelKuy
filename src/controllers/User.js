const UserModel = require('../models/Users')
// const AuthModel = require('../models/Auth')
const AgenModel = require('../models/Agent')
const UserdModel = require('../models/UserDetails')
const ScheduleModel = require('../models/Schedule')
const TransactionModel = require('../models/Transaction')
const BussModel = require('../models/Bus')

// package
const bcrypt = require('bcryptjs')
// const uuid = require('uuid').v4

module.exports = {
  createAgent: async function (req, res) {
    let { nameAgent } = req.body
    const info = req.user
    nameAgent = nameAgent || `${info.username} agent`
    if (info.roleId === 2) {
      await AgenModel.createAgent(info.id, nameAgent)
      const data = {
        success: true,
        msg: 'Agent created'
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'Ask administration become an agent'
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
    const { username, password } = req.body
    const id = req.user.id
    const encryptedPass = bcrypt.hashSync(password)
    const results = await UserModel.updateUser(id, picture, username, encryptedPass)
    const infoUser = await UserModel.getUserById(id)
    delete req.body.password
    if (results) {
      const data = {
        success: true,
        msg: `User with id ${req.user.id} has been updated`,
        infoUser
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
  },
  getScheduleForUser: async function (req, res) {
    const result = await UserModel.getAllSchedules()
    if (result) {
      const data = {
        success: true,
        result
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'Data not found'
      }
      res.send(data)
    }
  },
  topUp: async function (req, res) {
    const { balance } = req.body
    if (balance) {
      await UserdModel.topUp(req.user.id, balance)
      const result = await UserdModel.getUserDetailByIdUser(req.user.id)
      const data = {
        success: true,
        msg: 'Top up success',
        result
      }
      res.send(data)
    } else {
      const data = {
        success: false,
        msg: 'Enter balance'
      }
      res.send(data)
    }
  },
  Transaction: async function (req, res) {
    const { idSchedule } = req.body
    let newBalance = 0
    if (idSchedule) {
      const infoSchedule = await ScheduleModel.getScheduleById(idSchedule)
      if (infoSchedule) {
        const infoUserd = await UserdModel.getUserDetailByIdUser(req.user.id)
        const info = await ScheduleModel.getPriceBySchedule(idSchedule)
        newBalance = infoUserd.balance - info.price
        const infoBus = await TransactionModel.getScheduleForSeat(idSchedule)
        if (infoBus.bus_seat > 0 && newBalance >= 0) {
          await UserdModel.updateBalance(req.user.id, newBalance)
          await BussModel.updateBussSeat(infoBus.id)
          await UserModel.Transaction(idSchedule, req.user.id)
          const newUserd = await UserdModel.getUserDetailByIdUser(req.user.id)
          const data = {
            success: true,
            msg: 'transaction succes',
            newUserd
          }
          res.send(data)
        } else {
          if (infoBus.bus_seat === 0) {
            // await TransactionModel.deleteSchedule(idSchedule)
            const data = {
              success: true,
              msg: 'Bus seat is full, schedule was deleted'
            }
            res.send(data)
          } else {
            const data = {
              success: false,
              msg: 'Please top up your balance'
            }
            res.send(data)
          }
        }
      } else {
        const data = {
          success: false,
          msg: 'Schedule not found'
        }
        res.send(data)
      }
    } else {
      const data = {
        success: false,
        msg: 'Enter id Schedule'
      }
      res.send(data)
    }
  },
  countSchedule: async function (req, res) {
    const { idSchedule } = req.body
    if (idSchedule) {
      const info = await TransactionModel.countIdSchedules(idSchedule)
      console.log(info)
      const data = {
        info
      }
      res.send(data)
    } else {
      const data = {
        msg: 'kosong'
      }
      res.send(data)
    }
  },
  countSeat: async function (req, res) {
    const { idSchedule } = req.body
    const info = await TransactionModel.getScheduleForSeat(idSchedule)
    console.log(info.bus_seat)
  },
  getTransactionbyUser: async function (req, res) {
    const info = await TransactionModel.getTransactionByUser(req.user.id)
    console.log(info)
    const data = {
      success: true,
      info
    }
    res.send(data)
  }
}
