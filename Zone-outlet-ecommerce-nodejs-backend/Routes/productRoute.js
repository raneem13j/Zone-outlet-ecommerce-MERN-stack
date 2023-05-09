import express from "express";
const router = express.Router();
import controller from "../Controllers/productController.js";
import upload from '../middleware/upload.js'

  

router.get("/", controller.getAll);
router.get("/pag", controller.getPagination);
router.get("/search", controller.search);
router.get("/list1/:id", controller.getProductsBySubcategory);
router.get("/list2/:id", controller.getProductsByCategory);
router.get("/sale", controller.getAllDiscountedProducts);
router.get("/:id", controller.get);
router.post("/", upload.array('images'), controller.post);
// router.post('/', controller.post);
router.put("/:id",upload.array('images'),  controller.put);
router.delete("/:id", controller.delete);

export default router;
