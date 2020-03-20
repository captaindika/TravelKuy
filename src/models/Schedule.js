const db = require('../utils/db')

module.exports = {
  createSchedule: function (idAgent, idBus, idRoute, departureTime, arriveTime) {
    const table = 'schedules'
    const query = `INSERT INTO ${table} (idAgent, idBus, idRoute, departureTime, arriveTime)
    VALUES (${idAgent}, ${idBus},${idRoute}, '${departureTime}', '${arriveTime}')`
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
  deleteSchedule: function (id) {
    return new Promise(function (resolve, reject) {
      const table = 'schedules'
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
  getAllSchedules: function (conditions = {}) {
    let { page, perPage, sort, search } = conditions
    page = page || 1
    perPage = perPage || 5
    sort = sort || { key: 'id', value: 1 } // value => 0 untuk ascending, 1 descending
    search = search || { key: 'name', value: '' }
    const table = 'schedules'
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
  updateSchedule: function (id, idAgent, idBus, idRoute, departureTime, arriveTime) {
    return new Promise(function (resolve, reject) {
      const table = 'schedules'
      const query = `UPDATE ${table} SET id_agent=${idAgent}, id_bus=${idBus}, id_route-${idRoute},
      departure_time=${departureTime}, arriveTime=${arriveTime} WHERE id=${id}`
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
  }
}
