import { Rating } from "react-simple-star-rating";

export default function ReviewsStats(props) {
    return (
        <>
            <div className="col-md-2">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="text-theme">
                            {props.averageRatings.averageRating}
                        </h1>
                        <p>out of 5.0</p>
                        <Rating
                            initialValue={props.averageRatings.averageRating}
                            readonly={true}
                            size={props.size === "small" ? 16 : 20}
                            allowFraction={true}
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-10">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="ml-2 relative">
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="bi bi-patch-check text-success"></span>{" "}
                                            <p className="m-0">
                                                Quality of the service
                                            </p>
                                        </div>
                                        <Rating
                                            initialValue={
                                                props.averageRatings
                                                    .qualityOfService
                                            }
                                            readonly={true}
                                            size={
                                                props.size === "small" ? 12 : 16
                                            }
                                            allowFraction={true}
                                            style={{
                                                position: "absolute",
                                                left: "0",
                                                top: "20px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="ml-2 relative">
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="bi bi-briefcase text-info"></span>{" "}
                                            <p className="m-0">
                                                Professionalism
                                            </p>
                                        </div>

                                        <Rating
                                            initialValue={
                                                props.averageRatings
                                                    .professionalism
                                            }
                                            readonly={true}
                                            size={
                                                props.size === "small" ? 12 : 16
                                            }
                                            allowFraction={true}
                                            style={{
                                                position: "absolute",
                                                left: "0",
                                                top: "20px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="ml-2 relative">
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="bi bi-list-nested text-warning"></span>{" "}
                                            <p className="m-0">Flexibility</p>
                                        </div>
                                        <Rating
                                            initialValue={
                                                props.averageRatings.flexibility
                                            }
                                            readonly={true}
                                            size={
                                                props.size === "small" ? 12 : 16
                                            }
                                            allowFraction={true}
                                            style={{
                                                position: "absolute",
                                                left: "0",
                                                top: "20px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="ml-2 relative">
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="bi bi-coin text-danger"></span>{" "}
                                            <p className="m-0">
                                                Value for money
                                            </p>
                                        </div>
                                        <Rating
                                            initialValue={
                                                props.averageRatings
                                                    .valueForMoney
                                            }
                                            readonly={true}
                                            size={
                                                props.size === "small" ? 12 : 16
                                            }
                                            allowFraction={true}
                                            style={{
                                                position: "absolute",
                                                left: "0",
                                                top: "20px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="ml-2 relative">
                                        <div className="d-flex align-items-center gap-3">
                                            <span className="bi bi-clock-history text-primary"></span>{" "}
                                            <p className="m-0">Response time</p>
                                        </div>
                                        <Rating
                                            initialValue={
                                                props.averageRatings
                                                    .responseTime
                                            }
                                            readonly={true}
                                            size={
                                                props.size === "small" ? 12 : 16
                                            }
                                            allowFraction={true}
                                            style={{
                                                position: "absolute",
                                                left: "0",
                                                top: "20px",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
