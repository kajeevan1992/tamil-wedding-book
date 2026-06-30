import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@views/dashboard/Layout";
import CoupleLayout from "@views/dashboard/couple/Layout";
import MyWedding from "@views/dashboard/couple/pages/MyWedding";
import Checklist from "@views/dashboard/couple/pages/Checklist";
import Vendors from "@views/dashboard/couple/pages/Vendors";
import VendorsFilters from "@views/dashboard/couple/pages/VendorsFilters";
import GuestList from "@views/dashboard/couple/pages/GuestList";
import SeatingChart from "@views/dashboard/couple/pages/SeatingChart";
import NotFound from "@views/NotFound";
import BudgetPlanner from "@views/dashboard/couple/pages/BudgetPlanner";
import BudgetPlannerStats from "@views/dashboard/couple/pages/budget-planner/Stats";
import BudgetPlannerCategory from "@views/dashboard/couple/pages/budget-planner/Category";
import Dresses from "@views/dashboard/couple/pages/Dresses";
import WeddingWebsite from "@views/dashboard/couple/pages/WeddingWebsite";
import WebShoots from "@views/dashboard/couple/pages/WebShoots";

// Account
import AccountInformation from "@views/dashboard/couple/account/Information";
import AccountSettings from "@views/dashboard/couple/account/Settings";
import AccountNotifications from "@views/dashboard/couple/account/Notifications";


function CoupleRoute() {
  return (
    <>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* <Route index element={<CoupleLayout />} /> */}
          {/* <Route path="users" element={<Users />} /> */}
          <Route path="" element={<CoupleLayout />}>
            <Route index element={<MyWedding />} />
            <Route path="check-list" element={<Checklist />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/search" element={<VendorsFilters />} />
            <Route path="guest-list" element={<GuestList />} />
            <Route path="seating-chart" element={<SeatingChart />} />
            <Route path="budget-planner" element={<BudgetPlanner />}>
              <Route index element={<BudgetPlannerStats />} />
              <Route path=":id" element={<BudgetPlannerCategory />} />
            </Route>
            <Route path="dresses" element={<Dresses />} />
            <Route path="wedding-website" element={<WeddingWebsite />} />
            <Route path="web-shoots" element={<WebShoots />} />
            <Route path="account">
              <Route index element={<AccountInformation />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="notifications" element={<AccountNotifications />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default CoupleRoute;
