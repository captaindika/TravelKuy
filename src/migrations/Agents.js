const db = require('../utils/db')
const table = 'agents'
const query = `CREATE TABLE IF NOT EXISTS ${table} (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_agent1 FOREIGN KEY(id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE

)`
db.query(query, function () {
})
