import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartPage.css";
import { Plus, Minus, Trash2 } from "lucide-react";
import { IoAdd } from "react-icons/io5";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] }); // Đặt giá trị mặc định là một đối tượng rỗng
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Fetch cart data when the component is mounted
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Bạn cần đăng nhập để xem giỏ hàng!");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8080/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data || { items: [] }); // Đảm bảo luôn có giá trị mặc định
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau!");
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchCart();
  }, []);

  // Remove product from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để xóa sản phẩm khỏi giỏ hàng!");
        return;
      }

      // Gửi yêu cầu xóa sản phẩm khỏi giỏ hàng
      await axios.delete("http://localhost:8080/api/cart", {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Gọi lại API để lấy giỏ hàng mới
      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.items) {
        // Cập nhật lại state giỏ hàng
        setCart(response.data);
      } else {
        alert("Không thể làm mới giỏ hàng!");
      }
    } catch (error) {
      console.error(error);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng!");
    }
  };

  // Update product quantity in cart
  const handleChangeQuantity = async (productId, newQuantity) => {
    if (!productId || newQuantity < 0) {
      alert("Số lượng không hợp lệ!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để cập nhật giỏ hàng!");
        return;
      }

      if (newQuantity === 0) {
        // Nếu số lượng bằng 0, xóa sản phẩm khỏi giỏ hàng
        await handleRemoveFromCart(productId);
        return;
      }

      // Gửi yêu cầu cập nhật số lượng nếu số lượng > 0
      await axios.put(
        `http://localhost:8080/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Gọi lại API để lấy giỏ hàng mới
      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.items) {
        // Cập nhật lại state giỏ hàng
        setCart(response.data || { items: [] });
      } else {
        alert("Không thể làm mới giỏ hàng!");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng sản phẩm. Vui lòng thử lại!");
    }
  };

  // Calculate total price of the cart
  const calculateTotalPrice = () => {
    if (!cart.items || !Array.isArray(cart.items)) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0; // Kiểm tra giá hợp lệ
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return price.toLocaleString(); // Định dạng giá với dấu phẩy
  };

  const handlePayment = async () => {
    const response = await fetch(
      "http://localhost:8080/api/vnpay/create-payment-url",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotalPrice(), // Số tiền thanh toán
          orderId: Date.now(), // Mã đơn hàng
          orderInfo: "Thanh toán đơn hàng",
        }),
      }
    );

    const { paymentUrl } = await response.json();
    if (paymentUrl) {
      window.location.href = paymentUrl; // Redirect đến VNPay
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!cart.items || cart.items.length === 0) return <div>Giỏ hàng trống!</div>;

  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>
      <ul>
        {cart.items.map((item) => (
          <li key={item.productId._id} className="cart-item">
            <div className="cart-item-details">
              <img
                src={`http://localhost:8080${item.productId.cover_image}`}
                alt={item.productId.title}
                className="cart-item-image"
                onError={() =>
                  console.log(
                    "Image failed to load:",
                    item.productId.cover_image
                  )
                }
              />

              <div className="cart-item-info">
                <h2>{item.productId.title}</h2>
                <p>Giá: {formatPrice(item.productId.price)} VND</p>
                <p>Số lượng:</p>
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      handleChangeQuantity(
                        item.productId._id,
                        item.quantity - 1
                      )
                    }
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleChangeQuantity(
                        item.productId._id,
                        item.quantity + 1
                      )
                    }
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p>
                  Tổng tiền: {formatPrice(item.productId.price * item.quantity)}{" "}
                  VND
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveFromCart(item.productId._id)}
              className="remove-btn"
            >
              <Trash2 size={16} />
              <span>Xóa khỏi giỏ hàng</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3>Tổng cộng: {formatPrice(calculateTotalPrice())} VND</h3>
        <button onClick={handlePayment}>Thanh toán</button>
      </div>
    </div>
  );
};

export default CartPage;
