const db = require('../utils/db')
db.query(`CREATE TABLE IF NOT EXISTS routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  start VARCHAR(30) NOT NULL,
  end VARCHAR(30) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT route_user FOREIGN KEY (id_user) REFERENCES users(id)
)`)
