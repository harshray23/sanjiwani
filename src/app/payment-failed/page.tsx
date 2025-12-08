export default function PaymentFailed() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <h1 className="text-4xl font-bold text-red-700 mb-3">
          ❌ Payment Failed!
        </h1>
        <p className="text-gray-700">Something went wrong. Please try again.</p>
        <a
          href="/checkout"
          className="mt-5 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </a>
      </div>
    );
  }