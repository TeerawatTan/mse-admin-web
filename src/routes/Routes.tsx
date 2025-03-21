import React from "react";
import { Navigate, Route, RouteObject, RouteProps, Routes } from "react-router-dom";

// redux
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

// All layouts containers
import DefaultLayout from "../layouts/Default";
import VerticalLayout from "../layouts/Vertical";

import { authProtectedFlattenRoutes, publicProtectedFlattenRoutes } from ".";
import api from "../api";

const AllRoutes = (props: RouteProps) => {
  const { Layout } = useSelector((state: RootState) => ({
    Layout: state.Layout,
  }));

  const isAuthenticated = localStorage.getItem("accessToken");

  return (
    <React.Fragment>
      <Routes>
        <Route>
          {(publicProtectedFlattenRoutes || []).map((route: RouteObject, idx: number) => (
            <Route
              path={route.path}
              element={
                <DefaultLayout {...props} layout={Layout}>
                  {route.element}
                </DefaultLayout>
              }
              key={idx}
            />
          ))}
          ;
        </Route>

        <Route>
          {(authProtectedFlattenRoutes || []).map((route: RouteObject, idx: number) => (
            <Route
              path={route.path}
              element={
                !isAuthenticated ? (
                  <Navigate
                    to={"/auth/login"}
                  />
                ) : (
                  <VerticalLayout {...props}>{route.element}</VerticalLayout>
                )
              }
              key={idx}
            />
          ))}
          ;
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default AllRoutes;
