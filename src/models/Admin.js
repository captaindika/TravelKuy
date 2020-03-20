const db = require('../utils/db')

module.exports = {
  createAgent: function (id) {
    const table = 'users'
    const query = `UPDATE ${table} SET role_id = 2 WHERE id = ${id}`
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