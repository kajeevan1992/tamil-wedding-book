import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
    return (
        <>
            <div className="card relative-behave br-8">
                {props.app.profile.photo ? <img src={`${props.app.serverPath + props.app.profile.photo}`} className="br-8" /> : <img src="/assets/images/placeholder.png" className="br-8" />}
                <h5 className="text-mid fw-bold text-white text-center vendor-sidebar-img">{props.app.profile.fullName}</h5>
                <div className="cover-overlay br-8"></div>
            </div>
            <div className="nav flex-column budget-tab mt-3">
                <NavLink to={`/${props.app.profile.role}/storefront`} end className="nav-link nav-list-item">
                    <i className="bi bi-briefcase"></i>&nbsp;
                    <span> Business details</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/location`} end className="nav-link nav-list-item">
                    <i className="bi bi-map"></i>&nbsp;
                    <span> Location and map</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/faqs`} end className="nav-link nav-list-item">
                    <i className="bi bi-question-circle"></i>&nbsp;
                    <span> FAQs</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/deals`} end className="nav-link nav-list-item">
                    <i className="bi bi-tags"></i>&nbsp;
                    <span> Deals</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/images`} end className="nav-link nav-list-item">
                    <i className="bi bi-camera"></i>&nbsp;
                    <span> Photos</span>
                    {/* <span className="float-right">5</span> */}
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/videos`} end className="nav-link nav-list-item">
                    <i className="bi bi-camera-reels"></i>&nbsp;
                    <span> Videos</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/menus`} end className="nav-link nav-list-item">
                    <i className="bi bi-cup-hot"></i>&nbsp;
                    <span> Menus</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/events`} end className="nav-link nav-list-item">
                    <i className="bi bi-calendar4-event"></i>&nbsp;
                    <span> Events</span>
                </NavLink>

                <NavLink to={`/${props.app.profile.role}/storefront/preferred-vendor`} end className="nav-link nav-list-item">
                    <i className="bi bi-calendar4-event"></i>&nbsp;
                    <span> Preferred suppliers</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/social-links`} end className="nav-link nav-list-item">
                    <i className="bi bi-share"></i>&nbsp;
                    <span> Social networks</span>
                </NavLink>
                <NavLink to={`/${props.app.profile.role}/storefront/tamil-wedding-book-button`} end className="nav-link nav-list-item">
                    <i className="bi bi-ticket-perforated"></i>&nbsp;
                    <span> TamilWeddingBook button</span>
                </NavLink>
            </div>

        </>
    );
}