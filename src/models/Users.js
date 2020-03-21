const db = require('../utils/db')
module.exports = {
  getAllUsers: function (conditions = {}) {
    let { page, perPage, sort, search } = conditions
    page = page || 1
    perPage = perPage || 5
    sort = sort || { key: 'id', value: '' }
    search = search || { key: 'username', value: '' }
    const table = 'users'
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
  getTotalUsers: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'username', value: '' }
    const table = 'users'
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
  createAdmin: function (username, password, roleId) {
    const table = 'users'
    roleId = 1
    const image = 'http://google.com'
    return new Promise(function (resolve, reject) {
      const query = `INSERT INTO ${table} (picture, username, password, role_id, is_active, is_verified) VALUES ('${image}','${username}','${password}', ${roleId}, 1, 1)`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  createUser: function (picture, username, password, roleId) {
    const table = 'users'
    roleId = roleId || 3
    picture = typeof picture === 'string' ? `'${picture}'` : picture
    return new Promise(function (resolve, reject) {
      const query = `INSERT INTO ${table} (picture, username, password, role_id) VALUES (${picture}, '${username}', '${password}', ${roleId})`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results.insertId)
        }
      })
    })
  },
  updateUser: function (id, picture, username, password) {
    const table = 'users'
    picture = typeof picture === 'string' ? `'${picture}'` : picture
    return new Promise(function (resolve, reject) {
      const query = `UPDATE ${table} SET picture =${picture} username=${username}, password=${password} WHERE id=${id}`
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
  deleteUser: function (id) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      const query = `DELETE FROM ${table} WHERE id=${id}`
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
  }
}
