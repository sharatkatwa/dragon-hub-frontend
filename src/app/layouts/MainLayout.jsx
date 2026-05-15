import { Outlet } from "react-router";
import Navbar from "../components/navigation/Navbar";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <div className="app-container">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
