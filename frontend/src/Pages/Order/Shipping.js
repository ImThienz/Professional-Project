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
  const { state } = useLocation(); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    localStorage.setItem("paymentMethod", paymentMethod);
    navigate("/placeorder", {
      state: {
        discountedTotal: state.discountedTotal, // Truyền tiếp giá đã giảm
        voucher: state.voucher, // Truyền tiếp voucher
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Thông tin giao hàng</h1>
      <input
        type="text"
        placeholder="Địa chỉ đường"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phường"
        value={address.ward}
        onChange={(e) => setAddress({ ...address, ward: e.target.value })}
      />
      <input
        type="text"
        placeholder="Quận"
        value={address.district}
        onChange={(e) => setAddress({ ...address, district: e.target.value })}
      />
      <input
        type="text"
        placeholder="Thành phố"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
      />
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="VNPay">VNPay</option>
        <option value="PayPal">PayPal</option>
      </select>
      <button type="submit">Tiếp tục</button>
    </form>
  );
};

export default Shipping;