import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import { Plus, Minus, Trash2 } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState(""); // State lưu mã voucher
  const [discount, setDiscount] = useState(0); // State lưu % giảm giá
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để xem giỏ hàng!");
      navigate("/login");
      return;
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

  const calculateDiscountedTotal = () => {
    const total = calculateTotalPrice();
    return total - (total * discount) / 100;
  };

  const formatPrice = (price) => price.toLocaleString();

  const handleApplyVoucher = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/voucher/check-voucher",
        { code: voucher }
      );
      setDiscount(response.data.discount);
      alert(`Voucher hợp lệ! Giảm ${response.data.discount}%`);
    } catch (error) {
      console.error(error);
      alert("Voucher không hợp lệ hoặc đã hết hạn!");
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    navigate("/shipping", {
      state: {
        discountedTotal: calculateDiscountedTotal(), // Tổng tiền đã giảm
        voucher, 
      },
    });  
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
        <div>
          <input
            type="text"
            placeholder="Nhập voucher"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
          />
          <button onClick={handleApplyVoucher}>Áp dụng</button>
        </div>
        {discount > 0 && (
          <p>
            Giảm giá: {discount}% - Còn lại:{" "}
            {formatPrice(calculateDiscountedTotal())} VND
          </p>
        )}
        <button onClick={handleCheckout}>Thanh toán</button>
      </div>
    </div>
  );
};

export default CartPage;
