import moment from 'moment';
import { useState, useEffect } from 'react';

export default function ReviewsDetail(props) {
    const calculateAverageRating = (review) => {
        const totalRating = review.qualityOfService + review.professionalism + review.flexibility + review.valueForMoney + review.responseTime;
        const averageRating = totalRating / 5;
        return averageRating;
    }

    const reviewsPerPage = 5;
    const [currentReviews, setCurrentReviews] = useState([]);
    const [displayedCount, setDisplayedCount] = useState(0);

    useEffect(() => {
        if (props.reviews && props.reviews.length > 0) {
            const initialReviews = props.reviews.slice(0, reviewsPerPage);
            setCurrentReviews(initialReviews);
            setDisplayedCount(reviewsPerPage);
        } else {
            setCurrentReviews([]);
            setDisplayedCount(0);
        }
    }, [props.reviews]);

    const handleLoadMore = () => {
        if (props.reviews && displayedCount < props.reviews.length) {
            const newReviews = props.reviews.slice(displayedCount, displayedCount + reviewsPerPage);
            setCurrentReviews([...currentReviews, ...newReviews]);
            setDisplayedCount(displayedCount + reviewsPerPage);
        }
    }

    // Don't render anything if no reviews
    if (!props.reviews || props.reviews.length === 0) {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-center">
                        <p className="text-muted">No reviews yet. Be the first to review this vendor!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="vendor-review-list">
                    <ul className="list-unstyled">
                        {currentReviews.map((review, index) => (
                            <li key={`review-${review.id || index}`}>
                                <div className="d-flex">
                                    <div className="left">
                                        <span>
                                            <img src={review.user?.photo ? props.app.serverPath + review.user.photo : '/assets/images/placeholder.png'} className="profile-pict-img img-fluid" alt="" />
                                        </span>
                                    </div>
                                    <div className="right">
                                        <div className="d-flex align-items-center gap-10px">
                                            <h4>
                                                {review.user?.fullName || 'Anonymous'}
                                            </h4>
                                            <div className="d-flex align-items-center gap-5px">
                                                <span className="bi bi-star-fill text-warning fs-18px"></span>
                                                <small className="fw-bold">({calculateAverageRating(review).toFixed(1)})</small>
                                            </div>
                                        </div>
                                        <div className="review-description">
                                            <p>
                                                {review.reviewText}
                                            </p>
                                        </div>
                                        <span className="publish py-3 d-inline-block w-100">Published {moment(review.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {displayedCount < props.reviews.length && (
                        <div className="text-center">
                            <button className="btn btn-primary" onClick={handleLoadMore}>
                                Load More ({props.reviews.length - displayedCount} remaining)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}