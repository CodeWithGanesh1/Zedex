import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Cart from "../features/cart/pages/Cart";
import AppLayout from "./Applayout";
import OrderSuccess from "../features/cart/pages/OrderSuccess";
import Orders from "../features/cart/pages/Orders";
import OrderDetail from "../features/cart/pages/OrderDetail";
import SellerOrders from "../features/cart/pages/SellerOrders";


export const routes = createBrowserRouter([

    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "/cart",
                element: <Protected> <Cart /></Protected>
            },
            {
                path: "/order-success",
                element: <OrderSuccess />
            },
            {
    path: "/orders",
    element: <Protected><Orders /></Protected>
},
{
    path: "/orders/:orderId",
    element: <Protected><OrderDetail /></Protected>
},
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",

                        element: <Protected role="seller" >
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role="seller" >
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller" >
                            <SellerProductDetails />
                        </Protected>
                    },{
    path: "/seller/orders",
    element: <Protected role="seller"><SellerOrders /></Protected>
}
                ]
            }
        ]
    }


])