import { Outlet } from 'react-router-dom';
import VendorLinks from '@components/vendor/VendorLinks';
import { useSelector } from 'react-redux';
// import { useEffect } from 'react';

function Dashboard() {
    return (
        <>
            <VendorLinks />

            <section>
                <div>
                    <Outlet />
                </div>
            </section>
        </>
    );
}

export default Dashboard;