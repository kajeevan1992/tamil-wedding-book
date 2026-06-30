import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
    const reviewLinks = [
        {
            to: `/${props.app.profile.role}/reviews`,
            icon: "bi bi-gear",
            label: "Review Collector",
        },
        {
            to: `/${props.app.profile.role}/reviews/reviews-list`,
            icon: "bi bi-card-list",
            label: "Reviews",
        },
        {
            to: `/${props.app.profile.role}/reviews/badges`,
            icon: "bi bi-ticket-perforated",
            label: "TWB Rated™",
        },
        {
            to: `/${props.app.profile.role}/reviews/review-widget`,
            icon: "bi bi-gear",
            label: "Review Widget",
        },
    ];
    return (
        <>
            <div className="nav flex-column budget-tab">
                {reviewLinks.map((link) => (
                    <NavLink
                        to={link.to}
                        end
                        className="nav-link nav-list-item"
                    >
                        <i className={link.icon}></i>&nbsp;
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>
        </>
    );
}
