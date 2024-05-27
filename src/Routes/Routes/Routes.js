import { createBrowserRouter } from "react-router-dom";
import Main from "../../Layout/Main";
import Add_Category from "../../pages/Add_Category";
import Home from "../../pages/Home";
import Category from "../../pages/Category";
import SignIn from "../../pages/SignIn";
import Hotel from "../../pages/Hotel";
import Orders from "../../pages/Orders";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Add_hotel from "../../pages/Add_hotel";

import Promo from "../../pages/Promo";
import Add_Promo from "../../pages/Add_Promo";
import Add_Recommended from "../../pages/Add_Recommended";
import Recommended from "../../pages/Recommended";
import AdminRoute from "../AdminRoute/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main></Main>
      </PrivateRoute>
    ),

    children: [
      {
        path: "/",
        element: <Home></Home>,
      },

      {
        path: "/add_category",

        element: <Add_Category></Add_Category>,
      },
      // {
      //   path: "/add_hotel",
      //   element: <Add_hotel></Add_hotel>,
      // },
      // {
      //   path: "/hotel_list",
      //   element: <Hotel></Hotel>,
      // },
      {
        path: "/add_promo",
        element: <Add_Promo></Add_Promo>,
      },
      {
        path: "/promo_list",
        element: <Promo></Promo>,
      },
      {
        path: "/add_recommended",
        element: <Add_Recommended></Add_Recommended>,
      },
      {
        path: "/recommended_list",
        element: <Recommended></Recommended>,
      },
      {
        path: "/order",
        element: <Orders></Orders>,
      },
    ],
  },

  {
    path: "/",
    element: (
      <AdminRoute>
        <Main></Main>
      </AdminRoute>
    ),

    children: [
      {
        path: "/",
        element: <Home></Home>,
      },

      {
        path: "/add_category",
        element: <Add_Category></Add_Category>,
      },

      {
        path: "/category_list",
        element: <Category></Category>,
      },
      {
        path: "/add_hotel",
        element: <Add_hotel></Add_hotel>,
      },

      {
        path: "/hotel_list",
        element: <Hotel></Hotel>,
      },
      {
        path: "/add_promo",
        element: <Add_Promo></Add_Promo>,
      },
      {
        path: "/promo_list",
        element: <Promo></Promo>,
      },
      {
        path: "/add_recommended",
        element: <Add_Recommended></Add_Recommended>,
      },
      {
        path: "/recommended_list",
        element: <Recommended></Recommended>,
      },
      {
        path: "/order",
        element: <Orders></Orders>,
      },
    ],
  },
  {
    path: "/signup",
    element: <SignIn></SignIn>,
  },
]);

export default router;
