import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải danh sách đơn hàng.");
        }

        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="container mx-auto p-6 mb-4">
      <h1 className="text-2xl font-semibold mb-6 mt-3">Danh sách đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Hình ảnh</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mã đơn hàng</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Tổng tiền</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Ngày tạo</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Thanh toán</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Giao hàng</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {order.orderItems[0]?.product?.cover_image ? (
                    <img
                      src={`http://localhost:8080${order.orderItems[0].product.cover_image}`}
                      alt={order.orderItems[0].product.title}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                      }}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span>Không có hình</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.totalPrice.toLocaleString()} VND
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
