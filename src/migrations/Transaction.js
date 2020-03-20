const db = require('../utils/db')
db.query(`CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT NOT NULL,
  id_schedule INT NOT NULL,
  price INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk1_trans FOREIGN KEY(id_user) REFERENCES users(id),
  CONSTRAINT fk2_trans FOREIGN KEY(id_schedule) REFERENCES schedules(id)

)`)
