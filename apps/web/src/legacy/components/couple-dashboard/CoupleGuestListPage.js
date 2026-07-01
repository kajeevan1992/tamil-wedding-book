'use client';

import { useMemo, useState } from 'react';
import { guestListFallbackData } from '../../data/coupleDashboardData';

const guestFilters = [
  { label: 'Group', id: 'coupleWeddingEventGroupId', name: 'coupleWeddingEventGroups', actionType: 'group' },
  { label: 'Menu', id: 'coupleWeddingEventMenuId', name: 'coupleWeddingEventMenus', actionType: 'menu' },
  { label: 'Seating Chart', id: 'coupleWeddingEventTableId', name: 'coupleWeddingEventTables', actionType: 'table' },
  { label: 'Attendance', id: 'coupleWeddingEventAttendanceId', name: 'coupleWeddingEventAttendances', actionType: 'attendance' },
  { label: 'Lists', id: 'coupleWeddingEventListId', name: 'coupleWeddingEventLists', actionType: 'list' },
];

const invitationOptions = [
  { value: 'confirmed', label: 'Confirmed', icon: 'bi bi-check-circle-fill', color: 'success' },
  { value: 'pending', label: 'Pending', icon: 'bi bi-clock-fill', color: 'warning' },
  { value: 'declined', label: 'Declined', icon: 'bi bi-x-circle-fill', color: 'danger' },
];

const blankGuest = {
  fullName: '',
  email: '',
  telephone: '',
  mobile: '',
  address: '',
  groupId: 1,
  menuId: 1,
  listId: 1,
  tableId: 1,
  status: 'pending',
};

function buildStats(event) {
  const guests = event.guests || [];
  return {
    totalGuests: guests.length,
    totalSeatedGuests: guests.filter((guest) => guest.tableId).length,
    confirmed: guests.filter((guest) => guest.status === 'confirmed').length,
    pending: guests.filter((guest) => guest.status === 'pending').length,
    declined: guests.filter((guest) => guest.status === 'declined').length,
  };
}

function getOptionName(options, id) {
  return options.find((option) => option.id === Number(id))?.name || 'Choose';
}

function groupGuests(event, selectedFilter) {
  if (!event?.id) return [];

  const source = selectedFilter.name === 'coupleWeddingEventAttendances'
    ? invitationOptions.map((option) => ({ id: option.value, name: option.label, icon: option.icon.replace('bi bi-', ''), color: option.color }))
    : event[selectedFilter.name] || [];

  return source.map((collection) => {
    const guests = event.guests.filter((guest) => {
      if (selectedFilter.actionType === 'attendance') return guest.status === collection.id;
      if (selectedFilter.actionType === 'group') return guest.groupId === collection.id;
      if (selectedFilter.actionType === 'menu') return guest.menuId === collection.id;
      if (selectedFilter.actionType === 'table') return guest.tableId === collection.id;
      if (selectedFilter.actionType === 'list') return guest.listId === collection.id;
      return true;
    });

    return {
      ...collection,
      guests,
      chairs: collection.chairs,
    };
  }).filter((collection) => collection.guests.length > 0 || selectedFilter.actionType !== 'attendance');
}

export default function CoupleGuestListPage() {
  const [events, setEvents] = useState(guestListFallbackData.weddingEvents);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(guestFilters[0]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [activeModalTab, setActiveModalTab] = useState('guest');
  const [showWeddingGuestModal, setShowWeddingGuestModal] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [guestForm, setGuestForm] = useState(blankGuest);

  const selectedEvent = useMemo(() => (selectedEventId > 0 ? events.find((event) => event.id === selectedEventId) : { id: 0, name: 'Overview' }), [events, selectedEventId]);
  const statsByEvent = useMemo(() => events.reduce((stats, event) => ({ ...stats, [event.id]: buildStats(event) }), {}), [events]);

  const filteredCollection = useMemo(() => groupGuests(selectedEvent, selectedFilter).map((collection) => ({
    ...collection,
    guests: collection.guests.filter((guest) => guest.fullName.toLowerCase().includes(searchValue.toLowerCase())),
  })).filter((collection) => collection.guests.length > 0 || !searchValue), [selectedEvent, selectedFilter, searchValue]);

  const openGuestModal = (action = 'add', guest = blankGuest) => {
    setEditingGuestId(action === 'edit' ? guest.id : null);
    setGuestForm({ ...blankGuest, ...guest });
    setActiveModalTab('guest');
    setShowWeddingGuestModal(true);
  };

  const closeGuestModal = () => {
    setEditingGuestId(null);
    setGuestForm(blankGuest);
    setShowWeddingGuestModal(false);
  };

  const updateSelectedEventGuests = (updater) => {
    setEvents((current) => current.map((event) => (event.id === selectedEventId ? { ...event, guests: updater(event.guests) } : event)));
  };

  const saveGuest = (event) => {
    event.preventDefault();
    if (!guestForm.fullName.trim() || selectedEventId === 0) return;

    if (editingGuestId) {
      updateSelectedEventGuests((guests) => guests.map((guest) => (guest.id === editingGuestId ? { ...guest, ...guestForm, fullName: guestForm.fullName.trim() } : guest)));
    } else {
      updateSelectedEventGuests((guests) => [...guests, { ...guestForm, id: `temp-${Date.now()}`, fullName: guestForm.fullName.trim(), temporary: true }]);
    }

    closeGuestModal();
  };

  const deleteGuest = (guestId) => {
    updateSelectedEventGuests((guests) => guests.filter((guest) => guest.id !== guestId));
    setSelectedGuests((current) => current.filter((id) => id !== guestId));
  };

  const changeGuestValue = (guestId, field, value) => {
    updateSelectedEventGuests((guests) => guests.map((guest) => (guest.id === guestId ? { ...guest, [field]: value } : guest)));
  };

  const toggleGuestSelection = (guestId) => {
    setSelectedGuests((current) => (current.includes(guestId) ? current.filter((id) => id !== guestId) : [...current, guestId]));
  };

  const selectAllGuests = (checked) => {
    if (!checked || !selectedEvent?.guests) {
      setSelectedGuests([]);
      return;
    }
    setSelectedGuests(selectedEvent.guests.map((guest) => guest.id));
  };

  const handleFormInput = (event) => {
    const { name, value } = event.target;
    setGuestForm((current) => ({ ...current, [name]: ['groupId', 'menuId', 'listId', 'tableId'].includes(name) ? Number(value) : value }));
  };

  const renderEventStats = (event) => {
    const stats = statsByEvent[event.id] || buildStats(event);
    return (
      <div className="d-flex justify-content-between">
        <div className="mx-2"><h3 className="mb-0">{stats.totalGuests}</h3>Guests</div>
        <div className="mx-2"><small className="block-lh-14px"><strong className="text-success">{stats.confirmed}</strong> Confirmed <br /><strong className="text-warning">{stats.pending}</strong> Pending <br /><strong className="text-danger">{stats.declined}</strong> Declined</small></div>
      </div>
    );
  };

  return (
    <>
      <div className="container spacer">
        <div className="row">
          <div className="col-md-12">
            {selectedEvent.id > 0 && <button type="button" onClick={() => setSelectedEventId(0)} className="btn p-0 btn-lg m-0"><i className="bi bi-arrow-left text-theme"></i> Back</button>}
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0 fw-600">{selectedEvent.name}</h3>
              {selectedEvent.id === 0 && <button type="button" className="btn btn-sm btn-primary mx-1"><span><span className="bi bi-plus-lg"></span> Event</span></button>}
              {selectedEvent.id > 0 && <button type="button" className="btn btn-sm btn-outline-primary mx-1"><span><span className="bi bi-pencil"></span> Event Setting</span></button>}
            </div>
          </div>

          <div className="col-md-12 mt-4">
            {selectedEvent.id === 0 && <div className="row">
              {events.map((event) => (
                <div className="col-md-4 mb-3" key={event.id}>
                  <div className="card">
                    <div className="card-body d-flex justify-content-between">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="mr-3 h-sm"><img src={`/assets/images/events/${event.image || 'event.png'}`} className="w-100" alt="" /></div>
                        <div className="mt-1"><h5>{event.name}</h5>{renderEventStats(event)}</div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <div className="col-6"><button type="button" onClick={() => { setSelectedEventId(event.id); setSelectedFilter(guestFilters[0]); setSearchValue(''); setSelectedGuests([]); }} className="btn btn-outline-primary btn-sm w-100">View</button></div>
                        <div className="col-6 text-right"><button type="button" className="btn btn-outline-danger btn-sm"><span className="bi bi-trash"></span></button> &nbsp;<button type="button" className="btn btn-outline-info btn-sm"><span className="bi bi-pencil"></span></button></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>}

            {selectedEvent.id > 0 && <div className="card">
              <div className="card-body d-flex justify-content-between sm-block-100">
                <div className="d-flex justify-content-between align-items-center sm-block-100">
                  <div className="mr-3 h-sm"><img src={`/assets/images/events/${selectedEvent.image || 'event.png'}`} className="w-100" alt="" /></div>
                  <div className="mt-1">{renderEventStats(selectedEvent)}</div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mr-3 h-sm"><img src="/assets/images/events/guest-list.png" className="w-100" alt="Guest List" /></div>
                  <div className="mt-1 sm-w-100"><div className="c-grid lh-14px w-125px list-stats">{selectedEvent.coupleWeddingEventLists.map((list) => <small className="c-grid-col" key={list.id}>{list.name}: &nbsp;<strong>{selectedEvent.guests.filter((guest) => guest.listId === list.id).length}</strong><br /></small>)}</div></div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mr-3 h-sm"><img src="/assets/images/events/event-table.png" className="w-100" alt="Event Table" /></div>
                  <div className="mt-1 sm-w-100"><div className="d-flex justify-content-between sm-flex-center"><div className="mx-2 text-center lh-14px"><strong>{buildStats(selectedEvent).totalSeatedGuests}</strong> Guests Seated <br /><button className="btn btn-sm p-0 text-theme fs-12px">Arrange Seating</button></div></div></div>
                </div>
              </div>
            </div>}
          </div>

          {selectedEvent.id > 0 && <div className="col-md-12 mt-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between sm-block-100">
                <input className="form-control py-2 w-300px bg-white sm-w-100" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search Guests" />
                <div className="sm-flex-center">
                  <button type="button" onClick={() => openGuestModal('add')} className="btn btn-primary btn-sm mx-1"><span className="bi bi-plus-lg"></span> Add Guest</button>
                  {selectedFilter.actionType !== 'attendance' && <button type="button" className="btn btn-secondary btn-sm mx-1"><span className="bi bi-plus-lg"></span> Add <span className="text-capitalize">{selectedFilter.actionType}</span></button>}
                </div>
              </div>
              <nav className="nav pb-1 pt-2 d-flex justify-content-center align-items-center bg-light">
                {guestFilters.map((filter) => <button type="button" onClick={() => { setSelectedFilter(filter); setSearchValue(''); setSelectedGuests([]); }} className={`btn nav-link pt-0 ${selectedFilter.id === filter.id ? 'text-theme' : 'grey-color'}`} key={filter.id}>{filter.label}</button>)}
              </nav>
              <div className="card-body table-responsive">
                <div className="pb-3 d-flex">
                  <div className="form-check">
                    <input type="checkbox" id="guest-select-all" checked={selectedEvent.guests.length > 0 && selectedGuests.length === selectedEvent.guests.length} onChange={(event) => selectAllGuests(event.target.checked)} className="form-check-input theme-color-bg w-h-17px" />
                    <label className="form-check-label mt-2p5px" htmlFor="guest-select-all">&nbsp; {selectedEvent.guests.length > 0 && selectedGuests.length === selectedEvent.guests.length ? 'Un Select' : 'Select'} All</label>
                  </div>
                  {selectedGuests.length > 0 && <nav className="nav checked-options-nav"><button type="button" className="btn nav-link pt-0 text-capitalize"><span className="bi bi-arrow-left-right"></span> {selectedFilter.actionType}</button><button type="button" onClick={() => updateSelectedEventGuests((guests) => guests.filter((guest) => !selectedGuests.includes(guest.id)))} className="btn nav-link pt-0"><span className="bi bi-trash"></span> Delete</button></nav>}
                </div>
                <table className="table">
                  {filteredCollection.map((collection, index) => <tbody key={`${collection.name}-${index}`}>
                    <tr className="grey-bg">
                      <th className="va-middle bb-0"></th>
                      <th className="va-middle bb-0 text-capitalize d-flex align-items-center">{collection.icon && <span className={`bi bi-${collection.icon} mr-1 ${collection.color ? `text-${collection.color}` : ''}`}></span>}{collection.name} {collection.chairs ? `(${collection.chairs})` : ''}</th>
                      <td className="va-middle">Attendance</td>
                      <td className="va-middle">Menu</td>
                      <td className="va-middle">List</td>
                      <td className="va-middle">Table</td>
                      <td className="text-center va-middle"></td>
                    </tr>
                    {collection.guests.map((guest) => <tr key={guest.id}>
                      <td className="va-middle relative p-0"><div className="form-check mb-1p7rem"><input type="checkbox" checked={selectedGuests.includes(guest.id)} onChange={() => toggleGuestSelection(guest.id)} className="form-check-input theme-color-bg w-h-17px" /></div></td>
                      <td className="va-middle">{guest.fullName} {guest.temporary && <small className="badge badge-light text-muted fn-10 ml-1">Temporary</small>}<br /><small className="text-muted">{guest.email || guest.mobile}</small></td>
                      <td className="va-middle"><select className="select-theme-border filter p-5px" value={guest.status} onChange={(event) => changeGuestValue(guest.id, 'status', event.target.value)}>{invitationOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></td>
                      <td className="va-middle"><select className="select-theme-border filter p-5px" value={guest.menuId} onChange={(event) => changeGuestValue(guest.id, 'menuId', Number(event.target.value))}>{selectedEvent.coupleWeddingEventMenus.map((menu) => <option key={menu.id} value={menu.id}>{menu.name}</option>)}</select></td>
                      <td className="va-middle"><select className="select-theme-border filter p-5px" value={guest.listId} onChange={(event) => changeGuestValue(guest.id, 'listId', Number(event.target.value))}>{selectedEvent.coupleWeddingEventLists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}</select></td>
                      <td className="va-middle"><select className="select-theme-border filter p-5px" value={guest.tableId} onChange={(event) => changeGuestValue(guest.id, 'tableId', Number(event.target.value))}>{selectedEvent.coupleWeddingEventTables.map((table) => <option key={table.id} value={table.id}>{table.name} - ({table.chairs} Seats Available)</option>)}</select></td>
                      <td className="text-center va-middle"><div className="btn-group"><button type="button" className="btn dropdown-toggle btn-sm fs-20px no-arrow p-5px"><span className="bi bi-three-dots text-theme"></span></button><div className="d-inline-flex p-2"><button className="dropdown-item" type="button" onClick={() => openGuestModal('edit', guest)}><span className="bi bi-pencil text-success"></span> Edit</button><button className="dropdown-item" type="button" onClick={() => deleteGuest(guest.id)}><span className="bi bi-trash text-danger"></span> Delete</button></div></div></td>
                    </tr>)}
                  </tbody>)}
                </table>
              </div>
            </div>
          </div>}
        </div>
      </div>

      {showWeddingGuestModal && <div className="modal d-block" id="weddingGuestModal" tabIndex="-1" aria-labelledby="weddingGuestModal">
        <div className="modal-dialog modal-lg couple-dashboard-step-modal">
          <div className="modal-content">
            <div className="modal-header fs-16px"><div className="modal-title"><span className="text-capitalize">{editingGuestId ? 'edit' : 'add'}</span> Guest</div><button className="btn p-0" type="button" onClick={closeGuestModal}><span className="bi bi-x-lg"></span></button></div>
            <div className="modal-body">
              <ul className="nav nav-tabs justify-content-center" role="tablist">
                <li className="nav-item"><button className={`nav-link ${activeModalTab === 'guest' ? 'active' : ''}`} type="button" onClick={() => setActiveModalTab('guest')}><span className="bi bi-person-plus fs-20px"></span><br /><span className="fs-13px">Add Guest</span></button></li>
                <li className="nav-item"><button className={`nav-link ${activeModalTab === 'invite' ? 'active' : ''}`} type="button" onClick={() => setActiveModalTab('invite')}><span className="bi bi-link-45deg fs-20px"></span><br /><span className="fs-13px">Invite by link</span></button></li>
                <li className="nav-item"><button className={`nav-link ${activeModalTab === 'spreadsheet' ? 'active' : ''}`} type="button" onClick={() => setActiveModalTab('spreadsheet')}><span className="bi bi-file-earmark-spreadsheet fs-20px"></span><br /><span className="fs-13px">Import spreadsheet</span></button></li>
              </ul>
              {activeModalTab === 'guest' && <form className="mt-4" onSubmit={saveGuest}>
                <div className="row">
                  <div className="col-md-6 mb-3"><label>Guest Name</label><input className="form-control" name="fullName" value={guestForm.fullName} onChange={handleFormInput} placeholder="Guest full name" /></div>
                  <div className="col-md-6 mb-3"><label>Group</label><select className="form-control" name="groupId" value={guestForm.groupId} onChange={handleFormInput}>{selectedEvent.coupleWeddingEventGroups?.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></div>
                  <div className="col-md-6 mb-3"><label>Email</label><input className="form-control" type="email" name="email" value={guestForm.email} onChange={handleFormInput} placeholder="Guest email address" /></div>
                  <div className="col-md-6 mb-3"><label>Mobile</label><input className="form-control" name="mobile" value={guestForm.mobile} onChange={handleFormInput} placeholder="Mobile number" /></div>
                  <div className="col-md-6 mb-3"><label>Attendance</label><select className="form-control" name="status" value={guestForm.status} onChange={handleFormInput}>{invitationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
                  <div className="col-md-6 mb-3"><label>Invite to (What to do with old guests)</label><input className="form-control" value={selectedEvent.name} readOnly /></div>
                </div>
                <hr />
                <div className="d-flex justify-content-end"><button type="button" onClick={closeGuestModal} className="btn btn-warning btn-sm mr-2">Cancel</button><button type="submit" className="btn btn-primary btn-sm">{editingGuestId ? 'Update' : 'Add'}</button></div>
              </form>}
              {activeModalTab === 'invite' && <div className="d-flex flex-column text-center mt-4"><h4 className="mb-4">Collect addresses from all your guests with just one link.</h4><ol className="invite-by-link-ol mb-4"><li>Send your link to family and friends.</li><li>Guests fill out their contact details.</li><li>That's it - they're on your list.</li></ol><div className="d-flex justify-content-between w-50 m-auto gap-10px"><input className="form-control form-control-sm disabled" value={guestListFallbackData.inviteByLinkUrl} readOnly /><button type="button" className="btn btn-primary btn-sm">Copy</button></div></div>}
              {activeModalTab === 'spreadsheet' && <div className="row justify-content-center text-center my-4"><div className="col-md-6"><h4 className="mb-4">Import guests</h4><p>Easily organize and import your guest list using our template.</p><div className="d-flex flex-column"><a href="#" className="btn btn-outline-primary btn-sm my-3">Download Template</a><label htmlFor="inputFileSpreadsheet" className="btn btn-primary btn-sm">Upload Spreadsheet</label><input type="file" hidden id="inputFileSpreadsheet" /></div></div></div>}
            </div>
          </div>
        </div>
      </div>}
    </>
  );
}
