import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Splash from './Splash.jsx';
import Userpage from './Userpage.jsx';
import Authenticate from './component/login_signup_Page.jsx';
import Signup from './component/Signup.jsx';
import Login from './component/Login.jsx';
import Profile from './component/Profile.jsx';
import Transactions from './component/Transactions.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import AdminPage from './component/admin/AdminPage.jsx';
import Books from './products/Books.jsx';
import Brochure from './products/Brochure.jsx';
import CallingCard from './products/CallingCard.jsx';
import Calendars from './products/Calendars.jsx';
import OfficialReceipt from './products/OfficialReceipt.jsx';
import Flyers from './products/Flyers.jsx';
import Posters from './products/Posters.jsx';
import Maintenance from './component/admin/Maintenance.jsx';
import MaintenanceUser from './component/MaintenanceUser.jsx';
import ManagerPage from './component/manager/ManagerPage.jsx';
import Label from './products/Label.jsx';
import Binding from './products/Binding.jsx';
import Invitation from './products/Invitation.jsx';
import RaffleTicket from './products/RaffleTicket.jsx';
import NewsLetter from './products/NewsLetter.jsx';
import Customization from './component/Customization.jsx';
import TemplateGallery from './component/TemplateGallery.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastProvider } from './component/ui/ToastProvider.jsx';
import { AuthProvider } from './context/authContext.jsx';
<<<<<<< HEAD
//import CustomizationPage from "./component/customization/CustomizationPage";
import Customizer from "./pages/Customizer";
import CanvasEditor from './component/CanvasEditor.jsx';
=======

// ✅ Canva-style Editor imports
import  EditorPage  from './pages/EditorPage.jsx';
import { EditorProvider } from './context/EditorContext.jsx';
>>>>>>> 4719f0328a018e03fe426fa9299416772b732eda

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/dashboard', element: <Userpage /> },
  { path: '/auth', element: <Authenticate /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login onLogin={() => {}} /> },
  { path: '/transactions', element: (<ProtectedRoute><Transactions /></ProtectedRoute>) },
  { path: '/profile', element: (<ProtectedRoute><Profile /></ProtectedRoute>) },

  // Products
  { path: '/books', element: <Books /> },
  { path: '/brochure', element: <Brochure /> },
  { path: '/calling-card', element: <CallingCard /> },
  { path: '/official-receipt', element: <OfficialReceipt /> },
  { path: '/calendars', element: <Calendars /> },
  { path: '/flyers', element: <Flyers /> },
  { path: '/posters', element: <Posters /> },
  { path: '/labels', element: <Label /> },
  { path: '/binding', element: <Binding /> },
  { path: '/invitation', element: <Invitation /> },
  { path: '/raffleticket', element: <RaffleTicket /> },
  { path: '/newsletter', element: <NewsLetter /> },

  // Customization / Maintenance
  { path: '/customize', element: <Customization /> },
<<<<<<< HEAD
  { path: '/canvas-editor', element: <CanvasEditor /> },
  { path: '/maintenance', element: <MaintenanceUser/>},
=======
  { path: '/maintenance', element: <MaintenanceUser /> },
>>>>>>> 4719f0328a018e03fe426fa9299416772b732eda
  { path: '/template-gallery', element: <TemplateGallery /> },

  // Admin role
  { path: '/mainteance', element: <Maintenance /> },

  // Roles
  { path: '/admin', element: <AdminPage /> },
  { path: '/manager', element: <ManagerPage /> },

  // ✅ Canva-style Editor Page
  { path: '/editor', element: (
    <EditorProvider>
      <EditorPage />
    </EditorProvider>
  ) },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
