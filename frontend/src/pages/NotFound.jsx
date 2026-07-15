// NotFound.jsx - 404 page component
import { Link } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-card text-white/90 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-500 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FiHome /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline w-full flex items-center justify-center gap-2"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
