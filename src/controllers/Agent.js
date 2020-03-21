const BusModel = require('../models/Bus')
const AgentModel = require('../models/Agent')

module.exports = {
  createBus: async function (req, res) {
    const info = req.user
    const info2 = await AgentModel.findAgentByIdUser(info.id)
    let { nameCar, size } = req.body
    nameCar = nameCar || `Car ${info2.name}`
    size = size || 5
    // console.log(info2.id_user)
    if (info.roleId === 2) {
      await BusModel.CreateBus(info2.id, nameCar, size)
      const data = {
        success: true,
        msg: `Bus added by ${info2.name}`
      }
      res.send(data)
    } else {
      const data = {
        success: true,
        msg: 'U cannot access this feature',
        value: info2
      }
      res.send(data)
    }
  }
  // const { idAgent, name, seat } = req.body
  // await BusModel.CreateBus(idAgent, name, seat)
}
