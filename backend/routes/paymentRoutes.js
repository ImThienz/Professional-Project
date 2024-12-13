const express = require("express");
const crypto = require("crypto");
require("dotenv").config();
const Order = require("../models/Order");
const router = express.Router();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cấu hình VNPay từ environment variables
const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

// Kiểm tra xem các biến môi trường có tồn tại không
if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url || !vnp_ReturnUrl) {
  console.error(
    "Missing required VNPay configuration in environment variables"
  );
  process.exit(1);
}

// Tạo URL thanh toán
router.post("/create-payment-url", (req, res) => {
  const { amount, orderId, orderInfo } = req.body;
  console.log("Creating payment for Order ID:", orderId);
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

// Hàm format số tiền
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Xử lý kết quả thanh toán
router.get("/vnpay_return", async (req, res) => {
  console.log("VNPay callback hit");
  console.log("VNPay Query Params:", req.query);

  try {
    const vnp_Params = req.query;
    console.log("VNPay Return Params:", vnp_Params);

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
      .createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(signData)
      .digest("hex");

    if (checkHash === secureHash) {
      const transactionStatus = vnp_Params["vnp_TransactionStatus"];

      const paymentInfo = {
        orderId: vnp_Params["vnp_TxnRef"],
        amount: formatCurrency(parseInt(vnp_Params["vnp_Amount"]) / 100),
        orderInfo: vnp_Params["vnp_OrderInfo"],
        transactionNo: vnp_Params["vnp_TransactionNo"],
        bankCode: vnp_Params["vnp_BankCode"],
        payDate: new Date(
          vnp_Params["vnp_PayDate"].substring(0, 4),
          vnp_Params["vnp_PayDate"].substring(4, 6) - 1,
          vnp_Params["vnp_PayDate"].substring(6, 8),
          vnp_Params["vnp_PayDate"].substring(8, 10),
          vnp_Params["vnp_PayDate"].substring(10, 12),
          vnp_Params["vnp_PayDate"].substring(12, 14)
        ).toLocaleString("vi-VN"),
      };

      if (transactionStatus === "00") {
        // Thanh toán thành công
        const orderId = vnp_Params["vnp_TxnRef"];
        console.log("Mã đơn hàng từ VNPay:", orderId);

        const order = await Order.findById(orderId); 
        if (!order) {
          console.error("Không tìm thấy đơn hàng.");
          return res.status(404).send("Không tìm thấy đơn hàng.");
        }

        console.log("Thông tin đơn hàng:", order);

        // Cập nhật trạng thái đơn hàng
        console.log("Order found:", order);
        order.isPaid = true;
        order.paidAt = new Date();
        await order.save();
        console.log("Order updated:", order);

        res.send(`
          <html>
            <head>
              <title>Kết quả thanh toán</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 20px; 
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  border: 1px solid #ddd; 
                  border-radius: 5px; 
                }
                .success { 
                  color: #28a745; 
                }
                .detail-row { 
                  margin: 10px 0; 
                }
                .label { 
                  font-weight: bold; 
                }
                .home-button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
                  text-align: center;
                }
                .home-button:hover {
                  background-color: #0056b3;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="success">Thanh toán thành công!</h2>
                <div class="detail-row">
                  <span class="label">Mã đơn hàng:</span> ${paymentInfo.orderId}
                </div>
                <div class="detail-row">
                  <span class="label">Số tiền:</span> ${paymentInfo.amount}
                </div>
                <div class="detail-row">
                  <span class="label">Nội dung thanh toán:</span> ${paymentInfo.orderInfo}
                </div>
                <div class="detail-row">
                  <span class="label">Mã giao dịch:</span> ${paymentInfo.transactionNo}
                </div>
                <div class="detail-row">
                  <span class="label">Ngân hàng:</span> ${paymentInfo.bankCode}
                </div>
                <div class="detail-row">
                  <span class="label">Thời gian thanh toán:</span> ${paymentInfo.payDate}
                </div>
                <a href="http://localhost:3000" class="home-button">Đi shopping tiếp</a>
              </div>
            </body>
          </html>
        `);
      } else {
        // Thanh toán thất bại
        res.send(`
          <html>
            <head>
              <title>Kết quả thanh toán</title>
              <meta charset="utf-8">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 20px; 
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  padding: 20px; 
                  border: 1px solid #ddd; 
                  border-radius: 5px; 
                }
                .error { 
                  color: #dc3545; 
                }
                .detail-row { 
                  margin: 10px 0; 
                }
                .label { 
                  font-weight: bold; 
                }
                .home-button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
                  text-align: center;
                }
                .home-button:hover {
                  background-color: #0056b3;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="error">Giao dịch thất bại!</h2>
                <div class="detail-row">
                  <span class="label">Mã đơn hàng:</span> ${paymentInfo.orderId}
                </div>
                <div class="detail-row">
                  <span class="label">Số tiền:</span> ${paymentInfo.amount}
                </div>
                <div class="detail-row">
                  <span class="label">Lý do:</span> Giao dịch không thành công
                </div>
                <div class="detail-row">
                  <span class="label">Thời gian:</span> ${paymentInfo.payDate}
                </div>
                <a href="http://localhost:3000" class="home-button">Thử thanh toán lại lần nữa</a>
              </div>
            </body>
          </html>
        `);
      }
    } else {
      res.send(`
        <html>
          <head>
            <title>Kết quả thanh toán</title>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                margin: 20px; 
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                border: 1px solid #ddd; 
                border-radius: 5px; 
              }
              .error { 
                color: #dc3545; 
              }
              .home-button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                text-align: center;
              }
              .home-button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="error">Lỗi giao dịch!</h2>
              <p>Chữ ký không hợp lệ!</p>
              <a href="/" class="home-button">Quay về trang chủ</a>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error("Error processing VNPay return:", error);
    res.status(500).send(`
      <html>
        <head>
          <title>Lỗi</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              margin: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              border: 1px solid #ddd; 
              border-radius: 5px; 
            }
            .error { 
              color: #dc3545; 
            }
            .home-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
              text-align: center;
            }
            .home-button:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">Có lỗi xảy ra!</h2>
            <p>Có lỗi xảy ra khi xử lý kết quả thanh toán</p>
            <a href="/" class="home-button">Quay về trang chủ</a>
          </div>
        </body>
      </html>
    `);
  }
});

module.exports = router;
