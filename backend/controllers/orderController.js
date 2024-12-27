const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Voucher = require("../models/Voucher");
const Comic = require("../models/Comic");

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    console.log("Dữ liệu nhận từ frontend:", req.body);

    // Bước 1: Lấy giỏ hàng
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      console.error("Giỏ hàng rỗng hoặc không tìm thấy.");
      return res.status(400).json({ message: "Giỏ hàng rỗng." });
    }

    console.log("Giỏ hàng của người dùng:", cart);

    // Bước 2: Tạo danh sách sản phẩm từ giỏ hàng
    const orderItems = cart.items.map((item) => ({
      name: item.productId.title,
      qty: item.quantity,
      price: item.productId.price,
      product: item.productId._id,
    }));

    console.log("Danh sách sản phẩm trong đơn hàng:", orderItems);

    // Bước 3: Tính tổng giá ban đầu
    const baseTotalPrice = orderItems.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    console.log("Tổng giá ban đầu:", baseTotalPrice);

    let finalTotalPrice = baseTotalPrice;
    let voucherCode = null;

    // Bước 4: Xử lý mã voucher
    if (req.body.voucherCode) {
      console.log("Nhận mã voucher từ frontend:", req.body.voucherCode);

      try {
        const voucher = await Voucher.findOne({ code: req.body.voucherCode });
        console.log("Thông tin voucher tìm thấy:", voucher);

        if (!voucher) {
          console.error(
            "Voucher không hợp lệ hoặc không tồn tại trong cơ sở dữ liệu."
          );
          return res.status(400).json({ message: "Voucher không hợp lệ." });
        }

        if (new Date() > voucher.expiryDate) {
          console.error(`Voucher "${req.body.voucherCode}" đã hết hạn.`);
          return res.status(400).json({ message: "Voucher đã hết hạn." });
        }

        // Áp dụng giảm giá
        const discount = (baseTotalPrice * voucher.discount) / 100;
        finalTotalPrice -= discount;
        voucherCode = req.body.voucherCode;

        console.log(
          `Voucher "${voucherCode}" áp dụng thành công. Giảm giá: ${discount}`
        );
      } catch (voucherError) {
        console.error(
          "Lỗi khi tìm voucher trong cơ sở dữ liệu:",
          voucherError.message
        );
        return res
          .status(500)
          .json({ message: "Lỗi server khi kiểm tra voucher." });
      }
    } else {
      console.log("Không có voucher nào được gửi từ frontend.");
    }

    console.log("Tổng giá sau khi áp dụng voucher:", finalTotalPrice);

    // Bước 5: Tạo đơn hàng mới
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: finalTotalPrice,
      voucherCode,
    });

    console.log("Dữ liệu đơn hàng chuẩn bị lưu:", {
      user: req.user._id,
      orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: finalTotalPrice,
      voucherCode,
    });

    const createdOrder = await order.save();
    console.log("Đơn hàng đã được tạo:", createdOrder);

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await Cart.deleteOne({ userId: req.user._id });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error.message);
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
};

// Lấy đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra quyền truy cập
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && order.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error.message);
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
};

// Lấy danh sách đơn hàng
const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      // Admin có thể xem tất cả đơn hàng
      orders = await Order.find()
        .populate("user", "username email")
        .populate("orderItems.product");
    } else {
      // Người dùng chỉ có thể xem đơn hàng của chính mình
      orders = await Order.find({ user: req.user._id }).populate(
        "orderItems.product"
      );
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error.message);
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
};

// Cập nhật trạng thái thanh toán
const updatePaymentStatus = async (req, res) => {
  try {
    const { vnp_TransactionStatus, vnp_TxnRef } = req.body;

    if (vnp_TransactionStatus === "00") {
      // "00" là trạng thái thành công
      const order = await Order.findById(vnp_TxnRef);

      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      await order.save();

      return res
        .status(200)
        .json({ message: "Cập nhật trạng thái thanh toán thành công." });
    }

    res.status(400).json({ message: "Thanh toán không thành công." });
  } catch (error) {
    res.status(500).json({ message: `Lỗi server: ${error.message}` });
  }
};

const updateDeliveryStatus = async (req, res) => {
  console.log("ID từ request:", req.params.id);
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái giao hàng:", error.message);
    res.status(500).json({ message: "Lỗi server." });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const orders = await Order.find().populate("orderItems.product");

    if (!orders) {
      return res
        .status(404)
        .json({ message: "Không có đơn hàng nào được tìm thấy." });
    }

    const comicSales = {};

    // Tính số lượng bán của từng truyện
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (comicSales[item.product._id]) {
          comicSales[item.product._id].qty += item.qty;
        } else {
          comicSales[item.product._id] = {
            comic: item.product,
            qty: item.qty,
          };
        }
      });
    });

    // Lấy danh sách truyện bán chạy, sắp xếp giảm dần theo số lượng bán
    const bestSellers = Object.values(comicSales)
      .sort((a, b) => b.qty - a.qty)
      .map((item) => ({
        comic: item.comic,
        qty: item.qty,
      }))
      .slice(0, 10); // Lấy top 10

    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách truyện bán chạy:", error.message);
    res.status(500).json({ message: "Lỗi server." });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrders,
  updatePaymentStatus,
  updateDeliveryStatus,
  getBestSellers,
};
