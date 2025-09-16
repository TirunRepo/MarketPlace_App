import { type ReactNode } from "react";
import {
  HouseDoorFill,
  BoxSeam,
  ClipboardCheck,
  BarChart,
  PeopleFill,
  GearFill,
  KeyFill,
} from "react-bootstrap-icons";

import Promotion from "./components/promotions/Promotion";
import AddMarkup from "./components/markup/AddMarkup";
import Dashboard from "./components/dashboard/Dashboard";
import CruiseLineManager from "./components/inventory/cruiseLines/CruiseLineManager";
import CruiseShipsManager from "./components/inventory/cruiseShips/CruiseShipsManger";
import CruiseDeparturePortManager from "./components/inventory/cruiseDeparturesPort/CruiseDeparturePortManager";
import CruiseDestinationManager from "./components/inventory/cruiseDestination/CruiseDestinatioManager";
import CruiseInventoryManager from "./components/inventory/CruiseInventoryManager";

// Define roles clearly
export type UserRole = "Admin" | "Agent";

// ✅ Extended MenuItem type with children
export interface MenuItem {
  to: string;
  icon: ReactNode;
  label: string;
  roles: UserRole[];
  element: ReactNode;
  children?: MenuItem[]; // <-- optional nested items
}

// ✅ Menu items array with subitems under Inventory
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
    roles: ["Agent", "Admin"],
    element: <CruiseInventoryManager />,
    children: [
      {
        to: "/inventory/manage-inventory",
        icon: <BoxSeam />,
        label: "Cruise Inventory",
        roles: ["Admin", "Agent"],
        element: <CruiseInventoryManager />,
      },
      {
        to: "/inventory/manage-lines",
        icon: <BoxSeam />,
        label: "Manage Lines",
        roles: ["Admin", "Agent"],
        element: <CruiseLineManager />,
      },
      {
        to: "/inventory/manage-ships",
        icon: <BoxSeam />,
        label: "Manage Ships",
        roles: ["Admin", "Agent"],
        element: <CruiseShipsManager />,
      },
      {
        to: "/inventory/manage-destination",
        icon: <BoxSeam />,
        label: "Manage Destination",
        roles: ["Admin", "Agent"],
        element: <CruiseDestinationManager />,
      },
      {
        to: "/inventory/manage-departure-port",
        icon: <BoxSeam />,
        label: "Manage Departure Port",
        roles: ["Admin", "Agent"],
        element: <CruiseDeparturePortManager />,
      },
    ],
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
