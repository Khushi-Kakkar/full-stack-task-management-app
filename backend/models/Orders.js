const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

OrderSchema.pre("save", async function (next) {
    try {
        const menuItems = await mongoose.model("Menu").find({
            _id: { $in: this.items.map(item => item.menuItem) }
        });

        this.totalAmount = this.items.reduce((sum, item) => {
            const menuItem = menuItems.find(m => m._id.toString() === item.menuItem.toString());
            return sum + (menuItem ? menuItem.price * item.quantity : 0);
        }, 0);

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Order", OrderSchema);
