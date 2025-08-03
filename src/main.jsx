import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import Splash from './Splash.jsx';
import Userpage from './Userpage.jsx';
import Signup from './component/Signup.jsx';
import Login from './component/Login.jsx';
import Profile from './component/Profile.jsx';
import Transactions from './component/Transactions.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import Books from './products/Books.jsx';
import AdminPage from './component/admin/AdminPage.jsx';     // ✅ Import
import ManagerPage from './component/manager/ManagerPage.jsx'; // ✅ Import

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/dashboard', element: <Userpage /> },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login onLogin={() => {}} /> },
  { path: '/transactions', element: (<ProtectedRoute><Transactions /></ProtectedRoute>) },
  { path: '/profile', element: (<ProtectedRoute><Profile /></ProtectedRoute>) },
  { path: '/books', element: <Books /> },
  { path: '/admin', element: <AdminPage /> },       // ✅ Add admin route
  { path: '/manager', element: <ManagerPage /> },   // ✅ Add manager route
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
