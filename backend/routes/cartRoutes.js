const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middlewares/authMiddleware");

// Lấy giỏ hàng
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post("/", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/", authMiddleware, async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
// router.put("/:productId", authMiddleware, async (req, res) => {
//   const { productId } = req.params; // productId từ URL
//   const { quantity } = req.body;

//   try {
//     const cart = await Cart.findOne({ userId: req.user.id });
//     if (!cart) {
//       return res.status(404).json({ error: "Cart not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ error: "Product not found in cart" });
//     }

//     cart.items[itemIndex].quantity = quantity;
//     await cart.save();

//     res.status(200).json(cart); // Trả về cart mới sau khi cập nhật
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Cập nhật số lượng sản phẩm trong giỏ hàng
// router.put("/", authMiddleware, async (req, res) => {
//   const { productId, quantity } = req.body;

//   if (!productId || quantity <= 0) {
//     return res.status(400).json({ error: "Invalid productId or quantity" });
//   }

//   try {
//     const cart = await Cart.findOne({ userId: req.user.id });
//     if (!cart) return res.status(404).json({ error: "Cart not found" });

//     // Tìm index của sản phẩm trong giỏ hàng
//     const itemIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (itemIndex > -1) {
//       // Cập nhật số lượng sản phẩm
//       cart.items[itemIndex].quantity = quantity;
//       await cart.save();
//       return res.status(200).json(cart); // Trả về giỏ hàng đã cập nhật
//     } else {
//       return res.status(404).json({ error: "Product not found in cart" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params; // Lấy productId từ params
  const { quantity } = req.body; // Lấy quantity từ body

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    // Tìm item trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ error: "Sản phẩm không có trong giỏ hàng" });
    }

    // Cập nhật số lượng sản phẩm
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    res.status(200).json(cart); // Trả về giỏ hàng mới
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi cập nhật giỏ hàng" });
  }
});

module.exports = router;
