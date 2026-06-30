import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import Header from '@components/layout/Header';
// import Footer from '@components/layout/Footer';

function NotFound() {
    const app = useSelector(state => state.app);
    return (
        <>
            {/* <Header /> */}
            {/* <main id="body-content"> */}
            <section className="wide-tb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 mx-auto col-md-8">
                            <div className="text-center">
                                <div className="notfound">
                                    <div className="notfound-404">
                                        <h1>4<span>0</span>4</h1>
                                    </div>
                                </div>
                                <h2>Opps! Looks like the page is gone.</h2>
                                <p>The Link is broken or the page has beed moved. Try these pages instead:</p>
                                <NavLink to={app.isLoggedIn ? `/${app.profile.role}` : '/'} className="btn btn-primary btn-sm mt-4">Back to {app.isLoggedIn ? 'Dashboard' : 'Home'}?</NavLink>
                                <div className="tags mt-5">
                                    <a href="javascript:">Venues</a>
                                    <a href="javascript:">Vendors</a>
                                    <a href="javascript:">About Us</a>
                                    <a href="javascript:">Contact Us</a>
                                    <a href="javascript:">Real Weddings</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* </main> */}
            {/* <Footer /> */}
        </>

    );
}

export default NotFound;