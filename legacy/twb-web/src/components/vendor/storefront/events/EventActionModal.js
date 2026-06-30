import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Modal } from "@utilities/Modal";
import InputField from "@components/shared/InputField";
import InputFieldDate from "@components/shared/InputFieldDate";
import Select from "react-select";
import MapView from "@components/shared/MapView";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { timeOptions } from '@utilities/CommonUtil'
import { useDispatch } from "react-redux";
import * as validateUtil from '@utilities/ValidateUtil';
import { formatDate, convertDateToObject } from '@utilities/CommonUtil';
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import { statusMessages } from "@utilities/CommonUtil";

const EventActionModal = forwardRef((props, ref) => {
	const [state, setState] = useState({
		event: {},
		timeOptions: [],
		eventTypeOptions: [],

		action: 'create',
		errors: {},
	});

	const eventTypeRef = useRef('');
	const eventStartTimeRef = useRef('');
	const eventEndTimeRef = useRef('');

	let modal = null;
	const dispatch = useDispatch();

	useImperativeHandle(ref, () => ({
		showModal(action, event) {
			modal = new Modal('#createEventModal', {
				backdrop: true
			});

			setState((currentState) => ({
				...currentState,
				event: action === 'edit' ? event : {
					name: '',
					type: '',
					startDate: '',
					startTime: '',
					endDate: '',
					endTime: '',
					address: "Sydney, Australia",
					lng: "33.8688",
					lat: "151.2093",
					description: '',
					image: ''
				},
				eventTypeOptions: ['Open Door', 'Inauguration', 'Contest', 'Parade', 'Concert', 'Course', 'Exposition', 'Raffle'
				].map((opt) => ({ label: opt, name: opt })),
				timeOptions: timeOptions([{ label: 'All Day', name: 'All Day' }]),
				action: action,
			}));

			if (action === 'edit') {
				eventTypeRef.current.setValue({ label: event.type, name: event.type });
				eventStartTimeRef.current.setValue({ label: event.startTime, name: event.startTime });
				eventEndTimeRef.current.setValue({ label: event.endTime, name: event.endTime });
			} else {
				eventTypeRef.current.clearValue();
				eventStartTimeRef.current.setValue();
				eventEndTimeRef.current.setValue();
			}


			modal.show();
		},
		hideModal() {
			modal = new Modal('#createEventModal', {
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
			event: {
				...currentState.event,
				[name]: value,
			}
		}));
	}

	const handleSearchChange = (selected, type) => {
		setState((currentState) => ({
			...currentState,
			event: {
				...currentState.event,
				[type]: selected,
			}
		}));
	}

	const attachImage = (e, type) => {
		setState((currentState) => ({
			...currentState,
			event: {
				...currentState.event,
				[type]: e.target.files[0],
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

		if (validateUtil.isEmpty(state.event.name)) {
			validationFlag = false;
			errors.name = ['Name is required'];
		} else if (validateUtil.isGreaterThan(state.event.name, 255)) {
			validationFlag = false;
			errors.name = ['Name must not be greater than 255 characters!'];
		}

		if (validateUtil.isEmpty(state.event.type)) {
			validationFlag = false;
			errors.type = ['Type is required'];
		}

		if (validateUtil.isEmpty(state.event.startDate)) {
			validationFlag = false;
			errors.startDate = ['Start Date is required'];
		}

		if (validateUtil.isEmpty(state.event.startTime)) {
			validationFlag = false;
			errors.startTime = ['Start Time is required'];
		}

		if (validateUtil.isEmpty(state.event.endDate)) {
			validationFlag = false;
			errors.endDate = ['End Date is required'];
		}

		if (validateUtil.isEmpty(state.event.endTime)) {
			validationFlag = false;
			errors.endTime = ['End Time is required'];
		}

		if (validateUtil.isEmpty(state.event.address)) {
			validationFlag = false;
			errors.address = ['Location is required'];
		}

		if (validateUtil.isEmpty(state.event.description)) {
			validationFlag = false;
			errors.description = ['Description is required'];
		} else if (validateUtil.isLessThan(state.event.description, 25)) {
			validationFlag = false;
			errors.description = ['Description must be at leas 25 characters long!'];
		}

		if (validateUtil.isEmpty(state.event.image)) {
			validationFlag = false;
			errors.image = ['Image is required'];
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

			let response;
			let formData = new FormData();
			for (const key in state.event) {
				formData.append(key, state.event[key]);
			}

			if (state.action === 'create') {
				formData.append('vendorId', props.app.profile.vendor.id);
				response = await vendorService.createEvent(formData);
				props.onEventCreated(response.data.event);
			} else {
				response = await vendorService.updateEvent(state.event.id, formData);
				props.onEventUpdated(response.data.event);
			}

			dispatch(toggleLoading(false));
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
			<div className="modal fade" id="createEventModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="createEventModal">
				<div className="modal-dialog modal-lg couple-dashboard-step-modal">
					<div className="modal-content">
						<div className="modal-header fs-16px">
							<div className="modal-title text-capitalize">{state.action} Event</div>
							<button className="btn p-0" onClick={props.onHideModal}>
								<span className="bi bi-x-lg"></span>
							</button>
						</div>
						<div className="modal-body w-100">
							<div className="row mr-0 ml-0 w-100">
								<div className="col-12 w-100 d-flex justify-content-center">
									<form className="auth-register-form" action="#" method="POST" onSubmit={onSubmit}>
										<div className="row">
											<div className="col-md-12 pb-3">
												<div className="row">
													<div className="col-md-8">
														<InputField
															mbClassName="mb-3"
															type="text"
															selector="name"
															value={state.event.name}
															placeholder="Name"
															onHandleChange={handleInputChange}
															allBorders={true}
															errors={state.errors}
														/>
													</div>
													<div className="col-md-4">
														<div className="mb-3">
															<Select
																ref={eventTypeRef}
																className="z-index-1000"
																isClearable={true}
																isSearchable={true}
																placeholder="Event Type"
																name="type"
																defaultValue={state.event.type}
																// value={state.event.type}
																getOptionLabel={(option) => option.label}
																getOptionValue={(option) => option.name}
																onChange={(option) => { handleSearchChange(option !== null ? option.name : '', 'type') }}
																options={state.eventTypeOptions}
															/>
															{
																state.errors.type &&
																<div className="invalid-feedback">
																	{state.errors.type[0]}
																</div>
															}
														</div>
													</div>
												</div>
												<div className="row">
													<div className="col-md-3">
														<div className="mb-3">
															<InputFieldDate
																selected={state.action === 'edit' ? convertDateToObject(state.event.startDate) : state.event.startDate}
																selector="startDate"
																format="yyyy-MM-dd"
																onHandleChange={(date) => {
																	setState((currentState) => ({
																		...currentState,
																		event: {
																			...currentState.event,
																			startDate: date,
																		}
																	}));
																}}
																placeholder="Start Date"
																allBorders={true}
																errors={state.errors}
															/>
														</div>
													</div>
													<div className="col-md-3">
														<div className="mb-3">
															<Select
																ref={eventStartTimeRef}
																className="select-theme-border"
																isClearable={true}
																isSearchable={true}
																placeholder="Start At"
																defaultValue={state.event.startTime}
																getOptionLabel={(option) => option.label}
																getOptionValue={(option) => option.name}
																onChange={(option) => { handleSearchChange(option !== null ? option.name : '', 'startTime') }}
																options={state.timeOptions}
															/>
															{
																state.errors.startTime &&
																<div className="invalid-feedback">
																	{state.errors.startTime[0]}
																</div>
															}
														</div>
													</div>
													<div className="col-md-3">
														<div className="mb-3">
															<InputFieldDate
																selected={state.action === 'edit' ? convertDateToObject(state.event.endDate) : state.event.endDate}
																selector="endDate"
																format="yyyy-MM-dd"
																onHandleChange={(date) => {
																	setState((currentState) => ({
																		...currentState,
																		event: {
																			...currentState.event,
																			endDate: date,
																		}
																	}));
																}}
																placeholder="End Date"
																mbClassName="mb-3"
																allBorders={true}
																errors={state.errors}
															/>
														</div>
													</div>
													<div className="col-md-3">
														<div className="mb-3">
															<Select
																ref={eventEndTimeRef}
																className="select-theme-border"
																isClearable={true}
																isSearchable={true}
																placeholder="End At"
																defaultValue={state.event.endTime}
																getOptionLabel={(option) => option.label}
																getOptionValue={(option) => option.name}
																onChange={(option) => { handleSearchChange(option !== null ? option.name : '', 'endTime') }}
																options={state.timeOptions}
															/>
															{
																state.errors.endTime &&
																<div className="invalid-feedback">
																	{state.errors.endTime[0]}
																</div>
															}
														</div>
													</div>
												</div>
											</div>

											<div className="col-md-12">
												<div className="row">
													<div className="col-md-12">
														<MapView
															searchProps={{
																mbClassName: 'mb-3',
																address: '',
																icon: 'bi bi-geo-alt',
																placeholder: 'Event location',
																selector: 'address',
																inputClass: 'w-400px',
																allBorders: true,
																errors: state.errors
															}}
															onPlaceSelected={(place) => {
																setState((currentState) => ({
																	...currentState,
																	event: {
																		...currentState.event,
																		address: place.formatted_address,
																		lng: place.geometry.location.lng(),
																		lat: place.geometry.location.lat()
																	}
																}));
															}}
														/>
													</div>
												</div>
											</div>
											<div className="col-md-12 mt-5">
												<div className="row">
													<div className="col-md-7">
														<ReactQuill
															theme="snow"
															value={state.event.description}
															onChange={(value) => {
																setState((currentState) => ({
																	...currentState,
																	event: {
																		...currentState.event,
																		description: value,
																	}
																}));
															}}
															className="ql-container-h250px" placeholder="Event Description..."
														/>
														{
															state.errors.description &&
															<div className="invalid-feedback">
																{state.errors.description[0]}
															</div>
														}
													</div>
													<div className="col-md-5">
														<div className="card h-100">
															<div className="card-body d-flex flex-column align-items-center justify-content-center">
																{state.event.image ? <img
																	className="block app-tools-main-front-img dash-img"
																	src={state.event.image && state.event.image.name ? URL.createObjectURL(state.event.image) : props.app.serverPath + state.event.image}
																	alt="Event Image"
																/> : <i className="bi bi-images fs-6rem"></i>}
																<label
																	htmlFor="eventImage"
																	className="btn btn-primary btn-sm mt-3">
																	Add cover image
																</label>
																{
																	state.errors.image &&
																	<div className="invalid-feedback text-center">
																		{state.errors.image[0]}
																	</div>
																}
																<input type="file" accept="image/*" id="eventImage" className="hidden" onChange={(e) => attachImage(e, 'image')} />
															</div>
														</div>

													</div>
												</div>
												<div className="col-md-12">
													<p className="mb-0 mt-2">*Collages, photos with watermarks, contact details and illustrations cannot be published</p>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-12">
												<div className="text-center py-4">
													<input type='submit' name="submit" value={state.action == 'create' ? 'Create' : 'Update'} className="btn btn-primary btn-sm" />
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
});

export default EventActionModal;