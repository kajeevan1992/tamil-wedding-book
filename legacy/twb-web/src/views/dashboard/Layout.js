import { Outlet } from 'react-router-dom';
import Header from '@components/layout/Header';
import Sidebar from '@components/layout/Sidebar';
import Footer from '@components/layout/Footer';
import { useSelector } from 'react-redux';

function Layout() {
    const app = useSelector(state => state.app);
    return (
        <>
            <Header />
            <Sidebar />
            <main id="body-content">
                <Outlet context={app} />
            </main>
            <Footer />
        </>
    );
}

export default Layout;