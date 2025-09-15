import React, { useState, type JSX } from "react";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  HouseDoorFill,
  BoxSeam,
  ClipboardCheck,
  BarChart,
  PeopleFill,
  GearFill,
  KeyFill,
  List,
} from "react-bootstrap-icons";

interface MenuItem {
  to: string;
  icon: JSX.Element;
  label: string;
  action?: () => void;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { to: "/dashboard", icon: <HouseDoorFill />, label: "Home" },
    { to: "/inventory", icon: <BoxSeam />, label: "Inventory" },
    { to: "/promotions", icon: <ClipboardCheck />, label: "Promotions" },
    { to: "/markup", icon: <GearFill />, label: "Mark Up" },
    { to: "/reports", icon: <BarChart />, label: "Reports" },
    { to: "/admin", icon: <PeopleFill />, label: "Admin" },
    { to: "/role-management", icon: <KeyFill />, label: "Role Mgmt" },
  ];

  // Collapse toggle as first item
  const menuWithToggle: MenuItem[] = [
    { to: "#", icon: <List />, label: "", action: () => setCollapsed(!collapsed) },
    ...menuItems,
  ];

  const renderLink = (item: MenuItem) => {
    const isToggle = !!item.action;
    const isActive = location.pathname === item.to;

    const linkContent = isToggle ? (
      // Toggle item
      <div
        className="d-flex align-items-center justify-content-left my-1 px-3 py-2 rounded sidebar-link"
        style={{
          cursor: "pointer",
          height: "42px",
        }}
        onClick={item.action}
      >
        <span className="fs-5">{item.icon}</span>
      </div>
    ) : (
      // Navigation item
      <Link
        to={item.to}
        className={`d-flex align-items-left my-1 px-3 py-2 rounded sidebar-link ${isActive ? "active" : ""}`}
        style={{
          height: "42px",
          justifyContent:  "flex-start",
        }}
      >
        <span className="fs-5">{item.icon}</span>
        <span className={`sidebar-label ${collapsed ? "collapsed" : ""}`}>
          {item.label}
        </span>
      </Link>
    );

    // Tooltip only for collapsed non-toggle items
    if (collapsed && !isToggle) {
      return (
        <OverlayTrigger key={item.to} placement="right" overlay={<Tooltip>{item.label}</Tooltip>}>
          <div>{linkContent}</div>
        </OverlayTrigger>
      );
    }

    return <div key={item.to}>{linkContent}</div>;
  };

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
      <Nav className="flex-column mt-2">
        {menuWithToggle.map(renderLink)}
      </Nav>

      {/* Embedded focused CSS */}
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
