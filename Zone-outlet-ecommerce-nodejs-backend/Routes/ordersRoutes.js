import express from 'express';
const router = express.Router();

import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
  } from '../Controllers/ordersController.js';


  
// create a new order
router.post('/', createOrder);

// get all orders
router.get('/', getAllOrders);

// get a single order by ID
router.get('/:id', getOrderById);
  
// update the status of an order
router.patch('/:id', updateOrderStatus);
  

  export default router;