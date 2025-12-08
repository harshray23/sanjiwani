"use client";

import Script from "next/script";
import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }), // ₹500
      });

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Sanjiwani Health",
        description: "Subscription Payment",
        order_id: order.id,
        callback_url: "/api/paymentverify",
        theme: { color: "#2ECC71" },
        redirect: true, // Razorpay will redirect after payment
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error while starting payment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          {loading ? "Processing..." : "Pay ₹500"}
        </button>
      </div>
    </>
  );
}