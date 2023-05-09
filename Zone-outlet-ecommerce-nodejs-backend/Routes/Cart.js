import express from "express";
const router = express.Router();
import {
    getCartItems,
    addCartItem,
    deleteItem,
  } from "../Controllers/Cart.js";

router.get('/:id', getCartItems);
router.post('/:id', addCartItem);
router.delete('/:userId/:productId', deleteItem);


export default router;
