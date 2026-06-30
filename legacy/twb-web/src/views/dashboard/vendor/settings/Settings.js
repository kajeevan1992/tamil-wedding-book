import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import InputField from "@components/shared/InputField";

export default function Settings() {
    const app = useSelector(state => state.app);

    const [state, setState] = useState({
        settings: {
            monthlyNewsletter: true,
            trainingEmails: true,
            improvementTips: true
        },

        errors: {},
    });

    useEffect(() => {
        if (app.profile?.vendor?.id) {
            loadSettings(app.profile?.vendor?.id);
        }
    }, [app.profile?.vendor]);

    const dispatch = useDispatch();
    async function loadSettings(vendorId) {
        try {
            window.scrollTo(0, 0);
            dispatch(toggleLoading(true));
            const { data } = await vendorService.getSettings(vendorId);

            if (data !== null) {
                setState((currentState) => ({
                    ...currentState,
                    settings: data,
                }));
            }


            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Something went wrong, please try again");
        }
    }

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            settings: {
                ...currentState.settings,
                [name]: value,
            }
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            window.scrollTo(0, 0);
            dispatch(toggleLoading(true));
            const { data } = await vendorService.updateSettings(state.settings.id, state.settings);

            if (data !== null) {
                setState((currentState) => ({
                    ...currentState,
                    settings: data.settings,
                }));
            }

            toast.success('Settings updated');
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error("Something went wrong, please try again");
        }
    }
    return (<div className="row">
        <section className="col-md-12">
            <h1 className="prepareTextTitle">Settings</h1>
            {app.profile.stepsDone ? (
                <section className="alert alert-info mt-4">
                    <div>
                        <h4>Your business information is being verified.</h4>
                        <small>
                            Click the link in the email we just sent you to confirm your
                            Tamil Wedding Book account.
                            <br />
                            Our Content Team is in the process of
                            <b>verifying your business information</b> and will publish your
                            Shopfront once approved.
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
                        Complete the steps to activate your storefront so couples can find
                        you on Tamil Wedding Book.
                        <NavLink to="create-store-front">Go back to the steps</NavLink>
                    </p>
                </section>
            )}
            <div className="card mt-2">
                <div className="card-body">
                    <div className="border-bottom mb-4">
                        <h4 className="mb-2">Notifications</h4>
                        <p>
                            Our emails contain useful information and tips to help you
                            improve your listing and grow your business. You can edit your
                            email preferences at any time.
                        </p>
                    </div>
                    <form method="POST" onSubmit={onSubmit}>
                        <div className="form-group">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    value={true}
                                    checked={state.settings.monthlyNewsletter}
                                    name="monthlyNewsletter"
                                    id="monthlyNewsletter"
                                    onChange={handleInputChange}
                                    className="form-check-input w-h-17px theme-color-bg"
                                />
                                <label
                                    className="form-check-label fw-normal m-2-7-0"
                                    htmlFor="monthlyNewsletter"
                                >
                                    Monthly newsletter with my listing information.
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    value={true}
                                    checked={state.settings.trainingEmails}
                                    name="trainingEmails"
                                    id="trainingEmails"
                                    onChange={handleInputChange}
                                    className="form-check-input w-h-17px theme-color-bg"
                                />
                                <label
                                    className="form-check-label fw-normal m-2-7-0"
                                    htmlFor="trainingEmails"
                                >
                                    Training emails during the first week.
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    value={true}
                                    checked={state.settings.improvementTips}
                                    name="improvementTips"
                                    id="improvementTips"
                                    onChange={handleInputChange}
                                    className="form-check-input w-h-17px theme-color-bg"
                                />
                                <label
                                    className="form-check-label fw-normal m-2-7-0"
                                    htmlFor="improvementTips"
                                >
                                    Listing improvement tips.
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-4">Save</button>
                    </form>
                </div>
            </div>
        </section>
    </div>);
} 