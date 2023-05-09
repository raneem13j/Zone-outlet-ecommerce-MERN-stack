import Category from "../Models/Categories.js";

export const getAllCategories = async (req, res) => {
  try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ error: err });
    }
};

export const getCategoryById = async (req, res) => {
  try {
      const id = req.params.id;
      console.log(id);
      const category = await Category.findById(id);
      
      res.status(200).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
  }
}

export const createCategory = async (req, res) => {
  try {
      const newCategory = new Category ({
          title: req.body.title,
          subcategories: req.body.subcategories
      });
      await newCategory.save();
      res.status(201).json(newCategory);
      console.log(Category)
  } catch (error) {
      if (error) {
          return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal Server Error" });
  }
}

export const editCategory = async (req, res) => {
  try {
      const id = req.params.id;
      const updateFields = {};
      
      if (req.body.title) updateFields.title = req.body.title;
      if (req.body.subcategories) updateFields.subcategories = req.body.subcategories;
    
      const categoryDoc = await Category.findByIdAndUpdate(id, {
        $set: updateFields,
      }, { new: true });
  
      if (!categoryDoc) return res.status(404).send("Document not found");
      res.status(200).json("Document updated successfully.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating document in the database");
    }
}

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await Category.deleteOne({ _id: id });
    res.status(200).json({ message: "Document deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};