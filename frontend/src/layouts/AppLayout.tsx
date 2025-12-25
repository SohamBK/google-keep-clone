import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ViewNoteModal from "../components/NoteModal";

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
          <ViewNoteModal />
        </main>
      </div>
    </>
  );
};

export default AppLayout;
