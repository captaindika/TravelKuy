const db = require('../utils/db')

module.exports = {
  createSchedule: function (idUser, idBus, idRoute, price, departureTime, arriveTime, departureDate) {
    const table = 'schedules'
    const query = `INSERT INTO ${table} (id_admin, id_bus, id_route, price, departure_time, arrive_time, departure_date)
    VALUES (${idUser}, ${idBus},${idRoute}, ${price},'${departureTime}', '${arriveTime}', '${departureDate}')`
    console.log(query)
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
  getScheduleByIdAdmin: function (idAdmin) {
    const table = 'schedules'
    const query = `SELECT * FROM ${table} WHERE id_admin = ${idAdmin}`
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
  deleteSchedule: function (id, idAdmin) {
    return new Promise(function (resolve, reject) {
      const table = 'schedules'
      const query = `DELETE FROM ${table} WHERE id=${id} AND id_admin=${idAdmin}`
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
  getAllSchedules: function (conditions) {
    const { page, perPage, sort, search } = conditions
    // page = page || 1
    // perPage = perPage || 5
    // sort = sort || { key: 'id', value: 1 } // value => 0 untuk descending, 1 ascending
    // search = search || { key: 'name', value: '' }
    const table = 'schedules'
    return new Promise(function (resolve, reject) {
      const sql = `SELECT * FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%'
                  ORDER BY ${sort.key} ${parseInt(sort.value) ? 'ASC' : 'DESC'} 
                   LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
      console.log(sql)
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTotalSchedules: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'name', value: '' }
    const table = 'schedules'
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
  updateSchedule: function (id, idAdmin, idBus, idRoute, departureTime, arriveTime, departureDate, price) {
    return new Promise(function (resolve, reject) {
      const table = 'schedules'
      const query = `UPDATE ${table} SET id_bus=${idBus}, id_route=${idRoute},
      departure_time='${departureTime}', arrive_time='${arriveTime}', departure_date='${departureDate}', price = ${price} WHERE id=${id} AND id_admin = ${idAdmin}`
      console.log(query)
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
  getScheduleById: async function (id) {
    const table = 'schedules'
    const query = `SELECT * FROM ${table} WHERE id = ${id}`
    console.log(query)
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.length) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  getPriceBySchedule: async function (idSchedule) {
    const table = 'schedules'
    const query = `SELECT price FROM ${table} WHERE id = ${idSchedule}`
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
  getScheduleJoin: function () {
    const query = `SELECT routes.start, routes.end, busses.bus_seat, busses.car_name, schedules.price, schedules.departure_time, schedules.arrive_time, schedules.departure_date
                    FROM schedules
                    JOIN routes ON schedules.id_route = routes.id
                    JOIN busses ON schedules.id_bus = busses.id`
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
