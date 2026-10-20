import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, redirect } from "react-router";
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
import { isAuthenticated } from "./utils/auth";

const requireAuth = ({ request }) => {
  if (!isAuthenticated()) {
    const redirectUrl = new URL("/", window.location.origin);
    throw redirect(redirectUrl.pathname + redirectUrl.search);
  }

  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/dashboard",
    element: <App />,
    loader: requireAuth,
  },
  {
    path: "/logs",
    element: <ViewLogs />,
    loader: requireAuth,
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
    loader: requireAuth,
  },
  {
    path: "/users/new",
    element: <AddUserForm />,
    loader: requireAuth,
  },
  {
    path: "/users/:userId/edit",
    element: <UpdateUserForm />,
    loader: requireAuth,
  },
  {
    path: "/roles",
    element: <RolesAccessPoints />,
    loader: requireAuth,
  },
  {
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
    loader: requireAuth,
  },
  {
    path: "/add",
    element: <Navigate to="/users/new" replace />,
    loader: requireAuth,
  },
  {
    path: "/update",
    element: <Navigate to="/users" replace />,
    loader: requireAuth,
  },
  {
    path: "/delete",
    element: <Navigate to="/users" replace />,
    loader: requireAuth,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
