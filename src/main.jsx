import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Splash from "./Splash.jsx";
import Userpage from "./Userpage.jsx";
import Authenticate from "./component/login_signup_Page.jsx";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import Profile from "./component/Profile.jsx";
import Transactions from "./component/Transactions.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import AdminPage from "./component/admin/AdminPage.jsx";
import Books from "./products/Books.jsx";
import Brochure from "./products/Brochure.jsx";
import CallingCard from "./products/CallingCard.jsx";
import Calendars from "./products/Calendars.jsx";
import OfficialReceipt from "./products/OfficialReceipt.jsx";
import Flyers from "./products/Flyers.jsx";
import Posters from "./products/Posters.jsx";
import Maintenance from "./component/admin/Maintenance.jsx";
import MaintenanceUser from "./component/MaintenanceUser.jsx";
import ManagerPage from "./component/manager/ManagerPage.jsx";
import Label from "./products/Label.jsx";
import Binding from "./products/Binding.jsx";
import Invitation from "./products/Invitation.jsx";
import RaffleTicket from "./products/RaffleTicket.jsx";
import NewsLetter from "./products/NewsLetter.jsx";
import Customization from "./component/Customization.jsx";
import TemplateGallery from "./component/TemplateGallery.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastProvider } from "./component/ui/ToastProvider.jsx";
import { AuthProvider } from "./context/authContext.jsx";

// Canva-style Editor imports
import EditorPage from "./pages/EditorPage.jsx";
import { EditorProvider } from "./context/EditorContext.jsx";

// Unauthorized page (add this if not yet created)
import Unauthorized from "./component/Unauthorized.jsx";

const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <Splash /> },
  { path: "/auth", element: <Authenticate /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },

  // Protected customer pages
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
        <Userpage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transactions",
    element: (
      <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
        <Profile />
      </ProtectedRoute>
    ),
  },

  // Products (public or protected — up to you)
  { path: "/books", element: <Books /> },
  { path: "/brochure", element: <Brochure /> },
  { path: "/calling-card", element: <CallingCard /> },
  { path: "/official-receipt", element: <OfficialReceipt /> },
  { path: "/calendars", element: <Calendars /> },
  { path: "/flyers", element: <Flyers /> },
  { path: "/posters", element: <Posters /> },
  { path: "/labels", element: <Label /> },
  { path: "/binding", element: <Binding /> },
  { path: "/invitation", element: <Invitation /> },
  { path: "/raffleticket", element: <RaffleTicket /> },
  { path: "/newsletter", element: <NewsLetter /> },

  // Maintenance / Customization
  { path: "/customize", element: <Customization /> },
  { path: "/maintenance", element: <MaintenanceUser /> },
  { path: "/template-gallery", element: <TemplateGallery /> },

  // Admin routes (locked)
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-maintenance",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Maintenance />
      </ProtectedRoute>
    ),
  },

  // Manager routes (locked)
  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager", "admin"]}>
        <ManagerPage />
      </ProtectedRoute>
    ),
  },

  // Canva-style Editor (for all logged-in users)
  {
    path: "/editor",
    element: (
      <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
        <EditorProvider>
          <EditorPage />
        </EditorProvider>
      </ProtectedRoute>
    ),
  },

  // Unauthorized page
  { path: "/unauthorized", element: <Unauthorized /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
