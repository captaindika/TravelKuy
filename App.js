// third party module
const express = require('express')
const cors = require('cors')
const app = express()
const redis = require("redis");
const client = redis.createClient();

// redis
client.on("error", function(error) {
  console.error(error);
})

require('dotenv').config()
const bodyParser = require('body-parser')

// activate cors
app.use(cors())

// middleware
app.use(bodyParser.urlencoded({ extended: false })) // for x-www-urlencoded
app.use(bodyParser.json()) // for json

// import router
const AuthRouter = require('./src/routes/Auth')
const AdminRouter = require('./src/routes/Admin')
const UserRouter = require('./src/routes/User')
const AgentRouter = require('./src/routes/Agent')

app.use('/file', express.static('files'))
app.use('/auth', AuthRouter) // first register here
app.use('/admin', AdminRouter)
app.use('/user', UserRouter)
app.use('/agent', AgentRouter)


// create migration table
app.get('/migrate', function(req, res) {
  require('./src/migrations/Roles')
  require('./src/migrations/Users')
  require('./src/migrations/UserDetails')
  require('./src/migrations/Agents')
  require('./src/migrations/Busses')
  require('./src/migrations/Routes')
  require('./src/migrations/Schedules')
  require('./src/migrations/Transaction')
  const data = {
    msg: 'Table created'
  }
  res.status(200).send(data)
})

// app.get('/roles', function (req, res) {
//   require('./src/migrations/Roles')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/user-details', function (req, res) {
//   require('./src/migrations/UserDetails')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/user', function (req, res) {
//   require('./src/migrations/Users')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/agent', function (req, res) {
//   require('./src/migrations/Agents')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/bus', function (req, res) {
//   require('./src/migrations/Busses')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/schedules', function (req, res) {
//   require('./src/migrations/Schedules')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/transaction', function (req, res) {
//   require('./src/migrations/Transaction')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// app.get('/route', function (req, res) {
//   require('./src/migrations/Routes')
//   const data = {
//     msg: 'table created'
//   }
//   res.send(data)
// })

// port
const port = process.env.PORT

app.listen(port, function () {
  console.log(`listening on port ${port}`)
})
