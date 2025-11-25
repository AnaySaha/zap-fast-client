import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layout/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/SendParcel/SendParcel";
import DashboardLayout from "../layout/DashboardLayout";
import MyParcels from "../pages/Dashboard/Myparcels/Myparcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import Trackparcel from "../pages/Dashboard/TrackParcel/Trackparcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../pages/Dashboard/ActiveRiders/ActiveRiders";



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
          path: 'beARider',
          element: <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
          
        },

        {
          path: 'sendParcel',
          element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>,
        loader: () => fetch('./servicecenter.json')
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
  },

  {

    path: '/dashboard',
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
      path: 'myParcels',
      Component: MyParcels
      },
      {
        path: 'payment/:parcelId',
        Component: Payment
      },

      {
        path: 'paymentHistory',
        Component: PaymentHistory

      },

      {
        path: 'track',
        Component: Trackparcel
      },

      {
        path: 'pending-riders',
        Component: PendingRiders
      },

      {
        path: 'action-riders',
        Component: ActiveRiders
        
      }
     
    ]
  }
]);