const db = require('../utils/db')

module.exports = {
  create: function (idUser, idSchedule, price) {
    const table = 'transactions'
    const query = `INSERT INTO ${table} (id_user, id_schedule, price) VALUES
                  ${idUser}, ${idSchedule}, ${price}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.insertId) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  deleteTransaction: function (id) {
    return new Promise(function (resolve, reject) {
      const table = 'transactions'
      const query = `DELETE FROM ${table} WHERE id=${id}`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  getAllTransaction: function (conditions = {}) {
    let { page, perPage, sort, search } = conditions
    page = page || 1
    perPage = perPage || 5
    sort = sort || { key: 'id', value: 1 } // value => 0 untuk ascending, 1 descending
    search = search || { key: 'price', value: '' }
    const table = 'transactions'
    return new Promise(function (resolve, reject) {
      const sql = `SELECT * FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%'
                  ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'} 
                   LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTotalTransaction: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'price', value: '' }
    const table = 'transactions'
    return new Promise(function (resolve, reject) {
      const sql = `SELECT COUNT (*) AS total FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%'`
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  updateTransaction: function (id, idUser, idSchedule, price) {
    return new Promise(function (resolve, reject) {
      const table = 'transactions'
      const query = `UPDATE ${table} SET id_user=${idUser}, id_schedule=${idSchedule}, price=${price} WHERE id=${id}`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  countIdSchedules: function (idSchedule) {
    const table = 'transactions'
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE id_schedule=${idSchedule}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  getScheduleForSeat: function (idSchedule) {
    const query = `SELECT schedules.id, busses.id, busses.bus_seat
                  FROM (schedules
                  INNER JOIN busses ON schedules.id_bus = busses.id) WHERE schedules.id = ${idSchedule}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.length) {
            resolve(results[0])
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  deleteSchedule: function (idSchedule) {
    const table = 'schedules'
    const query = `DELETE FROM ${table} WHERE id = ${idSchedule}`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTransactionByUser: function (idUser) {
    const query = `select user_details.name, routes.start, routes.end, schedules.price, 
    busses.car_name, schedules.departure_date, schedules.departure_time, schedules.arrive_time
     from transactions, schedules, busses, user_details, routes 
     where transactions.id_schedule = schedules.id and schedules.id_bus = busses.id 
     and transactions.id_user = user_details.id_user and schedules.id_route = routes.id 
     AND transactions.id_user = 18`
    console.log(query)
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
}
