import UserAvatar from "@components/shared/UserAvatar";
import CountdownTimer from "@components/shared/CountdownTimer";
import { useRef, useState } from 'react';
import BannerEditProfilesModal from '@components/couple/BannerEditProfilesModal';
import ShareWeddingModal from '@components/couple/ShareWeddingModal';
import { formatDate } from '@utilities/CommonUtil';
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading, changeWeddingCardPhoto } from "@store/AppSlice";
import ImageCropper from "@components/shared/ImageCropper";
import { toast } from 'react-hot-toast';
import * as coupleService from '@services/CoupleService';
import { statusMessages } from "../../utilities/CommonUtil";
import { NavLink } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export default function Banner(props) {
    const app = useSelector(state => state.app);
    // const app = useSelector(state => state.app);

    const bannerEditProfilesModal = useRef(null);

    const showBannerEditProfilesModal = () => {
        bannerEditProfilesModal.current.showModal(app);
    }
    const hideBannerEditProfilesModal = () => {
        bannerEditProfilesModal.current.hideModal();
    }

    const shareWeddingModal = useRef(null);

    const showShareWeddingModal = () => {
        shareWeddingModal.current.showModal(app);
    }
    const hideShareWeddingModal = () => {
        shareWeddingModal.current.hideModal();
    }

    const [cardPhoto, setCardPhoto] = useState(null);

    const dispatch = useDispatch();

    const imageCropperModal = useRef(null);
    const showImageCropperModal = (image, type) => {
        if (image) {
            imageCropperModal.current.showModal(image, type, {
                enableExif: true,
                viewport: {
                    height: 300,
                    width: 300,
                    type: 'square'
                },
                boundary: {
                    height: 320,
                    width: 400,
                },
            }, 'banner');
        }
    }
    const hideImageCropperModal = async (image, type) => {
        try {
            dispatch(toggleLoading(true));

            let formData = new FormData();
            formData.append('weddingDetailId', app.profile.couple.weddingDetail.id);
            formData.append('photo', image);
            const response = await coupleService.updateWeddingCardPhoto(formData);

            dispatch(toggleLoading(false));
            toast.success(response.data.message);
            setCardPhoto(image);
            // app.profile.couple.weddingDetail.cardPhoto = response.data.cardPhoto;
            dispatch(changeWeddingCardPhoto({ cardPhoto: response.data.cardPhoto }));
            imageCropperModal.current.hideModal();
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }
    const attachImageToCrop = (e, type) => {
        showImageCropperModal(e.target.files[0], type);
    }

    return (
        <>
            <section className="slider-wrap bg-gradient" style={{ backgroundColor: app.profile.couple ? app.profile.couple.weddingDetail.color : 'rgb(211, 223, 158)' }}>
                <div id="photoLoading" className="dash-hero-wrapper wrapper">
                    <div id="uploadContainer" className="pure-g-r dash-heroContainer">
                        <div id="pickfiles" className="pure-u-1-3 dash-cover app-spinner-container app-pencil-profile cursor-defult">
                            {app.profile.couple && <img
                                className="block app-tools-main-front-img dash-img"
                                src={cardPhoto && cardPhoto.name ? URL.createObjectURL(cardPhoto) : app.serverPath + app.profile.couple.weddingDetail.cardPhoto}
                                alt="Tamil Wedding BooK"
                            />}
                            <div className="dash-coverTopSection">
                                <label htmlFor="bannerCardPhoto"
                                    className="dash-coverTopSectionButton app-croppie-browse-button-front app-ua-track-event-multiple">
                                    <span className="bi bi-camera"></span> Change photo </label>
                                <input type="file" accept="image/*" id="bannerCardPhoto" className="hidden" onChange={(e) => attachImageToCrop(e, '')} />
                                <label onClick={showShareWeddingModal} className="dash-coverTopSectionButton app-countdown-share app-ua-track-event-multiple">
                                    <span className="bi bi-upload"></span> Share </label>
                            </div>
                            <div className="dash-cover-info">
                                <div className="justMarriedWidget justMarriedWidget--toolsMain">
                                    <div className="justMarriedWidget__body">
                                        {/* <p className="justMarriedWidget__notice mb10 dnone app-countdown-message">Happily married 🎉
                                        </p> */}
                                        {app.profile.couple && <div id="defaultCountdown" className="justMarriedWidget__timer">
                                            <CountdownTimer date={app.profile.couple.weddingDetail.date} />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pure-u-2-3 dash-summaryContainer">
                            <div className="dash-summary">
                                <button type="button" onClick={showBannerEditProfilesModal}
                                    className="btn btn-sm btn-outline-primary btn-rt-15px">Edit</button>
                                {app.isLoggedIn && <div className="dash-summary-info text-center">
                                    <ul className="avatar-group reverse avatar-group-medium p-0">
                                        <li className="avatar-group-item app-marriage-layer-open">
                                            <div
                                                className="modal-myWedding-dash-sectionAvatar modal-myWedding-dash-sectionAvatar-small">
                                                <label htmlFor="photo_1" className="pointer frame-inputFile">
                                                    <div
                                                        className="modal-myWedding-dash-sectionAvatar-hover modal-myWedding-dash-sectionAvatar-hover-small">
                                                        <i className="icon-tools icon-tools-avatar-camera-white"></i>
                                                    </div>
                                                    <div className="avatar-alias size-avatar-xmedium avatar-center">
                                                        <UserAvatar name={app.profile.fullName} round={true} size={100} photo={
                                                            app.profile.photo ? app.serverPath + app.profile.photo : app.profile.couple.weddingDetail.partnerPhoto && app.profile.primary === false ? app.serverPath + app.profile.couple.weddingDetail.partnerPhoto : null
                                                        } />

                                                        <div className="camera-bg" onClick={showBannerEditProfilesModal}>
                                                            <span className="bi bi-camera"></span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </li>
                                        <li className="avatar-group-item app-marriage-layer-open">
                                            <div
                                                className="modal-myWedding-dash-sectionAvatar modal-myWedding-dash-sectionAvatar-small">
                                                <label htmlFor="photo_2" className="pointer frame-inputFile">
                                                    <div
                                                        className="modal-myWedding-dash-sectionAvatar-hover modal-myWedding-dash-sectionAvatar-hover-small">
                                                    </div>
                                                    <span
                                                        className="modal-myWedding-dash-sectionAvatar-empty modal-myWedding-dash-sectionAvatar-empty-small">
                                                        <i className="icon-tools icon-tools-avatar-camera-white"></i>
                                                    </span>
                                                    <div className="avatar-alias size-avatar-xmedium avatar-center">
                                                        <UserAvatar name={app.profile.partner ? app.profile.partner.fullName : app.profile.couple.weddingDetail.partnerName} round={true} size={100} photo={
                                                            app.profile.partner && app.profile.partner.photo ? app.serverPath + app.profile.partner.photo : app.profile.couple.weddingDetail.partnerPhoto ? app.serverPath + app.profile.couple.weddingDetail.partnerPhoto : null
                                                        } />

                                                        <div className="camera-bg" onClick={showBannerEditProfilesModal}>
                                                            <span className="bi bi-camera"></span>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                    <p className="dash-couple-names">
                                        <span className="app-owner-name">{app.profile.fullName}  {app.profile.partner ? ' & ' + app.profile.partner.fullName : app.profile.couple.weddingDetail.partnerName ? ' & ' + app.profile.couple.weddingDetail.partnerName : ''}</span>
                                    </p>
                                    <div className="dash-couple-personal">
                                        <div className="dash-couple-personal-date">
                                            <p className="dash-couple-subtitle"><span> {formatDate(app.profile.couple.weddingDetail.date, 'Mo of MMMM, YYYY')}</span></p>
                                        </div>
                                    </div>
                                </div>}

                                <hr />
                                {props.weddingStats.tasksStats && <div className="row">
                                    <div className="col mb-3">
                                        <NavLink to="/couple/vendors" end>
                                            <div className="card">
                                                <div className="card-body p-2 text-center">
                                                    <div style={{ width: 50, height: 50, margin: '0 auto' }}>
                                                        <CircularProgressbar value={props.weddingStats.hiredVendors} maxValue={32} text={`${props.weddingStats.hiredVendors} / 32`} styles={buildStyles({
                                                            trailColor: '#d6d6d6',
                                                            pathColor: '#28a745',
                                                            textColor: '#555555',
                                                        })} />
                                                    </div>
                                                    <small className="mt-2 d-block m-0">
                                                        <strong>Suppliers Hired</strong>
                                                    </small>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                    <div className="col mb-3">
                                        <NavLink to="/couple/vendors" end>
                                            <div className="card">
                                                <div className="card-body p-2 text-center">
                                                    <div style={{ width: 50, height: 50, margin: '0 auto' }}>
                                                        <CircularProgressbar value={props.weddingStats.tasksStats.completedChecklists} maxValue={props.weddingStats.tasksStats.totalChecklists} text={`${props.weddingStats.tasksStats.completedChecklists} / ${props.weddingStats.tasksStats.totalChecklists}`} styles={buildStyles({
                                                            trailColor: '#d6d6d6',
                                                            pathColor: '#28a745',
                                                            textColor: '#555555',
                                                        })} />
                                                    </div>
                                                    <small className="mt-2 d-block m-0">
                                                        <strong>Tasks Completed</strong>
                                                    </small>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                    <div className="col mb-3">
                                        <NavLink to="/couple/vendors" end>
                                            <div className="card">
                                                <div className="card-body p-2 text-center">
                                                    <div style={{ width: 50, height: 50, margin: '0 auto' }}>
                                                        <CircularProgressbar value={props.weddingStats.attendingGuests} maxValue={props.weddingStats.totalGuests * props.weddingStats.totalEvents} text={`${props.weddingStats.attendingGuests} / ${props.weddingStats.totalGuests * props.weddingStats.totalEvents}`} styles={buildStyles({
                                                            trailColor: '#d6d6d6',
                                                            pathColor: '#28a745',
                                                            textColor: '#555555',
                                                        })} />
                                                    </div>
                                                    <small className="mt-2 d-block m-0">
                                                        <strong>Guests Attending</strong>
                                                    </small>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                    <div className="col mb-3">
                                        <NavLink to="/couple/vendors" end>
                                            <div className="card">
                                                <div className="card-body p-2 text-center">
                                                    <div style={{ width: 50, height: 50, margin: '0 auto' }}>
                                                        <CircularProgressbar value={props.weddingStats.seatedGuests} maxValue={props.weddingStats.totalGuests * props.weddingStats.totalEvents} text={`${props.weddingStats.seatedGuests} / ${props.weddingStats.totalGuests * props.weddingStats.totalEvents}`} styles={buildStyles({
                                                            trailColor: '#d6d6d6',
                                                            pathColor: '#28a745',
                                                            textColor: '#555555',
                                                        })} />
                                                    </div>
                                                    <small className="mt-2 d-block m-0">
                                                        <strong>Guests Seated</strong>
                                                    </small>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </div>
                                </div>}
                            </div>
                            <div className="dash-summary-wedsite">
                                <div className="icon-tools icon-tools-wedsite-small">
                                    <span className="ml5">
                                        <strong>From '<span className="text-theme">yes</span>' to '<span className="text-theme">I do,</span>' we've got you covered.</strong>
                                        {/* <strong>Your Wedding Website: </strong>
                                        <span>www.tamilweddingbook.com/web/W39437903</span>
                                        &nbsp;
                                        <a href="#" className="text-theme d-block-md">
                                            <strong>Copy to clipboard</strong>
                                        </a> */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BannerEditProfilesModal ref={bannerEditProfilesModal} onHideModal={hideBannerEditProfilesModal} app={app} />

            <ImageCropper ref={imageCropperModal} onHideModal={(image, type) => { hideImageCropperModal(image, type) }} id="banner" />

            <ShareWeddingModal ref={shareWeddingModal} onHideModal={hideShareWeddingModal} app={app} />
        </>
    );
}