import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import App from "./App.jsx";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import SignIn from "./routes/SignIn";
import ViewLogs from "./routes/ViewLogs.jsx";
import AddUserForm from "./routes/AddUserForm.jsx";
import UpdateUserForm from "./routes/UpdateUserForm.jsx";
import RolesAccessPoints from "./routes/RolesAccessPoints.jsx";
import UserAdminConsole from "./components/UserAdminConsole.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/dashboard",
    element: <App />,
  },
  {
    path: "/logs",
    element: <ViewLogs />,
  },
  {
    path: "/users",
    element: (
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <main className="flex-grow-1 m-3">
          <UserAdminConsole
            title="Manage users"
            description="Review access records, update details, and toggle account activity."
          />
        </main>
        <Footer
          companyName="Smart Access Control"
          socialLinks={[
            {
              label: "Instagram",
              url: "https://instagram.com",
              icon: BsInstagram,
            },
            {
              label: "Facebook",
              url: "https://facebook.com",
              icon: BsFacebook,
            },
          ]}
        />
      </div>
    ),
  },
  {
    path: "/users/new",
    element: <AddUserForm />,
  },
  {
    path: "/users/:userId/edit",
    element: <UpdateUserForm />,
  },
  {
    path: "/roles",
    element: <RolesAccessPoints />,
  },
  {
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/add",
    element: <Navigate to="/users/new" replace />,
  },
  {
    path: "/update",
    element: <Navigate to="/users" replace />,
  },
  {
    path: "/delete",
    element: <Navigate to="/users" replace />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
