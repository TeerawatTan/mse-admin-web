/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";

// lazy load all the views

// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const RecoverPassword = React.lazy(() => import("../pages/auth/RecoverPassword"));
const LockScreen = React.lazy(() => import("../pages/auth/LockScreen"));

// dashboard 
const Dashboard = React.lazy(() => import("../pages/dashboard/"));

// Work Place
const Workplace = React.lazy(() => import("../pages/workplace-setting/"));

// Agency
const Agency = React.lazy(() => import("../pages/agency-setting/"));
const AgencyEdit = React.lazy(() => import("../pages/agency-setting/[id]"));

// JobType
const JobType = React.lazy(() => import("../pages/jobtype-setting/"));

// Map Question And Choice
const QuestionAndChoice = React.lazy(() => import("../pages/question-choice-setting/"));

// error pages
const Maintenance = React.lazy(() => import('../pages/error/Maintenance'));
const ComingSoon = React.lazy(() => import('../pages/error/ComingSoon'));
const Error404 = React.lazy(() => import('../pages/error/Error404'));
const Error404Alt = React.lazy(() => import('../pages/error/Error404Alt'));
const Error500 = React.lazy(() => import('../pages/error/Error500'));

export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}

// dashboards
const dashboardRoutes: RoutesProps = {
  path: "/home",
  name: "Dashboards",
  icon: "home",
  header: "Navigation",
  children: [
    {
      path: "/",
      name: "Root",
      element: <Navigate to='/dashboard' />,
      route: PrivateRoute,
    },
    {
      path: '/dashboard',
      name: "Dashboard",
      element: <Dashboard />,
      route: PrivateRoute,
    },
    {
      path: '/workplace',
      name: "Workplace",
      element: <Workplace />,
      route: PrivateRoute,
    },
    {
      path: '/agency',
      name: "Agency",
      element: <Agency />,
      route: PrivateRoute,
    },
    {
      path: 'agency/:id',
      name: "agency-edit",
      element: <AgencyEdit />,
      route: PrivateRoute,
    },
    {
      path: '/jobtype',
      name: "JobType",
      element: <JobType />,
      route: PrivateRoute,
    },
    {
      path: '/question-choice',
      name: "QuestionAndChoice",
      element: <QuestionAndChoice />,
      route: PrivateRoute,
    }
  ],
};

// auth
const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
    route: Route,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
    route: Route,
  },
  {
    path: "/auth/recover-password",
    name: "Recover Password",
    element: <RecoverPassword />,
    route: Route,
  },
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
    route: Route,
  },
];

// public routes
const otherPublicRoutes = [
  {
    path: "*",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    element: <Maintenance />,
    route: Route,
  },
  {
    path: "/coming-soon",
    name: "Coming Soon",
    element: <ComingSoon />,
    route: Route,
  },
  {
    path: "/error-404",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/error-500",
    name: "Error - 500",
    element: <Error500 />,
    route: Route,
  },
];

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);
    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const authProtectedRoutes = [
  dashboardRoutes
];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};
