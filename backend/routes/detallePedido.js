const router = require('express').Router();
const c = require('../controllers/detallePedido.controller');

router.get('/:pedidoId', c.getByPedido);
router.post('/', c.create);

module.exports = router;
