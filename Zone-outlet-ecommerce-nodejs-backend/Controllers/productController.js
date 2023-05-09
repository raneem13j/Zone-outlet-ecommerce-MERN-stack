import { response } from "express";
import Product from "../Models/productModel.js";
import Category from "../Models/Categories.js";
import Subcategory from "../Models/subcategoryModel.js";
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
 });

class Controller {
  //get all the products
  async getAll(req, res) {
    try {
      const products = await Product.find({ soldOut: false })
        .populate({ path: "subcategory", select: "title" })
        .populate({ path: "category", select: "title" });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getPagination(req, res) {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
  
    // Count the total number of products
    const count = await Product.countDocuments();
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
    const products = await Product.find({soldOut: false })
    .sort({ date_added: -1 }) // Sort products by the createdAt field in descending order
    .skip(skip)
    .limit(limit);
  
    res.status(200).json({
      results: products.length,
      page,
      totalPages, // Add totalPages to the response object
      data: products,
    });
  }
  //get a product by id
  async get(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id)
        .populate({ path: "subcategory", select: "title" })
        .populate({ path: "category", select: "title" });
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  //get discounted products

async getAllDiscountedProducts (req, res) {
  const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 12;
  
    // Count the total number of products
    const count = await Product.countDocuments();
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
  try {
    const products = await Product.find({ discountPercentage: { $gt: 0 } , soldOut: false })
    .sort({ date_added: -1 }) // Sort products by the createdAt field in descending order
    .skip(skip)
    .limit(limit);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No discounted products found" });
    }
    res.status(200).json({
      results: products.length,
      page,
      totalPages, // Add totalPages to the response object
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error occurred while fetching discounted products" });
  }
};

  // creating new product
   
  async post(req, res) {
    try {
      const {
        name,
        description,
        categoryTitle,
        subcategoryTitle,
        price,
        discountPercentage,
        size,
      } = req.body;
  
      let images = [];

      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const uploadedImage = await cloudinary.uploader.upload(req.files[i].path);
          images.push({
            public_id: uploadedImage.public_id,
            url: uploadedImage.secure_url,
          });
        }
      }
      let image;
         if (req.files.images && req.files.images.length > 0) {
      image = req.files.images[0].url;
    } else if (images.length > 0) {
      image = images[0].url;
    }
  
      // Find the category by its title
      const categoryRegex = new RegExp(categoryTitle, "i");
      const category = await Category.findOne({ title: { $regex: categoryRegex } });
  
      // Find the subcategories that belong to the selected category
      const subcategories = await Subcategory.find({ category: category._id});
  
      // Find the specific subcategory by its title within the subcategories array
      const subcategoryRegex = new RegExp(subcategoryTitle, "i");
      const subcategory = subcategories.find(sub => sub.title.match(subcategoryRegex));
  
      const product = new Product({
        name,
        images,
        image,
        description,
        category: category.id,
        subcategory: subcategory._id,
        categoryTitle: category.title,
        subcategoryTitle: subcategory.title,
        price,
        discountPercentage,
        size,
      });
  
      const savedProduct = await product.save();
      const discountedPrice = savedProduct.getDiscountedPrice();
      res.status(201).json({ product: savedProduct, discountedPrice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }



  // async post(req, res) {
  //   try {
  //     const {
  //       name,
  //       description,
  //       categoryTitle,
  //       subcategoryTitle,
  //       price,
  //       discountPercentage,
  //       size,
  //     } = req.body;
      
    
  //     const image = req.files.images[0];
  //   const fileName = image.filename;
  //   const basePath = `${req.protocol}://${req.get("host")}/uploads`;
  //   const Images = req.files.images.map(
  //     (file) => `${basePath}/${file.filename}`
  //   );
    
  //    // Find the category by its title
  //    const categoryRegex = new RegExp(categoryTitle, "i");
  //    const category = await Category.findOne({ title: { $regex: categoryRegex } });


  //    // Find the subcategories that belong to the selected category
  //    const subcategories = await Subcategory.find({ category: category._id});

  //    // Find the specific subcategory by its title within the subcategories array
  //    const subcategoryRegex = new RegExp(subcategoryTitle, "i");
  //    const subcategory = subcategories.find(sub => sub.title.match(subcategoryRegex));

  //     const product = new Product({
  //       name,
  //       image: `${basePath}/${fileName}`,
  //       images: Images,
  //       description,
  //       category: category.id,
  //       subcategory: subcategory._id,
  //       categoryTitle: category.title,
  //       subcategoryTitle: subcategory.title,
  //       price,
  //       discountPercentage,
  //       size,
        
        
  //     });

  //     const savedProduct = await product.save();
  //     const discountedPrice = savedProduct.getDiscountedPrice();
  //     res.status(201).json({ product: savedProduct, discountedPrice });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }

    // let images = [];
      // if (req.files && req.files.length > 0) {
      //   for (const file of req.files) {
      //     const filePath = path.join("uploads", file.filename);
      //     images.push(filePath);
      //   }
      // }

 // update a product
 async put(req, res) {
  try {
    const {
      name,
      description,
      categoryTitle,
      subcategoryTitle,
      price,
      discountPercentage,
      size
    } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploadedImage = await cloudinary.uploader.upload(req.files[i].path);
        images.push({
          public_id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
        });
      }
    }

    let image;
    if (req.files.images && req.files.images.length > 0) {
      image = req.files.images[0].url;
    } else if (images.length > 0) {
      image = images[0].url;
    }
    // Find the category by its title
    const categoryRegex = new RegExp(categoryTitle, "i");
    const category = await Category.findOne({ title: { $regex: categoryRegex } });

    // Find the subcategories that belong to the selected category
    const subcategories = await Subcategory.find({ category: category._id });

    // Find the specific subcategory by its title within the subcategories array
    const subcategoryRegex = new RegExp(subcategoryTitle, "i");
    const subcategory = subcategories.find(sub => sub.title.match(subcategoryRegex));

    const productId = req.params.id;

    let product = null;
    if (!productId) {
      // Create new product if ID is not provided
      product = new Product({
        name,
        images,
        image,
        description,
        category: category.id,
        subcategory: subcategory._id,
        categoryTitle: category.title,
        subcategoryTitle: subcategory.title,
        price,
        discountPercentage,
        size
      });
    } else {
      // Update existing product if ID is provided
      product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.name = name || product.name;
      product.image = image || product.image;
      product.images = images.length > 0 ? images : product.images;
      product.description = description || product.description;
      product.category = category._id || product.category._id;
      product.subcategory = subcategory._id || product.subcategory._id;
      product.categoryTitle = category.title || product.category.title;
      product.subcategoryTitle = subcategory.title || product.subcategory.title;
      product.price = price || product.price;
      product.discountPercentage = discountPercentage || product.discountPercentage;
      product.size = size || product.size;
    }

    const savedProduct = await product.save();
    const discountedPrice = savedProduct.getDiscountedPrice();
    res.json({ product: savedProduct, discountedPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
  //delete a product by id
  async delete(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findOne({ _id: id });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
      } else {
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // get products by subcategory name

  async getProductsBySubcategory(req, res) {
    console.log("hello");
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
  
    const subcategoryId = req.params.id;
    // Count the total number of products
    const count = await Product.countDocuments({ subcategory: subcategoryId });
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
    console.log("subcategoryId: ", subcategoryId);
    try {
      const products = await Product.find({
        subcategory: subcategoryId,
        soldOut: false
      }).sort({ date_added: -1 }).skip(skip).limit(limit);
      console.log("kkkk", products);
      res.status(200).json({
        results: products.length,
        page,
        totalPages, // Add totalPages to the response object
        data: products,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // get products by category name

  async getProductsByCategory(req, res) {
    console.log("hello");
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 8;
  
    const categoryId = req.params.id;
    // Count the total number of products
    const count = await Product.countDocuments({ category: categoryId });
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);
  
    const skip = (page - 1) * limit;
    console.log("categoryId: ", categoryId);
    try {
      const products = await Product.find({
        category: categoryId,
        soldOut: false
      }).sort({ date_added: -1 }).skip(skip).limit(limit);
      console.log("kkkk", products);
      res.status(200).json({
        results: products.length,
        page,
        totalPages, // Add totalPages to the response object
        data: products,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //  search about product

  async search(req, res) {
    try {
      const searchQuery = req.query.q || "";
      const page = req.query.page ? parseInt(req.query.page) : 1; // current page, default to 1 if not provided
      const perPage = 6; // number of products to show per page

      const productsCount = await Product.countDocuments({
        name: { $regex: searchQuery, $options: "i" },
      });
      const products = await Product.find({
        name: { $regex: searchQuery, $options: "i" },
      })
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(productsCount / perPage),
        products,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}






const controller = new Controller();

export default controller;
