// routes/vnpayRoutes.js
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// Cấu hình VNPay
const vnp_TmnCode = "KSPMY8G5";
const vnp_HashSecret = "2E7R0S56W12NSGR4TZW26IBRN1UN1I5B";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_ReturnUrl = "http://localhost:3000/purchase";

// Tạo URL thanh toán
router.post("/create-payment-url", (req, res) => {
  const { amount, orderId, orderInfo } = req.body;
  const date = new Date();
  const createDate = date.toISOString().slice(0, 19).replace(/T|-|:/g, "");
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_Locale: "vn",
  };

  // Sắp xếp và tạo hash
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = new URLSearchParams(sortedParams).toString();
  const secureHash = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(signData)
    .digest("hex");

  const paymentUrl = `${vnp_Url}?${signData}&vnp_SecureHash=${secureHash}`;
  res.json({ paymentUrl });
});

// Xử lý kết quả thanh toán
router.get("/vnpay_return", (req, res) => {
  const vnp_Params = req.query;

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = new URLSearchParams(sortedParams).toString();
  const checkHash = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(signData)
    .digest("hex");

  if (checkHash === secureHash) {
    const transactionStatus = vnp_Params["vnp_TransactionStatus"];
    if (transactionStatus === "00") {
      res.send("Thanh toán thành công!");
    } else {
      res.send("Thanh toán không thành công!");
    }
  } else {
    res.send("Chữ ký không hợp lệ!");
  }
});

module.exports = router;
