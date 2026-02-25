import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { QrCode } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({});
  const [collapsedMenu, setCollapsedMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  const menuItems = [
    {
      section: "Attendance",
      items: [
        {
          label: "Attendance Scan",
          icon: QrCode,
          path: "/attendance-scan",
        },
      ],
    },
  ];

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  /* ================= TOOLTIP ================= */
  const handleMouseEnter = (e, label) => {
    if (!collapsed) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setTooltip({
      visible: true,
      text: label,
      x: rect.right + 8,
      y: rect.top + rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  /* ================= FLOATING SUB MENU ================= */
  const handleCollapsedMenuEnter = (e, item) => {
    if (!collapsed) return;

    const rect = e.currentTarget.getBoundingClientRect();

    setCollapsedMenu(item);
    setMenuPosition({
      x: rect.right + 8,
      y: rect.top,
    });
  };

  const handleCollapsedMenuLeave = () => {
    setCollapsedMenu(null);
  };

  return (
    <>
      <aside
        className={`
          fixed lg:relative z-50
          h-full bg-white flex flex-col
          transition-all duration-300
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded text-white bg-primary flex items-center justify-center font-bold">
                A
              </div>
              <span className="font-bold text-lg text-slate-900">Attendance</span>
            </div>
          )}

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <span className="material-icons-outlined">close</span>
          </button>

          {/* Desktop Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block text-slate-400 hover:text-white"
          >
            <span className="material-icons-outlined">
              {collapsed ? "chevron_right" : "chevron_left"}
            </span>
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-2 pt-4 pb-2 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((section, i) => (
            <div key={i}>
              {!collapsed && (
                <div className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-900 uppercase">
                  {section.section}
                </div>
              )}

              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  item.path && location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center ${collapsed ? "justify-center" : ""
                      } px-3 py-2.5 mt-1 text-sm rounded-lg transition ${isActive
                        ? "bg-primary text-white"
                        : "text-slate-900 hover:bg-primary hover:text-white"
                      }`}
                  >
                    <Icon size={20} />

                    {!collapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* PROFILE */}
        {/* PROFILE */}
        <div className="p-4 border-t border-slate-100">
          <button
            className={`group w-full flex items-center ${collapsed ? "justify-center" : "gap-3"
              } p-2 rounded-lg hover:bg-slate-10021 transition`}
          >
            {/* Avatar */}
            <img
              className="w-9 h-9 rounded-full border border-slate-600"
              src="https://i.pravatar.cc/100"
              alt="Admin"
            />

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    Tom Cook
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    Administrator
                  </p>
                </div>

                {/* Logout Icon */}
                <span className="material-icons-outlined text-slate-400 group-hover:text-red-400 transition">
                  logout
                </span>
              </>
            )}
          </button>
        </div>

      </aside>

      {/* TOOLTIP DESKTOP */}
      {tooltip.visible && (
        <div
          className="hidden lg:block fixed z-[9999] px-2 py-1 text-xs bg-slate-800 text-white rounded shadow pointer-events-none"
          style={{
            top: tooltip.y,
            left: tooltip.x,
            transform: "translateY(-50%)",
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* FLOATING SUB MENU */}
      {collapsedMenu && (
        <div
          className="hidden lg:block fixed z-[9999] bg-white rounded-lg shadow-xl py-2 w-48"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
          onMouseEnter={() => setCollapsedMenu(collapsedMenu)}
          onMouseLeave={handleCollapsedMenuLeave}
        >
          {collapsedMenu.children.map((child, i) => {
            const isChildActive =
              location.pathname.startsWith(child.path);

            return (
              <NavLink
                key={i}
                to={child.path}
                className={`block px-4 py-2 text-sm ${isChildActive
                  ? "bg-primary text-white"
                  : "text-slate-300 hover:bg-slate-800"
                  }`}
              >
                {child.label}
              </NavLink>
            );
          })}
        </div>
      )}

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-80 p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              Confirm Logout
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
