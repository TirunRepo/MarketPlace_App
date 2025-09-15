import  { type ReactNode } from "react";
import {
  HouseDoorFill,
  BoxSeam,
  ClipboardCheck,
  BarChart,
  PeopleFill,
  GearFill,
  KeyFill,
} from "react-bootstrap-icons";

import AddInventory from "./components/inventory/AddInventory";
import Promotion from "./components/promotions/Promotion";
import AddMarkup from "./components/markup/AddMarkup";
import Dashboard from "./components/dashboard/Dashboard";

// Define roles clearly
export type UserRole = "Admin" | "Agent";

// ✅ Use ReactNode instead of ReactElement for flexibility
export interface MenuItem {
  to: string;          // Route path
  icon: ReactNode;     // Icon component
  label: string;       // Sidebar label
  roles: UserRole[];   // Allowed roles
  element: ReactNode;  // Component to render for the route
}

// ✅ Menu items array
export const menuItems: MenuItem[] = [
  {
    to: "/dashboard",
    icon: <HouseDoorFill />,
    label: "Home",
    roles: ["Admin", "Agent"],
    element: <Dashboard />,
  },
  {
    to: "/inventory",
    icon: <BoxSeam />,
    label: "Inventory",
    roles: ["Agent","Admin"],
    element: <AddInventory />,
  },
  {
    to: "/promotions",
    icon: <ClipboardCheck />,
    label: "Promotions",
    roles: ["Admin", "Agent"],
    element: <Promotion />,
  },
  {
    to: "/markup",
    icon: <GearFill />,
    label: "Mark Up",
    roles: ["Admin"],
    element: <AddMarkup />,
  },
  {
    to: "/reports",
    icon: <BarChart />,
    label: "Reports",
    roles: ["Agent"],
    element: <div>Reports Page</div>,
  },
  {
    to: "/admin",
    icon: <PeopleFill />,
    label: "Manage Users",
    roles: ["Admin"],
    element: <div>Admin Page</div>,
  },
  {
    to: "/role-management",
    icon: <KeyFill />,
    label: "Role Mgmt",
    roles: ["Admin"],
    element: <div>Role Mgmt</div>,
  },
];
