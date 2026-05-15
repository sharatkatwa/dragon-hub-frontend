import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import AuthBootstrap from "./app/components/auth/AuthBootstrap.jsx";
import Toaster from "./app/components/toast/Toaster.jsx";
import { setupInterceptors } from "./app/api/setupInterceptors.js";
import AppRoutes from "./app/routes/AppRoutes.jsx";
import { store } from "./app/store/store.js";

setupInterceptors();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthBootstrap />
    <AppRoutes />
    <Toaster />
  </Provider>,
);
