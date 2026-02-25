import type { RouteObject } from "react-router-dom";
import MainLayout from "@/features/layouts/app";
import Scane from "./pages/scane";

const adminRoutes: RouteObject = {
  children: [
    {
      element: <MainLayout />,
      children: [
        {
          path: "/attendance-scan",
          element: <Scane />,
        },
      ],
    },
  ],
};

export default adminRoutes;
