import React, { forwardRef, useImperativeHandle } from "react";
import { Modal } from "@utilities/Modal";
import ChecklistFilters from '@components/couple/checklist/Filters';

const ChecklistFiltersModal = forwardRef((props, ref) => {
    let modal = null;

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#checklistFiltersModal', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#checklistFiltersModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    return (
        <>
            <div className="modal fade" id="checklistFiltersModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="checklistFiltersModalLabel">
                <div className="modal-dialog modal-lg couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">Filters</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="px-3">
                                <ChecklistFilters state={props.state} addFilter={props.addFilter} removeFilter={props.removeFilter} />
                            </div>
                            <div className="row mt-4">
                                <div className="col-12 text-center">
                                    <hr />
                                    <div className="py-2">
                                        <button type="button" onClick={() => props.onHideModal()} className="btn btn-primary btn-sm">Done</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ChecklistFiltersModal;