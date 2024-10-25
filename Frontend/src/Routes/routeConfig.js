import { lazy } from "react";
import AdminLayout from "../Components/Layout/adminLayout";
import UserLayout from "../Components/Layout/userLayout";

const Login = lazy(() => import("../Components/Auth/login"));
const AdminDashboard = lazy(() => import("../Components/Admin/Dashboard"));
const AdminMasterCC = lazy(() =>
  import("../Components/Admin/MasterCountryCity")
);
const AdminMasterHobbies = lazy(() =>
  import("../Components/Admin/MasterHobbies")
);
const AdminAllUsers = lazy(() => import("../Components/Admin/Userslist"));
const UserDashboard = lazy(() => import("../Components/User/dashboard"));
const UserProfile = lazy(() => import("../Components/User/userProfile"));

export const ROLES = {
  ADMIN: 1,
  USER: 0,
};

export const routes = [
  {
    path: "/login",
    element: Login,
    isPublic: true,
  },
  {
    // Admin Routes
    path: "/admin",
    element: AdminLayout,
    role: ROLES.ADMIN,
    children: [
      {
        path: "dashboard",
        element: AdminDashboard,
      },
      {
        path: "users",
        element: AdminAllUsers,
      },
      {
        path: "master/cc",
        element: AdminMasterCC,
      },

      {
        path: "master/hobbies",
        element: AdminMasterHobbies,
      },
    ],
  },
  {
    // User Routes
    path: "/user",
    element: UserLayout,
    role: ROLES.USER,
    children: [
      {
        path: "dashboard",
        element: UserDashboard,
      },
      {
        path: "profile",
        element: UserProfile,
      },
    ],
  },
];
