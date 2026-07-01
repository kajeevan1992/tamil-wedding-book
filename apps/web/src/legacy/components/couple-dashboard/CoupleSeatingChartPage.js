'use client';

import { useMemo, useRef, useState } from 'react';
import { coupleProfile, seatingChartFallbackData } from '../../data/coupleDashboardData';

const tableTypes = [
  { type: 'sc-one-sided-table', label: 'One sided', icon: 'one-sided-table.png', chairs: 4 },
  { type: 'sc-two-sided-table', label: 'Two sided', icon: 'two-sided-table.png', chairs: 6 },
  { type: 'sc-four-sided-table', label: 'Four sided', icon: 'four-sided-table.png', chairs: 8 },
  { type: 'sc-rounded-table', label: 'Round', icon: 'rounded-table.png', chairs: 6 },
];

function makeChairs(count, tableId) {
  return Array.from({ length: count }, (_, index) => ({ id: `${tableId}-chair-${index + 1}`, coupleWeddingGuest: null }));
}

function GuestPill({ guest, onDragStart, onDragEnd }) {
  return (
    <div
      id={`guest-${guest.id}`}
      className="sc-guest"
      draggable
      onDragStart={(event) => onDragStart(event, guest.id)}
      onDragEnd={onDragEnd}
    >
      <span className="bi bi-person-circle"></span>
      <small>{guest.fullName}</small>
    </div>
  );
}

function SeatingChair({ chair, table, onDropGuest, onUnseatGuest, onDragGuestStart, onDragEnd }) {
  return (
    <div
      className="sc-table-chair"
      onDragOver={(event) => {
        event.preventDefault();
        event.currentTarget.classList.add('chair-highlighting');
      }}
      onDragLeave={(event) => event.currentTarget.classList.remove('chair-highlighting')}
      onDrop={(event) => {
        event.currentTarget.classList.remove('chair-highlighting');
        onDropGuest(event, table.id, chair.id);
      }}
      title={chair.coupleWeddingGuest ? 'Double click to unseat guest' : 'Drop guest here'}
      onDoubleClick={() => chair.coupleWeddingGuest && onUnseatGuest(table.id, chair.id)}
    >
      {chair.coupleWeddingGuest && (
        <GuestPill guest={chair.coupleWeddingGuest} onDragStart={(event, guestId) => onDragGuestStart(event, guestId, table.id, chair.id)} onDragEnd={onDragEnd} />
      )}
    </div>
  );
}

function SCTable({ table, onDropGuest, onUnseatGuest, onDragGuestStart, onDragEnd, onMoveTable, onDeleteTable }) {
  const dragStart = useRef(null);
  const chairs = table.coupleWeddingEventTableChairs;
  const firstHalf = chairs.slice(0, Math.ceil(chairs.length / 2));
  const secondHalf = chairs.slice(Math.ceil(chairs.length / 2));
  const sideCount = Math.max(1, Math.ceil(chairs.length / 4));
  const leftSide = chairs.slice(0, sideCount);
  const topSide = chairs.slice(sideCount, sideCount * 2 + 1);
  const rightSide = chairs.slice(sideCount * 2 + 1, sideCount * 3 + 1);
  const bottomSide = chairs.slice(sideCount * 3 + 1);
  const renderChair = (chair) => <SeatingChair key={chair.id} chair={chair} table={table} onDropGuest={onDropGuest} onUnseatGuest={onUnseatGuest} onDragGuestStart={onDragGuestStart} onDragEnd={onDragEnd} />;

  return (
    <div
      className={`sc-table ${table.type} chairs-count-${chairs.length}`}
      style={{ left: table.positionX, top: table.positionY, width: table.width, height: table.height }}
      onPointerDown={(event) => {
        if (event.target.closest('.sc-table-chair') || event.target.closest('.sc-guest') || event.target.closest('button')) return;
        dragStart.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: table.positionX, y: table.positionY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return;
        const nextX = Math.max(0, dragStart.current.x + event.clientX - dragStart.current.startX);
        const nextY = Math.max(0, dragStart.current.y + event.clientY - dragStart.current.startY);
        onMoveTable(table.id, nextX, nextY);
      }}
      onPointerUp={() => { dragStart.current = null; }}
    >
      {table.type === 'sc-one-sided-table' && <div className="sc-one-sided-table-top-side">{chairs.map(renderChair)}</div>}
      {table.type === 'sc-two-sided-table' && <><div className="sc-two-sided-table-top-side">{firstHalf.map(renderChair)}</div><div className="sc-two-sided-table-bottom-side">{secondHalf.map(renderChair)}</div></>}
      {table.type === 'sc-four-sided-table' && <><div className="sc-four-sided-table-left-side">{leftSide.map(renderChair)}</div><div className="sc-four-sided-table-top-side">{topSide.map(renderChair)}</div><div className="sc-four-sided-table-right-side">{rightSide.map(renderChair)}</div><div className="sc-four-sided-table-bottom-side">{bottomSide.map(renderChair)}</div></>}
      {table.type === 'sc-rounded-table' && chairs.map(renderChair)}
      <div className="table-mid-content text-center">
        <strong>{table.name}</strong>
        <small className="d-block">{chairs.length} Seats</small>
        <button type="button" className="btn btn-link text-danger p-0 fs-12px" onClick={() => onDeleteTable(table.id)}>Remove</button>
      </div>
    </div>
  );
}

function SeatingSidebar({ selectedEvent, searchValue, onSearchChange, unassignedGuests, onAddTable, onDragGuestStart, onDragEnd, sidebarOpen, onToggleSidebar }) {
  const guests = unassignedGuests.filter((guest) => guest.fullName.toLowerCase().includes(searchValue.toLowerCase()));
  return (
    <div className="sc-sidebar" style={{ left: sidebarOpen ? 0 : -300 }}>
      <button type="button" className={`btn sc-sidebar-btn btn btn-outline-primary bg-white p-1 ${sidebarOpen ? 'visible' : 'in-visible'}`} onClick={() => onToggleSidebar(!sidebarOpen)}>
        <span className={`bi ${sidebarOpen ? 'bi-chevron-double-left' : 'bi-chevron-double-right'}`}></span>{sidebarOpen ? 'Hide' : 'show'}
      </button>
      <div className="p-3 mt-4">
        <strong>Tables</strong>
        <div className="d-flex justify-content-between">
          {tableTypes.map((table) => (
            <label key={table.type} title={table.label} draggable onDragEnd={() => onAddTable(table)} onClick={() => onAddTable(table)}>
              <img src={`/assets/images/seating-charts/${table.icon}`} className="c-p" alt={table.label} />
            </label>
          ))}
        </div>
        <hr className="mb-0" />
      </div>
      <div className="p-3">
        <div className="d-flex justify-content-between align-items-center"><strong>Guests</strong><button type="button" className="btn btn-link text-danger p-0 d-flex align-items-center"><span className="bi bi-plus"></span> Guest</button></div>
        <div className="mt-1">
          <input type="text" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search guest..." className="form-control py-2 bg-white w-100 mb-2" />
          <div className="sc-guests-wrapper" style={{ height: selectedEvent.seatingChartWindowHeight - 250 }}>
            <ul className="list-group list-group-flush">
              {guests.map((guest) => <li className="list-group-item px-0 py-1 d-flex justify-content-between" key={guest.id}><GuestPill guest={guest} onDragStart={(event, guestId) => onDragGuestStart(event, guestId)} onDragEnd={onDragEnd} /></li>)}
              {guests.length === 0 && <li className="list-group-item px-0 py-1 text-muted"><small>No unassigned guests found.</small></li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SCHeader({ selectedEvent }) {
  return (
    <div className="sc-header">
      <div className="card d-flex">
        <div className="card-body">
          <img src="/assets/images/about/Tamil_Wedding_Book.png" alt="Tamil Wedding Book" className="header-logo" />
          <h2>{coupleProfile.fullName} & {coupleProfile.partnerName}</h2>
          <h3 className="m-0"><span className="badge badge-warning">{selectedEvent.name}</span></h3>
          <h4 className="m-0">Venue name, need to discuss</h4>
          <small className="badge badge-info">{coupleProfile.weddingDate}</small>
        </div>
      </div>
    </div>
  );
}

export default function CoupleSeatingChartPage() {
  const [events, setEvents] = useState(() => seatingChartFallbackData.weddingEvents.map((event) => ({
    ...event,
    eventTables: event.eventTables.map((table) => ({
      ...table,
      coupleWeddingEventTableChairs: (table.coupleWeddingEventTableChairs || table.chairs || []).map((chair) => ({
        id: chair.id,
        coupleWeddingGuest: chair.coupleWeddingGuest || event.eventGuests.find((guest) => guest.id === chair.guestId) || null,
      })),
    })),
  })));
  const [selectedEventId, setSelectedEventId] = useState(seatingChartFallbackData.weddingEvents[0].id);
  const [contentView, setContentView] = useState('chart');
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggingGuest, setDraggingGuest] = useState(null);

  const selectedEvent = events.find((event) => event.id === selectedEventId) || events[0];
  const seatedGuestIds = useMemo(() => new Set(selectedEvent.eventTables.flatMap((table) => table.coupleWeddingEventTableChairs).filter((chair) => chair.coupleWeddingGuest).map((chair) => chair.coupleWeddingGuest.id)), [selectedEvent]);
  const unassignedGuests = selectedEvent.eventGuests.filter((guest) => !seatedGuestIds.has(guest.id));
  const assignedCount = seatedGuestIds.size;

  const updateSelectedEvent = (updater) => setEvents((currentEvents) => currentEvents.map((event) => event.id === selectedEvent.id ? updater(event) : event));
  const handleDragGuestStart = (event, guestId, tableId = null, chairId = null) => {
    event.currentTarget.classList.add('dragging');
    event.dataTransfer.setData('text/plain', String(guestId));
    setDraggingGuest({ guestId, tableId, chairId });
  };
  const handleDragEnd = (event) => { event.currentTarget.classList.remove('dragging'); setDraggingGuest(null); };
  const findGuest = (eventData, guestId) => eventData.eventGuests.find((guest) => guest.id === Number(guestId)) || eventData.eventTables.flatMap((table) => table.coupleWeddingEventTableChairs).map((chair) => chair.coupleWeddingGuest).find((guest) => guest?.id === Number(guestId));
  const dropGuest = (dropEvent, tableId, chairId) => {
    dropEvent.preventDefault();
    const guestId = Number(dropEvent.dataTransfer.getData('text/plain'));
    updateSelectedEvent((eventData) => {
      const guest = findGuest(eventData, guestId);
      if (!guest) return eventData;
      return {
        ...eventData,
        eventTables: eventData.eventTables.map((table) => ({
          ...table,
          coupleWeddingEventTableChairs: table.coupleWeddingEventTableChairs.map((chair) => {
            if (chair.coupleWeddingGuest?.id === guestId) return { ...chair, coupleWeddingGuest: null };
            if (table.id === tableId && chair.id === chairId) return { ...chair, coupleWeddingGuest: guest };
            return chair;
          })
        }))
      };
    });
  };
  const unseatGuest = (tableId, chairId) => updateSelectedEvent((eventData) => ({ ...eventData, eventTables: eventData.eventTables.map((table) => table.id === tableId ? { ...table, coupleWeddingEventTableChairs: table.coupleWeddingEventTableChairs.map((chair) => chair.id === chairId ? { ...chair, coupleWeddingGuest: null } : chair) } : table) }));
  const moveTable = (tableId, x, y) => updateSelectedEvent((eventData) => ({ ...eventData, eventTables: eventData.eventTables.map((table) => table.id === tableId ? { ...table, positionX: x, positionY: y } : table) }));
  const addTable = (tableType) => updateSelectedEvent((eventData) => { const nextId = Math.max(0, ...eventData.eventTables.map((table) => table.id)) + 1; return { ...eventData, eventTables: [...eventData.eventTables, { id: nextId, name: `Table ${nextId}`, type: tableType.type, width: tableType.type === 'sc-rounded-table' ? 110 : 170, height: tableType.type === 'sc-rounded-table' ? 110 : 70, positionX: 220 + nextId * 25, positionY: 160 + nextId * 20, coupleWeddingEventTableChairs: makeChairs(tableType.chairs, nextId) }] }; });
  const deleteTable = (tableId) => updateSelectedEvent((eventData) => ({ ...eventData, eventTables: eventData.eventTables.filter((table) => table.id !== tableId) }));

  return (
    <div className="container-fluid p-0 seating-chart-migration">
      <div className="d-flex justify-content-between align-items-center px-3 pt-3">
        <div><h3 className="mb-1">Seating Chart</h3><small className="text-muted">{assignedCount} assigned · {unassignedGuests.length} unassigned · {selectedEvent.eventGuests.length} total guests</small></div>
        <div className="events">
          <select className="form-select form-select-sm d-inline-block w-auto me-2" value={selectedEventId} onChange={(event) => setSelectedEventId(Number(event.target.value))}>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select>
          <button type="button" onClick={() => setContentView(contentView === 'chart' ? 'list' : 'chart')} className="btn btn-white btn-sm text-danger"><span className={`bi ${contentView === 'chart' ? 'bi-view-list' : 'bi-diagram-2-fill'}`}></span> {contentView === 'chart' ? 'List' : 'Chart'}</button>
          <button type="button" className="btn btn-white btn-sm text-danger"><span className="bi bi-cloud-download"></span> PDF</button>
        </div>
      </div>
      <div className="sc-window mt-3" style={{ height: selectedEvent.seatingChartWindowHeight }}>
        <SeatingSidebar selectedEvent={selectedEvent} searchValue={searchValue} onSearchChange={setSearchValue} unassignedGuests={unassignedGuests} onAddTable={addTable} onDragGuestStart={handleDragGuestStart} onDragEnd={handleDragEnd} sidebarOpen={sidebarOpen} onToggleSidebar={setSidebarOpen} />
        <div className="sc-content" style={{ marginLeft: sidebarOpen ? 300 : 0 }}>
          {contentView === 'chart' ? <><div className="sc-tools d-table gap-5"><button type="button" className="btn btn-outline-primary bg-white p-2"><span className="bi bi-plus"></span></button><button type="button" className="btn btn-outline-primary bg-white p-2"><span className="bi bi-dash"></span></button><button type="button" className="btn btn-outline-primary bg-white p-2"><span className="bi bi-arrow-repeat"></span></button><button type="button" className="btn btn-outline-primary bg-white p-2"><span className="bi bi-border-center"></span></button></div><SCHeader selectedEvent={selectedEvent} />{selectedEvent.eventTables.map((table) => <SCTable key={table.id} table={table} onDropGuest={dropGuest} onUnseatGuest={unseatGuest} onDragGuestStart={handleDragGuestStart} onDragEnd={handleDragEnd} onMoveTable={moveTable} onDeleteTable={deleteTable} />)}{draggingGuest && <div className="sc-drop-guest-area pe-none">Drop guest on an empty chair</div>}</> : <div className="sc-list-view p-4"><h5>{selectedEvent.name} seating list</h5><div className="row">{selectedEvent.eventTables.map((table) => <div className="col-md-4 mb-3" key={table.id}><div className="card"><div className="card-body"><h6>{table.name}</h6>{table.coupleWeddingEventTableChairs.map((chair, index) => <div className="d-flex justify-content-between border-bottom py-1" key={chair.id}><small>Seat {index + 1}</small><small>{chair.coupleWeddingGuest?.fullName || 'Empty'}</small></div>)}</div></div></div>)}</div></div>}
        </div>
        <div className="resize-handle"><span className="bi bi-three-dots"></span></div>
      </div>
    </div>
  );
}
