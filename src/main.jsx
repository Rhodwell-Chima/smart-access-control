import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App.jsx";
import SignIn from "./routes/SignIn";
import ViewLogs from "./routes/ViewLogs.jsx";
import AddUserForm from "./routes/AddUserForm.jsx";
import UpdateUserForm from "./routes/UpdateUserForm.jsx";
import DeleteUser from "./routes/DeleteUser.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/dashboard",
    element: <p> Hi How are we?</p>,
  },
  {
    path: "/logs",
    element: <ViewLogs />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/add",
    element: <AddUserForm />,
  },
  {
    path: "/update",
    element: <UpdateUserForm />,
  },
  {
    path: "/delete",
    element: <DeleteUser />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
