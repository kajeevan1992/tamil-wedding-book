import { NavLink, useNavigate } from "react-router-dom";
import InputField from "@components/shared/InputField";
import { useState } from "react";
import * as validateUtil from '@utilities/ValidateUtil';

export default function PlanningHeader(props) {
    const [state, setState] = useState({
        user: {
            fullName: '',
            email: '',
        },
        errors: {}
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            user: {
                ...currentState.user,
                [name]: value,
            }
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (validateUtil.isEmpty(state.user.fullName)) {
            validationFlag = false;
            errors.fullName = ['Name and surname is required'];
        } else if (validateUtil.isGreaterThan(state.user.fullName, 191)) {
            validationFlag = false;
            errors.fullName = ['Name and surname must not be greater than 191 characters!'];
        }
        if (validateUtil.isEmpty(state.user.email)) {
            validationFlag = false;
            errors.email = ['Email is required'];
        } else if (validateUtil.isNotEmail(state.user.email)) {
            validationFlag = false;
            errors.email = ['Invalid email address, please make sure the spelling!'];
        } else if (validateUtil.isGreaterThan(state.user.email, 255)) {
            validationFlag = false;
            errors.email = ['Email must not be greater than 255 characters!'];
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors
            }));
        } else {
            navigate(`/register?name=${state.user.fullName}&email=${state.user.email}`);
        }
    }

    return (
        <section className="callout-main border-bottom pb-0">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <h2 className="text-theme my-4 text-sm-center">{props.title}</h2>
                        <p className="text-sm-center">{props.body}</p>

                        <div>
                            <form onSubmit={onSubmit}>
                                <p className="mt-0">Get Started:</p>
                                <div className="row">
                                    <InputField
                                        mbClassName="col-md-4 mb-3"
                                        fieldClassName="bg-white"
                                        type="text"
                                        selector="fullName"
                                        value={state.user.fullName}
                                        placeholder="Name"
                                        onHandleChange={handleInputChange}
                                        allBorders={true}
                                        errors={state.errors}
                                    />
                                    <InputField
                                        mbClassName="col-md-4 mb-3"
                                        fieldClassName="bg-white"
                                        type="email"
                                        selector="email"
                                        value={state.user.email}
                                        placeholder="Email"
                                        onHandleChange={handleInputChange}
                                        allBorders={true}
                                        errors={state.errors}
                                    />

                                    <div className="col-md-4 text-sm-center">
                                        <button type="submit" className="btn btn-primary mt-1">Start Planning</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="text-sm-center my-4">
                            <span>Already have an account? <NavLink
                                to="/login"
                                style={{ textDecoration: 'underline' }}>Login</NavLink>
                            </span>
                        </div>
                    </div>
                    <div className="col-md-1 d-none d-md-block"></div>
                    <div className="col-md-4 d-none d-md-block my-4">
                        <div className="card">
                            <div className="card-body p-1">
                                <img src={props.image} alt="Tamil wedding book guest list" className="w-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}