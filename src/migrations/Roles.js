const db = require('../utils/db')
db.query(`CREATE TABLE IF NOT EXISTS roles(
          id TINYINT(2) PRIMARY KEY AUTO_INCREMENT,
          code VARCHAR(5) NOT NULL ,
          name VARCHAR(15) NOT NULL,
          description VARCHAR(255),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP     
          ) `, function () {
  db.query(`INSERT INTO roles (code, name ,description) VALUES
            ('SA','Super Admin','This role can do anything'),
            ('A','Agent', 'Agent can control bus, schedule, route'),
            ('U','User', 'User only can control their profile and create transaction')
          `)
})
