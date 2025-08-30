import React, { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  loginUser,
  clearAuthError,
  selectAuth,
} from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  loginFormSchema,
  type LoginFormInputs,
} from "../../types/validationSchemas";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    error: reduxError,
    accessToken,
  } = useAppSelector(selectAuth);

  // Redirect to the home page if a token already exists
  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    dispatch(clearAuthError());
    const resultAction = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm mx-auto">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            errors.email ? "border-red-500" : ""
          }`}
          id="email"
          type="email"
          placeholder="email@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs italic mt-2">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
            errors.password ? "border-red-500" : ""
          }`}
          id="password"
          type="password"
          placeholder="******************"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs italic">
            {errors.password.message}
          </p>
        )}
      </div>

      {reduxError && (
        <p className="text-red-500 text-center text-sm italic mb-4">
          {reduxError}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Log In"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
