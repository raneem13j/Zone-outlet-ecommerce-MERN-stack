import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category:{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, "Please include the product category"],
  }

}, { timestamps: true });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

export default Subcategory;