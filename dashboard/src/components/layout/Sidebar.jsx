import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FiMenu, FiHome, FiUser, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-900 text-white transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
          <button onClick={() => setCollapsed(!collapsed)}>
            <FiMenu size={22} />
          </button>
        </div>

        {/* Menu Links */}
        <ul className="mt-4 space-y-3">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer"
            >
              <FiHome size={20} /> {!collapsed && "Dashboard"}
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer"
            >
              <FiUser size={20} /> {!collapsed && "Profile"}
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer"
            >
              <FiSettings size={20} /> {!collapsed && "Settings"}
            </Link>
          </li>
        </ul>
      </div>

      {/* Page Content (OUTLET) */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
