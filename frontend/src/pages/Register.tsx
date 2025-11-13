import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerUser } from "../features/auth/authThunks";

interface RegisterFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    dispatch(registerUser({ email: data.email, password: data.password }))
      .unwrap()
      .then(() => {
        navigate("/login"); // Redirect to login after success
      })
      .catch(() => {});
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
      <section className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-amber-400"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-amber-400"
              }`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-amber-400"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 disabled:opacity-70"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
