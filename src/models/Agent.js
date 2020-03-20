const db = require('../utils/db')

module.exports = {
  getAllAgent: function (conditions = {}) {
    let { page, perPage, sort, search } = conditions
    page = page || 1
    perPage = perPage || 5
    sort = sort || { key: 'id', value: '' }
    search = search || { key: 'name', value: '' }
    const table = 'agents'
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
  getTotalAgent: function (conditions = {}) {
    let { search } = conditions
    search = search || { key: 'name', value: '' }
    const table = 'agents'
    return new Promise(function (resolve, reject) {
      const query = `SELECT COUNT (*) AS TOTAL FROM ${table}
                    WHERE ${search.key} LIKE '${search.value}%'`
      db.query(query, function (err, results, fields) {
        if (err) {
          reject(err)
        } else {
          resolve(results[0].total)
        }
      })
    })
  }
}
