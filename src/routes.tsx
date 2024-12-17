import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import DevelopersList from "./pages/DevelopersList";
import DeveloperProfile from "./pages/DeveloperProfile";
import Reviews from "./pages/Reviews";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="developers" element={<DevelopersList />} />
        <Route path="developers/:id/profile" element={<DeveloperProfile />} />
        <Route path="developers/:id/reviews" element={<Reviews />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
