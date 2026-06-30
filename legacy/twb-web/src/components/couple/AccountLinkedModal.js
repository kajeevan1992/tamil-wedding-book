import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";

const AaccountLinkedModal = forwardRef((props, ref) => {
    let modal = null;
    const [partnerName, setPartnerName] = useState('');
    useImperativeHandle(ref, () => ({
        showModal(partnerName) {
            setPartnerName(partnerName);
            modal = new Modal('#accountLinkedModal', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#accountLinkedModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    return (
        <>
            <div className="modal fade" id="accountLinkedModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="accountLinkedModalLabel">
                <div className="modal-dialog couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">Account Linked</div>
                            <button type="button" className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row px-3">
                                <div className="col-12 text-center">
                                    <h5>Your account is now linked with "{partnerName}"</h5>
                                    <p>You can now plan your wedding together!</p>
                                    <p>Everything you modify will be visible for the two of you, It will be much easier. Let's plan your wedding!</p>

                                    <button type="button" className="btn btn-primary btn-sm" onClick={props.onHideModal}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default AaccountLinkedModal;