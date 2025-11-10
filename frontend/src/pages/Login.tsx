import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`name: ${email} and password: ${password} `);
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-yellow-50 to-white">
      <section className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">
          {" "}
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={handelSubmit}>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              placeholder="******"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link className="text-yellow-600 hover:underline" to="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
