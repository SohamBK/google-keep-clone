import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Register
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
