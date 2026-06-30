import UserAvatar from "@components/shared/UserAvatar";
import EnquiryDetail from "@components/vendor/enquiries/Detail";
import {
    deleteEnquiry,
    loadEnquiries,
    loadEnquiry,
} from "@services/VendorService";
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {
    NavLink,
    useLocation,
    useOutletContext,
    useParams,
} from "react-router-dom";

export default function Inbox() {
    const { updateStats } = useOutletContext();
    const { stats } = useOutletContext();
    const app = useSelector((state) => state.app);
    const location = useLocation();
    const [state, setState] = useState({
        enquiries: {
            data: [],
            totalItems: 0,
            itemsPerPage: 5,
            unreadCount: 0,
        },
        enquiry: null,
        selectedEnquiries: [],
        errors: {},
    });

    const dispatch = useDispatch();
    const { enquiryId } = useParams();

    // Get filter from pathname (only if not viewing a specific enquiry)
    const getFilterFromPath = () => {
        if (enquiryId) return null; // Don't filter when viewing a specific enquiry
        const path = location.pathname;
        // Match exact filter paths or paths with filter followed by enquiry ID
        const filterMatch = path.match(
            /\/enquiries\/(unread|read|pending|responded|booked)(\/|$)/
        );
        return filterMatch ? filterMatch[1] : null;
    };

    useEffect(() => {
        if (app.profile?.vendor?.id && !enquiryId) {
            tryLoadEnquiries(app.profile?.vendor?.id);
        }
    }, [app.profile?.vendor, location.pathname]);

    useEffect(() => {
        if (app.profile?.vendor?.id && enquiryId) {
            tryLoadEnquiry(app.profile?.vendor?.id, enquiryId);
        }
    }, [app.profile?.vendor, enquiryId]);

    // Reset selectedEnquiries when switching between tabs
    useEffect(() => {
        if (!enquiryId) {
            // Only reset when not viewing a specific enquiry
            setState((currentState) => ({
                ...currentState,
                selectedEnquiries: [],
            }));
        }
    }, [location.pathname, enquiryId]);

    const tryLoadEnquiry = async (vendorId, enquiryId) => {
        try {
            window.scrollTo(0, 0);
            dispatch(toggleLoading(true));

            // Check if enquiry was unread before loading (to update stats)
            const enquiryInList = state.enquiries.data.find(
                (e) => e.id === parseInt(enquiryId)
            );
            const wasUnread = enquiryInList && !enquiryInList.readByVendor;

            const { data } = await loadEnquiry(vendorId, enquiryId);
            setState((currentState) => ({
                ...currentState,
                enquiry: data,
                // Update the enquiry in the list to mark it as read
                enquiries: {
                    ...currentState.enquiries,
                    data: currentState.enquiries.data.map((e) =>
                        e.id === parseInt(enquiryId)
                            ? { ...e, readByVendor: true }
                            : e
                    ),
                },
            }));

            // Reload stats from backend (silent mode - no UI changes)
            // This ensures stats are always accurate, especially when filtered
            if (wasUnread) {
                // Reload enquiries in background to refresh stats only
                tryLoadEnquiries(vendorId, null, true).catch(() => {
                    // Silently fail if reload fails, stats will update on next load
                });
            }
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    };

    const tryLoadEnquiries = async (vendorId, page = null, silent = false) => {
        try {
            if (!silent) {
                window.scrollTo(0, 0);
                dispatch(toggleLoading(true));
            }
            const filter = getFilterFromPath();
            const { data } = await loadEnquiries(
                vendorId,
                state.enquiries.itemsPerPage,
                page,
                filter
            );
            if (!silent) {
                setState((currentState) => ({
                    ...currentState,
                    enquiries: data.enquiries,
                }));
            } else {
                // Silent mode: only update stats, don't update the list
                // This is used when we just need fresh stats after an action
            }
            console.log(data);
            // Use stats from backend (always fresh from database, not filtered)
            updateStats({
                inboxCount: data.totalCount || 0,
                inboxUnreadCount: data.unreadCount || 0,
                inboxReadCount: data.readCount || 0,
                inboxPendingCount: data.pendingCount || 0,
                inboxRespondedCount: data.respondedCount || 0,
                inboxBookedCount: data.bookedCount || 0,
            });
            if (!silent) {
                dispatch(toggleLoading(false));
            }
        } catch (error) {
            console.log(error);
            dispatch(toggleLoading(false));
            // Reset count to 0 on error
            setState((currentState) => ({
                ...currentState,
                enquiries: {
                    ...currentState.enquiries,
                    totalItems: 0,
                    data: [],
                },
            }));
            statusMessages(error);
        }
    };

    const enquiryReplyPosted = (enquiryData) => {
        const enquiryId = enquiryData.id || state.enquiry?.id;

        setState((currentState) => ({
            ...currentState,
            enquiry: {
                ...currentState.enquiry,
                status: "responded",
                replyText: enquiryData.replyText,
            },
            // Update the enquiry in the list as well
            enquiries: {
                ...currentState.enquiries,
                data: currentState.enquiries.data.map((e) =>
                    e.id === enquiryId
                        ? {
                              ...e,
                              status: "responded",
                              replyText: enquiryData.replyText,
                          }
                        : e
                ),
            },
        }));

        // Reload stats from backend (silent mode - no UI changes)
        // This ensures stats are always accurate, especially when filtered
        tryLoadEnquiries(app.profile?.vendor?.id, null, true).catch(() => {
            // Silently fail if reload fails, stats will update on next load
        });
    };

    const handleSelectEnquiry = (enquiryId, checked) => {
        setState((currentState) => ({
            ...currentState,
            selectedEnquiries: checked
                ? [...currentState.selectedEnquiries, enquiryId]
                : currentState.selectedEnquiries.filter(
                      (id) => id !== enquiryId
                  ),
        }));
    };

    const handleSelectAll = (checked) => {
        setState((currentState) => ({
            ...currentState,
            selectedEnquiries: checked
                ? currentState.enquiries.data.map((e) => e.id)
                : [],
        }));
    };

    const handleBulkDelete = async () => {
        if (state.selectedEnquiries.length === 0) {
            toast.error("Please select at least one enquiry to delete");
            return;
        }

        if (
            !window.confirm(
                `Are you sure you want to delete ${state.selectedEnquiries.length} enquiry(ies)? This action cannot be undone.`
            )
        ) {
            return;
        }

        try {
            dispatch(toggleLoading(true));

            // Delete all selected enquiries
            const deletePromises = state.selectedEnquiries.map((enquiryId) =>
                deleteEnquiry(app.profile?.vendor?.id, enquiryId)
            );

            await Promise.all(deletePromises);

            // Remove from list
            setState((currentState) => ({
                ...currentState,
                enquiries: {
                    ...currentState.enquiries,
                    data: currentState.enquiries.data.filter(
                        (e) => !currentState.selectedEnquiries.includes(e.id)
                    ),
                    totalItems:
                        currentState.enquiries.totalItems -
                        currentState.selectedEnquiries.length,
                },
                selectedEnquiries: [],
            }));

            // Reload stats from backend
            tryLoadEnquiries(app.profile?.vendor?.id, null, true).catch(() => {
                // Silently fail if reload fails
            });

            dispatch(toggleLoading(false));
            toast.success(
                `${state.selectedEnquiries.length} enquiry(ies) deleted successfully`
            );
        } catch (error) {
            console.log(error);
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    };
    return (
        <>
            {state.enquiry && enquiryId ? (
                <EnquiryDetail
                    enquiry={state.enquiry}
                    vendorId={app.profile?.vendor?.id}
                    role={app.profile?.role}
                    stats={stats}
                    onEnquiryReplyPosted={enquiryReplyPosted}
                    onEnquiryDeleted={() => {
                        // Reload enquiries and stats after deletion
                        if (app.profile?.vendor?.id) {
                            tryLoadEnquiries(app.profile.vendor.id, null);
                        }
                    }}
                />
            ) : (
                <div className="row">
                    <section className="col-md-12">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h1 className="prepareTextTitle mb-0">
                                {(() => {
                                    const filter = getFilterFromPath();
                                    const filterLabels = {
                                        unread: "Unread Enquiries",
                                        read: "Read Enquiries",
                                        pending: "Pending Enquiries",
                                        responded: "Responded Enquiries",
                                        booked: "Booked Enquiries",
                                    };
                                    return filter
                                        ? `${filterLabels[filter]} (${state.enquiries.totalItems})`
                                        : `Enquiries (${state.enquiries.totalItems})`;
                                })()}
                            </h1>
                            {state.selectedEnquiries.length > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={handleBulkDelete}
                                >
                                    <i className="bi bi-trash"></i> Delete
                                    Selected ({state.selectedEnquiries.length})
                                </button>
                            )}
                        </div>
                        {/* ? (
                    <section className="alert alert-info mt-5">
                        <div>
                            <h4>Your business information is being verified.</h4>
                            <small>
                                Click the link in the email we just sent you to confirm your
                                Tamil Wedding Book account.
                                <br />
                                Our Content Team is in the process of{" "}
                                <b>verifying your business information</b> and will publish
                                your Shopfront once approved.
                            </small>
                            <br />
                            <div className="mt-4">
                                <small>
                                    Telephone: 0700 205 1531 - Email:
                                    feedback@tamilweddingbook.email.com
                                </small>
                            </div>
                        </div>
                    </section>
                ) : ( */}
                        {!app.profile.stepsDone && (
                            <section className="alert alert-danger mt-5">
                                <strong>
                                    Your storefront isn't active yet
                                </strong>
                                <p className="mt-2 mb-0">
                                    Complete the steps to activate your
                                    storefront so couples can find you on Tamil
                                    Wedding Book.{" "}
                                    <NavLink to="create-storefront">
                                        Go back to the steps
                                    </NavLink>
                                </p>
                            </section>
                        )}
                    </section>

                    {state.enquiries.totalItems === 0 && (
                        <section className="col-md-12">
                            <div className="card mt-5 p-5 mb-5">
                                <div className="card-shadow-body">
                                    <div className="text-center">
                                        <i
                                            className="tamilweddingbook_heart_envelope"
                                            style={{ fontSize: "70px" }}
                                        ></i>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p>
                                            No messages have been found in this
                                            folder
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {state.enquiries.totalItems > 0 && (
                        <>
                            <div className="col-md-12 mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="theme-color-bg w-h-17px"
                                        checked={
                                            state.enquiries.data.length > 0 &&
                                            state.selectedEnquiries.length ===
                                                state.enquiries.data.length
                                        }
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <label className="mb-0">
                                        Select All (
                                        {state.selectedEnquiries.length}/
                                        {state.enquiries.data.length} selected)
                                    </label>
                                </div>
                            </div>
                            {state.enquiries.data.map((enquiry) => (
                                <div className="col-md-12" key={enquiry.id}>
                                    <div
                                        className="card mt-3"
                                        style={
                                            !enquiry.readByVendor
                                                ? {
                                                      borderLeft:
                                                          "4px solid #007bff",
                                                  }
                                                : {}
                                        }
                                    >
                                        <div className="card-body c-p p-095-09 d-flex align-items-center gap-20px">
                                            <NavLink
                                                to={`/${app.profile.role}/enquiries/${enquiry.id}`}
                                                style={{
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "20px",
                                                    textDecoration: "none",
                                                    color: "inherit",
                                                }}
                                            >
                                                <div className="d-flex align-items-center gap-10px">
                                                    <input
                                                        type="checkbox"
                                                        className="theme-color-bg w-h-17px"
                                                        checked={state.selectedEnquiries.includes(
                                                            enquiry.id
                                                        )}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectEnquiry(
                                                                enquiry.id,
                                                                e.target.checked
                                                            );
                                                        }}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    />
                                                    <div
                                                        style={{
                                                            position:
                                                                "relative",
                                                        }}
                                                    >
                                                        {!enquiry.readByVendor && (
                                                            <div
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    top: "-5px",
                                                                    right: "-5px",
                                                                    width: "12px",
                                                                    height: "12px",
                                                                    backgroundColor:
                                                                        "#007bff",
                                                                    borderRadius:
                                                                        "50%",
                                                                    border: "2px solid white",
                                                                    zIndex: 1,
                                                                }}
                                                            ></div>
                                                        )}
                                                        <UserAvatar
                                                            name={
                                                                enquiry.user
                                                                    ? enquiry
                                                                          .user
                                                                          .fullName
                                                                    : enquiry.fullName
                                                            }
                                                            round={true}
                                                            size={50}
                                                            photo={
                                                                enquiry.user
                                                                    ? enquiry
                                                                          .user
                                                                          .photo
                                                                        ? app.serverPath +
                                                                          enquiry
                                                                              .user
                                                                              .photo
                                                                        : null
                                                                    : null
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        minWidth: 0,
                                                        maxWidth: "100%",
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center gap-2 mb-1">
                                                        <h4 className="mb-0">
                                                            {enquiry.user
                                                                ? enquiry.user
                                                                      .fullName
                                                                : enquiry.fullName}
                                                        </h4>
                                                        {enquiry.status ===
                                                            "responded" && (
                                                            <span className="badge badge-primary badge-sm">
                                                                Responded
                                                            </span>
                                                        )}
                                                        {enquiry.status ===
                                                            "booked" && (
                                                            <span className="badge badge-success badge-sm">
                                                                Booked
                                                            </span>
                                                        )}
                                                        {enquiry.status !==
                                                            "responded" &&
                                                            enquiry.status !==
                                                                "booked" && (
                                                                <span className="badge badge-warning badge-sm">
                                                                    Pending
                                                                </span>
                                                            )}
                                                    </div>
                                                    <small className="text-muted">
                                                        {moment(
                                                            enquiry.createdAt
                                                        ).fromNow()}
                                                    </small>
                                                    <p
                                                        className="text-truncate mt-2"
                                                        style={{
                                                            width: "70%",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            whiteSpace:
                                                                "nowrap",
                                                            margin: 0,
                                                            display: "block",
                                                        }}
                                                    >
                                                        {enquiry.message}
                                                    </p>
                                                </div>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {state.enquiries.totalItems >
                        state.enquiries.itemsPerPage && (
                        <section className="col-md-12 mt-3">
                            <ReactPaginate
                                nextLabel=">"
                                onPageChange={(e) => {
                                    tryLoadEnquiries(
                                        app.profile?.vendor?.id,
                                        e.selected
                                    );
                                }}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={1}
                                pageCount={Math.ceil(
                                    state.enquiries.totalItems /
                                        state.enquiries.itemsPerPage
                                )}
                                previousLabel="<"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination sm justify-content-center"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </section>
                    )}
                </div>
            )}
        </>
    );
}
