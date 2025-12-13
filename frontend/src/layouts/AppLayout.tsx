import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main
          className="
            flex-1
            bg-gray-50
            min-h-[calc(100vh-64px)]
            transition-all
          "
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default AppLayout;
