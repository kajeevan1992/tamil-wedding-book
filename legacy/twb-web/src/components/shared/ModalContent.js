export default function ModalContent(props) {
    return (
        <>
            <div className="modal fade" id={props.id} data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby={`${props.id}Label`} >
                <div className={`modal-dialog couple-dashboard-step-modal ${props.className ? props.className : ''}`}>
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title">{props.title}</div>
                            <button className="btn p-0" onClick={props.onHide}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {props.body}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}