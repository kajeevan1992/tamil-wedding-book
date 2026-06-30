import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@views/dashboard/Layout';
import Dashboard from '@views/dashboard/admin/Dashboard';
import Users from '@views/dashboard/admin/Users';
// import Contacts from '@views/dashboard/admin/Contacts';
// import ContactDetailLayout from '@views/dashboard/admin/ContactDetailLayout';
// import ContactDetailsLogBook from '@views/dashboard/admin/ContactDetailsLogBook';
// import ContactDetailsJobs from '@views/dashboard/admin/ContactDetailsJobs';
// import ContactDetailsEvents from '@views/dashboard/admin/ContactDetailsEvents';

function AdminRoute() {
    return (
        <>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    {/* <Route path="contact-detail/:id" element={<ContactDetailLayout />}>
                        <Route index element={<ContactDetailsLogBook />} />
                        <Route path="jobs" element={<ContactDetailsJobs />} />
                        <Route path="events" element={<ContactDetailsEvents />} />
                    </Route> */}
                </Route>
            </Routes>
        </>
    );
}

export default AdminRoute;