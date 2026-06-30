// TODO define aliases like @views, @services and so on

import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import * as authService from "@services/AuthService";
import GuestInvitations from "@views/GuestInvitations";
import Home from "@views/Home";
import Layout from "@views/Layout";
import NetworkError from "@views/NetworkError";
import NotFound from "@views/NotFound";
import SearchVendor from "@views/SearchVendor";
import VendorDetail from "@views/VendorDetail";
import AuthLayout from "@views/auth/Layout";
import Login from "@views/auth/Login";
import Register from "@views/auth/Register";
import RequestResetPassword from "@views/auth/RequestResetPassword";
import ResetPassword from "@views/auth/ResetPassword";
import VendorAuthLayout from "@views/auth/VendorLayout";
import VendorLogin from "@views/auth/VendorLogin";
import VendorRegister from "@views/auth/VendorRegister";
import BudgetPlanner from "@views/planning/BudgetPlanner";
import Checklist from "@views/planning/Checklist";
import Dresses from "@views/planning/Dresses";
import Guestlist from "@views/planning/Guestlist";
import SeatingChart from "@views/planning/SeatingChart";
import Vendors from "@views/planning/Vendors";
import Website from "@views/planning/Website";
import WedShoots from "@views/planning/WedShoots";
// todo: import your pages
import BarnWeddings from "@views/venue/BarnWeddings";

import AdminRoutes from "./AdminRoutes";
import CoupleRoutes from "./CoupleRoutes";
import VendorRoutes from "./VendorRoutes";
// const Register = React.lazy(() => import('@views/auth/Register')); // lazy loading

function Index() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/search-vendor" element={<SearchVendor />} />
                <Route
                    path="/vendor-detail/:vendorId"
                    element={<VendorDetail />}
                />
                <Route path="/check-list" element={<Checklist />} />
                <Route path="/guest-list" element={<Guestlist />} />
                <Route path="/seating-chart" element={<SeatingChart />} />
                <Route path="/budget-planner" element={<BudgetPlanner />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/dresses" element={<Dresses />} />
                <Route path="/wedding-website" element={<Website />} />
                <Route path="/wedding-shoots" element={<WedShoots />} />
                {/* todo: start from */}
                <Route
                    path="/venues/barn-weddings"
                    element={<BarnWeddings />}
                />

                <Route path="*" element={<NotFound />} />
                <Route path="network-error" element={<NetworkError />} />
            </Route>
            <Route
                element={
                    authService.isLoggedIn() ? (
                        <Navigate to={"/" + authService.getUserRole()} />
                    ) : (
                        <Outlet />
                    )
                }
            >
                <Route element={<AuthLayout />}>
                    <Route path="/" index element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/vendor-register"
                        element={<VendorRegister />}
                    />
                    <Route
                        path="/request-reset-password"
                        element={<RequestResetPassword />}
                    />
                    <Route
                        path="/reset-password/:hash"
                        element={<ResetPassword />}
                    />
                </Route>
            </Route>
            <Route
                element={
                    authService.isLoggedIn() ? (
                        <Navigate to={"/" + authService.getUserRole()} />
                    ) : (
                        <Outlet />
                    )
                }
            >
                <Route element={<VendorAuthLayout />}>
                    <Route path="/vendor-login" element={<VendorLogin />} />
                </Route>
            </Route>
            <Route
                element={
                    authService.isLoggedIn() ? (
                        <Outlet />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            >
                <Route
                    element={
                        authService.getUserRole() === "admin" ? (
                            <Outlet />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route path="/admin/*" element={<AdminRoutes />} />
                </Route>
                <Route
                    element={
                        authService.getUserRole() === "couple" ? (
                            <Outlet />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route path="/couple/*" element={<CoupleRoutes />} />
                </Route>
                <Route
                    element={
                        authService.getUserRole() === "venue" ||
                        authService.getUserRole() === "supplier" ? (
                            <Outlet />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route
                        path={`/${authService.getUserRole()}/*`}
                        element={<VendorRoutes />}
                    />
                    {/* <Route path="/supplier/*" element={<VendorRoutes />} /> */}
                </Route>
            </Route>
            <Route
                path="/guest-invitation/:coupleData"
                element={<GuestInvitations />}
            />

            {/* <Route path="/post/:id" element={<Post />} />  */}
            {/** if notice here both routes this and below same but router 6 will priority the static route first */}
            {/* <Route path="/post/new" element={<NewPost />} /> */}

            {/* TODO: wrap in switch later to active current route only <Switch></Switch>*/}
        </Routes>
    );
}

export default Index;
