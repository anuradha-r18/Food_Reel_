const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware.authUserMiddleware, orderController.createOrder);
router.get('/', authMiddleware.authUserMiddleware, orderController.getUserOrders);

module.exports = router;
