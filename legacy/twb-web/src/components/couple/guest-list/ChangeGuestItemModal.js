import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "@utilities/Modal";
import { isEmpty } from '@utilities/ValidateUtil';
import Select from "react-select";
import { selectColorStyles } from "@utilities/CommonUtil";

const ChangeGuestItemModal = forwardRef((props, ref) => {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState(null);
    const [item, setItem] = useState(null);
    const [errors, setErrors] = useState({});
    const itemsRef = useRef([]);

    let modal = null;

    useImperativeHandle(ref, () => ({
        showModal(name, itemList) {
            modal = new Modal('#changeGuestItemModal', {
                backdrop: true
            });

            setItemName(name);
            setItems(itemList);
            setErrors({});

            modal.show();
        },
        hideModal() {
            modal = new Modal('#changeGuestItemModal', {
                backdrop: true
            });

            itemsRef.current.clearValue();
            modal.hide();
        },
    }));

    const onSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        let errors = {};
        let validationFlag = true;

        if (item?.id == null || isEmpty(item.id)) {
            validationFlag = false;
            errors.id = ['Selection is required'];
        }

        if (!validationFlag) {
            setErrors(errors);
        } else {
            props.onItemSelected(itemName, item.id);
        }
    }

    return (
        <>
            <div className="modal fade" id="changeGuestItemModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="changeGuestItemModal">
                <div className="modal-dialog couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">Change {itemName} of selected guests</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    <form
                                        className="auth-register-form col-12"
                                        action="#"
                                        method="POST"
                                        onSubmit={onSubmit}
                                    >
                                        <div className="mb-4">
                                            <label className="text-capitalize">{itemName}</label>
                                            <Select
                                                ref={itemsRef}
                                                className="select-theme-border filter"
                                                styles={selectColorStyles}
                                                isClearable={true}
                                                isSearchable={true}
                                                placeholder="Choose"
                                                value={item}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                onChange={(option) => setItem(option)}
                                                options={items?.map((opt) => ({ id: opt.id, name: opt.name }))}
                                            />
                                            {
                                                errors.id &&
                                                <div className="invalid-feedback">
                                                    {errors.id[0]}
                                                </div>
                                            }
                                        </div>

                                        <hr />
                                        <div className="d-flex justify-content-end">
                                            <button type="button" onClick={props.onHideModal} className="btn btn-warning btn-sm mr-2">Cancel</button>
                                            <button type="submit" className="btn btn-primary btn-sm"><span className="bi bi-arrow-left-right"></span> Change</button>
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

export default ChangeGuestItemModal;