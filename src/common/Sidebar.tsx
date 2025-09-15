import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { List } from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import { menuItems } from "../menuConfig";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div
      className="sidebar-container d-flex flex-column shadow-sm border-end bg-white"
      style={{
        width: collapsed ? "50px" : "220px",
        transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
        minHeight: "100vh",
        zIndex: 2,
      }}
    >
      {/* Collapse Toggle */}
      <div
        className="d-flex align-items-center my-2 px-3 py-2 sidebar-link"
        style={{ cursor: "pointer", height: "42px" }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <List size={20} />
      </div>

      {/* Menu Items */}
      <Nav className="flex-column mt-2">
        {menuItems
          .filter((item: any) => item.roles.includes(user?.role || ""))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center sidebar-link ${isActive ? "active" : ""
                }`
              }
            >
              {item.icon}
              <span
                className={`sidebar-label ${collapsed ? "collapsed" : ""}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
      </Nav>

      {/* Embedded CSS */}
      <style>
        {`
          .sidebar-link {
            color: #495057;
            font-size: 14px;
            transition: background 0.24s, color 0.18s;
            white-space: nowrap;
          }
          .sidebar-link:hover {
            background-color: #f1f3f5;
            color: #0d6efd !important;
          }
          .sidebar-link.active {
            background-color: #e7f1ff;
            color: #0d6efd !important;
            font-weight: 600;
            border-left: 4px solid #0d6efd;
            padding-left: calc(0.75rem - 4px);
          }
          .sidebar-label {
            display: inline-block;
            transition: opacity 0.22s, width 0.22s, margin 0.22s;
            opacity: 1;
            margin-left: 13px;
          }
          .sidebar-label.collapsed {
            opacity: 0;
            width: 0 !important;
            margin: 0 !important;
            pointer-events: none;
          }
          .sidebar-container {
            box-sizing: border-box;
            overflow-x: hidden;
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
