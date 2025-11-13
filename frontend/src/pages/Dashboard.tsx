import React from "react";

const Dashboard: React.FC = () => {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome! You are logged in and can view protected content here.
      </p>
    </main>
  );
};

export default Dashboard;
