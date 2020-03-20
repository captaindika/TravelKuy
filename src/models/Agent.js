const db = require('../utils/db')
var table = 'agents'
module.exports = {
  createAgent: function (id, name) {
    const query = `INSERT INTO ${table} (id_user,name) VALUES (${id}, '${name}')`
    console.log(query)
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
  checkAgentExist: function (name) {
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT (*) AS total FROM ${table} WHERE name = '${name}'`
      console.log(query)
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  updateAgent: function (id, idUser, name) {
    return new Promise(function (resolve, reject) {
      const query = `UPDATE ${table} SET id_user=${idUser}, name='${name}' WHERE id=${id}`
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
  updateAgentForUser: function (id, name) {
    return new Promise(function (resolve, reject) {
      const query = `UPDATE ${table} SET  name='${name}' WHERE id=${id}`
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
  deleteAgent: function (idUser) {
    return new Promise(function (resolve, reject) {
      const query = `DELETE FROM ${table} WHERE id_user=${idUser}`
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
  getAllAgents: function (conditions = {}) {
    let { page, perPage, sort, search } = conditions
    page = page || 1
    perPage = perPage || 5
    sort = sort || { key: 'id', value: 1 } // value => 0 untuk ascending, 1 descending
    search = search || { key: 'name', value: '' }
    const table = 'agents'
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
  getTotalAgents: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'name', value: '' }
    const table = 'agents'
    return new Promise(function (resolve, reject) {
      const sql = `SELECT COUNT (*) AS TOTAL FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%'`
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  }
}
