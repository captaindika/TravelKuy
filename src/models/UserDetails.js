const db = require('../utils/db')

module.exports = {
  createAdminDetail: function (name, email, phone, balance) {
    const table = 'user_details'
    const query = `INSERT INTO ${table} (name, email, phone, balance) VALUES('${name}','${email}','${phone}', ${balance})`
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
  getIdAdminDetail: function (email) {
    const table = 'user_details'
    const query = `SELECT id FROM ${table} WHERE email='${email}'`
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
  }
}
