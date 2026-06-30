import InputField from "@components/shared/InputField";
import * as vendorService from "@services/VendorService";
import { toggleLoading } from "@store/AppSlice";
import { copyToClipboard, statusMessages } from "@utilities/CommonUtil";
import * as validateUtil from "@utilities/ValidateUtil";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function ReviewCollector() {
    const app = useSelector((state) => state.app);

    const [state, setState] = useState({
        reviewRequest: {
            recipients: [],
            reviewTemplate: "",
            saveTemplate: false,
        },
        recipient: {
            name: "",
            email: "",
        },
        url: "",
        rememberChecked: false,

        errors: {},
    });

    // const importClientModal = useRef(null);
    // const showimportClientModal = () => {
    //   importClientModal.current.showModal();
    // }
    // const hideimportClientModal = () => {
    //   importClientModal.current.hideModal();
    // }

    useEffect(() => {
        if (app.profile?.vendor?.id) {
            let reviewTemplate = app.profile?.vendor.reviewTemplate.replaceAll(
                /\[your name\]/g,
                app.profile?.fullName
            );

            console.log(app.profile);

            setState((currentState) => ({
                ...currentState,
                url: `${window.location.origin}/vendor-detail/${app.profile?.id}`,
            }));

            // let parser = new DOMParser();
            // const doc = parser.parseFromString(reviewTemplate, 'text/html');
            // if (doc.getElementById('your-name') !==null) {
            //   doc.getElementById('your-name').innerHTML = app.profile?.fullName;
            setState((currentState) => ({
                ...currentState,
                reviewRequest: {
                    ...currentState.reviewRequest,
                    reviewTemplate: reviewTemplate,
                },
            }));
            // }
        }
    }, [app.profile?.vendor]);

    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value =
            target.type === "checkbox" ? target.checked : target.value;

        if (target.type === "checkbox") {
            setState((currentState) => ({
                ...currentState,
                reviewRequest: {
                    ...currentState.reviewRequest,
                    [name]: value,
                },
            }));
        } else {
            setState((currentState) => ({
                ...currentState,
                recipient: {
                    ...currentState.recipient,
                    [name]: value,
                },
            }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {},
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.recipient.name)) {
            validationFlag = false;
            errors.name = ["Name and surname is required"];
        } else if (validateUtil.isGreaterThan(state.recipient.name, 191)) {
            validationFlag = false;
            errors.name = [
                "Name and surname must not be greater than 191 characters!",
            ];
        }

        if (validateUtil.isEmpty(state.recipient.email)) {
            validationFlag = false;
            errors.email = ["Email is required"];
        } else if (validateUtil.isNotEmail(state.recipient.email)) {
            validationFlag = false;
            errors.email = [
                "Invalid email address, please make sure the spelling!",
            ];
        } else if (validateUtil.isGreaterThan(state.recipient.email, 255)) {
            validationFlag = false;
            errors.email = ["Email must not be greater than 255 characters!"];
        } else {
            // Check if email already exists in recipients list
            const emailExists = state.reviewRequest.recipients.some(
                (recipient) =>
                    recipient.email.toLowerCase() ===
                    state.recipient.email.toLowerCase()
            );
            if (emailExists) {
                validationFlag = false;
                errors.email = [
                    "This email address has already been added to the recipients list.",
                ];
            }
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors,
            }));
        } else {
            addRecipient();
        }
    };

    const addRecipient = () => {
        let recipients = state.reviewRequest.recipients;
        recipients.push(state.recipient);

        setState((currentState) => ({
            ...currentState,
            reviewRequest: {
                ...currentState.reviewRequest,
                recipients: recipients,
            },
            recipient: {
                name: "",
                email: "",
            },
        }));
    };

    const removeRecipient = (index) => {
        setState((currentState) => ({
            ...currentState,
            reviewRequest: {
                ...currentState.reviewRequest,
                recipients: currentState.reviewRequest.recipients.filter(
                    (_, i) => i !== index
                ),
            },
        }));
    };

    const clearAllRecipients = () => {
        setState((currentState) => ({
            ...currentState,
            reviewRequest: {
                ...currentState.reviewRequest,
                recipients: [],
            },
        }));
    };

    const sendRequests = async (e) => {
        e.preventDefault();
        try {
            if (state.reviewRequest.recipients.length < 1) {
                toast.error("Recipients list must not be empty");
                return;
            } else if (state.reviewRequest.reviewTemplate.length < 50) {
                toast.error(
                    "Email content must contain at least 50 characters"
                );
                return;
            }

            dispatch(toggleLoading(true));
            const reviewRequest = state.reviewRequest;
            reviewRequest.vendorId = app.profile?.vendor.id;

            const { data } = await vendorService.reviewRequest(reviewRequest);

            dispatch(toggleLoading(false));
            toast.success(data.message);

            setState((currentState) => ({
                ...currentState,
                reviewRequest: {
                    ...currentState.reviewRequest,
                    recipients: [],
                },
            }));
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === "validation-errors") {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors,
                }));
            }
        }
    };

    return (
        <div className="row">
            <section className="col-md-12">
                <h1 className="prepareTextTitle">Review Collector</h1>
                {/* <div className="card mt-2">
                    <div className="card-body d-flex grey-bg">
                        <span className="stars">
                            <i
                                className="fa fa-star"
                                aria-hidden="true"
                                style={{ fontSize: "50px" }}
                            ></i>
                        </span>
                        <div className="ml-3">
                            <h4>You have received 0 reviews</h4>

                            <span>
                                <i className="bi bi-arrow-right-circle"></i>{" "}
                                &nbsp;0 requests sent
                            </span>
                            <span className="ml-3">
                                <i className="bi bi-clock"></i>
                                &nbsp;0 not replied to
                            </span>
                            <span className="ml-3">
                                <i className="bi bi-question-circle"></i>
                                &nbsp;0 without a photo
                            </span>
                        </div>
                    </div>
                </div> */}
                <div className="card mt-4">
                    <div className="card-body header-bg">
                        <p className="mb-0">
                            You are unable to request reviews until your
                            business has been validated. Make sure to add
                            high-quality photos and a description to your
                            storefront so it can be published.
                        </p>
                    </div>
                </div>
                {app.profile.stepsDone ? (
                    <section className="alert alert-info mt-4">
                        <div>
                            <h4>
                                Your business information is being verified.
                            </h4>
                            <small>
                                Click the link in the email we just sent you to
                                confirm your Tamil Wedding Book account.
                                <br />
                                Our Content Team is in the process of{" "}
                                <b>verifying your business information</b> and
                                will publish your Shopfront once approved.
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
                ) : (
                    <section className="alert alert-danger mt-4">
                        <strong>Your storefront isn't active yet</strong>
                        <p className="mt-2 mb-0">
                            Complete the steps to activate your storefront so
                            couples can find you on Tamil Wedding Book.
                            <NavLink to="create-store-front">
                                Go back to the steps
                            </NavLink>
                        </p>
                    </section>
                )}
            </section>

            <section className="col-md-12 mt-4">
                <div className="card mt-3">
                    <div className="card-body">
                        <h4 className="mb-2">Recipients</h4>
                        <p>
                            Customise this message to request reviews. You'll
                            receive a copy via email.
                        </p>

                        <div className="form-group mt-3 ">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <label className="mb-0">To: &nbsp;</label>
                                {state.reviewRequest.recipients.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={clearAllRecipients}
                                    >
                                        <i className="bi bi-x-circle"></i> Clear
                                        All
                                    </button>
                                )}
                            </div>
                            <div className="mb-2 d-flex flex-wrap">
                                {state.reviewRequest.recipients.map(
                                    (recipient, key) => (
                                        <span
                                            key={`recipient-list-${key}`}
                                            className="mr-2 mb-2 d-flex align-items-center"
                                        >
                                            <span
                                                className="badge badge-success br-0"
                                                style={{ fontWeight: 500 }}
                                            >
                                                {`${recipient.name} | ${recipient.email}`}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn-sm p-1px text-white bg-danger ms-1 br-0"
                                                style={{
                                                    fontSize: "0.7em",
                                                    opacity: 0.8,
                                                }}
                                                onClick={() =>
                                                    removeRecipient(key)
                                                }
                                                aria-label="Remove"
                                            >
                                                {" "}
                                                <i className="bi bi-x-circle"></i>
                                            </button>
                                        </span>
                                    )
                                )}
                            </div>
                            <form onSubmit={onSubmit} method="post">
                                <div className="d-flex align-items-center justify-content-between row">
                                    <div className="col-md-5">
                                        <InputField
                                            labelClassName="mb-0"
                                            type="text"
                                            selector="name"
                                            value={state.recipient.name}
                                            placeholder="Name"
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>

                                    <div className="col-md-5">
                                        <InputField
                                            labelClassName="mb-0"
                                            type="email"
                                            selector="email"
                                            value={state.recipient.email}
                                            placeholder="Email"
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm ml-3 mb-2"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* <a className="own-color" onClick={showimportClientModal}>
              <i className="bi bi-file-earmark-arrow-up mr-1" ></i>
              <span>Import clients</span>
            </a> */}
                            <div className="mt-3">
                                <span>
                                    <b>CC:</b> {app.profile?.email}
                                </span>
                            </div>
                        </div>
                        <form
                            onSubmit={sendRequests}
                            method="post"
                            className="mb-3"
                        >
                            <div className="d-flex justify-content-between align-items-end mr-4 mb-1">
                                <h4>Message</h4>
                                {/* <div className="btn-group">
                <button type="button" className="btn  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Template
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                  <i className="bi bi-pencil mr-1"></i>
                  <span type="button">Manage templates</span>
                </div>
              </div> */}
                            </div>

                            <div className="mb-4">
                                <div className="alert alert-info py-2 px-2 mb-1">
                                    <strong>Note:</strong> [recipient name] will
                                    be replaced on name in the list above.
                                </div>
                                <ReactQuill
                                    theme="snow"
                                    value={state.reviewRequest.reviewTemplate}
                                    onChange={(value) => {
                                        setState((currentState) => ({
                                            ...currentState,
                                            reviewRequest: {
                                                ...currentState.reviewRequest,
                                                reviewTemplate: value,
                                            },
                                        }));
                                    }}
                                    className="ql-container-h250px"
                                />
                                {state.errors.reviewRequest && (
                                    <div className="invalid-feedback">
                                        {state.perrors.reviewRequest[0]}
                                    </div>
                                )}
                            </div>

                            <p>
                                Note: a link to write a review directly on your
                                storefront will be included in the email:[Link]
                            </p>

                            <div className="form-group">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        value={true}
                                        checked={
                                            state.reviewRequest.saveTemplate
                                        }
                                        name="saveTemplate"
                                        id="saveTemplate"
                                        onChange={handleInputChange}
                                        className="form-check-input w-h-17px theme-color-bg"
                                    />
                                    <label
                                        className="form-check-label fw-normal m-2-7-0"
                                        htmlFor="saveTemplate"
                                    >
                                        Save template for future use
                                    </label>
                                </div>
                            </div>
                            {/* {state.rememberChecked && <div className="card mt-2 mr-4">
              <div className="card-body grey-bg p-1">
                <div className="col-md-12">
                  <InputField
                    label=""
                    labelClassName="mb-0"
                    type="text"
                    selector="template"
                    value={''}
                    placeholder="Template name"
                    onHandleChange={(e) => { }
                    }
                    errors={{}}
                  />
                </div>

                <div className="form-group col-md-12 mb-1">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      // value={}
                      // checked={ }
                      name={"default"}
                      id={"default"}
                      onChange={(e) => console.log(e)}
                      className="form-check-input w-h-17px theme-color-bg"
                    />
                    <label
                      className="form-check-label fw-normal m-2-7-0"
                      htmlFor={"default"}
                    >
                      Set as default
                    </label>
                  </div>
                </div>
              </div>
            </div>} */}
                            {state.errors["recipients"] && (
                                <div className="invalid-feedback">
                                    {state.errors["recipients"][0]}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary mt-2"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            <section className="col-md-12">
                <h4 className="mt-5 mb-2">
                    Share your personalised review URL
                </h4>
                <div className="card">
                    <div className="card-body">
                        <p>
                            Send this personalised URL to your past clients to
                            quickly collect reviews for your services.
                        </p>
                        <div className="bg-grey p-3 mt-3">
                            <p className="mb-0 fs-1rem">
                                <span>{state.url}</span>
                                <span
                                    className="float-right copy-button"
                                    onClick={() => copyToClipboard(state.url)}
                                >
                                    COPY
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* <ImportClientModal ref={importClientModal} appState={app} onHideModal={hideimportClientModal} /> */}
            </section>
        </div>
    );
}
