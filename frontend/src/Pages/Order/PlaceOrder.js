import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PlaceOrder.css"; // Import file CSS để tùy chỉnh giao diện

const PlaceOrder = () => {
  const { state } = useLocation();
  const { discountedTotal, voucher } = state || {};
  console.log("Voucher được truyền:", voucher);
  console.log("Total price:", discountedTotal);
  const [cartItems, setCartItems] = useState([]);
  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));
  const paymentMethod = localStorage.getItem("paymentMethod");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }

        const data = await response.json();
        setCartItems(data.items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    const order = {
      orderItems: cartItems.map((item) => ({
        product: item.productId._id,
        qty: item.quantity,
        price: item.productId.price,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice: discountedTotal || 0,
      voucherCode: voucher || "",
    };
    console.log("Dữ liệu order gửi tới backend:", order);

    try {
      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Phản hồi lỗi từ backend:", errorData);
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();
      console.log("Đơn hàng được tạo thành công:", data);
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="place-order-container">
      <h1 className="place-order-title">Xác nhận đơn hàng</h1>
      <div className="place-order-section">
        <h2>Thông tin giao hàng</h2>
        <p>
          <strong>Địa chỉ:</strong> {shippingAddress.street}, {shippingAddress.ward},{" "}
          {shippingAddress.district}, {shippingAddress.city}
        </p>
      </div>
      <div className="place-order-section">
        <h2>Phương thức thanh toán</h2>
        <p>{paymentMethod}</p>
      </div>
      <div className="place-order-section">
        <h2>Chi tiết sản phẩm</h2>
        <ul className="place-order-item-list">
          {cartItems.map((item) => (
            <li key={item.productId._id} className="place-order-item">
              {item.productId.title} - {item.quantity} x{" "}
              {item.productId.price.toLocaleString()} VND
            </li>
          ))}
        </ul>
      </div>
      <div className="place-order-section">
        <h2>Tóm tắt đơn hàng</h2>
        <p>
          <strong>Mã giảm giá:</strong> {voucher || "Không có"}
        </p>
        <p>
          <strong>Tổng cộng (đã giảm giá):</strong>{" "}
          {discountedTotal?.toLocaleString() || "0"} VND
        </p>
      </div>
      <div className="place-order-actions">
        <button className="place-order-button" onClick={handlePlaceOrder}>
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
