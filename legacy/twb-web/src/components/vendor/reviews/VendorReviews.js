import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReviewsDetail from "./ReviewsDetail";
import ReviewsStats from "./ReviewsStats";
import WriteReviewModal from "./WriteReviewModal";

export default function VendorReviews(props) {
    const reviewModal = useRef(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const showReviewModal = (action = "add") => {
        if (props.app.isLoggedIn) {
            reviewModal.current.showModal(action);
        } else {
            navigate("/login");
        }
    };
    const hideReviewModal = () => {
        reviewModal.current.hideModal();
    };

    // Check for writeReview query parameter and open modal
    useEffect(() => {
        // Only run if the query parameter exists and component is ready
        if (
            searchParams.get("writeReview") === "true" &&
            props.vendor?.id &&
            reviewModal.current
        ) {
            // Remove the query parameter from URL first
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("writeReview");
            setSearchParams(newSearchParams, { replace: true });

            // Open the review modal
            if (props.app.isLoggedIn) {
                // Small delay to ensure everything is rendered
                setTimeout(() => {
                    reviewModal.current?.showModal();
                }, 300);
            } else {
                // Navigate to login but preserve the vendor detail URL with query param
                const currentPath = window.location.pathname;
                navigate("/login", {
                    state: {
                        from: currentPath + "?writeReview=true",
                        returnTo: currentPath,
                    },
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.vendor?.id, props.app.isLoggedIn]);

    return (
        <>
            <div className="row">
                <ReviewsStats
                    app={props.app}
                    averageRatings={props.averageRatings}
                    reviews={props.reviews}
                />

                <div className="col-md-12">
                    <hr />
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-8">
                            <h5>People who viewed this vendor</h5>
                        </div>
                        <div className="col-md-4 text-right">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => showReviewModal()}
                            >
                                {props.app.isLoggedIn
                                    ? "Write a review"
                                    : "Login to write a review"}
                            </button>
                        </div>
                    </div>
                    <ReviewsDetail
                        app={props.app}
                        vendor={props.vendor}
                        reviews={props.reviews}
                    />
                </div>
            </div>

            <WriteReviewModal
                ref={reviewModal}
                app={props.app}
                vendor={props.vendor}
                onHideModal={hideReviewModal}
                onReviewPosted={props.onReviewPosted}
            />
        </>
    );
}
