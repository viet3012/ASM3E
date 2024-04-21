const express = require("express");
const authController = require("../middleware/auth");
const productController = require("../controllers/product");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/getdetail/:id", productController.getProduct);
router.post("/add", authController.Auth, productController.addProduct);
router.delete("/delete", authController.Auth, productController.deleteProduct);
router.post("/edit/:id", authController.Auth, productController.editProduct);

router.get("/search", productController.searchProduct);

module.exports = router;
