const db = require('../utils/db')
module.exports = {
  CreateBus: function (idAgent, name, busSeat) {
    const table = 'busses'
    const query = `INSERT INTO ${table} (id_agent,car_name,bus_seat) VALUES (${idAgent}, '${name}', ${busSeat})`
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  updateBuss: function (id, name, size) {
    return new Promise(function (resolve, reject) {
      const table = 'busses'
      const query = `UPDATE ${table} SET car_name='${name}', bus_seat=${size} WHERE id=${id}`
      console.log(query)
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(results)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  updateBussAdmin: function (id, idAgent, name, size) {
    return new Promise(function (resolve, reject) {
      const table = 'busses'
      const query = `UPDATE ${table} SET id_agent=${idAgent}, car_name='${name}', bus_seat=${size} WHERE id=${id}`
      console.log(query)
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(results)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  deleteBuss: function (id) {
    return new Promise(function (resolve, reject) {
      const table = 'busses'
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
  getAllBusses: function (conditions = {}) {
    let { page, perPage, sort, search } = conditions
    page = page || 1
    perPage = perPage || 5
    sort = sort || { key: 'id', value: 0 } // value => 0 untuk ascending, 1 descending
    search = search || { key: 'car_name', value: '' }
    const table = 'busses'
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
  getTotalBusses: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'car_name', value: '' }
    const table = 'busses'
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
  findBusByAgent: function (id) {
    const table = 'busses'
    const query = `SELECT * FROM ${table} WHERE id_agent=${id}`
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
  findBusById: function (id) {
    const table = 'busses'
    const query = `SELECT * FROM ${table} WHERE id=${id}`
    console.log(query)
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
  updateBussSeat: function (id) {
    return new Promise(function (resolve, reject) {
      const table = 'busses'
      const query = `UPDATE ${table} SET bus_seat=bus_seat-1 WHERE id=${id}`
      // console.log(query)
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(results)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}
