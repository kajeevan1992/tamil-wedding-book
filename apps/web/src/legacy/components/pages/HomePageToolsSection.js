'use client';

import { NavLink } from '../NextNavLink';

export default function HomePageToolsSection(props) {
    const coupleTools = [
        {
            icon: 'tamilweddingbook_checklist',
            name: 'Checklist',
            href: `/${props.app?.profile?.role && props.app?.profile?.role === 'couple' ? 'couple/' : ''}check-list`,
        },
        {
            icon: 'tamilweddingbook_guestlist',
            name: 'Guestlist',
            href: `/${props.app?.profile?.role && props.app?.profile?.role === 'couple' ? 'couple/' : ''}guest-list`,
        },
        {
            icon: 'tamilweddingbook_seating_chart',
            name: 'Seating Chart',
            href: `/${props.app?.profile?.role && props.app?.profile?.role === 'couple' ? 'couple/' : ''}seating-chart`,
        },
        {
            icon: 'tamilweddingbook_budget',
            name: 'Budget Planner',
            href: `/${props.app?.profile?.role && props.app?.profile?.role === 'couple' ? 'couple/' : ''}budget-planner`,
        },
        {
            icon: 'tamilweddingbook_vendor_manager',
            name: 'Suppliers',
            href: `/${props.app?.profile?.role && props.app?.profile?.role === 'couple' ? 'couple/' : ''}vendors`,
        },
        {
            icon: 'tamilweddingbook_websote_demo',
            name: 'Website',
            href: `/${props.app?.profile?.role && props.app?.profile?.role === 'couple' ? 'couple/' : ''}wedding-website`,
        }
    ];

    return (
        <section className="wide-tb-50">
            <div className="container">
                <div className="section-title text-center pt-5 mb-5">
                    <h2>Tools That Make Wedding Planning a Piece of Cake</h2>
                    <p className="own-family">
                        Find suppliers and advice you need to plan your wedding, on the go
                        at your fingertips
                    </p>
                </div>
                <div className="row">
                    {coupleTools.map((item, indexTools) => <div key={`tool-${indexTools}`} className="col-lg-4 col-xl-2 text-center col-6">
                        <NavLink to={item.href} className="fw-5">
                            <div className="why-choose-icons shadow  mb-5 bg-white rounded">
                                <div className="icon-big-cirlce mx-auto">
                                    <i className={`${item.icon} f-size`}></i>
                                </div>
                                <h5 className="mt-2"> {item.name} </h5>
                            </div>
                        </NavLink>
                    </div>)}
                </div>
                <div className="text-center mt-3">
                    <NavLink to={props.app?.profile?.role ? `/${props.app.profile.role}` : '/login'} className="btn btn-default btn-rounded btn-lg w-40prcnt btn-primary"> Start Planning </NavLink>
                </div>
                {props.app?.isLoggedIn ? '' : <p className="text-center mt-4">
                    Already have an account? <NavLink to="/login" className="text-theme"> Log in </NavLink>
                </p>}
            </div>
        </section>
    );
} 