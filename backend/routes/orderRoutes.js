const express = require("express");
const { createOrder, getOrderById, getOrders, updatePaymentStatus, updateDeliveryStatus } = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkAdminRole = require("../middlewares/checkAdminRole");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/:id", authMiddleware, getOrderById);
router.get("/", authMiddleware, getOrders);
router.post("/vnpay/callback", updatePaymentStatus);
router.put("/:id/deliver", authMiddleware, checkAdminRole, updateDeliveryStatus);

module.exports = router;
