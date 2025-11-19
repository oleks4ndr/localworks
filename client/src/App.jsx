import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import CreateTradesProfile from './pages/CreateTradesProfile';
import ErrorPage from './pages/ErrorPage';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><Dashboard /></PrivateRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile',
    element: <PrivateRoute><Profile /></PrivateRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: '/messages',
    element: <PrivateRoute><Messages /></PrivateRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: '/create-trades-profile',
    element: <PrivateRoute><CreateTradesProfile /></PrivateRoute>,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
