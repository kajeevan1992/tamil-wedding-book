import '@components/couple/seating-charts/style.css';
import Draggable from 'react-draggable';
import React, { useEffect, useRef, useState } from 'react';
import { toggleLoading } from "@store/AppSlice";
import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";
import SCSidebar from '@components/couple/seating-charts/SCSidebar';
import { ChartActions, EventsAndExport } from '@components/couple/seating-charts/Controls';
import { useDispatch, useSelector } from 'react-redux';
import {
    loadWeddingEvents,
    loadEventTablesAndGuests,
    setTablePosition,
    setGuestSeat,
    unSeatGuest,
    deleteTable,
    // generatePDF,
} from "@services/CoupleService";
import { statusMessages, encryptAsUrl, sortGuestCompanions } from "@utilities/CommonUtil";

import { toast } from 'react-hot-toast';
import { Margin, usePDF } from "react-to-pdf";
import Masonry from 'masonry-layout';
import SCTable from '@components/couple/seating-charts/SCTable';
import SCWindow from '@components/couple/seating-charts/SCWindow';
import SCHeader from '@components/couple/seating-charts/SCHeader';


function SeatingChart() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();

    useEffect(() => {
        if (app.profile && app.profile.couple) {
            init(app.profile.couple.id);
        }
    }, [app.profile]);

    const [state, setState] = useState({
        weddingEvents: [],
        inviteByLinkUrl: '',
        selectedEvent: {},
        draggingSeatedGuest: {},
        generatingPdf: false,
        contentView: 'chart',

        errors: {}
    });

    async function init(coupleId) {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadWeddingEvents(coupleId);

            tryLoadEventTablesAndGuests(data.weddingEvents[0]);

            setState((currentState) => ({
                ...currentState,
                weddingEvents: data.weddingEvents,
                inviteByLinkUrl: `${data.inviteByLinkUrl}/${encryptAsUrl({
                    coupleId: app.profile.couple.id,
                    fullName: app.profile.fullName,
                    partnerName: app.profile.couple.weddingDetail.partnerName,
                })}`,
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }

    const tryLoadEventTablesAndGuests = async (event) => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadEventTablesAndGuests(event.id);

            event.eventTables = data.eventTables;
            event.eventGuests = sortGuestCompanions(data.eventGuests);

            setState((currentState) => ({
                ...currentState,
                selectedEvent: event,
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }

    function remove_highlighting() {
        return document.querySelectorAll(".sc-table-chair").forEach(elem => elem.classList.remove("chair-highlighting"));
    }

    // const targetRef = useRef(null);
    const [isMoveable, setIsMoveable] = useState(false);

    const guestDragging = (event, type = 'un-seated', table = null, chair = null) => {

        //todo use this type or think some other logic like getting if outside of the table area?
        event.target.classList.add('dragging');
        event.dataTransfer.setData("text", event.target.id);

        if (type === 'seated') {
            setState((currentState) => ({
                ...currentState,
                draggingSeatedGuest: {
                    status: true,
                    table: table,
                    chair: chair,
                }
            }));
        }

        console.log('guest dragging');
        console.log(type, table, chair)
    }

    const guestDraggingEnd = (event, type = 'un-seated') => {
        // console.log('guest draging end');
        // console.log(draggingGuest);
        if (type === 'seated' && state.draggingSeatedGuest?.status) {
            setState((currentState) => ({
                ...currentState,
                draggingSeatedGuest: {
                    ...currentState.draggingSeatedGuest,
                    status: false,
                }
            }));
        }
        event.target.classList.remove('dragging');
    }

    const allowGuestDrop = (event) => {
        event.preventDefault();
        if (event.target.closest("div").className === "sc-table-chair") {
            event.target.closest("div.sc-table-chair").classList.add("chair-highlighting");
        }
    }

    const dropChoiceChanged = (event, chair = null) => {
        console.log('drag leave')

        // setIsMoveable(false);
        remove_highlighting();
    }

    const guestSeated = (event, table, chair) => {
        event.preventDefault();
        setIsMoveable(false);

        if (event.currentTarget.innerHTML.trim() === '') {
            let data = event.dataTransfer.getData('text');
            // event.currentTarget.appendChild(document.getElementById(data));
            trySetGuestSeat(parseInt(data.split('-')[1]), table, chair);
        }

        remove_highlighting();
    }

    const trySetGuestSeat = async (guestId, table, chair) => {
        try {
            dispatch(toggleLoading(true));
            const request = encryptAsUrl({
                eventId: state.selectedEvent.id,
                guestId: guestId,
                tableId: table.id,
                chairId: chair.id,
            });

            const { data } = await setGuestSeat({ request });

            let selectedEvent = state.selectedEvent;
            let eventTable = selectedEvent?.eventTables?.find((t) => t.id === table.id);
            let tableChair = eventTable?.coupleWeddingEventTableChairs?.find((c) => c.id === chair.id);
            if (tableChair) {
                tableChair.coupleWeddingGuest = data.guest;
                let seatedGuest = state.draggingSeatedGuest;
                if (seatedGuest.table) {
                    let prevTable = selectedEvent?.eventTables?.find((t) => t.id === seatedGuest.table.id);
                    let prevTableChair = prevTable?.coupleWeddingEventTableChairs?.find((c) => c.id === seatedGuest.chair.id);
                    if (prevTableChair) {
                        prevTableChair.coupleWeddingGuest = null;
                    }
                }
            }

            let egIndex = selectedEvent?.eventGuests?.findIndex((eg) => eg.coupleWeddingGuest.id === data.guest.id);
            if (egIndex >= 0) {
                let companions = selectedEvent?.eventGuests[egIndex]?.coupleWeddingGuest?.companions;
                console.log('companions');
                console.log(companions);
                companions = (companions && companions.length > 0) ? companions : [];
                selectedEvent.eventGuests.splice(egIndex, 1, ...companions);
            } else {
                selectedEvent.eventGuests.map((eg) => {
                    eg.coupleWeddingGuest.companions = eg?.coupleWeddingGuest?.companions?.filter((egc) => egc.coupleWeddingGuest.id !== data.guest.id);
                });
            }

            setState((currentState) => ({
                ...currentState,
                selectedEvent: selectedEvent,
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            console.log('error', error)
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    const eventLogger = (e, data) => {
        console.log('Event: ', e);
        console.log('Data: ', data);
    };

    const handleDraggableStart = (event) => {
        // console.log('handleDraggableStart');
        // console.log(event);
    }

    const handleDraggableDrag = (event) => {
        // console.log('handleDrag');
        // console.log(event);
        setIsMoveable(true);
    }

    const handleDraggableStop = (event, data, table) => {
        // console.log('handleDraggableStop');
        // console.log(data.x, data.y);
        trySetTablePosition(table, data);
        setIsMoveable(false);
    }

    const trySetTablePosition = async (table, posData) => {
        try {
            let newPosition = { x: posData.x, y: posData.y };
            if (JSON.stringify(table.position) === JSON.stringify(newPosition)) {
                return;
            }

            dispatch(toggleLoading(true));
            const request = {
                tableId: table.id,
                position: newPosition
            }

            console.log(request)
            const { data } = await setTablePosition(request);
            table.position = data.position;

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    const tryUnSeatGuest = async (event) => {
        console.log('tryUnSeatGuest')
        console.log(state.draggingSeatedGuest)

        // let data = event.dataTransfer.getData('text');
        // console.log(data, parseInt(data.split('-')[1]));
        // event.currentTarget.appendChild(document.getElementById(data));
        // trySetGuestSeat(parseInt(data.split('-')[1]), table, chair);

        try {
            dispatch(toggleLoading(true));
            const request = encryptAsUrl({
                eventId: state.selectedEvent.id,
                guestId: state.draggingSeatedGuest.chair.coupleWeddingGuest.id,
                chairId: state.draggingSeatedGuest.chair.id,
            });

            const { data } = await unSeatGuest({ request });
            let selectedEvent = state.selectedEvent;
            let eventTable = selectedEvent?.eventTables?.find((t) => t.id === state.draggingSeatedGuest?.table?.id);
            let tableChair = eventTable?.coupleWeddingEventTableChairs?.find((c) => c.id === state.draggingSeatedGuest?.chair?.id);
            if (tableChair) {
                tableChair.coupleWeddingGuest = null;
            }

            selectedEvent.eventGuests.push(data.eventGuest);
            selectedEvent.eventGuests = sortGuestCompanions(selectedEvent.eventGuests);

            setState((currentState) => ({
                ...currentState,
                selectedEvent: selectedEvent,
                draggingSeatedGuest: {},
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }

        // selectedEvent.eventTables.map(et => {
        //     return {
        //         ...et,
        //         coupleWeddingEventTableChairs: coupleWeddingEventTableChairs.filter((chair) => {
        //             return chair.coupleWeddingGuest.fullName.toLowerCase().includes(searchValue.toLowerCase())
        //         }),
        //     }
        // })?.filter(fc => {
        //     return fc.guests.length > 0;
        // });

        // if (type === 'seated' && draggingGuest) {
        //     setState(() => ({
        //         ...currentState,
        //         draggingSeatedGuest: {}
        //     }));
        // }
    }

    const addTable = (table) => {
        let selectedEvent = state.selectedEvent;
        selectedEvent.eventTables.push(table);

        // setState((currentState) => ({
        //     ...currentState,
        //     selectedEvent: selectedEvent,
        // }));
    }

    const updateTable = (table) => {
        let selectedEvent = state.selectedEvent;
        let eventTable = selectedEvent.eventTables.find((et) => et.id === table.id);
        if (eventTable) {
            for (const key in eventTable) {
                eventTable[key] = table[key];
            }
        }

        // setState((currentState) => ({
        //     ...currentState,
        //     selectedEvent: selectedEvent,
        // }));
    }

    const generateStyles = (table) => {
        let styles = {};
        if (table.type === 'sc-one-sided-table') {
            styles.width = `${table.coupleWeddingEventTableChairs.length * 50}px`;
        } else if (table.type === 'sc-two-sided-table') {
            styles.width = `${table.coupleWeddingEventTableChairs.length / 2 * 50}px`;
        } else if (table.type === 'sc-four-sided-table') {
            styles.width = `${table.coupleWeddingEventTableChairs.length / 2 * 40}px`;
        }
        // else if (table.type === 'sc-rounded-table') {
        //     styles.width = `${table.coupleWeddingEventTableChairs.length / 2 * 40}px`;
        // }

        return styles;
    }

    const generateClasses = (table) => {
        let classes = '';
        // if (table.type === 'sc-one-sided-table') {
        // } else if (table.type === 'sc-two-sided-table') {
        // } else if (table.type === 'sc-four-sided-table') {
        // } else 
        if (table.type === 'sc-rounded-table') {
            classes += `chairs-count-${table.coupleWeddingEventTableChairs.length}`;
        }

        return classes;
    }

    const tryDeleteTable = async (table) => {
        if (!window.confirm(`Are you sure you want to delete ${table.name}?`)) {
            return;
        }
        try {
            dispatch(toggleLoading(true));

            let selectedEvent = state.selectedEvent;
            const { data } = await deleteTable(selectedEvent.id, table.id);
            toast.success(data.message);
            selectedEvent.eventTables = selectedEvent.eventTables.filter((t) => t.id !== table.id);

            data.eventGuests.map((eventGuest) => {
                selectedEvent.eventGuests.push(eventGuest);
            });

            // setState((currentState) => ({
            //     ...currentState,
            //     selectedEvent: selectedEvent,
            // }));
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    const addGuest = (guest) => {
        let selectedEvent = state.selectedEvent;
        selectedEvent.eventGuests.unshift(guest);
    }

    const { toPDF, targetRef } = usePDF({
        method: "save",
        filename: `${app.profile.fullName}-${state.selectedEvent.name}.pdf`,
        page: { margin: Margin.SMALL },
    });

    const exportToPdf = () => {
        setState((currentState) => ({
            ...currentState,
            generatingPdf: true,
        }));

        setTimeout(() => {
            toPDF().then((_) => {
                setState((currentState) => ({
                    ...currentState,
                    generatingPdf: false,
                }));
            });
        });
    }

    const contentListView = useRef(null);
    useEffect(() => {
        if (state.contentView === 'list') {
            setTimeout(() => {
                new Masonry(contentListView.current, {
                    // options...
                    // itemSelector: '.col',
                    // columnWidth: 200
                    percentPosition: true,
                });
            }, 50);
        }
    }, [state.contentView]);

    const changeContentView = (view) => {
        setState((currentState) => ({ ...currentState, contentView: view }));
    }

    const windowResized = async (height) => {
        let selectedEvent = state.selectedEvent;
        selectedEvent.seatingChartWindowHeight = height;
        setState((currentState) => ({
            ...currentState,
            selectedEvent: selectedEvent,
        }));
    }

    return (
        <>
            <SCWindow
                selectedEvent={state.selectedEvent}
                generatingPdf={state.generatingPdf}
                onWindowResized={(height) => windowResized(height)}
            >
                {state.contentView === 'chart' && <SCSidebar
                    app={app}
                    inviteByLinkUrl={state.inviteByLinkUrl}
                    contentRef={targetRef}
                    weddingEvents={state.weddingEvents}
                    selectedEvent={state.selectedEvent}
                    draggingGuest={state.draggingSeatedGuest}
                    onGuestDrag={(event) => guestDragging(event)}
                    onGuestDragEnd={(event) => guestDraggingEnd(event)}
                    onSetIsMoveable={(status) => setIsMoveable(status)}
                    onUnSeatGuest={(event) => tryUnSeatGuest(event)}
                    onTableCreated={(table) => addTable(table)}
                    onTableUpdated={(table) => updateTable(table)}
                    onGuestCreated={(guest) => addGuest(guest)}
                />}
                <div
                    className="sc-content pb-150px"
                    style={state.contentView === 'list' ? { marginLeft: 0 } : {}}
                    ref={targetRef}
                >
                    {state.generatingPdf &&
                        <SCHeader
                            profile={app.profile}
                            selectedEvent={state.selectedEvent}
                        />
                    }

                    {!state.generatingPdf && <EventsAndExport
                        weddingEvents={state.weddingEvents}
                        selectedEvent={state.selectedEvent}
                        contentView={state.contentView}
                        onSelectEvent={(event) => tryLoadEventTablesAndGuests(event)}
                        // onExportToPdf={() => exportToPdf()}
                        changeChartView={(view) => changeContentView(view)}
                        onExportToPdf={() => exportToPdf()}
                    />}
                    {
                        state.contentView === 'chart' ?
                            <TransformWrapper
                                // initialScale={1}
                                // initialPositionX={0}
                                // initialPositionY={0}
                                // limitToBounds={false}
                                centerZoomedOut={true} // try true
                                // centerOnInit={true}
                                // disablePadding={true}
                                initialScale={1}
                                disabled={isMoveable}
                                minScale={1}
                                maxScale={1}
                                limitToBounds={false}
                                wheel={{ disabled: true }}
                                panning={{ disabled: true }}
                            // onPanning={updateXarrow}
                            // onZoom={updateXarrow}
                            // pinch={{ step: 5 }}
                            >
                                {({ zoomIn, zoomOut, resetTransform, centerView, ...rest }) => (
                                    <>
                                        {/* {!state.generatingPdf && <ChartActions />} */}

                                        <TransformComponent
                                            contentclassName="sc-tc-main"
                                        >
                                            {state.selectedEvent?.eventTables?.map((table, tableIndex) => <Draggable
                                                onStart={handleDraggableStart}
                                                onDrag={handleDraggableDrag}
                                                onStop={(event, data) => handleDraggableStop(event, data, table)}
                                                defaultPosition={table.position}
                                                key={`table-${tableIndex}`}
                                                disabled={isMoveable}
                                            >
                                                <div
                                                    id={`id-${table.type}-${tableIndex}`}
                                                    className={`sc-table ${table.type} ${generateClasses(table)}`}
                                                    style={generateStyles(table)}
                                                >
                                                    <SCTable
                                                        table={table}
                                                        onGuestSeated={(event, chair) => guestSeated(event, table, chair)}
                                                        onAllowGuestDrop={(event) => allowGuestDrop(event)}
                                                        onDropChoiceChanged={(event) => dropChoiceChanged(event)}
                                                        onGuestDragging={(event, chair) => guestDragging(event, 'seated', table, chair)}
                                                        onSetIsMoveable={(value) => setIsMoveable(value)}
                                                        onGuestDraggingEnd={(event) => guestDraggingEnd(event, 'seated')}
                                                    />
                                                    <div className="table-mid-content text-center">
                                                        <small>{table.name}</small> <br />
                                                        {!state.generatingPdf && <button
                                                            type="button"
                                                            className="btn btn-outline-danger px-2 py-0 text-danger"
                                                            onClick={() => tryDeleteTable(table)}
                                                        >
                                                            <span className="bi bi-trash"></span>
                                                        </button>}
                                                    </div>
                                                </div>
                                            </Draggable>)}

                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                            :
                            <div className="p-5 sc-list-view">
                                <div className="row pt-5" ref={contentListView}>
                                    {state.selectedEvent?.eventTables?.map((table, tableIndex) => <div className="col-md-3" key={`list-table-${table.id}-${tableIndex}`}>
                                        <div className="card mb-3">
                                            <div className="card-header text-center">
                                                <h5>{table.name} <small>(Chairs: {table.coupleWeddingEventTableChairs.length})</small></h5>
                                            </div>
                                            <div className="card-body">
                                                {table.coupleWeddingEventTableChairs.map((chair, chairIndex) =>
                                                    chair.coupleWeddingGuest && <div
                                                        id={`content-view-${chair.coupleWeddingGuest.id}`}
                                                        className="sc-guest"
                                                        key={`list-table-chair-${table.id}-${chair.id}-${chairIndex}`}
                                                    >
                                                        <span className="bi bi-person-circle"></span>
                                                        <small>
                                                            {chair.coupleWeddingGuest.fullName}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                    }
                </div>
            </SCWindow>
        </>
    );
}


export default SeatingChart;