import ReviewsDetail from "@components/vendor/reviews/ReviewsDetail";
import ReviewsStats from "@components/vendor/reviews/ReviewsStats";
import { loadReviews } from "@services/VendorService";
import { toggleLoading } from "@store/AppSlice";
import { calculateAverageRating } from "@utilities/CommonUtil";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function Reviews() {
    const app = useSelector((state) => state.app);
    const dispatch = useDispatch();

    const [state, setState] = useState({
        reviews: [],
        averageRatings: {
            qualityOfService: 0,
            professionalism: 0,
            flexibility: 0,
            valueForMoney: 0,
            responseTime: 0,
            averageRating: 0,
        },

        errors: {},
    });

    useEffect(() => {
        if (app.profile?.vendor?.id) {
            tryLoadReviews();
        }
    }, [app.profile?.vendor]);

    const tryLoadReviews = async () => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadReviews(app.profile.vendor.id);
            setState((currentState) => ({
                ...currentState,
                reviews: data || [],
            }));
            setState((currentState) => ({
                ...currentState,
                averageRatings: calculateAverageRating(data),
            }));
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Failed to fetch reviews. Please try again.");
            console.error("Error fetching reviews:", error);
        }
    };

    return (
        <div className="row">
            <section className="col-md-12">
                <h1 className="prepareTextTitle">Reviews</h1>
                <div className="card mt-2">
                    <div className="card-body d-flex grey-bg d-flex justify-content-between align-items-center">
                        <span className="stars">
                            <i
                                className="fa fa-star"
                                aria-hidden="true"
                                style={{ fontSize: "50px" }}
                            ></i>
                        </span>
                        <div className="ml-3">
                            <h4>Get reviews from your couples</h4>
                            <div>
                                <small>
                                    Reviews are critical when it comes time to
                                    choose a supplier. Encourage your past
                                    couples to leave a review about their
                                    experience with your business.
                                </small>
                            </div>
                        </div>
                        <div className="ml-3">
                            <NavLink
                                to={`/${app.profile.role}/reviews`}
                                end
                                className="btn btn-sm btn-primary"
                                style={{ width: "150px" }}
                            >
                                Request Review
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            <section className="col-md-12 mt-4">
                <div className="row">
                    <ReviewsStats
                        app={app}
                        size="small"
                        averageRatings={state.averageRatings}
                        reviews={state.reviews}
                    />

                    <div className="col-md-12 mt-4">
                        <ReviewsDetail
                            app={app}
                            vendor={app.profile.vendor}
                            reviews={state.reviews}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
