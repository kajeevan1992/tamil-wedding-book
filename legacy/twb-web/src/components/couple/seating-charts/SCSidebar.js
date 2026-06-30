import React, { useEffect, useRef, useState } from "react";
import InputField from "@components/shared/InputField";
import Tables from "@components/couple/seating-charts/Tables";
import WeddingGuestModal from "@components/couple/guest-list/WeddingGuestModal";

export default function SCSidebar(props) {
    const [searchValue, setSearchValue] = useState('');
    const [searchedGuests, setSearchedGuests] = useState([]);
    useEffect(() => {
        filterGuests();
    }, [searchValue]);

    const filterGuests = () => {
        if (searchValue.length < 1) {
            setSearchedGuests([]);
            return;
        }

        let guests = props.selectedEvent?.eventGuests.filter((guest) => {
            return guest.coupleWeddingGuest.fullName.toLowerCase().includes(searchValue.toLowerCase())
        });

        setSearchedGuests(guests);
    }

    const sidebarRef = useRef(null);
    const [sidebarStatus, setSidebarStatus] = useState(true);
    const toggleSidebar = (status) => {
        sidebarRef.current.style.left = status ? '0' : '-300px';
        props.contentRef.current.style.marginLeft = status ? '300px' : '0';
        setSidebarStatus(status);
    }

    const whichGuests = () => {
        let guests = [];
        if (searchValue.length > 0) {
            guests = searchedGuests;
        } else {
            guests = props.selectedEvent?.eventGuests;
        }

        return guests;
    }

    const weddingGuestModal = useRef(null);
    const showWeddingGuestModal = (action, guestType, guest = {}) => {
        let guestData = { ...guest };
        // if (action === 'edit' && guestType === 'guest') {
        //     state.selectedFilterCollection.forEach(sfc => {
        //         sfc.guests.forEach(guest => {
        //             if (guest.companionOfId === guestData.id) {
        //                 guestData.companions.push(guest);
        //             }
        //         });
        //     });
        // }

        weddingGuestModal.current.showModal(
            action,
            guestData,
        );
    }
    const hideWeddingGuestModal = (isMajorAction) => {
        weddingGuestModal.current.hideModal();
    }

    const guestAdded = (events, count, guest) => {
        let currentEvent = { ...guest.invitations.find((gi) => gi.coupleWeddingEventId === props.selectedEvent.id) };
        let companions = guest.companions;
        delete guest.invitations;
        delete guest.companions;

        console.log(currentEvent)
        console.log(companions)

        if (currentEvent) {
            currentEvent.coupleWeddingGuest = guest;
            currentEvent.coupleWeddingGuest.companions = [];
            companions.map((c) => {
                let companionEvent = { ...currentEvent };
                companionEvent.coupleWeddingGuest = c;
                companionEvent.coupleWeddingGuestId = c.id;
                currentEvent.coupleWeddingGuest.companions.push(companionEvent);
            });

            props.onGuestCreated(currentEvent);
        }

        console.log(currentEvent);
        // changeFilter(state.selectedFilter);
        // props.onGuestAdded(events, count);
    }

    return (
        <>
            <div className="sc-sidebar" ref={sidebarRef}>
                <button
                    type="button"
                    className={`btn sc-sidebar-btn btn btn-outline-primary bg-white p-1 ${sidebarStatus ? 'visible' : 'in-visible'}`}
                    onClick={() => toggleSidebar(!sidebarStatus)}
                >
                    {sidebarStatus ? <span className="bi bi-chevron-double-left"></span> : <span className="bi bi-chevron-double-right"></span>}
                    {sidebarStatus ? 'Hide' : 'show'}
                </button>

                <div className="p-3 mt-4">
                    <Tables
                        selectedEvent={props.selectedEvent}
                        onTableCreated={(table) => props.onTableCreated(table)}
                        onTableUpdated={(table) => props.onTableUpdated(table)}
                    />
                    <hr className="mb-0" />
                </div>
                <div className="p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <strong>Guests</strong>
                        <button type="button" onClick={() => showWeddingGuestModal('add', 'guest')} className="btn btn-link text-danger p-0 d-flex align-items-center">
                            <span className="bi bi-plus"></span> Guest
                        </button>
                    </div>
                    <div className="mt-1">
                        <InputField
                            type="text"
                            value={searchValue}
                            allBorders={true}
                            selector="search"
                            placeholder="Search guest..."
                            className="w-100 mb-2"
                            mbClassName="mb-0"
                            fieldClassName="py-2 bg-white"
                            onHandleChange={(e) => setSearchValue(e.target.value)}
                            errors={{}}
                        />

                        <div className="sc-guests-wrapper" style={{ height: `${Number(props.selectedEvent.seatingChartWindowHeight) - 250}px` }}>
                            <ul className="list-group list-group-flush">
                                {whichGuests()?.map((guest, guestIndex) => {
                                    return (
                                        <React.Fragment key={`main-${guestIndex}`}>
                                            <li className={`list-group-item px-0 py-1 d-flex justify-content-between ${guest.coupleWeddingGuest?.companions?.length ? 'pb-10px' : ''}`} key={`guest-${guestIndex}-${guest.id}`}>
                                                <div
                                                    id={`guestId-${guest.coupleWeddingGuest.id}`}
                                                    className="sc-guest"
                                                    draggable={true}
                                                    onDragStart={(event) => props.onGuestDrag(event)}
                                                    onMouseEnter={() => props.onSetIsMoveable(true)}
                                                    onMouseLeave={() => props.onSetIsMoveable(false)}
                                                    onDragEnd={(event) => props.onGuestDragEnd(event)}
                                                >
                                                    <span className="bi bi-person-circle"></span>
                                                    <small>{guest.coupleWeddingGuest.fullName}</small>
                                                </div>
                                            </li>
                                            {guest.coupleWeddingGuest?.companions?.map((companion, companionIndex) => <li className="list-group-item px-0 py-1 d-flex justify-content-between companion-list p-10px" key={`guest-companion-${companionIndex}-${companion.id}`}>
                                                <span className="bi bi-link companion-icon"></span>
                                                <div
                                                    id={`guestId-${companion.coupleWeddingGuest.id}`}
                                                    className="sc-guest"
                                                    draggable={true}
                                                    onDragStart={(event) => props.onGuestDrag(event)}
                                                    onMouseEnter={() => props.onSetIsMoveable(true)}
                                                    onMouseLeave={() => props.onSetIsMoveable(false)}
                                                    onDragEnd={(event) => props.onGuestDragEnd(event)}
                                                >
                                                    <span className="bi bi-person-circle"></span>
                                                    <small>{companion.coupleWeddingGuest.fullName}</small>
                                                </div>
                                                <ul>
                                                </ul>
                                            </li>)}
                                        </React.Fragment>
                                    );
                                })}
                            </ul>
                            {props.draggingGuest?.status &&
                                <div
                                    className="sc-drop-guest-area"
                                    style={{ height: `${Number(props.selectedEvent.seatingChartWindowHeight) + 100}px` }}
                                    onDrop={(event) => props.onUnSeatGuest(event)}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <span className="bi bi-x-circle"></span> &nbsp; Un seat
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <WeddingGuestModal
                app={props.app}
                inviteByLinkUrl={props.inviteByLinkUrl}
                ref={weddingGuestModal}
                onHideModal={(isMajorAction = false) => hideWeddingGuestModal(isMajorAction)}
                weddingEvents={props.weddingEvents}
                selectedEvent={props.selectedEvent}
                onGuestAdded={(events, count, guest) => guestAdded(events, count, guest)}
                onMajorAction={() => { }}
                onCompanionDeleted={(guest) => { }}
            />
        </>
    );
}