import { exportToExcel } from "@services/VendorService";
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

export default function ExportToExcel() {
    const { stats } = useOutletContext();
    const app = useSelector((state) => state.app);
    const dispatch = useDispatch();
    const [selectedFilter, setSelectedFilter] = useState("all");

    const filterOptions = [
        {
            value: "all",
            label: "All Enquiries",
            count: stats.inboxCount || 0,
            icon: "bi bi-envelope",
        },
        {
            value: "unread",
            label: "Unread Enquiries",
            count: stats.inboxUnreadCount || 0,
            icon: "bi bi-envelope-exclamation",
        },
        {
            value: "read",
            label: "Read Enquiries",
            count: stats.inboxReadCount || 0,
            icon: "bi bi-envelope-check",
        },
        {
            value: "pending",
            label: "Pending Enquiries",
            count: stats.inboxPendingCount || 0,
            icon: "bi bi-circle-fill text-warning",
        },
        {
            value: "responded",
            label: "Responded Enquiries",
            count: stats.inboxRespondedCount || 0,
            icon: "bi bi-circle-fill text-primary",
        },
        {
            value: "booked",
            label: "Booked Enquiries",
            count: stats.inboxBookedCount || 0,
            icon: "bi bi-circle-fill text-success",
        },
    ];

    const handleExport = async () => {
        if (!app.profile?.vendor?.id) {
            toast.error("Vendor information not available");
            return;
        }

        try {
            dispatch(toggleLoading(true));
            toast.loading("Preparing export...", { id: "export" });

            const filter = selectedFilter === "all" ? null : selectedFilter;
            const response = await exportToExcel(app.profile.vendor.id, filter);

            // Create a blob from the response
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // Get filename from response headers or use default
            const contentDisposition = response.headers["content-disposition"];
            let filename = "enquiries.xlsx";
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                );
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, "");
                }
            }

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Export completed successfully!", { id: "export" });
            dispatch(toggleLoading(false));
        } catch (error) {
            console.error("Export error:", error);
            dispatch(toggleLoading(false));
            toast.error("Failed to export enquiries. Please try again.", {
                id: "export",
            });
            statusMessages(error);
        }
    };

    return (
        <div className="row">
            <section className="col-md-12">
                <div className="card mt-3">
                    <div className="card-body">
                        <h1 className="prepareTextTitle mb-4">
                            Export Enquiries to Excel
                        </h1>
                        <p className="text-muted mb-4">
                            Select which enquiries you would like to export. The
                            export will include all relevant details for the
                            selected filter.
                        </p>

                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                Select Filter:
                            </label>
                            <div className="row mt-3">
                                {filterOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className="col-md-6 mb-3"
                                    >
                                        <div
                                            className={`card ${
                                                selectedFilter === option.value
                                                    ? "border-primary shadow-sm"
                                                    : ""
                                            }`}
                                            style={{
                                                cursor: "pointer",
                                                transition: "all 0.2s",
                                            }}
                                            onClick={() =>
                                                setSelectedFilter(option.value)
                                            }
                                            onMouseEnter={(e) => {
                                                if (
                                                    selectedFilter !==
                                                    option.value
                                                ) {
                                                    e.currentTarget.style.borderColor =
                                                        "#dee2e6";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (
                                                    selectedFilter !==
                                                    option.value
                                                ) {
                                                    e.currentTarget.style.borderColor =
                                                        "";
                                                    e.currentTarget.style.boxShadow =
                                                        "";
                                                }
                                            }}
                                        >
                                            <div className="card-body px-4">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="filter"
                                                            value={option.value}
                                                            checked={
                                                                selectedFilter ===
                                                                option.value
                                                            }
                                                            onChange={() =>
                                                                setSelectedFilter(
                                                                    option.value
                                                                )
                                                            }
                                                            className="form-check-input hidden"
                                                        />
                                                        <i
                                                            className={`${option.icon} fs-5`}
                                                        ></i>{" "}
                                                        &nbsp;
                                                        <span className="ms-2">
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                    <span className="badge bg-secondary">
                                                        {option.count}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="alert alert-info">
                            <i className="bi bi-info-circle"></i>&nbsp;
                            <strong>Note:</strong> Large exports may take a few
                            moments to process. Please be patient while we
                            prepare your file.
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-primary px-4"
                                onClick={handleExport}
                                disabled={
                                    filterOptions.find(
                                        (opt) => opt.value === selectedFilter
                                    )?.count === 0
                                }
                            >
                                <i className="bi bi-filetype-xlsx"></i> Export
                                to Excel
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
