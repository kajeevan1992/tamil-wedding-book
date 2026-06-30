import { NavLink } from "react-router-dom";

export default function Sidebar(props) {
    const folderLinks = [
        {
            to: `/${props.app.profile.role}/enquiries`,
            icon: "bi bi-envelope",
            label: "Inbox",
            count: props.stats.inboxCount || 0,
        },
        {
            to: `/${props.app.profile.role}/enquiries/unread`,
            icon: "bi bi-envelope-exclamation",
            label: "Unread",
            count: props.stats.inboxUnreadCount || 0,
        },
        {
            to: `/${props.app.profile.role}/enquiries/read`,
            icon: "bi bi-envelope-check",
            label: "Read",
            count: props.stats.inboxReadCount || 0,
        },
        // {
        //     to: `/${props.app.profile.role}/enquiries/archived`,
        //     icon: "bi bi-envelope-heart",
        //     label: "Archived",
        //     count: props.stats.inboxArchivedCount || 0,
        // },
        {
            type: "divider",
        },
        {
            to: `/${props.app.profile.role}/enquiries/pending`,
            icon: "bi bi-circle-fill text-warning fs-12px",
            label: "Pending",
            count: props.stats.inboxPendingCount || 0,
        },
        {
            to: `/${props.app.profile.role}/enquiries/responded`,
            icon: "bi bi-circle-fill text-primary fs-12px",
            label: "Responded",
            count: props.stats.inboxRespondedCount || 0,
        },
        // {
        //     to: `/${props.app.profile.role}/enquiries/booked`,
        //     icon: "bi bi-circle-fill text-success fs-12px",
        //     label: "Booked",
        //     count: props.stats.inboxBookedCount || 0,
        // },
        // {
        //     to: `/${props.app.profile.role}/enquiries/discarded`,
        //     icon: "bi bi-envelope-x",
        //     label: "Discarded",
        //     count: props.stats.inboxDiscardedCount || 0,
        // },
    ];
    return (
        <>
            <div>
                <strong>FOLDERS</strong>
            </div>
            <div className="nav flex-column budget-tab mt-3">
                {folderLinks.map((link) =>
                    link.type === "divider" ? (
                        <div className="dropdown-divider"></div>
                    ) : (
                        <NavLink
                            to={link.to}
                            end
                            className="nav-link nav-list-item"
                        >
                            <i className={link.icon}></i>&nbsp;
                            <span>{link.label}</span>
                            <span className="float-right">{link.count}</span>
                        </NavLink>
                    )
                )}
                <div className="dropdown-divider"></div>
                {/*<strong className="mt-3 mb-2">TOOLS</strong>
                <NavLink
                    to={`/${props.app.profile.role}/enquiries/settings`}
                    className="nav-link nav-list-item"
                >
                    <i className="bi bi-gear"></i>&nbsp;
                    <span> Settings</span>
                </NavLink>
                <NavLink
                    to={`/${props.app.profile.role}/enquiries/templates`}
                    className="nav-link nav-list-item"
                >
                    <i className="bi bi-file-earmark-text"></i>&nbsp;
                    <span> Templates</span>
                </NavLink> */}
                <div className="mt-3">
                    <strong>TOOLS</strong>
                </div>
                <NavLink
                    to={`/${props.app.profile.role}/enquiries/export-to-excel`}
                    className="nav-link nav-list-item"
                >
                    <i className="bi bi-filetype-csv"></i>&nbsp;
                    <small className="premium-color"> PREMIUM</small>
                    <br />
                    <span> Export to Excel</span>
                </NavLink>
            </div>
        </>
    );
}
