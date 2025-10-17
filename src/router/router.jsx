import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
          path: 'coverage',
          Component: Coverage,
          loader: () => fetch('./servicecenter.json')
        },

        {
          path: 'sendParcel',
          element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
        }
    ]
  },

  {
   path: '/',
   Component: AuthLayout,
   children: [
    {
      path: 'login',
      Component: Login
    },

    {
      path: 'register',
      Component: Register
    }


   ]
  }
]);