import InputField from "@components/shared/InputField";
import InputFieldPassword from "@components/shared/InputFieldPassword";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { NavLink } from 'react-router-dom';

export default function CreateStorefrontStep1(props) {
    function BusinessIdentities() {
        return (
            props.businessIdentities.map((businessIdentity, identityIndex) =>
                <div className="col-md-4" key={`identity-${identityIndex}`}>
                    <div className="form-group">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                value={businessIdentity.id}
                                checked={props.initialData.vendor.vendorBusinessIdentities.includes(businessIdentity.id) ? true : false}
                                name={`businessIdentity${businessIdentity.id}`}
                                id={`businessIdentity${businessIdentity.id}`}
                                onChange={(e) => props.onIdentityChange('businessIdentity', null, businessIdentity.id, businessIdentity.name, e.target.checked)}
                                className="form-check-input w-h-17px theme-color-bg"
                            />
                            <label className="form-check-label fw-normal m-2-7-0" htmlFor={`businessIdentity${businessIdentity.id}`}>
                                {businessIdentity.name}
                                {businessIdentity.name === 'None of these apply' && <small><br />(Hidden from storefront)</small>}
                            </label>
                        </div>
                    </div>
                </div>
            )
        );
    }

    return (
        <>
            <div className="row">
                <section className="col-md-12">
                    <h1 className="prepareTextTitle">
                        {props.title ? props.title : 'Add information about your business'}
                    </h1>
                    <div className="card mt-2">
                        <div className="card-body d-flex grey-bg">
                            <i className="bi bi-file-earmark-text fs-3rem mr-3"></i>
                            <div>
                                <strong>Your storefront features information about your wedding services to attract and convert our audience of engaged couples.</strong>
                                <p>It's important that all the information on your storefront is up to date and accurate.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-4">
                    <h4>Your login details</h4>
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <InputField
                                        label="Username"
                                        labelClassName="mb-0"
                                        type="text"
                                        selector="username"
                                        value={props.initialData.username}
                                        placeholder="Username"
                                        onHandleChange={(e) => props.onInputChange('user', 'username', e.target.value)}
                                        errors={props.errors}
                                    />
                                </div>
                            </div>

                            <button onClick={() => {
                                props.onInputChange('general', 'changePasswordCheck', !props.changePasswordCheck);
                            }} className="btn btn-link text-theme p-0">{props.changePasswordCheck ? 'Cancel' : 'Change Password'}</button>
                            {props.changePasswordCheck && <div className="row">
                                <div className="col-md-12">
                                    <div className="alert alert-info">
                                        Username and Password required to access your business account. Username must contain a minimum of 5 characters. Your password must be between 8 and 48 characters and include at least 1 lowercase letter, 1 capital letter, 1 number, and no spaces.
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <InputFieldPassword
                                        mbClassName="mb-0"
                                        labelClassName="mb-0"
                                        selector="currentPassword"
                                        value={props.initialData.currentPassword}
                                        placeholder="Current Password"
                                        onHandleChange={(e) => props.onInputChange('user', 'currentPassword', e.target.value)}
                                        errors={props.errors}
                                    />
                                    <NavLink to="" className="text-theme my-2 d-block">Forgot your password?</NavLink>
                                    <InputFieldPassword
                                        mbClassName="mb-0"
                                        labelClassName="mb-0"
                                        selector="newPassword"
                                        value={props.initialData.newPassword}
                                        placeholder="New Password"
                                        onHandleChange={(e) => props.onInputChange('user', 'newPassword', e.target.value)}
                                        errors={props.errors}
                                    />
                                    <InputFieldPassword
                                        mbClassName="mb-0"
                                        labelClassName="mb-0"
                                        selector="newPasswordConfirmation"
                                        value={props.initialData.newPasswordConfirmation}
                                        placeholder="Confirm Password"
                                        onHandleChange={(e) => props.onInputChange('user', 'newPasswordConfirmation', e.target.value)}
                                        errors={props.errors}
                                    />
                                </div>
                            </div>}
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-5">
                    <h4>Describe your business and services</h4>
                    <div className="card mt-3">
                        <div className="card-body">
                            <p className="m-0">Share unique, descriptive information about your business in order to attract more couples and boost your visibility across top search engines. Please do not include any contact information in this section.</p>

                            <NavLink to="" className="text-theme mt-1 d-block">View an example of a storefront</NavLink>

                            <div className="mt-4 mb-4">
                                <ReactQuill theme="snow" value={props.initialData.vendor.aboutStoreFront} onChange={(value) => props.onInputChange('vendor', 'aboutStoreFront', value)} className="ql-container-h250px" />
                                {
                                    props.errors.aboutStoreFront &&
                                    <div className="invalid-feedback">
                                        {props.errors.aboutStoreFront[0]}
                                    </div>
                                }
                            </div>

                            <h5>Business attributes</h5>
                            <p>Our marketplace's Support Diversity filters help couples discover and connect with underrepresented professionals who personally identify with the filters.</p>
                            <br />
                            <h5>How does your business identify?</h5>
                            <small>These filters are meant to reflect how your business identifies, not to show your support or allyship. Once you opt in, we'll add your selection(s) to your Storefront's About section.</small>
                            <div className="row mt-3">
                                <BusinessIdentities />
                                <div className="col-md-12">
                                    <div className="alert alert-info">
                                        <strong>Note:</strong> We have not changed our algorithm. Couples will still see your business in the default directory view before applying any filters. We encourage you to be mindful of our <NavLink className="text-theme">terms of use</NavLink> when making your selection.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-5">
                    <h4>Contact details</h4>
                    <div className="alert alert-info">Lead notifications and updates from Tamil Wedding Book will be sent to this email address.</div>
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <InputField
                                        label="Contact Person"
                                        labelClassName="mb-0"
                                        type="fullName"
                                        selector="fullName"
                                        value={props.initialData.vendor.contactPerson.fullName ?? ''}
                                        placeholder="Enter Name"
                                        onHandleChange={(e) => props.onInputChange('contactPerson', 'fullName', e.target.value)}
                                        errors={props.errors}
                                    />
                                    <InputField
                                        label="Email"
                                        labelClassName="mb-0"
                                        type="email"
                                        selector="email"
                                        value={props.initialData.vendor.contactPerson.email ?? ''}
                                        placeholder="Email"
                                        onHandleChange={(e) => props.onInputChange('contactPerson', 'email', e.target.value)}
                                        errors={props.errors}
                                    />
                                    <label className="mb-0">Telephone</label>
                                    <PhoneInput
                                        name="telephone"
                                        value={props.initialData.vendor.contactPerson.telephone ?? ''}
                                        id="telephone"
                                        onChange={(value) => props.onInputChange('contactPerson', 'telephone', value)}
                                        placeholder="Telephone"
                                        className="form-control own-input only-b-brdr-grey phone-field"
                                    />
                                    {
                                        props.errors.telephone &&
                                        <div className="invalid-feedback">
                                            {props.errors.telephone[0]}
                                        </div>
                                    }

                                    <label className="mb-0 mt-4">Mobile Number</label>
                                    <PhoneInput
                                        name="mobile"
                                        value={props.initialData.vendor.contactPerson.mobile ?? ''}
                                        id="mobile"
                                        onChange={(value) => props.onInputChange('contactPerson', 'mobile', value)}
                                        placeholder="Mobile"
                                        className="form-control own-input only-b-brdr-grey phone-field"
                                    />
                                    {
                                        props.errors.mobile &&
                                        <div className="invalid-feedback">
                                            {props.errors.mobile[0]}
                                        </div>
                                    }
                                    <br />
                                    <InputField
                                        label="Fax"
                                        labelClassName="mb-0"
                                        type="text"
                                        selector="fax"
                                        value={props.initialData.vendor.contactPerson.fax ?? ''}
                                        placeholder="Enter Fax"
                                        onHandleChange={(e) => props.onInputChange('contactPerson', 'fax', e.target.value)}
                                        errors={props.errors}
                                    />

                                    <InputField
                                        label="Website"
                                        labelClassName="mb-0"
                                        type="url"
                                        selector="website"
                                        value={props.initialData.vendor.contactPerson.website ?? ''}
                                        placeholder="Enter url"
                                        onHandleChange={(e) => props.onInputChange('contactPerson', 'website', e.target.value)}
                                        errors={props.errors}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-2">
                    <small>Published content must meet Tamil Wedding's Book <NavLink className="text-theme">Terms of Use.</NavLink></small><br />
                    <button className="btn bt-sm btn-primary" onClick={() => props.onSubmit('step1')}>Save</button>
                </section>
            </div>
        </>
    );
}