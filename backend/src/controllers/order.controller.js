const orderModel = require('../models/order.model');

async function createOrder(req, res) {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.user._id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must contain at least one item" });
        }

        const order = await orderModel.create({
            user: userId,
            items,
            totalAmount
        });

        res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getUserOrders(req, res) {
    try {
        const userId = req.user._id;
        const orders = await orderModel.find({ user: userId })
            .populate('items.food')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    createOrder,
    getUserOrders
};
