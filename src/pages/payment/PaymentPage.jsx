import React, { useState, useEffect } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState";

const PaymentPage = () => {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      // if (notifyTimer.current) {
      //   clearTimeout(notifyTimer.current);
      //   setNotify(null);
      // }
    };
  }, []);

  const createOrder = async () => {
    try {
      const response = await axiosInstance.post("/payment/create-paypal-order", { amount: "50" });
      console.log("response: ", response.data);
      if (response.data.id) {
        return response.data.id; // Returns PayPal Order ID
      }
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  // ✅ Capture Payment when user approves
  const onApprove = async (data) => {
    try {
      const response = await axiosInstance.post("/payment/capture-paypal-order", { orderID: data.orderID });
      if (response.status === 200) {
        setPaid(true);
        alert("Payment Successful! 🎉");
      }
      console.log("Payment Result:", response.data);
    } catch (err) {
      setError("Payment failed. Try again.");
      console.error("Error capturing payment:", err);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className={`${windowWidth > 768 ? "h-[50vh] w-[50vw]" : "w-full"}`}>
        <h2>Checkout</h2>
        {paid ? <h3>Thank you for your purchase! ✅</h3> : <PayPalButtons createOrder={createOrder} onApprove={onApprove} />}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default PaymentPage;
