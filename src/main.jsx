import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root.jsx';
import ErrorPage from './ErrorPage.jsx';
import Login from './routes/Login.jsx';
import Register from './routes/Register.jsx';
import { AuthProvider } from './AuthContext.jsx';
import Home from './routes/Home.jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
