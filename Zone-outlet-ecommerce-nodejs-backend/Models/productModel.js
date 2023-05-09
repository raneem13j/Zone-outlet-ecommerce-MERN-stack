import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please include the product name"],
  },
  images: [{
    public_id:{
       type: String,
       //required: true,
    },
    url:{
       type: String,
       //required: true,
    }
  }],
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please include the product category"],
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: [true, "Please include the product subcategory"],
  },
  categoryTitle: {
    type: String,
    required: true
  },
  subcategoryTitle: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, "Please include the product price"],
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    required: [true, "Please include the product size"],
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  soldOut: {
    type: Boolean,
    default: false,
  },
 
});

productSchema.methods.getDiscountedPrice = function () {
  const discountAmount = (this.price * this.discountPercentage) / 100;
  return this.price - discountAmount;
};
productSchema.pre("save", function () {
  this.discountedPrice = this.getDiscountedPrice();
});
const Product = model("Product", productSchema);
export default Product;
