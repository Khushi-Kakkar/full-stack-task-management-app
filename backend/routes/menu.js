const express = require("express");
const Menu = require("../models/Menu");

const router = express.Router();

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Get all menu items
 *     description: Retrieves a list of all available menu items.
 *     tags:
 *       - Menu
 *     responses:
 *       200:
 *         description: Successfully fetched menu items
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu items" });
  }
});

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Add a new menu item
 *     description: Adds a new menu item to the database.
 *     tags:
 *       - Menu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - availability
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sandwich"
 *               category:
 *                 type: string
 *                 example: "Main Course"
 *               price:
 *                 type: number
 *                 example: 450.20
 *               availability:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Menu item successfully added
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  try {
    const { name, category, price, availability } = req.body;
    const menu = new Menu({ name, category, price, availability });
    await menu.save();
    res.status(201).json({ message: "Menu Item added", menu });
  } catch (err) {
    res.status(500).json({ message: "Error adding menu item" });
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update a menu item
 *     description: Updates an existing menu item by ID.
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Sandwich"
 *               category:
 *                 type: string
 *                 example: "Main Course"
 *               price:
 *                 type: number
 *                 example: 500.00
 *               availability:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Menu item successfully updated
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!menu) return res.status(404).json({ message: "Menu Item not found" });
    res.json({ message: "Menu Item updated", menu });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating menu item", error: err.message });
  }
});

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     description: Deletes a menu item by ID.
 *     tags:
 *       - Menu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The menu item ID
 *     responses:
 *       200:
 *         description: Menu item successfully deleted
 *       404:
 *         description: Menu item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu Item not found" });
    res.json({ message: "Menu Item deleted", menu });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: err.message });
  }
});

module.exports = router;
