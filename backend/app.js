const express = require("express");
const app = express();
const cors = require("cors");


require ("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Search = require("./routes/search");
app.use(cors());
app.use(express.json());

//routes
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1/search", Search);

//creating port
app.listen(process.env.PORT, () => {
  console.log(`Server Started at port ${process.env.PORT}`);
});