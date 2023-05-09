import Order from "../Models/ordersModel.js";
import Cart from "../Models/Cart.js";
import Product from "../Models/productModel.js";
import Auth from "../Models/Auth.js";

const createOrder = async (req, res) => {
  try {
    const userId = req.body.userId;

    // find the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    // create a new order based on the cart's products
    const order = new Order({

      user: userId,
      products: cart.items.map((item) => ({
        product: {
          _id: item.productId._id,
        },
      })),
      total_price: cart.bill,
    });

    // save the order to the database
    const savedOrder = await order.save();

    // clear the user's cart
    cart.items = [];
    cart.bill = 0;
    await cart.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username  address phonenumber")
      .populate("products.product", "name images image size status price createdAt");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username  address phonenumber")
      .populate("products.product", "name size");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// update the status of an order
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    } 
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export { createOrder, getAllOrders, getOrderById, updateOrderStatus };
