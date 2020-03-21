const BusModel = require('../models/Bus')
const AgentModel = require('../models/Agent')

module.exports = {
  createBus: async function (req, res) {
    const info = req.user
    const info2 = await AgentModel.findAgentByIdUser(info.id)
    console.log(info2)
    if (info.roleId === 2) {
      // await BusModel.CreateBus()
      const data = {
        success: true,
        msg: 'Bus created',
        info2
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
