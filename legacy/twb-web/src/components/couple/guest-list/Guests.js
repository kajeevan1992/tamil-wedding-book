import InputField from "@components/shared/InputField";
import React, { useEffect, useRef, useState } from "react";
import GuestListFilters from "@components/couple/guest-list/Filters";
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import WeddingEventItemModal from "@components/couple/guest-list/WeddingEventItemModal";
import WeddingGuestModal from "@components/couple/guest-list/WeddingGuestModal";
import ChangeGuestItemModal from "@components/couple/guest-list/ChangeGuestItemModal";
import {
    loadSelectedFilterData,
    deleteGuestWithCompanions,
    deleteCollectionItem,
    actionOnMultipleSelectedGuests,
    changeGuestEventStatus,
} from "@services/CoupleService";
import {
    statusMessages,
    selectColorStyles,
    capitalizeFirst,
    sortGuestCompanions
} from "@utilities/CommonUtil";
import Select from "react-select";

const invitationOptions = [
    { label: 'Confirmed', value: 'confirmed', icon: 'bi bi-check-circle', color: 'success' },
    { label: 'Pending', value: 'pending', icon: 'bi bi-clock-history', color: 'warning' },
    { label: 'Declined', value: 'declined', icon: 'bi bi-x-circle', color: 'danger' },
];

export default function GuestListGuests(props) {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        selectedFilter: {
            label: 'Group',
            id: 'coupleWeddingEventGroupId',
            model: 'CoupleWeddingEventGroup',
            name: 'coupleWeddingEventGroups',
            actionType: 'group',
        },
        selectedFilterCollection: [],
        filteredCollection: [],
        selectedGuests: [],

        errors: {}
    });
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (props.selectedEvent && props.selectedEvent.id > 0) {
            changeFilter(state.selectedFilter);
        }
    }, [props.selectedEvent]);

    useEffect(() => {
        filterGuests();
    }, [searchValue]);

    const [selectAll, setSelectAll] = useState(false);

    const changeFilter = async (filter) => {
        try {
            dispatch(toggleLoading(true));
            const request = {
                eventId: props.selectedEvent.id,
                filter: filter.name,
            };

            const { data } = await loadSelectedFilterData(request);
            if (filter.name === 'coupleWeddingEventAttendances') {
                data.eventFilterData.coupleWeddingEventAttendances = [
                    { name: 'confirmed', icon: 'bi bi-check-circle', color: 'success', guests: [] },
                    { name: 'pending', icon: 'bi bi-clock-history', color: 'warning', guests: [] },
                    { name: 'declined', icon: 'bi bi-x-circle', color: 'danger', guests: [] },
                ];
            }

            data.eventFilterData.coupleWeddingEventGuests.forEach(guest => {
                if (filter.name === 'coupleWeddingEventAttendances') {
                    let attendance = data.eventFilterData.coupleWeddingEventAttendances.find(attendance => attendance.name === guest.status);
                    if (attendance) {
                        attendance.guests.push(guest);
                    }
                } else {
                    let item = data.eventFilterData[filter.name]?.find(item => item.id === guest[filter.id]);
                    if (item) {
                        item.guests ? item.guests.push(guest) : item.guests = [guest];
                    } else {
                        let unAssigned = data.eventFilterData[filter.name].find(collection => collection.name === 'Un Assigned');
                        if (unAssigned) {
                            unAssigned.guests ? unAssigned.guests.push(guest) : unAssigned.guests = [guest];
                        } else {
                            data.eventFilterData[filter.name].push({ name: 'Un Assigned', guests: [guest] });
                        }
                    }
                }
            });

            data.eventFilterData[filter.name].forEach(collection => {
                if (!collection?.guests) {
                    collection.guests = [];
                }

                collection.guests = sortGuestCompanions(collection.guests);
            });

            setState((currentState) => ({
                ...currentState,
                selectedFilter: filter,
                selectedFilterCollection: data.eventFilterData[filter.name],
            }));
            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    const addItem = (item) => {
        let collection = state.selectedFilterCollection;
        item.guests = [];
        collection.push(item);

        setState((currentState) => ({
            ...currentState,
            selectedFilterCollection: collection,
        }));
    }
    const updateItem = (item) => {
        let collection = state.selectedFilterCollection;
        let oldCollection = collection?.find(c => c.id === item.id);
        if (oldCollection) {
            oldCollection.name = item.name;
            if (item.chairs) {
                oldCollection.chairs = item.chairs;
            }
        }

        setState((currentState) => ({
            ...currentState,
            selectedFilterCollection: collection,
        }));
    }
    const deleteItem = async (item) => {
        if (!window.confirm(`Are you sure you want to delete selected ${state.selectedFilter.actionType}`)) {
            return;
        }

        try {
            dispatch(toggleLoading(true));

            let request = {
                id: item.id,
                type: state.selectedFilter.actionType,
                model: state.selectedFilter.model,
            };

            await deleteCollectionItem(request);
            let collection = state.selectedFilterCollection;
            collection = collection.filter(c => c.id !== item.id);

            if (item.guests.length > 0) {
                let unAssigned = collection.find(g => g.name === 'Un Assigned');

                if (unAssigned) {
                    item.guests.forEach(guest => {
                        unAssigned.guests.push(guest);
                    });
                } else {
                    let guests = [];
                    item.guests.forEach(guest => {
                        guests.push(guest);
                    });
                    collection.push({ name: 'Un Assigned', guests: guests });
                }
            }

            setState((currentState) => ({
                ...currentState,
                selectedFilterCollection: collection,
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    const weddingGuestModal = useRef(null);
    const showWeddingGuestModal = (action, guestType, guest = {}) => {
        let guestData = { ...guest };
        if (action === 'edit' && guestType === 'guest') {
            state.selectedFilterCollection.forEach(sfc => {
                sfc.guests.forEach(guest => {
                    if (guest.companionOfId === guestData.id) {
                        guestData.companions.push(guest);
                    }
                });
            });
        }

        weddingGuestModal.current.showModal(
            action,
            guestData,
        );
    }
    const hideWeddingGuestModal = (isMajorAction) => {
        if (isMajorAction) {
            changeFilter(state.selectedFilter);
            props.onMajorAction();
        }

        weddingGuestModal.current.hideModal();
    }

    const weddingEventItemModal = useRef(null);
    const showWeddingItemModal = (action, item = {}) => {
        weddingEventItemModal.current.showModal(
            props.selectedEvent.id,
            action,
            item,
            state.selectedFilter.actionType,
            null,
            action === 'edit' ? item?.displayOrder : state.selectedFilterCollection?.length + 1,
        );
    }
    const hideWeddingItemModal = () => {
        weddingEventItemModal.current.hideModal();
    }

    const filterGuests = () => {
        if (searchValue.length < 1) {
            setState((currentState) => ({
                ...currentState,
                filteredCollection: [],
            }));
            return;
        }

        let filteredCollection = state.selectedFilterCollection.map(sfc => {
            return {
                ...sfc,
                guests: sfc.guests.filter((guest) => {
                    return guest.coupleWeddingGuest.fullName.toLowerCase().includes(searchValue.toLowerCase())
                }),
            }
        })?.filter(fc => {
            return fc.guests.length > 0;
        });

        setState((currentState) => ({
            ...currentState,
            filteredCollection: filteredCollection,
        }));
    }

    const guestAdded = (events, count) => {
        changeFilter(state.selectedFilter);
        props.onGuestAdded(events, count);
    }

    const deleteGuest = async (guest, type = null) => {
        if (window.confirm(`Are you sure you want to completely delete ${guest.coupleWeddingGuest.fullName}?`)) {
            try {
                dispatch(toggleLoading(true));
                const { data } = await deleteGuestWithCompanions(guest);
                toast.success(data.message);

                props.onGuestDeleted(guest);
                changeFilter(state.selectedFilter);

                dispatch(toggleLoading(false));
            } catch (error) {
                dispatch(toggleLoading(false));
                statusMessages(error);
            }
        }
    }

    const majorAction = () => {
        props.onMajorAction();
        changeFilter(state.selectedFilter);
    }

    const changeGuestStatus = async ({
        type,
        guestRecord,
        guest,
        prevStatus = null,
        status = null,
        menuId = null,
        prevList = null,
        listId = null,
        prevTable = null,
        tableId = null,
    }) => {
        try {
            dispatch(toggleLoading(true));
            const request = {
                type: type,
                guestId: guest?.id,
                eventId: props.selectedEvent.id,
                status: status,
                menuId: menuId,
                listId: listId,
                tableId: tableId,
            };

            const { data } = await changeGuestEventStatus(request);

            if (type === 'status') {
                if (state.selectedFilter.name === 'coupleWeddingEventAttendances') {
                    changeFilter(state.selectedFilter);
                } else {
                    guestRecord.status = status;
                }

                props.onGuestStatusChanged(prevStatus, status);
            } else if (type === 'menu') {
                if (state.selectedFilter.name === 'coupleWeddingEventMenus') {
                    changeFilter(state.selectedFilter);
                } else {
                    guestRecord.coupleWeddingEventMenuId = menuId;
                }
            } else if (type === 'list') {
                if (state.selectedFilter.name === 'coupleWeddingEventLists') {
                    changeFilter(state.selectedFilter);
                } else {
                    guestRecord.coupleWeddingEventListId = listId;
                }

                props.onGuestListChanged(prevList, listId);
            } else if (type === 'table') {
                if (state.selectedFilter.name === 'coupleWeddingEventTables') {
                    changeFilter(state.selectedFilter);
                } else {
                    //todo release previous table chair
                    // option.coupleWeddingEventTableChairs.filter(chair => chair.coupleWeddingGuest).length >= option.coupleWeddingEventTableChairs.length

                    if (prevTable) {
                        props.selectedEvent.coupleWeddingEventTables.forEach(table => {
                            if (table.id === guestRecord.coupleWeddingEventTableId) {
                                for (const chair of table.coupleWeddingEventTableChairs) {
                                    if (chair.coupleWeddingGuestId === guest.id) {
                                        chair.coupleWeddingGuestId = null;
                                        chair.coupleWeddingGuest = null;
                                        break;
                                    }
                                }
                            }
                        });

                        props.selectedEvent.coupleWeddingEventTables.forEach(table => {
                            if (table.id === tableId) {
                                for (const chair of table.coupleWeddingEventTableChairs) {
                                    if (chair.coupleWeddingGuestId === null) {
                                        chair.coupleWeddingGuestId = guest.id;
                                        chair.coupleWeddingGuest = guest;
                                        break;
                                    }
                                }
                            }
                        });
                    }

                    guestRecord.coupleWeddingEventTableId = tableId;
                }

                if (!prevTable) {
                    props.onGuestTableChanged();
                }
            }

            toast.success(data.message);
            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error);
            dispatch(toggleLoading(false));
            statusMessages(error)
        }
    }

    const handleSelectAllCheck = (isCheck) => {
        setSelectAll(isCheck);
        let selectedGuests = [];
        if (isCheck) {
            state.selectedFilterCollection?.forEach(fg => {
                fg?.guests?.forEach(guest => {
                    selectedGuests.push(guest.id);
                    guest.coupleWeddingGuest.companions?.forEach(companion => {
                        selectedGuests.push(companion.id);
                    });
                });
            });
        }

        setState((currentState) => ({
            ...currentState,
            selectedGuests: selectedGuests,
        }));
    }

    const handleGuestCheck = (guestId) => {
        let selectedGuests = state.selectedGuests
        let find = selectedGuests.indexOf(guestId);
        if (find > -1) {
            selectedGuests.splice(find, 1);
        } else {
            selectedGuests.push(guestId);
        }

        setState((currentState) => ({
            ...currentState,
            selectedGuests: selectedGuests,
        }));
    }

    const changeGuestItemModal = useRef(null);
    const showChangeGuestItemModal = (name, itemList) => {
        changeGuestItemModal.current.showModal(name, itemList);
    }
    const hideChangeGuestItemModal = () => {
        changeGuestItemModal.current.hideModal();
    }

    const checkActionOnMultiple = async (action) => {
        if (state.selectedGuests.length < 1) {
            toast('No guests found to perform this action.');
        } else if (action === 'delete') {
            if (!window.confirm('Are you sure you want to delete selected guests')) {
                return;
            }

            actionOnMultipleGuests({ action: action });
        } else {
            let items = [];
            state.selectedFilterCollection.forEach(item => {
                if (action === 'attendance') {
                    items.push({ id: item.name, name: capitalizeFirst(item.name) });
                } else {
                    if (item.id) {
                        let itemObject = { id: item.id, name: item.name };
                        if (action === 'table') {
                            itemObject.chairs = item.chairs;
                        }

                        items.push(itemObject);
                    }
                }
            });

            showChangeGuestItemModal(action, items);
        }
    }

    async function actionOnMultipleGuests({ action, itemId = null }) {
        try {
            dispatch(toggleLoading(true));
            const request = {
                coupleId: props.app.profile.couple.id,
                eventId: props.selectedEvent.id,
                action: action,
                collection: state.selectedFilter.id,
                itemId: itemId,
                selectedGuests: state.selectedGuests
            };
            const { data } = await actionOnMultipleSelectedGuests(request);

            if (action !== 'delete') {
                hideChangeGuestItemModal();
            }

            if (action === 'delete' || (
                state.selectedFilter.actionType !== 'group' &&
                state.selectedFilter.actionType !== 'menu'
            )) {
                props.onMajorAction();
            }

            changeFilter(state.selectedFilter);

            setState((currentState) => ({
                ...currentState,
                selectedGuests: [],
            }));
            setSelectAll(false);

            toast.success(data.message);
            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    return (
        <>
            {props.selectedEvent.id > 0 && <div className="col-md-12 mt-4">
                <div className="card">
                    <div className="card-header d-md-flex justify-content-between">
                        <InputField
                            type="text"
                            value={searchValue}
                            allBorders={true}
                            selector="search"
                            placeholder="Search guest..."
                            className="w-100"
                            mbClassName="mb-0 sm-mb-3"
                            fieldClassName="py-2 w-300px bg-white sm-w-100"
                            onHandleChange={(e) => setSearchValue(e.target.value)}
                            errors={{}}
                        />
                        <div className="sm-flex-center">
                            <button type="button" onClick={() => showWeddingGuestModal('add', 'guest')} className="btn btn-primary btn-sm mx-1">
                                <span className="bi bi-plus-lg"></span> Add Guest
                            </button>
                            {state.selectedFilter.actionType !== 'attendance' && <button type="button" onClick={() => showWeddingItemModal('add')} className="btn btn-secondary btn-sm mx-1">
                                <span className="bi bi-plus-lg"></span> Add <span className="text-capitalize">{state.selectedFilter.actionType}</span>
                            </button>}
                        </div>
                    </div>
                    <GuestListFilters
                        selectedFilter={state.selectedFilter}
                        onSelectFilter={(filter) => {
                            setSearchValue('');
                            changeFilter(filter);
                        }}
                    />
                    <div className="card-body table-responsive">
                        <div className="pb-3 d-flex">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    name="category-venues"
                                    id="category-venues"
                                    checked={selectAll}
                                    onChange={(value) => {
                                        handleSelectAllCheck(value.target.checked)
                                    }}
                                    className="form-check-input theme-color-bg w-h-17px"
                                />
                                <label className="form-check-label mt-2p5px" htmlFor="category-venues">
                                    &nbsp; {selectAll === true ? 'Un Select' : 'Select'} All
                                </label>
                            </div>
                            {state.selectedGuests.length > 0 && <nav className="nav checked-options-nav">
                                <button type="button" onClick={() => checkActionOnMultiple(state.selectedFilter.actionType)} className="btn nav-link pt-0 text-capitalize">
                                    <span className="bi bi-arrow-left-right"></span> {state.selectedFilter.actionType}
                                </button>
                                <button type="button" onClick={() => checkActionOnMultiple('delete')} className="btn nav-link pt-0">
                                    <span className="bi bi-trash"></span> Delete
                                </button>
                            </nav>}
                        </div>
                        <table className="table">
                            {state[state.filteredCollection.length > 0 ? 'filteredCollection' : 'selectedFilterCollection'].map((collection, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <thead key={`thead-${index + 2 * 2}`}>
                                            <tr className="grey-bg">
                                                <th className="va-middle bb-0"></th>
                                                <th className="va-middle bb-0 text-capitalize d-flex align-items-center">
                                                    {collection.icon && <span className={`bi bi-${collection.icon} mr-1 ${collection.color ? `text-${collection.color}` : ''}`}></span>}{collection.name} {collection.chairs ? `(${collection.chairs})` : ''}
                                                </th>
                                                <td className="va-middle">Attendance</td>
                                                <td className="va-middle">Menu</td>
                                                <td className="va-middle">List</td>
                                                <td className="va-middle">Table</td>
                                                <td className="text-center va-middle">
                                                    {collection.id && <div className="btn-group">
                                                        <button type="button" className="btn btn-sm px-2 pb-0 pt-0" data-toggle="dropdown" aria-expanded="false">
                                                            <span className="bi bi-pencil text-theme"></span>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-right p-2">
                                                            <button className="dropdown-item" type="button" onClick={() => showWeddingItemModal('edit', collection)}><span className="bi bi-pencil text-success"></span> Edit</button>
                                                            <button className="dropdown-item" type="button" onClick={() => deleteItem(collection)}><span className="bi bi-trash text-danger"></span> Delete</button>
                                                        </div>
                                                    </div>}
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody key={`tbody-${index + 3 * 3}`}>
                                            {collection.guests.map((guestRecord, indexGuest) => {
                                                return (<React.Fragment key={`glist-${guestRecord.id}`}>
                                                    <tr key={`wedding-group-guest-${indexGuest}`}>
                                                        <td className="va-middle relative p-0">
                                                            <div className="form-check mb-1p7rem">
                                                                <input
                                                                    type="checkbox"
                                                                    name="category-venues"
                                                                    id="category-venues"
                                                                    checked={state.selectedGuests.includes(guestRecord.id)}
                                                                    onChange={() => {
                                                                        handleGuestCheck(guestRecord.id)
                                                                    }}
                                                                    className="form-check-input theme-color-bg w-h-17px"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="va-middle">{guestRecord.coupleWeddingGuest.fullName} </td>
                                                        <td className="va-middle">
                                                            <Select
                                                                className="select-theme-border filter p-5px"
                                                                isClearable={false}
                                                                isSearchable={false}
                                                                placeholder="Status"
                                                                defaultValue={invitationOptions.filter(io => io.value === guestRecord.status)}
                                                                styles={selectColorStyles}
                                                                formatOptionLabel={function (option) {
                                                                    return (
                                                                        <div className="d-flex justify-content-start align-items-center">
                                                                            <span className={`${option.icon} text-${option.color} mr-2`}></span>
                                                                            <div style={{ fontWeight: '500' }}>{option.label}</div>
                                                                        </div>
                                                                    );
                                                                }}
                                                                getOptionValue={(option) => option.value}
                                                                onChange={(option) => {
                                                                    if (guestRecord.status !== option.value) {
                                                                        changeGuestStatus({
                                                                            type: 'status',
                                                                            guestRecord: guestRecord,
                                                                            guest: guestRecord.coupleWeddingGuest,
                                                                            prevStatus: guestRecord.status,
                                                                            status: option.value,
                                                                        });
                                                                    }
                                                                }}
                                                                options={invitationOptions}
                                                            />
                                                        </td>
                                                        <td className="va-middle">
                                                            <Select
                                                                className="select-theme-border filter p-5px"
                                                                isClearable={false}
                                                                isSearchable={false}
                                                                placeholder="Choose"
                                                                defaultValue={props.selectedEvent?.coupleWeddingEventMenus?.filter(menu => menu.id === guestRecord.coupleWeddingEventMenuId)}
                                                                styles={selectColorStyles}
                                                                getOptionLabel={(option) => option.name}
                                                                getOptionValue={(option) => option.id}
                                                                onChange={(option) => {
                                                                    if (guestRecord.coupleWeddingEventMenuId !== option.id) {
                                                                        changeGuestStatus({
                                                                            type: 'menu',
                                                                            guestRecord: guestRecord,
                                                                            guest: guestRecord.coupleWeddingGuest,
                                                                            menuId: option.id,
                                                                        });
                                                                    }
                                                                }}
                                                                options={props.selectedEvent.coupleWeddingEventMenus}
                                                            />
                                                        </td>
                                                        <td className="va-middle">
                                                            <Select
                                                                className="select-theme-border filter p-5px"
                                                                isClearable={false}
                                                                isSearchable={false}
                                                                placeholder="Choose"
                                                                defaultValue={props.selectedEvent?.coupleWeddingEventLists?.filter(list => list.id === guestRecord.coupleWeddingEventListId)}
                                                                styles={selectColorStyles}
                                                                getOptionLabel={(option) => option.name}
                                                                getOptionValue={(option) => option.id}
                                                                onChange={(option) => {
                                                                    if (guestRecord.coupleWeddingEventListId !== option.id) {
                                                                        changeGuestStatus({
                                                                            type: 'list',
                                                                            guestRecord: guestRecord,
                                                                            guest: guestRecord.coupleWeddingGuest,
                                                                            prevList: guestRecord.coupleWeddingEventListId,
                                                                            listId: option.id,
                                                                        });
                                                                    }
                                                                }}
                                                                options={props.selectedEvent.coupleWeddingEventLists}
                                                            />
                                                        </td>
                                                        <td className="va-middle">
                                                            <Select
                                                                className="select-theme-border filter p-5px"
                                                                isClearable={false}
                                                                isSearchable={false}
                                                                placeholder="Choose"
                                                                defaultValue={props.selectedEvent?.coupleWeddingEventTables?.filter(table => table.id === guestRecord.coupleWeddingEventTableId)}
                                                                styles={selectColorStyles}
                                                                //todo apply all new in companion select
                                                                isOptionDisabled={(option) => option.coupleWeddingEventTableChairs.filter(chair => chair.coupleWeddingGuest).length >= option.coupleWeddingEventTableChairs.length}
                                                                formatOptionLabel={function (option) {
                                                                    return (
                                                                        <>
                                                                            <div className="d-flex justify-content-start align-items-center gap-5">
                                                                                <div>{option.name}</div>
                                                                                <small> - {guestRecord.coupleWeddingEventTableId !== option.id ? `${option.coupleWeddingEventTableChairs.filter(chair => !chair.coupleWeddingGuest).length} Seats` : `${option.coupleWeddingEventTableChairs.length} Total`} </small>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                }}
                                                                getOptionValue={(option) => option.id}
                                                                onChange={(option) => {
                                                                    if (guestRecord.coupleWeddingEventTableId !== option.id) {
                                                                        if (option.coupleWeddingEventTableChairs.filter(chair => chair.coupleWeddingGuest).length >= option.coupleWeddingEventTableChairs.length) {
                                                                            alert('Table is full');
                                                                        } else {
                                                                            changeGuestStatus({
                                                                                type: 'table',
                                                                                guestRecord: guestRecord,
                                                                                guest: guestRecord.coupleWeddingGuest,
                                                                                prevTable: guestRecord.coupleWeddingEventTableId,
                                                                                tableId: option.id,
                                                                            });
                                                                        }
                                                                    }
                                                                }}
                                                                options={props.selectedEvent.coupleWeddingEventTables}
                                                            />
                                                        </td>
                                                        <td className="text-center va-middle">
                                                            <div className="btn-group">
                                                                <button type="button" className="btn dropdown-toggle btn-sm fs-20px no-arrow p-5px" data-toggle="dropdown" aria-expanded="false">
                                                                    <span className="bi bi-three-dots text-theme"></span>
                                                                </button>
                                                                <div className="dropdown-menu dropdown-menu-right p-2">
                                                                    <button className="dropdown-item" type="button" onClick={() => showWeddingGuestModal('edit', 'guest', guestRecord.coupleWeddingGuest)}><span className="bi bi-pencil text-success"></span> Edit</button>
                                                                    <button className="dropdown-item" type="button" onClick={() => deleteGuest(guestRecord)}><span className="bi bi-trash text-danger"></span> Delete</button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {guestRecord?.coupleWeddingGuest?.companions?.map((companion, indexCompanion) => {
                                                        return (<tr key={`wedding-group-guest-companion-${indexCompanion}`}>
                                                            <td className="va-middle relative p-0 no-bt">
                                                                <div className="form-check mb-1p7rem">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="category-venues"
                                                                        id="category-venues"
                                                                        checked={state.selectedGuests.includes(companion.id)}
                                                                        onChange={() => {
                                                                            handleGuestCheck(companion.id)
                                                                        }}
                                                                        className="form-check-input theme-color-bg w-h-17px"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="va-middle relative">
                                                                {companion.coupleWeddingGuest.fullName}
                                                                {companion.history}
                                                                <span className="bi bi-link companion-icon"></span>
                                                            </td>
                                                            <td className="va-middle">
                                                                <Select
                                                                    className="select-theme-border filter p-5px"
                                                                    isClearable={false}
                                                                    isSearchable={false}
                                                                    placeholder="Status"
                                                                    defaultValue={invitationOptions.filter(io => io.value === companion.status)}
                                                                    styles={selectColorStyles}
                                                                    formatOptionLabel={function (option) {
                                                                        return (
                                                                            <div className="d-flex justify-content-start align-items-center">
                                                                                <span className={`${option.icon} text-${option.color} mr-2`}></span>
                                                                                <div style={{ fontWeight: '500' }}>{option.label}</div>
                                                                            </div>
                                                                        );
                                                                    }}
                                                                    getOptionValue={(option) => option.value}
                                                                    onChange={(option) => {
                                                                        if (companion.status !== option.value) {
                                                                            changeGuestStatus({
                                                                                type: 'status',
                                                                                guestRecord: companion,
                                                                                guest: companion.coupleWeddingGuest,
                                                                                prevStatus: companion.status,
                                                                                status: option.value,
                                                                            });
                                                                        }
                                                                    }}
                                                                    options={invitationOptions}
                                                                />
                                                            </td>
                                                            <td className="va-middle">
                                                                <Select
                                                                    className="select-theme-border filter p-5px"
                                                                    isClearable={false}
                                                                    isSearchable={false}
                                                                    placeholder="Choose"
                                                                    defaultValue={props.selectedEvent?.coupleWeddingEventMenus?.filter(menu => menu.id === companion.coupleWeddingEventMenuId)}
                                                                    styles={selectColorStyles}
                                                                    getOptionLabel={(option) => option.name}
                                                                    getOptionValue={(option) => option.id}
                                                                    onChange={(option) => {
                                                                        if (companion.coupleWeddingEventMenuId !== option.id) {
                                                                            changeGuestStatus({
                                                                                type: 'menu',
                                                                                guestRecord: companion,
                                                                                guest: companion.coupleWeddingGuest,
                                                                                menuId: option.id,
                                                                            });
                                                                        }
                                                                    }}
                                                                    options={props.selectedEvent.coupleWeddingEventMenus}
                                                                />
                                                            </td>
                                                            <td className="va-middle">
                                                                <Select
                                                                    className="select-theme-border filter p-5px"
                                                                    isClearable={false}
                                                                    isSearchable={false}
                                                                    placeholder="Choose"
                                                                    defaultValue={props.selectedEvent?.coupleWeddingEventLists?.filter(list => list.id === companion.coupleWeddingEventListId)}
                                                                    styles={selectColorStyles}
                                                                    getOptionLabel={(option) => option.name}
                                                                    getOptionValue={(option) => option.id}
                                                                    onChange={(option) => {
                                                                        if (companion.coupleWeddingEventListId !== option.id) {
                                                                            changeGuestStatus({
                                                                                type: 'list',
                                                                                guestRecord: companion,
                                                                                guest: companion.coupleWeddingGuest,
                                                                                prevList: companion.coupleWeddingEventListId,
                                                                                listId: option.id,
                                                                            });
                                                                        }
                                                                    }}
                                                                    options={props.selectedEvent.coupleWeddingEventLists}
                                                                />
                                                            </td>
                                                            <td className="va-middle">
                                                                <Select
                                                                    className="select-theme-border filter p-5px"
                                                                    isClearable={false}
                                                                    isSearchable={false}
                                                                    placeholder="Choose"
                                                                    defaultValue={props.selectedEvent?.coupleWeddingEventTables?.filter(table => table.id === companion.coupleWeddingEventTableId)}
                                                                    styles={selectColorStyles}
                                                                    getOptionLabel={(option) => `${option.name} - (${option?.coupleWeddingEventTableChairs?.length} Seats Available) `}
                                                                    getOptionValue={(option) => option.id}
                                                                    onChange={(option) => {
                                                                        if (companion.coupleWeddingEventTableId !== option.id) {
                                                                            changeGuestStatus({
                                                                                type: 'table',
                                                                                guestRecord: companion,
                                                                                guest: companion.coupleWeddingGuest,
                                                                                prevTable: companion.coupleWeddingEventTableId,
                                                                                tableId: option.id,
                                                                            });
                                                                        }
                                                                    }}
                                                                    options={props.selectedEvent.coupleWeddingEventTables}
                                                                />
                                                            </td>
                                                            <td className="text-center va-middle">
                                                                <div className="btn-group">
                                                                    <button type="button" className="btn dropdown-toggle btn-sm fs-20px no-arrow p-5px" data-toggle="dropdown" aria-expanded="false">
                                                                        <span className="bi bi-three-dots text-theme"></span>
                                                                    </button>
                                                                    <div className="dropdown-menu dropdown-menu-right p-2">
                                                                        <button className="dropdown-item" type="button" onClick={() => showWeddingGuestModal('edit', 'companion', companion.coupleWeddingGuest)}><span className="bi bi-pencil text-success"></span> Edit</button>
                                                                        <button className="dropdown-item" type="button" onClick={() => deleteGuest(companion, 'companion')}><span className="bi bi-trash text-danger"></span> Delete</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>)
                                                    })}
                                                </React.Fragment>);
                                            })}
                                        </tbody>
                                    </React.Fragment>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </div>}

            <WeddingEventItemModal
                app={props.app}
                ref={weddingEventItemModal}
                selectedFilter={state.selectedFilter}
                onHideModal={hideWeddingItemModal}
                onItemCreated={(item) => addItem(item)}
                onItemUpdated={(item) => updateItem(item)}
            />

            <WeddingGuestModal
                app={props.app}
                inviteByLinkUrl={props.inviteByLinkUrl}
                ref={weddingGuestModal}
                onHideModal={(isMajorAction = false) => hideWeddingGuestModal(isMajorAction)}
                weddingEvents={props.weddingEvents}
                selectedEvent={props.selectedEvent}
                onGuestAdded={(events, count) => guestAdded(events, count)}
                onMajorAction={() => majorAction()}
                onCompanionDeleted={(guest) => props.onGuestDeleted(guest)}
            />

            <ChangeGuestItemModal
                ref={changeGuestItemModal}
                onHideModal={hideChangeGuestItemModal}
                onItemSelected={(action, itemId) => actionOnMultipleGuests({ action: action, itemId: itemId })}
            />
        </>
    );
}