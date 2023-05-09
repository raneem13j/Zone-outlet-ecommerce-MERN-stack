import Subcategory from "../Models/subcategoryModel.js";


export const getAllsubCategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate({path: 'category', select: 'title'});
        res.status(200).json(subcategories);
      } catch (err) {
        res.status(500).json({ error: err });
      }
};

export const getSubCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const subcategory = await Subcategory.findById(id).populate({path: 'category', select: 'title'});
        res.status(200).json(subcategory);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}

export const createSubCategory = async (req, res) => {
    try {
        const newSubcategory = new Subcategory ({
            title: req.body.title,
            category: req.body.category
        });
        await newSubcategory.save();
        res.status(201).json(newSubcategory);
        console.log(Subcategory)
    } catch (error) {
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = {};
        
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.category) updateFields.category = req.body.category;

        const subcategoryDoc = await Subcategory.findByIdAndUpdate(id, {
          $set: updateFields,
        }, { new: true });
    
        if (!subcategoryDoc) return res.status(404).send("Document not found");
        res.status(200).json("Document updated successfully.");
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating document in the database");
      }
}

export const deleteSubCategory = async (req, res) => {
    try {
      const id = req.params.id;
      await Subcategory.deleteOne({ _id: id });
      res.status(200).json({ message: "Document deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  };

export const getSubCategoryByCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const subcategories = await Subcategory.find({
      category: categoryId,
    });
    res.status(200).json({ subcategories, message: "subcategorise listed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};