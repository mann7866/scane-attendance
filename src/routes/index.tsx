import adminRoutes from "@/features/attendance/route";
import { BrowserRouter, useRoutes } from "react-router-dom";

function AppRouter() {
  const routes = useRoutes([
    adminRoutes
  ]);

  return routes;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
