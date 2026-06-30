import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "@utilities/Modal";
import * as validateUtil from '@utilities/ValidateUtil';
import * as coupleService from '@services/CoupleService';
import { useDispatch } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import UserAvatar from "@components/shared/UserAvatar";
import ImageCropper from "@components/shared/ImageCropper";
import InputField from "@components/shared/InputField";
import InputFieldDate from "@components/shared/InputFieldDate";
import ModalContent from "@components/shared/ModalContent";
import { convertDateToObject, formatDate, statusMessages } from "@utilities/CommonUtil";
import { weddingThemeColors } from "@utilities/CommonUtil";

const BannerEditProfilesModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        profile: {
            coupleId: '',
            fullName: '',
            partnerName: '',
            photo: '',
            partnerPhoto: '',
            weddingDate: '',
            venue: '',
            startTime: '',
            endTime: '',
            color: ''
        },

        action: 'add',
        errors: {}
    });

    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal(app) {
            modal = new Modal('#bannerEditProfilesModal', {
                backdrop: true
            });

            setState((currentState) => ({
                ...currentState,
                profile: {
                    ...currentState.profile,
                    coupleId: app.profile.couple.id,
                    fullName: app.profile.fullName,
                    partnerName: app.profile.couple.weddingDetail.partnerName,
                    photo: app.profile.photo,
                    partnerPhoto: app.profile.couple.weddingDetail.partnerPhoto,
                    weddingDate: convertDateToObject(app.profile.couple.weddingDetail.date),
                    venue: app.profile.couple.weddingDetail.venue ? app.profile.couple.weddingDetail.venue : '',
                    startTime: app.profile.couple.weddingDetail.startTime ? app.profile.couple.weddingDetail.startTime : '',
                    endTime: app.profile.couple.weddingDetail.endTime ? app.profile.couple.weddingDetail.endTime : '',
                    color: app.profile.couple.weddingDetail.color
                }
            }));

            modal.show();
        },
        hideModal() {
            modal = new Modal('#bannerEditProfilesModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            profile: {
                ...currentState.profile,
                [name]: value,
            }
        }));
    }

    const imageCropperModal = useRef(null);

    const showImageCropperModal = (image, type) => {
        if (image) {
            imageCropperModal.current.showModal(image, type, {
                enableExif: true,
                viewport: {
                    height: 100,
                    width: 100,
                    type: 'circle'
                },
                boundary: {
                    height: 280,
                    width: 400,
                },
            });
        }
    }

    const hideImageCropperModal = (image, type) => {
        setState((currentState) => ({
            ...currentState,
            profile: {
                ...currentState.profile,
                [type]: image,
            }
        }));

        imageCropperModal.current.hideModal();

        document.getElementById('bannerEditProfilesModal').style.overflowY = 'auto';
    }

    const attachImageToCrop = (e, type) => {
        showImageCropperModal(e.target.files[0], type);
    }

    const handleColorChange = (value) => {
        setState((currentState) => ({
            ...currentState,
            profile: {
                ...currentState.profile,
                color: value,
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

        if (validateUtil.isEmpty(state.profile.fullName)) {
            validationFlag = false;
            errors.fullName = ['Name is required'];
        } else if (validateUtil.isGreaterThan(state.profile.fullName, 191)) {
            validationFlag = false;
            errors.fullName = ['Name must not be greater than 255 characters!'];
        }

        if (validateUtil.isEmpty(state.profile.partnerName)) {
            validationFlag = false;
            errors.partnerName = ['Partner name is required'];
        } else if (validateUtil.isGreaterThan(state.profile.partnerName, 191)) {
            validationFlag = false;
            errors.partnerName = ['Partner name must not be greater than 255 characters!'];
        }

        if (validateUtil.isEmpty(state.profile.weddingDate)) {
            validationFlag = false;
            errors.weddingDate = ['Wedding date is required'];
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors
            }));
        } else {
            submit();
        }
    }

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            let formData = new FormData();
            for (let key in state.profile) {
                // if (key === 'anyObject') {
                //     formData.append(key, JSON.stringify(state.user[key]));
                // } else...

                if (key === 'weddingDate') {
                    formData.append(key, formatDate(state.profile[key], 'YYYY-MM-DD'));
                } else {
                    formData.append(key, state.profile[key]);
                }
            }

            const response = await coupleService.updateProfileAndWeddingDetail(formData);

            dispatch(toggleLoading(false));
            dispatch(authenticate(response.data.user));
            toast.success(response.data.message);
            props.onHideModal();
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    return (
        <>
            {props.app.profile.couple && <ModalContent
                id="bannerEditProfilesModal"
                title="My Wedding"
                onHide={props.onHideModal}
                body={<div className="row px-3">
                    <div className="col-12">
                        <form className="auth-register-form mt-1" action="#" method="POST" onSubmit={onSubmit}>
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-center">
                                        <label htmlFor="currentUserPhoto">
                                            <div className="avatar-alias size-avatar-xmedium avatar-center justify-content-center">
                                                <UserAvatar name={state.profile.fullName} round={true} size={100} photo={
                                                    state.profile.photo && state.profile.photo.name ? state.profile.photo : state.profile.photo ? props.app.serverPath + state.profile.photo : props.app.profile.couple.weddingDetail.partnerPhoto && props.app.profile.primary === false ? props.app.serverPath + props.app.profile.couple.weddingDetail.partnerPhoto : null
                                                } />
                                                <div className="camera-bg">
                                                    <span className="bi bi-camera"></span>
                                                </div>
                                            </div>
                                        </label>
                                        <input type="file" accept="image/*" id="currentUserPhoto" className="hidden" onChange={(e) => attachImageToCrop(e, 'photo')} />
                                    </div>
                                    {
                                        state.errors.photo &&
                                        <div className="invalid-feedback">
                                            {state.errors.photo[0]}
                                        </div>
                                    }
                                </div>
                                <div className="col-md-1 d-flex justify-content-center align-items-center">
                                    <span className="bi bi-hearts text-red-35px"></span>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-center">
                                        <label htmlFor="currentUserCouplePhoto">
                                            <div className="avatar-alias size-avatar-xmedium avatar-center">
                                                <UserAvatar name={state.profile.partnerName} round={true} size={100} photo={
                                                    state.profile.partnerPhoto && state.profile.partnerPhoto.name ? state.profile.partnerPhoto : props.app.profile.partner && props.app.profile.partner.photo ? props.app.serverPath + props.app.profile.partner.photo : props.app.profile.couple.weddingDetail.partnerPhoto ? props.app.serverPath + props.app.profile.couple.weddingDetail.partnerPhoto : null
                                                } />
                                                <div className="camera-bg">
                                                    <span className="bi bi-camera"></span>
                                                </div>
                                            </div>
                                        </label>
                                        <input type="file" accept="image/*" id="currentUserCouplePhoto" className="hidden"
                                            onChange={(e) => attachImageToCrop(e, 'partnerPhoto')} />
                                    </div>
                                    {
                                        state.errors.partnerPhoto &&
                                        <div className="invalid-feedback">
                                            {state.errors.partnerPhoto[0]}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputField
                                            label="I AM"
                                            type="text"
                                            selector="fullName"
                                            value={state.profile.fullName}
                                            placeholder="Name"
                                            allBorders={true}
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputField
                                            label="PARTNER'S NAME"
                                            type="text"
                                            selector="partnerName"
                                            value={state.profile.partnerName}
                                            placeholder="Name"
                                            allBorders={true}
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputFieldDate
                                            label="WEDDING DATE"
                                            selected={state.profile.weddingDate}
                                            selector="weddingDate"
                                            format="yyyy-MM-dd"
                                            allBorders={true}
                                            onHandleChange={(date) => {
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    profile: {
                                                        ...currentState.profile,
                                                        weddingDate: date,
                                                    }
                                                }));
                                            }}
                                            placeholder="Wedding Date"
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputField
                                            label="VENUE"
                                            type="text"
                                            selector="venue"
                                            allBorders={true}
                                            value={state.profile.venue}
                                            placeholder="Business Name"
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputField
                                            label="START TIME"
                                            type="time"
                                            allBorders={true}
                                            selector="startTime"
                                            value={state.profile.startTime}
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <InputField
                                            label="END TIME"
                                            type="time"
                                            allBorders={true}
                                            selector="endTime"
                                            value={state.profile.endTime}
                                            onHandleChange={handleInputChange}
                                            errors={state.errors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <hr />
                                    <label>SELECT A COLOUR</label>
                                    <div className="d-flex justify-content-center">
                                        {weddingThemeColors.map((color, colorIndex) =>
                                            <button type="button" key={`colorIndex-${colorIndex}`} className={`btn round-clr-btn ${state.profile.color == color ? 'active-color' : ''}`} onClick={() => handleColorChange(color)}>
                                                <span style={{ backgroundColor: color }}></span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <hr />
                                    <div className="py-2 text-center">
                                        <button className="btn btn-primary btn-sm">Save</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
            />}
            <ImageCropper ref={imageCropperModal} onHideModal={(image, type) => { hideImageCropperModal(image, type) }} id="banner-edit-profiles" />
        </>
    );
});

export default BannerEditProfilesModal;