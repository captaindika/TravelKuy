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
  checkUserHasAgent: function (id) {
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT(*) AS total FROM ${table} WHERE id_user = '${id}'`
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
  deleteAgentById: function (idAgent) {
    return new Promise(function (resolve, reject) {
      const table = 'agents'
      const query = `DELETE FROM ${table} WHERE id = ${idAgent}`
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

    const table = 'agents'
    const sql = `SELECT * FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%'
                  ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'} 
                   LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
    console.log(sql)
    return new Promise(function (resolve, reject) {
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
    const table = 'agents'
    const sql = `SELECT COUNT(*) AS total FROM ${table}
                  WHERE ${search.key} LIKE '${search.value}%'`
    console.log(sql)
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  findAgentByIdUser: function (id) {
    const table = 'agents'
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM ${table} WHERE id_user=${id}`
      console.log(query)
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    })
  },
  findAgentById: function (id) {
    const table = 'agents'
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM ${table} WHERE id=${id}`
      console.log(query)
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0])
        }
      })
    })
  }
}
