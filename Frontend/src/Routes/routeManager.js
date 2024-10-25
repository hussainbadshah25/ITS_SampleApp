import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { routes, ROLES } from "./routeConfig";
import { jwtDecode } from "jwt-decode"; // Ensure this is imported correctly

const LoadingFallback = () => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Spin size="large" />
  </div>
);

const ProtectedRoute = ({ element: Component, role, ...rest }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.is_admin ? ROLES.ADMIN : ROLES.USER;

  // Role-based redirection
  if (role === ROLES.ADMIN && userRole !== ROLES.ADMIN) {
    return <Navigate to="/user/dashboard" replace />;
  }
  if (role === ROLES.USER && userRole !== ROLES.USER) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Component {...rest} />;
};

// Public route component to prevent logged-in users from accessing the login page
const PublicRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.is_admin ? ROLES.ADMIN : ROLES.USER;

    // Redirect based on role if user is already logged in
    if (userRole === ROLES.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === ROLES.USER) {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // If user is not logged in, show the login component
  return <Component />;
};

const RouteManager = () => {
  const renderRoutes = (routesList) => {
    return routesList.map((route) => {
      if (route.isPublic) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<LoadingFallback />}>
                <PublicRoute element={route.element} />
              </Suspense>
            }
          />
        );
      }

      if (route.children) {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute element={route.element} role={route.role} />
              </Suspense>
            }
          >
            {renderRoutes(route.children)}
          </Route>
        );
      }

      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ProtectedRoute element={route.element} role={route.role} />
            </Suspense>
          }
        />
      );
    });
  };

  return (
    <Routes>
      {renderRoutes(routes)}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RouteManager;
