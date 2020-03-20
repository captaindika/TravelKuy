const db = require('../utils/db')

db.query(`CREATE TABLE IF NOT EXISTS user_details(
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone VARCHAR(60) NOT NULL,
  balance INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT unique_user UNIQUE (id_user))`
)
