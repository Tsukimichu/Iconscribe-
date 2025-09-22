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
import BusinessCard from './products/BusinessCard.jsx';
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

import Customization from './component/Customization.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/dashboard', element: <Userpage /> },
  { path: '/auth', element: <Authenticate/>},
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login onLogin={() => {}} /> },
  { path: '/transactions', element: (<ProtectedRoute><Transactions /></ProtectedRoute>) },
  { path: '/profile', element: (<ProtectedRoute><Profile /></ProtectedRoute>) },

  // Products
  { path: '/books', element: <Books /> },
  { path: '/brochure', element: <Brochure/>},
  { path: '/business-card', element: <BusinessCard/>},
  { path: '/calling-card', element: <CallingCard/>},
  { path: '/official-receipt', element: <OfficialReceipt/>},
  { path: '/calendars', element: <Calendars/>},
  { path: '/flyers', element: <Flyers/>},
  { path: '/posters', element: <Posters/>},
  { path: '/labels', element: <Label/>}, 
  { path: '/binding', element: <Binding/>},
  { path: '/invitation', element: <Invitation/>},
  { path: '/raffleticket', element: <RaffleTicket/>},            

  // Customization/Maintenance route for selected products
  { path: '/customize', element: <Customization /> },
  { path: '/maintenance', element: <MaintenanceUser/>},

 
  // Admin role 
   { path: '/mainteance', element: <Maintenance/> },


  // Roles
  { path: '/admin', element: <AdminPage /> },      
  { path: '/manager', element: <ManagerPage /> },  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
