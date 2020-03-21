const db = require('../utils/db')
module.exports = {
  CreateBus: function (idAgent, name, busSeat) {
    const table = 'busses'
    const query = `INSERT INTO ${table} (id_agent,name,bus_seat) VALUES (${idAgent}, '${name}', ${busSeat})`
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
  updateBuss: function (id, idAgent, name) {
    return new Promise(function (resolve, reject) {
      const table = 'busses'
      const query = `UPDATE ${table} SET id_agent=${idAgent}, name='${name}' WHERE id=${id}`
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
    sort = sort || { key: 'id', value: 1 } // value => 0 untuk ascending, 1 descending
    search = search || { key: 'name', value: '' }
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
    search = search || { key: 'name', value: '' }
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
  }
}
