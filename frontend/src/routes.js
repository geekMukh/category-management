import React from "react";
import { useRoutes, Navigate } from "react-router-dom";

export default function Router(props) {
    const Login = React.lazy(() => import("./pages/auth/login.js"))
    const TreeView = React.lazy(() => import("./pages/product/tree.js"))


    const routes = useRoutes([
        {
            path: "/",
            element: (
                <Navigate to="/login" />
            )
        },
        {
            path: "/login",
            element: (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Login />
                </React.Suspense>
            )
        },
        {
            path: "/register",
            element: (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Login />
                </React.Suspense>
            )
        },
        {
            path: "tree",
            element: (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <TreeView />
                </React.Suspense>
            )
        },
        {
            path: "*",
            element: (
                <Navigate to="/login" />
            )
        }
    ])
    return routes
}