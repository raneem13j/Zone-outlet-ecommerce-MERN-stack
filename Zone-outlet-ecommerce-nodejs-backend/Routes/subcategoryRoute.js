import express from "express";
const router = express.Router();

import {
    getAllsubCategories,
    getSubCategoryById,
    getSubCategoryByCategory,
    createSubCategory,
    editSubCategory,
    deleteSubCategory
  } from "../Controllers/subcategoryController.js";

router.get('/', getAllsubCategories);
router.get('/:id', getSubCategoryById);
router.get('/list/:id', getSubCategoryByCategory);
router.post('/', createSubCategory);
router.put('/:id', editSubCategory);
router.delete('/:id', deleteSubCategory);



export default router;