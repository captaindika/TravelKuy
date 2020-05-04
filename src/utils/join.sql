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

select user_details.name, routes.start, routes.end, schedules.price, busses.name, schedules.departure_date, schedules.departure_time, schedules.arrive_time
from transactions, schedules, busses, user_details, routes
where transactions.id_schedule = schedules.id and 
schedules.id_bus = busses.id and
transactions.id_user = user_details.id_user and
schedules.id_route = routes.id AND
id_user = 18

SELECT user_details.name, routes.start, routes.end, busses.car_name, schedules.price, schedules.departure_time, schedules.arrive_time, schedules.departure_date
FROM transactions
JOIN users ON transactions.id_user = users.id
JOIN user_details ON user_details.id_user = users.id
JOIN schedules ON transactions.id_schedule = schedules.id
JOIN busses ON schedules.id_bus = busses.id
JOIN routes ON schedules.id_route = routes.id


select user_details.name , routes.start, routes.end, schedules.price, busses.car_name, schedules.departure_date, schedules.departure_time, schedules.arrive_time
from ((((transactions 
INNER JOIN schedules ON schedules.id = transactions.id_schedule)
INNER JOIN routes ON routes.id = schedules.id_route)
INNER JOIN busses ON busses.id = schedules.id_bus)
INNER JOIN user_details ON transactions.id_user = user_details.id_user)
WHERE transactions.id_user = ${idUser} and WHERE ${search.key} LIKE `%${search.value}%`
ORDER BY ${sort.key} ${sort.value ?  'ASC' : 'DESC'}
LIMIT ${perPage} OFFSET ${(page - 1) * perPage}

select schedules.id, schedules.price, schedules.departure_time, schedules.arrive_time, routes.start, routes.end, busses.bus_seat
FROM ((schedules 
INNER JOIN routes ON routes.id = schedules.id_route)
INNER JOIN busses ON busses.id = schedules.id_bus)
WHERE ${search.key} LIKE '%${search.value}%' ORDER BY ${sort.key} ${sort.value ? 'ASC' : 'DESC'}
LIMIT ${perPage} OFFSET ${(page - 1) * perPage}
