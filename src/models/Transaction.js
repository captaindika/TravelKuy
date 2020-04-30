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
  getTransactionByUser: function (idUser, conditions) {
    const { page, perPage, sort, search } = conditions
    const query = `select user_details.name , routes.start, routes.end, schedules.price, busses.car_name, schedules.departure_date, schedules.departure_time, schedules.arrive_time
    from ((((transactions 
    INNER JOIN schedules ON schedules.id = transactions.id_schedule)
    INNER JOIN routes ON routes.id = schedules.id_route)
    INNER JOIN busses ON busses.id = schedules.id_bus)
    INNER JOIN user_details ON transactions.id_user = user_details.id_user)
    WHERE transactions.id_user = ${idUser} and ${search.key} LIKE '%${search.value}%'
    ORDER BY ${sort.key} ${parseInt(sort.value) ?  'ASC' : 'DESC'}
    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
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
  },
  getTotalTransactionByUser: function (idUser) {
    const table = 'transactions'
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE id_user=${idUser}`
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
  getTransactionDetail: function (conditions) {
    const { page, perPage, sort, search } = conditions
    // page = page || 1
    // perPage = perPage || 5
    // sort = sort || { key: 'transactions.id', value: 0 } // value => 0 untuk ascending, 1 descending
    // search = search || { key: 'user_details.name', value: '' }
    const query = `SELECT user_details.name, routes.start, routes.end, busses.car_name, schedules.price, schedules.departure_time, schedules.arrive_time, schedules.departure_date
                    FROM transactions
                    INNER JOIN users ON transactions.id_user = users.id
                    INNER JOIN user_details ON user_details.id_user = users.id
                    INNER JOIN schedules ON transactions.id_schedule = schedules.id
                    INNER JOIN busses ON schedules.id_bus = busses.id
                    INNER JOIN routes ON schedules.id_route = routes.id
                    WHERE ${search.key} LIKE %'${search.value}%'
                    ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'} 
                    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
    console.log(query)
    return new Promise(function (resolve, reject) {
      console.log(query)
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
