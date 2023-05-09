import Cart from "../Models/Cart.js";
import Product from "../Models/productModel.js";

export const getCartItems = async (req, res) => {
  const userId = req.params.id;

  try {
    let cart = await Cart.findOne({ userId })
    .populate("userId", "username  address phonenumber")

      .populate("items.productId")
      .exec();
    if (cart && cart.items.length > 0) {
      res.send(cart);
    } else {
      res.send(null);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }                                                                                                                                           
};


export const addCartItem = async (req, res) => {
  const userId = req.params.id;
  const productId = req.body.productId;
  try {
    let cart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }
    
    // Check if the product is sold out before adding it to the cart
    if (product.soldOut) {
      return res.status(400).send("Product is sold out.");
    }

    let price;
    if (product.discountPercentage > 0) {
      price = product.discountedPrice;
    } else {
      price = product.price;
    }
    if (!cart) {
      const newCart = await Cart.create({
        userId,
        items: [{ productId }],
        bill: price,
      });

      // Mark the product as sold out since it's been added to the cart
      await Product.updateOne({ _id: productId }, { soldOut: true });

      return res.status(201).send(newCart);
    } else {
      let itemIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId.toString()
      );
      if (itemIndex > -1) {
        return res.send("Product already exists in cart.");
      } else {
        cart.items.push({ productId });
      }
      cart.bill += price;
      cart = await cart.save();

      // Mark the product as sold out since it's been added to the cart
      await Product.updateOne({ _id: productId }, { soldOut: true });

      return res.status(201).send(cart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};




export const deleteItem = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    let cart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });
    let itemIndex = cart.items.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart.bill -= product.getDiscountedPrice() || product.price;
    }
    cart = await cart.save();

     // Mark the product as sold in since it's been deleted from the cart
     await Product.updateOne({ _id: productId }, { soldOut: false });
    // console.log("hello", cart);
    return res.status(200).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};