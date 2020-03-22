SELECT Orders.OrderID, Customers.CustomerName, Shippers.ShipperName
FROM ((Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID)
INNER JOIN Shippers ON Orders.ShipperID = Shippers.ShipperID);

SELECT busses.name, routes.start, routes.end, schedules.price, schedules.departure_time, schedules.arrive_time
FROM ((schedules
INNER JOIN routes ON schedules.id_route = routes.id)
INNER JOIN busses ON schedules.id_bus = busses.id)

select transactions.id_user, schedules.price, busses.name
from transactions, schedules, busses
where transactions.id = 3 and transactions.id_schedule = schedules.id and schedules.id_bus = busses.id
