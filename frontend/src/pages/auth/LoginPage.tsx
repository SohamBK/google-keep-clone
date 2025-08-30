import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login</h1>
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
