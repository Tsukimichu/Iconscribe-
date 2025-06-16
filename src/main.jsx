import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Splash from './Splash.jsx';
import Userpage from './Userpage.jsx';
import Signup from './component/Signup.jsx'; // ✅ Add this

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/dashboard', element: <Userpage /> },
  { path: '/signup', element: <Signup /> }, // ✅ Add this line
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
