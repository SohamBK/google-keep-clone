import React from "react";
import { NavLink } from "react-router-dom";
import { MdLightbulbOutline, MdArchive, MdDeleteOutline } from "react-icons/md";

const Sidebar: React.FC = () => {
  const navItems = [
    {
      label: "Notes",
      path: "/dashboard",
      icon: <MdLightbulbOutline size={22} />,
    },
    {
      label: "Archive",
      path: "/archive",
      icon: <MdArchive size={22} />,
    },
    {
      label: "Trash",
      path: "/trash",
      icon: <MdDeleteOutline size={22} />,
    },
  ];

  return (
    <aside
      className="
        group
        h-[calc(100vh-64px)]
        sticky top-16
        bg-amber-50
        border-r border-amber-200
        transition-all duration-200
        w-16 hover:w-64
        px-2 py-4
      "
    >
      <nav className="space-y-1">
        {navItems.map(({ label, path, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `
                flex items-center gap-4
                px-3 py-2
                rounded-full
                text-gray-700
                hover:bg-amber-100
                transition
                ${isActive ? "bg-amber-200 text-amber-800 font-medium" : ""}
              `
            }
          >
            {/* Icon */}
            <span className="min-w-[24px] flex justify-center">{icon}</span>

            {/* Label (hidden when collapsed) */}
            <span
              className="
                absolute left-16
                text-black text-lg
                px-2 py-1 rounded
                opacity-0
                group-hover:opacity-100
                group-hover:left-16
                transition-opacity duration-200
              "
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
