import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
        },
      },
    ],

    total_price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processed"],
      default: "pending",
    },
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
