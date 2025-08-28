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
import ManagerPage from './component/manager/ManagerPage.jsx';
import YearBooks from './products/Yearbooks.jsx'; 
import DocumentPrint from './products/DocumentPrint.jsx';  
import Id from './products/Id.jsx';        
import Label from './products/Label.jsx';  

import Customization from './products/Customization.jsx';

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
  { path: '/yearbooks', element: <YearBooks/>},
  { path: '/documents', element: <DocumentPrint/>},
  { path: '/id-printing', element: <Id/>},            
  { path: '/labels', element: <Label/>},              

  // Customization route for selected products
  { path: '/customize/:productName', element: <Customization /> },

  // Roles
  { path: '/admin', element: <AdminPage /> },      
  { path: '/manager', element: <ManagerPage /> },  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
