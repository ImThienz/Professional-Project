import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Shipping = () => {
  const [address, setAddress] = useState({
    street: "",
    ward: "",
    district: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [errors, setErrors] = useState({});
  const { state } = useLocation();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
  
    if (!address.street.trim()) {
      newErrors.street = "❗ Địa chỉ đường không được để trống.";
    }
    if (!address.ward.trim()) {
      newErrors.ward = "❗ Vui lòng nhập phường.";
    }
    if (!address.district.trim()) {
      newErrors.district = "❗ Quận không được bỏ trống.";
    }
    if (!address.city.trim()) {
      newErrors.city = "❗ Vui lòng nhập tên thành phố.";
    }
  
    setErrors(newErrors);
  
    // Trả về true nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      localStorage.setItem("shippingAddress", JSON.stringify(address));
      localStorage.setItem("paymentMethod", paymentMethod);

      navigate("/placeorder", {
        state: {
          discountedTotal: state?.discountedTotal, // Truyền tiếp giá đã giảm
          voucher: state?.voucher, // Truyền tiếp voucher
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-8 p-6">
      <h1 className="text-2xl font-semibold mb-6">Thông tin giao hàng</h1>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Địa chỉ đường:</label>
        <input
          type="text"
          placeholder="Địa chỉ đường"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          className={`w-full px-4 py-2 border rounded ${
            errors.street ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.street && (
          <p className="text-red-500 text-sm mt-2">{errors.street}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Phường:</label>
        <input
          type="text"
          placeholder="Phường"
          value={address.ward}
          onChange={(e) => setAddress({ ...address, ward: e.target.value })}
          className={`w-full px-4 py-2 border rounded ${
            errors.ward ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.ward && (
          <p className="text-red-500 text-sm mt-2">{errors.ward}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Quận:</label>
        <input
          type="text"
          placeholder="Quận"
          value={address.district}
          onChange={(e) =>
            setAddress({ ...address, district: e.target.value })
          }
          className={`w-full px-4 py-2 border rounded ${
            errors.district ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.district && (
          <p className="text-red-500 text-sm mt-2">{errors.district}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Thành phố:</label>
        <input
          type="text"
          placeholder="Thành phố"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          className={`w-full px-4 py-2 border rounded ${
            errors.city ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.city && (
          <p className="text-red-500 text-sm mt-2">{errors.city}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Phương thức thanh toán:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-4 py-2 border rounded border-gray-300"
        >
          <option value="VNPay">VNPay</option>
          {/* <option value="PayPal">PayPal</option> */}
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-600 transition"
      >
        Tiếp tục
      </button>
    </form>
  );
};

export default Shipping;
