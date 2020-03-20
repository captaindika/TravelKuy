const db = require('../utils/db')

module.exports = {
  checkUsername: function (username) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT (*) AS total FROM ${table} WHERE username ='${username}'`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  },
  getUserByUsername: function (username) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      const query = `SELECT * FROM ${table} WHERE username = '${username}'`
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
  createVerificationCode: function (id, vercode) {
    const table = 'users'
    const query = `UPDATE ${table} SET verification_code = '${vercode}' WHERE id = ${id}`
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
  getVerificationCode: async function (username) {
    const table = 'users'
    return new Promise(function (resolve, reject) {
      const query = `SELECT verification_code FROM ${table} WHERE username = '${username}'`
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
  verifyUser: async function (username, code) {
    const table = 'users'
    const checkUser = await this.checkUsername(username)
    const query = `UPDATE ${table} SET verification_code=${null}, is_verified = 1, is_active=1 WHERE username='${username}' AND verification_code = '${code}'`
    return new Promise(function (resolve, reject) {
      if (!checkUser) {
        resolve(false)
      } else {
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
      }
    })
  },
  checkVerifiedUser: function (id) {
    const table = 'users'
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE id = ${id} AND is_verified = 1`
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
  checkActivatedUser: function (id) {
    const table = 'users'
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE id = ${id} AND is_active = 1`
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
  forgotPassword: async function (uuid, newPassword) {
    const table = 'users'
    const query = `SELECT COUNT (*) AS total FROM ${table} WHERE verification_code ='${uuid}' AND is_active=1 AND is_verified=1`
    console.log(query)
    const checkUser = new Promise(function (resolve, reject) {
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
    if (await checkUser) {
      return new Promise(function (resolve, reject) {
        db.query(`UPDATE ${table} SET password='${newPassword}' WHERE verification_code='${uuid}'`, function (err, results, fields) {
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
}
