const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comic",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng rỗng, không thể tạo đơn hàng" });
    }

    const orderItems = cart.items.map((item) => ({
      name: item.productId.title,
      qty: item.quantity,
      price: item.productId.price,
      product: item.productId._id,
    }));

    const totalPrice = orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const order = new Order({
      orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice,
      user: req.user._id,
    });

    await order.save();
    await Cart.deleteOne({ userId: req.user._id }); // Xóa giỏ hàng sau khi đặt hàng

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

module.exports = mongoose.model("Cart", cartSchema);
