const express = require('express');
const Order = require('../models/Orders');

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Allows a user to place a new order.
 *     tags: 
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - totalAmount
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "65f7a99d3e5e42b1a0f3d5c7"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     menuItem:
 *                       type: string
 *                       example: "65f8b34d5a2c1a0e5b9e37c2"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               totalAmount:
 *                 type: number
 *                 example: 900.50
 *     responses:
 *       201:
 *         description: Order successfully created
 *       400:
 *         description: Bad request, invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    try {
        const { userId, items } = req.body; 
        const order = new Order({ userId, items});
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Get orders by user ID
 *     description: Fetches all orders for a specific user.
 *     tags: 
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose orders are being retrieved
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       404:
 *         description: No orders found for this user
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.menuItem');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Get orders by user ID and status
 *     description: Fetches orders for a user, filtered by status.
 *     tags: 
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose orders are being retrieved
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Completed, Cancelled]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.get("/user/:userId", async (req, res) => {
    try {
        const { status } = req.query;
        const query = { userId: req.params.userId };
        if (status) query.status = status;

        const orders = await Order.find(query).populate("items.menuItem");
        res.json(orders);
    } catch (err) {
        console.error(" Error fetching orders:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
