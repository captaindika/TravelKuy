const db = require('../utils/db')

module.exports = {
  getAllRoutes: function (conditions) {
    const { page, perPage, sort, search } = conditions
    // page = page || 1
    // perPage = perPage || 5
    // sort = sort || { key: 'id', value: 1 } // 1 for value asc or des
    // search = search || { key: 'end', value: '' }
    const table = 'routes'
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
  getTotalRoutes: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'id', value: '' }
    const table = 'routes'
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
  createRoute: function (idUser, start, end) {
    const table = 'routes'
    const sql = `INSERT INTO ${table} (id_user, start, end) VALUES (${idUser}, '${start}', '${end}')`
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  deleteRoute: function (id) {
    const table = 'routes'
    return new Promise(function (resolve, reject) {
      const sql = `DELETE FROM ${table} WHERE id=${id}`
      console.log(sql)
      db.query(sql, function (err, results, fields) {
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
  updateRoute: function (id, start, end) {
    const table = 'routes'
    const query = `UPDATE ${table} SET start='${start}', end='${end}' WHERE id=${id}`
    // console.log(sql)
    return new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          if (results.affectedRows) {
            resolve(results.affectedRows)
          } else {
            resolve(false)
          }
        }
      })
    })
  },
  getRouteByIdUser: function (idUser) {
    const table = 'routes'
    const sql = `SELECT * FROM ${table} WHERE id_user=${idUser}`
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results, fields) {
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
  getRouteById: function (id) {
    const table = 'routes'
    const sql = `SELECT * FROM  ${table} WHERE id=${id}`
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results, fields) {
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
  }
}
