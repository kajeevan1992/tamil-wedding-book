import Sidebar from "@components/vendor/enquiries/Sidebar";
import { loadEnquiries } from "@services/VendorService";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function EnquiriesLayout() {
    const app = useSelector((state) => state.app);
    const [state, setState] = useState({
        stats: {
            inboxCount: 0,
            inboxUnreadCount: 0,
            inboxReadCount: 0,
            inboxPendingCount: 0,
            inboxRespondedCount: 0,
            inboxBookedCount: 0,
            // inboxDiscardedCount: 0,
        },
    });

    const updateStats = (stats) => {
        setState((currentState) => ({
            ...currentState,
            stats: {
                ...currentState.stats,
                ...stats,
            },
        }));
    };

    // Load stats when component mounts or vendor changes
    useEffect(() => {
        const loadStats = async () => {
            if (app.profile?.vendor?.id) {
                try {
                    // Load with minimal data just to get stats
                    const { data } = await loadEnquiries(
                        app.profile.vendor.id,
                        1, // itemsPerPage - minimal to reduce load
                        0, // page 0
                        null // no filter - get all stats
                    );
                    updateStats({
                        inboxCount: data.totalCount || 0,
                        inboxUnreadCount: data.unreadCount || 0,
                        inboxReadCount: data.readCount || 0,
                        inboxPendingCount: data.pendingCount || 0,
                        inboxRespondedCount: data.respondedCount || 0,
                        inboxBookedCount: data.bookedCount || 0,
                    });
                } catch (error) {
                    console.error("Failed to load enquiry stats:", error);
                    // Don't show error toast here as it's a background operation
                }
            }
        };

        loadStats();
    }, [app.profile?.vendor?.id]);
    const [inboxCount, setInboxCount] = useState(0);
    const [inboxUnreadCount, setInboxUnreadCount] = useState(0);

    // Function to update inbox count from child components
    const updateInboxCount = (count) => {
        setInboxCount(count);
    };

    const updateInboxUnreadCount = (count) => {
        setInboxUnreadCount(count);
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar
                            app={app}
                            inboxCount={inboxCount}
                            inboxUnreadCount={inboxUnreadCount}
                            stats={state.stats}
                        />
                    </div>
                    <div className="col-md-9">
                        <Outlet
                            context={{
                                app,
                                stats: state.stats,
                                updateStats,
                                updateInboxCount,
                                updateInboxUnreadCount,
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
