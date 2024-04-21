const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();

router.get("/cart/:id", userController.getCart);
router.post("/addcart/:id", userController.postCart);
router.put("/updatecart/:id", userController.updateCart);
router.post("/deletecart/:id", userController.deleteCart);

router.post("/order/post", userController.postOrder);
router.get("/orders", userController.getOrders);
router.get("/order/:id", userController.getOrder);
router.get("/order/:userid/:detailid", userController.getOrderDetail);

router.get("/getbusiness", userController.getBusinessInfo);

module.exports = router;
