const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const setupSwagger = require("./swaggerConfig");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/authentication");
const menuRoutes = require("./routes/menu");
const ordersRoutes = require("./routes/orders");

app.use("/authentication", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", ordersRoutes);

setupSwagger(app);
app.listen(5000, () => console.log("Server running on port"));
