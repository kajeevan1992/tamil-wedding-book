import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import InputField from "@components/shared/InputField";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from "react-redux";
import * as validateUtil from '@utilities/ValidateUtil';
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import { statusMessages } from "@utilities/CommonUtil";

const MenuActionModal = forwardRef((props, ref) => {
	const [state, setState] = useState({
		menu: {},
		action: 'create',
		errors: {},
	});




	let modal = null;
	const dispatch = useDispatch();

	useImperativeHandle(ref, () => ({
		showModal(action, menu) {
			modal = new Modal('#createMenuModal', {
				backdrop: true
			});

			setState((currentState) => ({
				...currentState,
				menu: action === 'edit' ? menu : {
					name: '',
					description: '',
					price: ''
				},

				action: action,
			}));




			modal.show();
		},
		hideModal() {
			modal = new Modal('#createMenuModal', {
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
			menu: {
				...currentState.menu,
				[name]: value,
			}
		}));
	}

	const handleSearchChange = (selected, type) => {
		setState((currentState) => ({
			...currentState,
			menu: {
				...currentState.menu,
				[type]: selected,
			}
		}));
	}

	const attachImage = (e, type) => {
		setState((currentState) => ({
			...currentState,
			menu: {
				...currentState.menu,
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

		if (validateUtil.isEmpty(state.menu.name)) {
			validationFlag = false;
			errors.name = ['Name is required'];
		} else if (validateUtil.isGreaterThan(state.menu.name, 255)) {
			validationFlag = false;
			errors.name = ['Name must not be greater than 255 characters!'];
		}
		if (validateUtil.isEmpty(state.menu.price)) {
			validationFlag = false;
			errors.price = ['Price is required'];
		}

		if (validateUtil.isEmpty(state.menu.description)) {
			validationFlag = false;
			errors.description = ['Description is required'];
		} else if (validateUtil.isLessThan(state.menu.description, 10)) {
			validationFlag = false;
			errors.description = ['Description must be at leas 10 characters long!'];
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
			for (const key in state.menu) {
				formData.append(key, state.menu[key]);
			}

			if (state.action === 'create') {
				formData.append('vendorId', props.app.profile.vendor.id);
				response = await vendorService.createMenu(formData);
				props.onMenuCreated(response.data.menu);
			} else {
				response = await vendorService.updateMenu(state.menu.id, formData);
				props.onMenuUpdated(response.data.menu);
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
			<div className="modal fade" id="createMenuModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="createMenuModal">
				<div className="modal-dialog modal-lg couple-dashboard-step-modal">
					<div className="modal-content">
						<div className="modal-header fs-16px">
							<div className="modal-title text-capitalize">{state.action} Menu</div>
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
													<div className="col-md-12">
														<div className="row">
															<div className="col-md-12">
																<InputField
																	mbClassName="mb-3"
																	type="text"
																	selector="name"
																	value={state.menu.name}
																	placeholder="Name"
																	onHandleChange={handleInputChange}
																	allBorders={true}
																	errors={state.errors}
																/>
															</div>


															<div className="col-md-12 mb-3">
																<ReactQuill
																	theme="snow"
																	value={state.menu.description}
																	onChange={(value) => {
																		setState((currentState) => ({
																			...currentState,
																			menu: {
																				...currentState.menu,
																				description: value,
																			}
																		}));
																	}}
																	className="ql-container-h250px" placeholder="Menu Description..."
																/>
																{
																	state.errors.description &&
																	<div className="invalid-feedback">
																		{state.errors.description[0]}
																	</div>
																}
															</div>
															<div className="col-md-12">
																<InputField
																	mbClassName="mb-3"
																	type="number"
																	selector="price"
																	value={state.menu.price}
																	placeholder="Price"
																	onHandleChange={handleInputChange}
																	allBorders={true}
																	errors={state.errors}
																/>
															</div>
														</div>
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

export default MenuActionModal;