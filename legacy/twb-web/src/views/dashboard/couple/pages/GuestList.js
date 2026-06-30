import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { loadGuestsData } from "@services/CoupleService";
import GuestListEvents from "@components/couple/guest-list/Events";
import GuestListGuests from "@components/couple/guest-list/Guests";
import { encryptAsUrl } from "@utilities/CommonUtil";

function GuestList() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();

    useEffect(() => {
        if (app.profile && app.profile.couple) {
            init(app.profile.couple.id);
        }
    }, [app.profile]);

    const [state, setState] = useState({
        selectedEvent: {
            id: 0,
            name: 'Overview',
        },
        weddingEvents: [],
        weddingGroups: [],
        weddingMenus: [],
        weddingLists: [],
        weddingTables: [],
        inviteByLinkUrl: '',

        errors: {}
    });

    function setEventStats(event) {
        let stats = {
            totalGuests: event.coupleWeddingEventGuests.length,
            totalSeatedGuests: event.coupleWeddingEventGuests.filter(guest => guest.coupleWeddingEventTableId !== null).length,
            confirmed: event.coupleWeddingEventGuests.filter(guest => guest.status === 'confirmed').length,
            pending: event.coupleWeddingEventGuests.filter(guest => guest.status === 'pending').length,
            declined: event.coupleWeddingEventGuests.filter(guest => guest.status === 'declined').length,
        };

        event.coupleWeddingEventGuests.forEach(guest => {
            let item = event.coupleWeddingEventLists?.find(item => item.id === guest.coupleWeddingEventListId);
            if (item) {
                item.totalListedGuests ? item.totalListedGuests++ : item.totalListedGuests = 1;
            }
        });

        return {
            ...event,
            stats: stats
        };
    }

    async function init(coupleId, isSelectEvent = false) {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadGuestsData(coupleId);

            let weddingEvents = data.weddingEvents.map(event => setEventStats(event));

            setState((currentState) => ({
                ...currentState,
                weddingEvents: weddingEvents,
                weddingGroups: data.weddingGroups,
                weddingMenus: data.weddingMenus,
                weddingLists: data.weddingLists,
                weddingTables: data.weddingTables,
                inviteByLinkUrl: `${data.inviteByLinkUrl}/${encryptAsUrl({
                    coupleId: app.profile.couple.id,
                    fullName: app.profile.fullName,
                    partnerName: app.profile.couple.weddingDetail.partnerName,
                })}`,
            }));

            if (isSelectEvent) {
                let selectedEvent = weddingEvents.find(we => we.id === state.selectedEvent.id);
                setTimeout(() => {
                    setState((currentState) => ({
                        ...currentState,
                        selectedEvent: selectedEvent,
                    }));
                }, 1000);

                console.log(selectedEvent);
            }



            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }

    const actionEvent = (action, event) => {
        let weddingEvents = state.weddingEvents;
        let weddingEvent = setEventStats(event);

        if (action === 'add') {
            weddingEvents.push(weddingEvent);
        } else {
            let weddingEventIndex = weddingEvents?.findIndex(e => e.id === event.id);
            weddingEvents[weddingEventIndex] = weddingEvent;
        }

        setState((currentState) => ({
            ...currentState,
            weddingEvents: weddingEvents,
        }));
    }

    const deleteEvent = (id) => {
        let weddingEvents = state.weddingEvents;
        weddingEvents = weddingEvents.filter(e => {
            return e.id !== id;
        });

        setState((currentState) => ({
            ...currentState,
            weddingEvents: weddingEvents,
        }));
    }

    const selectEvent = (event) => {
        let selectedEvent = event.id > 0 ? state.weddingEvents.find(we => we.id === event.id) : {
            id: 0,
            name: 'Overview',
        };

        setState((currentState) => ({
            ...currentState,
            selectedEvent: selectedEvent,
        }));
    }

    const guestAdded = (events, count) => {
        let weddingEvents = state.weddingEvents;

        events.forEach(event => {
            let weddingEvent = weddingEvents.find(we => we.id === event.id);
            if (weddingEvent) {
                weddingEvent.stats.totalGuests += count;
                weddingEvent.stats.confirmed += count;
            }
        });

        setState((currentState) => ({
            ...currentState,
            weddingEvents: weddingEvents,
        }));
    }

    const majorAction = async () => {
        init(app.profile.couple.id, true);
    }

    const guestStatusChanged = (prevStatus, status) => {
        let weddingEvents = state.weddingEvents;
        let weddingEvent = weddingEvents.find(we => we.id === state.selectedEvent.id);
        if (weddingEvent) {
            weddingEvent.stats[status.toLowerCase()]++;
            weddingEvent.stats[prevStatus]--;
        }

        setState((currentState) => ({
            ...currentState,
            weddingEvents: weddingEvents,
        }));
    }

    const guestListChanged = (prevList, listId) => {
        let weddingEvents = state.weddingEvents;
        let weddingEvent = weddingEvents.find(we => we.id === state.selectedEvent.id);
        if (weddingEvent) {
            weddingEvent.coupleWeddingEventLists.forEach(el => {
                if (el.id === listId) {
                    el.totalListedGuests ? el.totalListedGuests++ : el.totalListedGuests = 1;
                }

                if (prevList && el.id === prevList) {
                    el.totalListedGuests ? el.totalListedGuests-- : el.totalListedGuests = 0;
                }
            });
        }

        setState((currentState) => ({
            ...currentState,
            weddingEvents: weddingEvents,
        }));
    }

    const guestTableChanged = () => {
        let weddingEvents = state.weddingEvents;
        let weddingEvent = weddingEvents.find(we => we.id === state.selectedEvent.id);
        if (weddingEvent) {
            weddingEvent.stats.totalSeatedGuests++;
        }

        setState((currentState) => ({
            ...currentState,
            weddingEvents: weddingEvents,
        }));
    }

    const guestDeleted = (guest) => {
        let selectedEvent = state.selectedEvent;
        selectedEvent.stats.totalGuests--;
        selectedEvent.stats[guest.status]--;
        if (guest.coupleWeddingEventTableId) {
            selectedEvent.stats.totalSeatedGuests--;
        }

        if (guest.coupleWeddingEventListId) {
            selectedEvent.coupleWeddingEventLists.forEach(el => {
                if (el.id === guest.coupleWeddingEventListId) {
                    el.totalListedGuests ? el.totalListedGuests-- : el.totalListedGuests = 0;
                }
            });
        }

        setState((currentState) => ({
            ...currentState,
            selectedEvent: selectedEvent,
        }));
    }

    return (
        <>
            <div className="container spacer">
                <div className="row">
                    <GuestListEvents
                        app={app}
                        weddingEvents={state.weddingEvents}
                        weddingGroups={state.weddingGroups}
                        weddingMenus={state.weddingMenus}
                        weddingLists={state.weddingLists}
                        weddingTables={state.weddingTables}
                        selectedEvent={state.selectedEvent}
                        onEventDeleted={(id) => deleteEvent(id)}
                        onEventAction={(action, event) => actionEvent(action, event)}
                        onSelectEvent={(event) => selectEvent(event)}
                    />

                    <GuestListGuests
                        app={app}
                        weddingEvents={state.weddingEvents}
                        selectedEvent={state.selectedEvent}
                        inviteByLinkUrl={state.inviteByLinkUrl}
                        onGuestAdded={(events, count) => guestAdded(events, count)}
                        onMajorAction={() => majorAction()}
                        onGuestDeleted={(guest) => guestDeleted(guest)}
                        onGuestStatusChanged={(prevStatus, status) => guestStatusChanged(prevStatus, status)}
                        onGuestListChanged={(prevList, listId) => guestListChanged(prevList, listId)}
                        onGuestTableChanged={() => guestTableChanged()}
                    />
                </div>
            </div>
        </>
    );
}

export default GuestList;