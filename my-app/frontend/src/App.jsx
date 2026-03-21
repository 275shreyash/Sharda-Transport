import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import MoversPackers from './pages/MoversPackers'
import CarRental from './pages/CarRental'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Bookings from './pages/admin/Bookings'
import Fleet from './pages/admin/Fleet'
import Inquiries from './pages/admin/Inquiries'
import CustomerDashboard from './pages/CustomerDashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movers-packers', element: <MoversPackers /> },
      { path: 'car-rental', element: <CarRental /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        )
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'fleet', element: <Fleet /> },
      { path: 'inquiries', element: <Inquiries /> },
    ]
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
