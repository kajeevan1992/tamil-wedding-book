import { useRef } from "react";
import WeddingEventModal from "@components/couple/guest-list/WeddingEventModal";
import { deleteEvent } from "@services/CoupleService";
import { statusMessages } from "@utilities/CommonUtil";
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";

export default function GuestListEvents(props) {
    const weddingEventModal = useRef(null);
    const showWeddingEventModal = (displayOrder, action, event = {}) => {
        weddingEventModal.current.showModal(
            props.app.profile.couple.id,
            displayOrder,
            action,
            event
        );
    }
    const hideWeddingEventModal = () => {
        weddingEventModal.current.hideModal();
    }

    const dispatch = useDispatch();
    const removeEvent = async (event) => {
        if (!window.confirm(`Are you sure you want to delete ${event.name}?`)) {
            return;
        }
        try {
            dispatch(toggleLoading(true));
            const { data } = await deleteEvent(event.id);
            toast.success(data.message);
            props.onEventDeleted(event.id);
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    return (
        <>
            <div className="col-md-12">
                {props.selectedEvent.id > 0 && <button
                    type="button"
                    onClick={() => props.onSelectEvent({ id: 0 })}
                    className="btn p-0 btn-lg m-0"
                >
                    <i className="bi bi-arrow-left text-theme"></i> Back
                </button>}
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0 fw-600">{props.selectedEvent.name}</h3>
                    {props.app.profile.id && props.selectedEvent.id === 0 && <button type="button" className="btn btn-sm btn-primary mx-1" onClick={() => showWeddingEventModal(props.weddingEvents.length + 1, 'add')}>
                        <span><span className="bi bi-plus-lg"></span> Event</span>
                    </button>}
                    {props.selectedEvent.id > 0 && <button type="button" className="btn btn-sm btn-outline-primary mx-1" onClick={() => showWeddingEventModal(props.selectedEvent.displayOrder, 'edit', props.selectedEvent)}>
                        <span><span className="bi bi-pencil"></span> Event Setting</span>
                    </button>}
                </div>
            </div>

            <div className="col-md-12 mt-4">
                {props.selectedEvent.id === 0 && <div className="row">
                    {props.weddingEvents.map((event, index) => {
                        return (<div className="col-md-4 mb-3" key={`event-list-${index}`}>
                            <div className="card">
                                <div className="card-body d-flex justify-content-between">
                                    <div className="d-flex justify-content-between align-items-center" key={`card-stats-${index}`}>
                                        <div className="mr-3 h-sm">
                                            {event.image ? <img
                                                src={`/assets/images/events/${event.image}`}
                                                className="w-100"
                                            /> : <img
                                                src={`/assets/images/events/event.png`}
                                                className="w-100"
                                            />}
                                        </div>
                                        <div className="mt-1">
                                            <h5>{event.name}</h5>
                                            <div className="d-flex justify-content-between">
                                                <div className="mx-2">
                                                    <h3 className="mb-0">{event.stats.totalGuests}</h3>
                                                    Guests
                                                </div>
                                                <div className="mx-2">
                                                    <small className="block-lh-14px">
                                                        <strong className="text-success">{event.stats.confirmed}</strong> Confirmed <br />
                                                        <strong className="text-warning">{event.stats.pending}</strong> Pending <br />
                                                        <strong className="text-danger">{event.stats.declined}</strong> Declined
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-6">
                                            <button type="button" onClick={() => props.onSelectEvent(event)} className="btn btn-outline-primary btn-sm w-100">View</button>
                                        </div>
                                        <div className="col-6 text-right">
                                            <button type="button" onClick={() => removeEvent(event)} className="btn btn-outline-danger btn-sm">
                                                <span className="bi bi-trash"></span>
                                            </button> &nbsp;
                                            <button type="button" onClick={() => showWeddingEventModal(event.displayOrder, 'edit', event)} className="btn btn-outline-info btn-sm">
                                                <span className="bi bi-pencil"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>);
                    })}
                </div>}
                {props.selectedEvent.id > 0 && <div className="card">
                    <div className="card-body d-flex justify-content-between sm-block-100">
                        <div className="d-flex justify-content-between align-items-center sm-block-100">
                            <div className="mr-3 h-sm">
                                {props.selectedEvent.image ? <img
                                    src={`/assets/images/events/${props.selectedEvent.image}`}
                                    className="w-100"
                                /> : <img
                                    src={`/assets/images/events/event.png`}
                                    className="w-100"
                                />}
                            </div>
                            <div className="mt-1">
                                <div className="d-flex justify-content-between">
                                    <div className="mx-2">
                                        <h3 className="mb-0">{props.selectedEvent.stats.totalGuests}</h3>
                                        Guests
                                    </div>
                                    <div className="mx-2">
                                        <small className="block-lh-14px">
                                            <strong className="text-success">{props.selectedEvent.stats.confirmed}</strong> Confirmed <br />
                                            <strong className="text-warning">{props.selectedEvent.stats.pending}</strong> Pending <br />
                                            <strong className="text-danger">{props.selectedEvent.stats.declined}</strong> Declined
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {props.selectedEvent.coupleWeddingEventLists?.length > 0 && < div className="d-flex justify-content-between align-items-center">
                            <div className="mr-3 h-sm">
                                <img src="/assets/images/events/guest-list.png"
                                    className="w-100"
                                    alt="Guest List"
                                />
                            </div>
                            <div className="mt-1 sm-w-100">
                                <div className="c-grid lh-14px w-125px list-stats">
                                    {props.selectedEvent.coupleWeddingEventLists.map((list, index) => {
                                        return (list.id && <small className="c-grid-col" key={`wel-${index}`}>
                                            {list.name}: &nbsp;<strong>{list.totalListedGuests > 0 ? list.totalListedGuests : 0}</strong><br />
                                        </small>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>}
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="mr-3 h-sm">
                                <img
                                    src="/assets/images/events/event-table.png"
                                    className="w-100"
                                    alt="Event Table"
                                />
                            </div>
                            <div className="mt-1 sm-w-100">
                                <div className="d-flex justify-content-between sm-flex-center">
                                    <div className="mx-2 text-center lh-14px">
                                        <strong>{props.selectedEvent.stats.totalSeatedGuests ?? 0}</strong> Guests Seated <br />
                                        <button className="btn btn-sm p-0 text-theme fs-12px">Arrange Seating</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>

            <WeddingEventModal
                app={props.app}
                ref={weddingEventModal}
                groups={props.weddingGroups}
                menus={props.weddingMenus}
                lists={props.weddingLists}
                tables={props.weddingTables}
                onEventAction={(action, event) => props.onEventAction(action, event)}
                onHideModal={hideWeddingEventModal}
            />
        </>
    );
}