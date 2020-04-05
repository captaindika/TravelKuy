const db = require('../utils/db')

module.exports = {
  createUserDetail: function (idUser, name, email, phone, balance) {
    const table = 'user_details'
    const query = `INSERT INTO ${table} (id_user, name, email, phone, balance) VALUES(${idUser}, '${name}','${email}','${phone}', ${balance})`
    console.log(query)
    return new Promise(function (resolve, reject) {
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
  getUserDetailByIdUser: function (idUser) {
    const table = 'user_details'
    const query = `SELECT * FROM ${table} WHERE id_user='${idUser}'`
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
  getAllUserDetail: function (conditions) {
    const { page, perPage, sort, search } = conditions
    // page = page || 1
    // perPage = perPage || 5
    // sort = sort || { key: 'id', value: 1 }
    // search = search || { key: 'username', value: '' }
    const table = 'user_details'
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM ${table}
                    WHERE ${search.key} LIKE '${search.value}%'
                    ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'} 
                    LIMIT ${perPage} OFFSET ${(page - 1) * perPage}`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  },
  getTotalUserDetail: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'username', value: '' }
    const table = 'user_details'
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT (*) AS total FROM ${table}
                    WHERE ${search.key} LIKE '${search.value}%'`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  updateUserDetailByIdUser: function (id, name, email, phone) {
    const table = 'user_details'
    const sql = `UPDATE ${table} SET name='${name}', email='${email}', phone='${phone}' WHERE id_user=${id}`
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results, fields) {
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
  topUp: function (idUser, balance) {
    const table = 'user_details'
    const query = `UPDATE ${table} SET balance = balance + ${balance} WHERE id_user=${idUser}`
    console.log(query)
    return new Promise(function (resolve, reject) {
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
  updateBalance: function (idUser, balance) {
    const table = 'user_details'
    const query = `UPDATE ${table} SET balance = ${balance} WHERE id_user=${idUser}`
    // console.log(query)
    return new Promise(function (resolve, reject) {
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
