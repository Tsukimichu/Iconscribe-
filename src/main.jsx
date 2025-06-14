import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Splash from './Splash.jsx'
import Userpage from './Userpage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element:<Splash/>},
  { path: '/dashboard', element:<Userpage/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>,
)
