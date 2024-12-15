import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("adminToken");

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản lý Đơn hàng</h1>
      
        <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
            Quay về Trang Chủ Admin
        </button>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-3 px-4 text-left">SẢN PHẨM</th>
            <th className="py-3 px-4 text-left">MÃ ĐƠN HÀNG</th>
            <th className="py-3 px-4 text-left">NGƯỜI DÙNG</th>
            <th className="py-3 px-4 text-left">NGÀY</th>
            <th className="py-3 px-4 text-left">TỔNG TIỀN</th>
            <th className="py-3 px-4 text-left">THANH TOÁN</th>
            <th className="py-3 px-4 text-left">GIAO HÀNG</th>
            <th className="py-3 px-4 text-center">HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
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
              <td className="py-3 px-4">{order._id}</td>
              <td className="py-3 px-4">
                {order.user ? order.user.username : "N/A"}
              </td>
              <td className="py-3 px-4">
                {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
              </td>
              <td className="py-3 px-4">{order.totalPrice.toLocaleString()} VND</td>
              <td className="py-3 px-4">
                {order.isPaid ? (
                  <span className="text-green-600 bg-green-200 py-1 px-3 rounded-full text-sm">
                    Đã thanh toán
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-200 py-1 px-3 rounded-full text-sm">
                    Chưa thanh toán
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                {order.isDelivered ? (
                  <span className="text-green-600 bg-green-200 py-1 px-3 rounded-full text-sm">
                    Đã giao
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-200 py-1 px-3 rounded-full text-sm">
                    Chưa giao
                  </span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <Link to={`/order/${order._id}`}>
                  <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600">
                    Xem chi tiết
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList;
