export default function PaymentSuccess() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <h1 className="text-4xl font-bold text-green-700 mb-3">
          ✅ Payment Successful!
        </h1>
        <p className="text-gray-700">
          Thank you! Your transaction was completed successfully.
        </p>
        <a
          href="/"
          className="mt-5 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Go Back Home
        </a>
      </div>
    );
  }