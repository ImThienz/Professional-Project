import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải thông tin đơn hàng.");
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
      const response = await fetch(
        "http://localhost:8080/api/vnpay/create-payment-url",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: order.totalPrice,
            orderId: order._id,
            orderInfo: "Thanh toán đơn hàng",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tạo liên kết thanh toán.");
      }

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error creating payment URL:", error);
      alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 md:flex space-x-8 mt-4 mb-4">
      {/* Thông tin đơn hàng */}
      <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Chi tiết đơn hàng</h2>
        {order.orderItems.length === 0 ? (
          <p>Đơn hàng không có sản phẩm.</p>
        ) : (
          <table className="w-full text-sm text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Hình ảnh</th>
                <th className="py-2 px-4">Sản phẩm</th>
                <th className="py-2 px-4 text-center">Số lượng</th>
                <th className="py-2 px-4">Đơn giá</th>
                <th className="py-2 px-4">Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">
                    <img
                      src={`http://localhost:8080${item.product.cover_image}`}
                      alt={item.product.title}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                      }}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/comics/${item.product._id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {item.product.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-center">{item.qty}</td>
                  <td className="py-2 px-4 text-center">
                    {item.price.toLocaleString()} VND
                  </td>
                  <td className="py-2 px-4 text-center">
                    {(item.qty * item.price).toLocaleString()} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="md:w-1/3 mt-6 md:mt-0">
        <h2 className="text-2xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
        <div className="p-4 bg-dark text-white rounded shadow mb-4">
          <ul className="list-unstyled fs-5">
            <li className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Mã đơn hàng:</span>
              <span>{order._id}</span>
            </li>
            <li className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Người đặt:</span>
              <span>{order.user.username}</span>
            </li>
            <li className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Email:</span>
              <span>{order.user.email}</span>
            </li>
            <li className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Địa chỉ giao hàng:</span>
              <span>
                {order.shippingAddress.street}, {order.shippingAddress.ward},{" "}
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </span>
            </li>
            <li className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Phương thức thanh toán:</span>
              <span>{order.paymentMethod}</span>
            </li>
            <li className="d-flex justify-content-between fw-bold fs-5">
              <span>Tổng cộng (đã bao gồm mã giảm giá):</span>
              <span>{order.totalPrice.toLocaleString()} VND</span>
            </li>
          </ul>

          {!order.isPaid && (
            <button
              type="button"
              className="btn btn-primary btn-lg w-100 mt-4"
              onClick={handlePayment}
            >
              Thanh toán ngay
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Order;
