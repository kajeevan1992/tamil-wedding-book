import RequestPricingModal from "@components/vendor/RequestPricingModal";
import VendorReviews from "@components/vendor/reviews/VendorReviews";
import { loadGallery, loadReviews, loadVendor } from "@services/UserService";
import { toggleLoading } from "@store/AppSlice";
import { calculateAverageRating } from "@utilities/CommonUtil";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function VendorDetail() {
    const app = useSelector((state) => state.app);
    const dispatch = useDispatch();
    let { vendorId } = useParams();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [gallery, setGallery] = useState([]);
    const [galleryLoaded, setGalleryLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("about");
    const [reviews, setReviews] = useState([]);
    const tabs = [
        {
            label: "About",
            value: "about",
            icon: "bi bi-info-circle",
        },
        {
            label: "FAQs",
            value: "faqs",
            icon: "bi bi-question-circle",
        },
        {
            label: "Reviews",
            value: "reviews",
            icon: "bi bi-star",
        },
        {
            label: "Gallery",
            value: "gallery",
            icon: "bi bi-images",
        },
        {
            label: "Videos",
            value: "videos",
            icon: "bi bi-camera-reels",
        },
        {
            label: "Location",
            value: "location",
            icon: "bi bi-geo-alt",
        },
    ];

    const [averageRatings, setAverageRatings] = useState({
        qualityOfService: 0,
        professionalism: 0,
        flexibility: 0,
        valueForMoney: 0,
        responseTime: 0,
        averageRating: 0,
    });

    useEffect(() => {
        if (vendorId) {
            console.log(vendorId);
            tryLoadVendor();

            // Check if writeReview query parameter exists and switch to reviews tab
            if (searchParams.get("writeReview") === "true") {
                setActiveTab("reviews");
            }
        } else {
            navigate("/404");
        }
    }, [searchParams]);

    const changeTab = (tab) => {
        // if tab == gallery we need to load the gallery images
        if (tab === "gallery") {
            if (!galleryLoaded) {
                tryLoadGallery();
            }
        }
        setActiveTab(tab);
    };

    const tryLoadVendor = async () => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadVendor(vendorId);
            setUser(data || {});
            tryLoadReviews(data.vendor.id);
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Failed to fetch vendors. Please try again.");
            console.error("Error fetching vendors:", error);
        }
    };

    const tryLoadReviews = async (vId) => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadReviews(vId);
            setReviews(data || []);
            setAverageRatings(calculateAverageRating(data));
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Failed to fetch reviews. Please try again.");
            console.error("Error fetching reviews:", error);
        }
    };

    const tryLoadGallery = async () => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadGallery(user.vendor.id);
            setGallery(data || []);
            setGalleryLoaded(true);
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Failed to fetch gallery. Please try again.");
            console.error("Error fetching gallery:", error);
        }
    };

    const requestPricingModal = useRef(null);
    const showRequestPricingModal = () => {
        requestPricingModal.current.showModal();
    };
    const hideRequestPricingModal = () => {
        requestPricingModal.current.hideModal();
    };

    return (
        <>
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-md-3 col-6">
                                    <div className="card">
                                        <div className="card-body p-2">
                                            {user.photo ? (
                                                <img
                                                    src={`${
                                                        app.serverPath +
                                                        user.photo
                                                    }`}
                                                    alt={user.fullName}
                                                    className="card-image"
                                                />
                                            ) : (
                                                <img
                                                    src="/assets/images/placeholder.png"
                                                    alt={user.fullName}
                                                    className="card-image"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9 col-6">
                                    <h3 className="fs-28px fw-500 mt-3">
                                        {user.fullName}
                                    </h3>
                                    <span className="bg-secondary text-white px-1">
                                        {user?.vendor?.category?.name}
                                    </span>
                                    <br />
                                    <br />
                                    <span>
                                        <i className="bi bi-geo-alt-fill text-info"></i>
                                        &nbsp;
                                        <span className="text-muted">
                                            {user?.address}
                                        </span>
                                    </span>{" "}
                                    &nbsp;
                                    <span>
                                        <i className="bi bi-star-fill text-warning"></i>{" "}
                                        {averageRatings.averageRating.toFixed(
                                            1
                                        )}
                                        &nbsp;
                                        <span className="text-muted">
                                            {reviews.length} Reviews
                                        </span>
                                    </span>
                                    <hr />
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={showRequestPricingModal}
                                    >
                                        Request Pricing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="my-3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {user.id && (
                                <ul className="list-unstyled d-flex align-items-center gap-10 mt-3">
                                    {tabs.map((tab, tabIndex) => (
                                        <li key={`${tabIndex}-${tab.value}`}>
                                            <button
                                                key={`${tabIndex}-${tab.value}`}
                                                className={`btn btn-outline-primary own-style-button-5 btn-sm ${
                                                    activeTab === tab.value
                                                        ? "active-theme-button"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    changeTab(tab.value)
                                                }
                                            >
                                                <i className={tab.icon}></i>
                                                &nbsp;<span>{tab.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <hr />
                        </div>
                        <div className="col-lg-12 mt-3">
                            {activeTab === "about" && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: user?.vendor?.aboutStoreFront,
                                    }}
                                ></div>
                            )}
                            {activeTab === "faqs" &&
                                user?.vendor?.faqs?.faqsList?.map(
                                    (faq, faqIndex) => (
                                        <React.Fragment key={faqIndex}>
                                            {faq?.status === "done" && (
                                                <div>
                                                    <h5>{faq.question}</h5>
                                                    {faq.type ===
                                                        "checkbox" && (
                                                        <p>
                                                            {faq.options
                                                                .filter(
                                                                    (option) =>
                                                                        option.checked
                                                                )
                                                                .map(
                                                                    (
                                                                        option,
                                                                        optionIndex
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                        >
                                                                            {optionIndex !==
                                                                                0 &&
                                                                                ", "}
                                                                            {
                                                                                option.name
                                                                            }{" "}
                                                                            {option.name ===
                                                                                "Other" && (
                                                                                <span>
                                                                                    {"(" +
                                                                                        option.value +
                                                                                        ")"}
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    )
                                                                )}
                                                        </p>
                                                    )}
                                                    {faq.type === "radio" && (
                                                        <p>
                                                            {faq.options
                                                                .filter(
                                                                    (option) =>
                                                                        option.checked
                                                                )
                                                                .map(
                                                                    (
                                                                        option,
                                                                        optionIndex
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                        >
                                                                            {optionIndex !==
                                                                                0 &&
                                                                                ", "}
                                                                            {
                                                                                option.name
                                                                            }{" "}
                                                                            {option.name ===
                                                                                "Yes" && (
                                                                                <span className="text-success">
                                                                                    <i className="bi bi-check-lg"></i>
                                                                                </span>
                                                                            )}{" "}
                                                                            {option.name ===
                                                                                "No" && (
                                                                                <span className="text-danger">
                                                                                    <i className="bi bi-x-lg"></i>
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    )
                                                                )}
                                                        </p>
                                                    )}
                                                    {faq.type === "range" && (
                                                        <p>{faq.value}</p>
                                                    )}
                                                    {/* <div className="progress mt-1">
                                    <div className="progress-bar" role="progressbar" style={{ width: `${Math.round((state.counts.completed / state.counts.total) * 100)}%`, backgroundColor: '#eb2327' }}
                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div> */}

                                                    {faq.type ===
                                                        "textarea" && (
                                                        <p>{faq.value}</p>
                                                    )}
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )
                                )}
                            {activeTab === "reviews" && (
                                <VendorReviews
                                    app={app}
                                    vendor={user}
                                    reviews={reviews}
                                    averageRatings={averageRatings}
                                    onReviewPosted={() =>
                                        tryLoadReviews(user.vendor.id)
                                    }
                                />
                            )}
                            {activeTab === "gallery" && (
                                <ResponsiveMasonry
                                    columnsCountBreakPoints={{
                                        350: 1,
                                        750: 2,
                                        900: 3,
                                    }}
                                    gutterBreakpoints={{
                                        350: "12px",
                                        750: "16px",
                                        900: "24px",
                                    }}
                                >
                                    <Masonry>
                                        {gallery.map((image, imageIndex) => (
                                            <div key={`gallery-${imageIndex}`}>
                                                <div className="card">
                                                    <div className="card-body p-1">
                                                        <img
                                                            src={`${
                                                                app.serverPath +
                                                                image.path
                                                            }`}
                                                            alt={image.name}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Masonry>
                                </ResponsiveMasonry>
                            )}
                            {activeTab === "videos" && (
                                <div>
                                    <h5>Videos</h5>
                                    <p>
                                        Have to discuss with kajee either we
                                        upload to external storage or we use our
                                        own storage
                                    </p>
                                </div>
                            )}
                            {activeTab === "location" && (
                                <div>
                                    <h5>Location</h5>
                                    <p>
                                        Have to use google map after buying the
                                        package
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <RequestPricingModal
                ref={requestPricingModal}
                vendor={user}
                onHideModal={hideRequestPricingModal}
                app={app}
            />
        </>
    );
}

export default VendorDetail;
