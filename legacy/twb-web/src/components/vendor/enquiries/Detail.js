import TextArea from "@components/shared/TextArea";
import { deleteEnquiry, postEnquiryReply } from "@services/VendorService";
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import { isEmpty, isGreaterThan, isLessThan } from "@utilities/ValidateUtil";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EnquiryDetail(props) {
    const [state, setState] = useState({
        reply: {
            replyText: "",
        },

        errors: {},
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value =
            target.type === "checkbox" ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            reply: {
                ...currentState.reply,
                [name]: value,
            },
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        // submit();
        // return;

        setState((currentState) => ({
            ...currentState,
            errors: {},
        }));

        let errors = {};
        let validationFlag = true;

        if (isEmpty(state.reply.replyText)) {
            errors.replyText = ["Reply text is required"];
            validationFlag = false;
        } else if (isLessThan(state.reply.replyText, 10)) {
            errors.replyText = ["Reply text must be at least 10 characters"];
            validationFlag = false;
        } else if (isGreaterThan(state.reply.replyText, 250)) {
            errors.replyText = ["Reply text must be less than 250 characters"];
            validationFlag = false;
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors,
            }));
        } else {
            submit();
        }
    };

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {},
            }));

            dispatch(toggleLoading(true));
            const replyData = {
                enquiryId: props.enquiry.id,
                vendorId: props.vendorId,
                replyText: state.reply.replyText.trim(),
            };

            const { data } = await postEnquiryReply(replyData);
            props.onEnquiryReplyPosted(data.enquiry);
            dispatch(toggleLoading(false));
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            dispatch(toggleLoading(false));
            if (statusMessages(error) === "validation-errors") {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors,
                }));
            }
        }
    }

    const handleDelete = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this enquiry? This action cannot be undone."
            )
        ) {
            return;
        }

        try {
            dispatch(toggleLoading(true));
            await deleteEnquiry(props.vendorId, props.enquiry.id);
            dispatch(toggleLoading(false));
            toast.success("Enquiry deleted successfully");

            // Navigate back to enquiries list
            if (props.onEnquiryDeleted) {
                props.onEnquiryDeleted();
            }
            navigate(`/${props.role || "vendor"}/enquiries`);
        } catch (error) {
            console.log(error);
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    };

    const getStatusBadge = () => {
        const status = props.enquiry?.status?.toLowerCase();
        if (status === "responded") {
            return <span className="badge badge-primary ml-2">Responded</span>;
        } else if (status === "booked") {
            return <span className="badge badge-success ml-2">Booked</span>;
        } else {
            return <span className="badge badge-warning ml-2">Pending</span>;
        }
    };

    const getReadStatusBadge = () => {
        if (props.enquiry?.readByVendor) {
            return (
                <span className="badge badge-info ml-2">
                    <i className="bi bi-envelope-check"></i> Read
                </span>
            );
        } else {
            return (
                <span className="badge badge-secondary ml-2">
                    <i className="bi bi-envelope-exclamation"></i> Unread
                </span>
            );
        }
    };

    return (
        <div className="row">
            <section className="col-md-12">
                <h1 className="prepareTextTitle">Enquiry Detail</h1>
            </section>

            {props.enquiry && (
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h3 className="mb-0">
                                            {props.enquiry.fullName}
                                        </h3>
                                        <div className="d-flex align-items-center gap-2">
                                            {getReadStatusBadge()}
                                            {getStatusBadge()}
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={handleDelete}
                                                title="Delete enquiry"
                                            >
                                                <i className="bi bi-trash"></i>{" "}
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {props.enquiry.email} <br />
                                        <strong>Phone:</strong>{" "}
                                        {props.enquiry.phone} <br />
                                        <strong>Event Date:</strong>{" "}
                                        {moment(props.enquiry.eventDate).format(
                                            "DD-MM-YYYY"
                                        )}{" "}
                                        <br />
                                        <strong>Guests Count:</strong>{" "}
                                        {props.enquiry.guestsCount} <br />
                                    </p>
                                    <p>
                                        <strong>Message:</strong>
                                        <br /> {props.enquiry.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {props.enquiry.status !== "responded" ? (
                        <div className="row">
                            <div className="col-md-12 mt-5">
                                <TextArea
                                    mbClassName="mb-3"
                                    type="text"
                                    label={
                                        <span>
                                            Reply{" "}
                                            <small className="text-muted">
                                                (
                                                {
                                                    state.reply.replyText.trim()
                                                        .length
                                                }
                                                /250)
                                            </small>
                                        </span>
                                    }
                                    selector="replyText"
                                    value={state.reply.replyText}
                                    placeholder="Write your reply here."
                                    onHandleChange={handleInputChange}
                                    allBorders={true}
                                    errors={state.errors}
                                />
                            </div>
                            <div className="col-md-12">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    onClick={onSubmit}
                                >
                                    Submit Reply
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-md-12 mt-5">
                                <p>
                                    <strong>Reply:</strong>
                                    <br /> {props.enquiry.replyText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
