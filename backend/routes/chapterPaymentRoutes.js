const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const UserChapterPayment = require("../models/UserChapterPayment");
const Chapter = require("../models/Chapter");
const ObjectId = mongoose.Types.ObjectId;
require("dotenv").config();

const router = express.Router();

const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL_CHAPTER; // URL trả về riêng cho chapter

router.post("/create-payment", async (req, res) => {
  try {
    const { user_id, chapter_id } = req.body;

    if (!user_id || !chapter_id) {
      console.error("Missing user_id or chapter_id");
      return res
        .status(400)
        .json({ message: "user_id và chapter_id là bắt buộc." });
    }

    const chapter = await Chapter.findById(chapter_id);
    if (!chapter) {
      console.error("Chapter not found with id:", chapter_id);
      return res.status(404).json({ message: "Chapter không tồn tại." });
    }

    const amount = chapter.price * 100;
    const orderId = `${user_id}-${chapter_id}-${Date.now()}`;
    const orderInfo = `Thanh toán Chapter ${chapter.chapter_number}`;
    const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const createDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/T|-|:/g, "");
    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode,
      vnp_Amount: amount,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_Locale: "vn",
    };

    console.log("VNPay parameters to send:", vnp_Params);

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

    console.log("Generated payment URL:", paymentUrl);

    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).json({ message: "Error creating payment URL", error });
  }
});

router.get("/vnpay-return", async (req, res) => {
  try {
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
      .createHmac("sha512", process.env.VNP_HASH_SECRET)
      .update(signData)
      .digest("hex");

    if (checkHash === secureHash && vnp_Params["vnp_ResponseCode"] === "00") {
      const [user_id, chapter_id] = vnp_Params["vnp_TxnRef"].split("-");

      const userObjectId = new ObjectId(user_id);
      const chapterObjectId = new ObjectId(chapter_id);

      const chapter = await Chapter.findById(chapterObjectId);
      if (!chapter) {
        return res.send("<h1>Chapter không tồn tại!</h1>");
      }

      const newPayment = new UserChapterPayment({
        user_id: userObjectId,
        chapter_id: chapterObjectId,
        createdAt: new Date(),
      });

      await newPayment.save();

      // Trả về HTML hiện đại cho thanh toán thành công
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thanh toán thành công</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f4f4f9;
            }
            .container {
              text-align: center;
              padding: 20px;
              background: white;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
              border-radius: 10px;
              width: 80%;
              max-width: 500px;
            }
            .success {
              color: #28a745;
              font-size: 24px;
              font-weight: bold;
            }
            .details {
              margin-top: 20px;
              text-align: left;
            }
            .details p {
              margin: 5px 0;
              font-size: 16px;
            }
            .btn {
              margin-top: 20px;
              padding: 10px 20px;
              font-size: 16px;
              color: white;
              background: #007bff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
              display: inline-block;
            }
            .btn:hover {
              background: #0056b3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">Thanh toán thành công!</h1>
            <div class="details">
              <p><strong>Chapter:</strong> ${chapter.title}</p>
              <p><strong>Số Chapter:</strong> ${chapter.chapter_number}</p>
              <p><strong>Giá:</strong> ${chapter.price.toLocaleString()} VND</p>
              <p><strong>Thời gian thanh toán:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <a href="http://localhost:3000" class="btn">Tiếp tục đọc</a>
          </div>
        </body>
        </html>
      `);
    }

    return res.redirect("/payment-fail");
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).send("<h1>Thanh toán thất bại!</h1>");
  }
});

module.exports = router;
