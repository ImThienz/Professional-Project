import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token"); // Lấy token từ localStorage

      if (!token) {
        console.error("Token không hợp lệ hoặc chưa đăng nhập.");
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/vnpay/create-payment-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: order.totalPrice, // Sử dụng tổng đã giảm giá
          orderId: order._id,
          orderInfo: "Thanh toán đơn hàng",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment URL");
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error creating payment URL:", error);
      alert("Đã xảy ra lỗi khi tạo liên kết thanh toán. Vui lòng thử lại.");
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Chi tiết đơn hàng</h1>
      <p>Mã đơn hàng: {order._id}</p>
      <p>
        Địa chỉ: {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
        {order.shippingAddress.district}, {order.shippingAddress.city}
      </p>
      <p>Phương thức thanh toán: {order.paymentMethod}</p>
      {order.voucherCode && <p>Mã giảm giá: {order.voucherCode}</p>}
      <p>Tổng cộng (đã giảm giá): {order.totalPrice.toLocaleString()} VND</p>
      {order.voucherCode && <p>Mã giảm giá: {order.voucherCode}</p>}
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default Order;
