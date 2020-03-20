const db = require('../utils/db')
db.query(`CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_agent INT NOT NULL,
  id_bus INT NOT NULL,
  id_route INT NOT NULL,
  departure_time DATETIME NOT NULL,
  arrive_time DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk1_schedules FOREIGN KEY(id_agent) REFERENCES agents(id),
  CONSTRAINT fk2_schedules FOREIGN KEY(id_bus) REFERENCES busses(id),
  CONSTRAINT fk3_schedules FOREIGN KEY(id_route) REFERENCES routes(id)
)`)
