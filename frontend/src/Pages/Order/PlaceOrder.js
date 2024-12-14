import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const PlaceOrder = () => {
  const { state } = useLocation();
  const { discountedTotal, voucher } = state || {};
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
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Xác nhận đơn hàng</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin giao hàng */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Thông tin giao hàng</h2>
          <div className="p-4 bg-gray-100 rounded-lg">
            <p>
              <strong>Địa chỉ:</strong> {shippingAddress.street},{" "}
              {shippingAddress.ward}, {shippingAddress.district},{" "}
              {shippingAddress.city}
            </p>
          </div>

          {/* Chi tiết sản phẩm */}
          <h2 className="text-2xl font-semibold mt-6 mb-4">Chi tiết sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="px-3 py-4 text-left bg-gray-100">Hình ảnh</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Sản phẩm</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Số lượng</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Giá</th>
                  <th className="px-3 py-4 text-left bg-gray-100">Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={`http://localhost:8080${item.productId.cover_image}`}
                        alt={item.productId.title}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          border: '1px solid #ddd',
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/comics/${item.productId._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.productId.title}
                      </Link>
                    </td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.productId.price.toLocaleString()} VND</td>
                    <td className="p-3">
                      {(item.quantity * item.productId.price).toLocaleString()} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div>
          <h2 className="text-2xl font-semibold mt-4">Tóm tắt đơn hàng</h2>
          <div className="p-4 bg-dark text-white rounded shadow mb-4">
            <ul className="list-unstyled fs-5">
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Mã giảm giá:</span>
                <span>{voucher || "Không có"}</span>
              </li>
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Phương thức thanh toán:</span>
                <span>{paymentMethod}</span>
              </li>
              <li className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Tổng sản phẩm (đã bao gồm mã giảm giá):</span>
                <span>{discountedTotal?.toLocaleString() || "0"} VND</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-primary btn-lg w-100 mt-4"
              onClick={handlePlaceOrder}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
