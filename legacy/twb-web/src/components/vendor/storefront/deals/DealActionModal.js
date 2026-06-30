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

const DealActionModal = forwardRef((props, ref) => {
	const [state, setState] = useState({
		deal: {},
		timeOptions: [],
		dealTypeOptions: [],
		action: 'create',
		errors: {},
	});

	const dealTypeRef = useRef('');


	let modal = null;
	const dispatch = useDispatch();

	useImperativeHandle(ref, () => ({
		showModal(action, deal) {
			modal = new Modal('#createDealModal', {
				backdrop: true
			});

			setState((currentState) => ({
				...currentState,
				deal: action === 'edit' ? deal : {
					name: '',
					type: '',
					validity: '',
					discount: '',
					description: '',
					image: ''
				},
				dealTypeOptions: ['Late Availability', 'Offer', 'Discount'
				].map((opt) => ({ label: opt, name: opt })),
				action: action,
			}));

			if (action === 'edit') {
				dealTypeRef.current.setValue({ label: deal.type, name: deal.type });

			} else {
				dealTypeRef.current.clearValue();
			}


			modal.show();
		},
		hideModal() {
			modal = new Modal('#createDealModal', {
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
			deal: {
				...currentState.deal,
				[name]: value,
			}
		}));
	}

	const handleSearchChange = (selected, type) => {
		setState((currentState) => ({
			...currentState,
			deal: {
				...currentState.deal,
				[type]: selected,
			}
		}));
	}

	const attachImage = (e, type) => {
		setState((currentState) => ({
			...currentState,
			deal: {
				...currentState.deal,
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

		if (validateUtil.isEmpty(state.deal.name)) {
			validationFlag = false;
			errors.name = ['Name is required'];
		} else if (validateUtil.isGreaterThan(state.deal.name, 255)) {
			validationFlag = false;
			errors.name = ['Name must not be greater than 255 characters!'];
		}

		if (validateUtil.isEmpty(state.deal.type)) {
			validationFlag = false;
			errors.type = ['Type is required'];
		}

		if (state.deal.type === 'Discount' && validateUtil.isEmpty(state.deal.discount)) {
			validationFlag = false;
			errors.discount = ['Discount is required'];
		}

		if (validateUtil.isEmpty(state.deal.validity)) {
			validationFlag = false;
			errors.validity = ['Validity Date is required'];
		}

		if (validateUtil.isEmpty(state.deal.description)) {
			validationFlag = false;
			errors.description = ['Description is required'];
		} else if (validateUtil.isLessThan(state.deal.description, 10)) {
			validationFlag = false;
			errors.description = ['Description must be at leas 10 characters long!'];
		}

		// if (validateUtil.isEmpty(state.deal.image)) {
		// 	validationFlag = false;
		// 	errors.image = ['Image is required'];
		// }

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
			for (const key in state.deal) {
				formData.append(key, state.deal[key]);
			}

			if (state.action === 'create') {
				formData.append('vendorId', props.app.profile.vendor.id);
				response = await vendorService.createDeal(formData);
				props.onDealCreated(response.data.deal);
			} else {
				response = await vendorService.updateDeal(state.deal.id, formData);
				props.onDealUpdated(response.data.deal);
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
			<div className="modal fade" id="createDealModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="createDealModal">
				<div className="modal-dialog modal-lg couple-dashboard-step-modal">
					<div className="modal-content">
						<div className="modal-header fs-16px">
							<div className="modal-title text-capitalize">{state.action} Deal</div>
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
													<div className="col-md-7">
														<div className="row">
															<div className="col-md-12">
																<InputField
																	mbClassName="mb-3"
																	type="text"
																	selector="name"
																	value={state.deal.name}
																	placeholder="Name"
																	onHandleChange={handleInputChange}
																	allBorders={true}
																	errors={state.errors}
																/>
															</div>
															<div className="col-md-12">
																<div className="mb-3">
																	<Select
																		ref={dealTypeRef}
																		className="z-index-1000"
																		isClearable={true}
																		isSearchable={true}
																		placeholder="Deal Type"
																		name="type"
																		defaultValue={state.deal.type}
																		// value={state.deal.type}
																		getOptionLabel={(option) => option.label}
																		getOptionValue={(option) => option.name}
																		onChange={(option) => { handleSearchChange(option !== null ? option.name : '', 'type') }}
																		options={state.dealTypeOptions}
																	/>
																	{
																		state.errors.type &&
																		<div className="invalid-feedback">
																			{state.errors.type[0]}
																		</div>
																	}
																</div>
															</div>
															{state.deal.type === 'Discount' && <div className="col-md-12">
																<InputField
																	mbClassName="mb-3"
																	type="number"
																	selector="discount"
																	value={state.deal.discount}
																	placeholder="Discount Price"
																	onHandleChange={handleInputChange}
																	allBorders={true}
																	errors={state.errors}
																/>
															</div>}
															<div className="col-md-12">
																<div className="mb-3">
																	<InputFieldDate
																		selected={state.action === 'edit' ? convertDateToObject(state.deal.validity) : state.deal.validity}
																		selector="validity"
																		format="yyyy-MM-dd"
																		onHandleChange={(date) => {
																			setState((currentState) => ({
																				...currentState,
																				deal: {
																					...currentState.deal,
																					validity: date,
																				}
																			}));
																		}}
																		placeholder="Valid until"
																		allBorders={true}
																		errors={state.errors}
																	/>
																</div>
															</div>
															<div className="col-md-12">
																<ReactQuill
																	theme="snow"
																	value={state.deal.description}
																	onChange={(value) => {
																		setState((currentState) => ({
																			...currentState,
																			deal: {
																				...currentState.deal,
																				description: value,
																			}
																		}));
																	}}
																	className="ql-container-h250px" placeholder="Deal Description..."
																/>
																{
																	state.errors.description &&
																	<div className="invalid-feedback">
																		{state.errors.description[0]}
																	</div>
																}
															</div>
														</div>
													</div>
													<div className="col-md-5">
														<div className="card">
															<div className="card-body d-flex flex-column align-items-center justify-content-center">
																{state.deal.image ? <img
																	className="block app-tools-main-front-img dash-img"
																	src={state.deal.image && state.deal.image.name ? URL.createObjectURL(state.deal.image) : props.app.serverPath + state.deal.image}
																	alt="Deal Image"
																/> : <i className="bi bi-images fs-6rem"></i>}
																<label
																	htmlFor="dealImage"
																	className="btn btn-primary btn-sm mt-3">
																	Add cover image
																</label>
																{
																	state.errors.image &&
																	<div className="invalid-feedback text-center">
																		{state.errors.image[0]}
																	</div>
																}
																<input type="file" accept="image/*" id="dealImage" className="hidden" onChange={(e) => attachImage(e, 'image')} />
															</div>
														</div>
														<p className="mb-0 mt-2">*Collages, photos with watermarks, contact details and illustrations cannot be published</p>
													</div>
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

export default DealActionModal;