import Header from '@components/layout/Header';
import { Outlet } from 'react-router-dom';
import Footer from '@components/layout/Footer';
import { useSelector } from 'react-redux';

function Layout() {
    const app = useSelector(state => state.app);
    return (
        <>
            <Header />
            <main id="body-content">
                <Outlet context={app} />
            </main>
            <Footer />
        </>

        //? to navigate user after login or something https://reactrouter.com/docs/en/v6/hooks/use-navigate
        /**
         * const navigate = useNavigate();
         * navigate('/dashboard');
         * extra if you want to navigate to previous navigate(-1) or -2 back to two pages and so on work similar 
         * to back button of the browser
         */
    );
}

export default Layout;