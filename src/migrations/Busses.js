const db = require('../utils/db')
db.query(`CREATE TABLE IF NOT EXISTS busses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_agent INT NOT NULL,
  car_name VARCHAR(60) NOT NULL,
  bus_seat TINYINT(2) DEFAULT 6,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT bus_user FOREIGN KEY (id_agent) REFERENCES agents(id) ON UPDATE CASCADE ON DELETE CASCADE
)`)
