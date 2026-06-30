import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import InputField from "@components/shared/InputField";

const ImportClientModal = forwardRef((props, ref) => {
    const [activTab, setactivTab] = useState('all')

    let modal = null;



    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#importClientModal', {
                backdrop: true
            });

            modal.show();
            console.log(';herere')
        },
        hideModal() {
            modal = new Modal('#importClientModal', {
                backdrop: true
            });

            modal.hide();

            console.log(';herere too')

        },
    }));





    const onSubmit = async (e) => {
        e.preventDefault();
        props.onHideModal();

    }



    return (
        <>
            <div className="modal fade" id="importClientModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="importClientLabel" >
                <div className="modal-dialog modal-xl couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-body w-100">
                            <i className="bi bi-x-lg float-right cross-icon" onClick={props.onHideModal}></i>
                            <div className="row mr-0 ml-0 w-100 ">
                                <div className="col-12 pt-4 w-100 d-flex justify-content-center">
                                    <form className="auth-register-form mt-3 w-50" action="#" method="POST" onSubmit={onSubmit}>
                                        <div className="row">
                                            <div className="col-12 mb-3 text-center">
                                                <h3 className="  mt-2 ">
                                                    Add from bookings!
                                                </h3>
                                            </div>
                                            <div className="col-md-12 ">
                                                <div className="mb-4 d-flex align-items-center ">

                                                    <i className="bi bi-search mb-4 mr-3"></i>
                                                    <div className="w-100">
                                                        <InputField
                                                            label=""
                                                            type="text"
                                                            selector="Search"
                                                            value={''}
                                                            placeholder="Search"
                                                            onHandleChange={(e) => { }}
                                                            errors={{}}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-md-12 w-100 d-flex justify-content-center only-b-brdr-grey">
                                                <ul className="nav nav-tabs border-bottom-0 ">
                                                    <li className="active mr-5"><a onClick={() => setactivTab('all')}>All</a></li>
                                                    <li><a onClick={() => setactivTab('bookings')}>Booked</a></li>

                                                </ul>
                                            </div>

                                            <div className="col-md-10 pt-5">
                                                {activTab === "all" ? <div className="mb-4">
                                                    You have no contacts
                                                </div> : <div className="mb-4">
                                                    You have no bookings
                                                </div>}
                                            </div>


                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="text-center py-4">
                                                    <button className="btn btn-primary btn-sm">Add Clients</button>
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

export default ImportClientModal;