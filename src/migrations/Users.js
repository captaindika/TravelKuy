const db = require('../utils/db')
const bcrypt = require('bcryptjs')
const password = process.env.ADMIN_PASS
const encrypPass = bcrypt.hashSync(password)
console.log(password, encrypPass)

db.query(`CREATE TABLE IF NOT EXISTS users(
  id INT PRIMARY KEY AUTO_INCREMENT,
  picture TEXT,
  username VARCHAR(60) NOT NULL,
  password VARCHAR(150) NOT NULL,
  verification_code VARCHAR(37),
  is_active TINYINT(2) DEFAULT 0,
  is_verified TINYINT(2) DEFAULT 0,
  role_id TINYINT(2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE  KEY unique_username (username),
  CONSTRAINT fk_roles FOREIGN KEY (role_id) REFERENCES roles(id)
   )`, function () {
     db.query(`INSERT INTO users(username, password, is_active, is_verified, role_id) VALUES('MAMANGKESBOR','${encrypPass}',1,1,1)`)
   })
//     db.query(`INSERT INTO users (username, password)`)
//   })
