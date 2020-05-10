const db = require('../utils/db')
db.query(`CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_admin INT NOT NULL,
  id_bus INT NOT NULL,
  id_route INT NOT NULL,
  price INT,
  departure_time TIME NOT NULL,
  arrive_time TIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  departure_date DATE NOT NULL,
  CONSTRAINT user_schedules FOREIGN KEY(id_admin) REFERENCES users(id) ON UPDATE CASCADE ,
  CONSTRAINT bus_schedules FOREIGN KEY(id_bus) REFERENCES busses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT route_schedules FOREIGN KEY(id_route) REFERENCES routes(id) ON DELETE RESTRICT ON UPDATE CASCADE
)`)
