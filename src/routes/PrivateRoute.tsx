import { Route, Navigate, RouteProps } from "react-router-dom";
/**
 * Private Route forces the authorization before the route can be accessed
 * @param {*} param0
 * @returns
 */

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => {

  return (
    <Route
      {...rest}
      render={(props: RouteProps) => {
        const isAuthenticated = localStorage.getItem("accessToken");

        if (!isAuthenticated) {
          // not logged in so redirect to login page with the return url
          return (
            <Navigate
              to={{
                pathname: "/auth/login",
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
