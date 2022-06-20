const Router = require('express')
const router = new Router()
const tableController = require('../controller/controller')

router.post('/item', tableController.createItem)
router.get('/item/:page', tableController.getItems)
router.get('/item/:id', tableController.getOneItem)
router.put('/item', tableController.updateItem)
router.put('/filter/:page', tableController.getFilteredItems)
router.delete('/item/:id', tableController.deleteItem)


module.exports = router