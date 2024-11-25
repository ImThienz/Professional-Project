import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Dùng để chuyển hướng
import "./CartPage.css";
import { Plus, Minus, Trash2 } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook để điều hướng

  // Check if user is logged in and fetch cart data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem giỏ hàng!");
      navigate("/login"); // Chuyển hướng đến trang đăng nhập
      return; // Dừng thực thi nếu chưa đăng nhập
    }

    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data || { items: [] });
      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // Các hàm khác giữ nguyên, không cần kiểm tra token nữa vì đã kiểm tra ở trên
  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:8080/api/cart", {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(response.data || { items: [] });
    } catch (error) {
      console.error(error);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng!");
    }
  };

  const handleChangeQuantity = async (productId, newQuantity) => {
    if (!productId || newQuantity < 0) {
      alert("Số lượng không hợp lệ!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (newQuantity === 0) {
        await handleRemoveFromCart(productId);
        return;
      }

      await axios.put(
        `http://localhost:8080/api/cart/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(response.data || { items: [] });
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng sản phẩm. Vui lòng thử lại!");
    }
  };

  const calculateTotalPrice = () => {
    if (!cart.items || !Array.isArray(cart.items)) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => price.toLocaleString();

  const handlePayment = async () => {
    const response = await fetch(
      "http://localhost:8080/api/vnpay/create-payment-url",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotalPrice(),
          orderId: Date.now(),
          orderInfo: "Thanh toán đơn hàng",
        }),
      }
    );

    const { paymentUrl } = await response.json();
    if (paymentUrl) {
      window.location.href = paymentUrl;
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
