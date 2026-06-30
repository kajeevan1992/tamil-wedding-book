import { forwardRef, useImperativeHandle, useState, useRef, Fragment } from "react";
import { Modal } from "@utilities/Modal";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import CreateAndInviteVendor from "@components/couple/CreateAndInviteSupplier";
import { isEmpty, isGreaterThan, isLessThan } from '@utilities/ValidateUtil';
import { formatDate, statusMessages } from "@utilities/CommonUtil";
import { createUpdateEvent, deleteEventOption } from "@services/CoupleService";
import InputField from "@components/shared/InputField";

const eventImages = [
    'hall.png',
    'wedding-reception.png',
    'breakfast.png',
    'event.png'
];

const WeddingEventModal = forwardRef((props, ref) => {
    const [state, setState] = useState({
        event: {
            coupleId: 0,
            name: '',
            displayOrder: 0,
            groups: [],
            menus: [],
            lists: [],
            tables: [],
        },
        action: 'add',
        deleteActionPerformed: false,
        group: {
            name: '',
        },
        menu: {
            name: '',
        },
        list: {
            name: '',
        },
        table: {
            name: '',
            chairs: '',
        },

        errors: {}
    });

    let modal = null;
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        showModal(coupleId, displayOrder, action, event) {
            modal = new Modal('#weddingEventModal', {
                backdrop: true
            });

            modal.show();

            let groups = [...props.groups];
            let menus = [...props.menus];
            let lists = [...props.lists];
            let tables = [...props.tables];
            // if (action === 'edit') {
            //     menus = event.coupleWeddingEventMenus.filter(({ name }) => {
            //         return name != 'Un Assigned';
            //     });

            //     lists = event.coupleWeddingEventLists.filter(({ name }) => {
            //         return name != 'Un Assigned';
            //     });
            // }

            setState((currentState) => ({
                ...currentState,
                action: action,
                event: {
                    ...currentState.event,
                    coupleId: coupleId,
                    id: action === 'add' ? '' : event.id,
                    name: action === 'add' ? '' : event.name,
                    image: action === 'add' ? '' : event.image,
                    // hasMenu: action === 'add' ? true : event.hasMenu,
                    // hasSeatingChart: action === 'add' ? true : event.hasSeatingChart,
                    displayOrder: displayOrder,
                    groups: groups,
                    menus: menus,
                    lists: lists,
                    tables: tables,
                },
                errors: {}
            }));

            setTimeout(() => {
                console.log(state.event)
            }, 3000);
        },
        hideModal() {
            modal = new Modal('#weddingEventModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        setState((currentState) => ({
            ...currentState,
            event: {
                ...currentState.event,
                [name]: value,
            }
        }));
    }

    const addItem = (type) => {
        const item = state[type];
        if (item.name.length < 1) {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} name is required`);
            return;
        }

        if (type === 'table' && item.chairs.length < 1) {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} number of chairs are required`);
            return;
        }

        const items = state.event[`${type}s`];
        items.push(item);

        setState((currentState) => ({
            ...currentState,
            [type]: {
                ...currentState[type],
                name: '',
            },
            event: {
                ...currentState.event,
                [type]: items,
            }
        }));

        if (type === 'table') {
            setState((currentState) => ({
                ...currentState,
                table: {
                    ...currentState.table,
                    chairs: '',
                }
            }));
        }

        setTimeout(() => {
            console.log(state);
        }, 3000);
    }

    const removeItem = async (type, item) => {
        if (item.id && (window.confirm('Are you sure you want to delete item?'))) {
            try {
                setState((currentState) => ({
                    ...currentState,
                    errors: {}
                }));

                dispatch(toggleLoading(true));
                const { data } = await deleteEventOption({ type: type, id: item.id });
                toast.success(data.message);

                const items = state.event[type];
                items.splice(items.indexOf(item), 1);
                setState((currentState) => ({
                    ...currentState,
                    deleteActionPerformed: true,
                    event: {
                        ...currentState.event,
                        [type]: items,
                    }
                }));
                // props.onEventOptionDelete(type, item.id);
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
        } else {
            const items = state.event[type];
            items.splice(items.indexOf(item), 1);
            setState((currentState) => ({
                ...currentState,
                event: {
                    ...currentState.event,
                    [type]: items,
                }
            }));
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((currentState) => ({
            ...currentState,
            errors: {}
        }));

        let errors = {};
        let validationFlag = true;

        if (isEmpty(state.event.name)) {
            validationFlag = false;
            errors.name = ['Name is required'];
        } else if (isLessThan(state.event.name, 3)) {
            validationFlag = false;
            errors.name = ['Name must not be less than 3 characters!'];
        } else if (isGreaterThan(state.event.name, 255)) {
            validationFlag = false;
            errors.name = ['Name must not be greater than 255 characters!'];
        }

        if (!validationFlag) {
            setState((currentState) => ({
                ...currentState,
                errors: errors
            }));
        } else {
            submit();
        }
    }

    async function submit() {
        try {
            setState((currentState) => ({
                ...currentState,
                errors: {}
            }));

            dispatch(toggleLoading(true));

            let event = state.event;
            event.action = state.action;
            const { data } = await createUpdateEvent(event);

            dispatch(toggleLoading(false));
            toast.success(data.message);

            props.onEventAction(state.action, data.event);
            props.onHideModal();
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

    return (
        <>
            <div className="modal fade" id="weddingEventModal" data-backdrop="static" data-keyboard="false" tabIndex="-1">
                <div className="modal-dialog modal-lg couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px">
                            <div className="modal-title"><span className="text-capitalize">{state.action}</span> an Event</div>
                            <button className="btn p-0" onClick={props.onHideModal}>
                                <span className="bi bi-x-lg"></span>
                            </button>
                        </div>
                        <div className="modal-body w-100">
                            <div className="row mr-0 ml-0 w-100">
                                <div className="col-12 w-100">
                                    <form
                                        className="auth-register-form col-12"
                                        action="#"
                                        method="POST"
                                        onSubmit={onSubmit}
                                    >
                                        <div className="mb-4">
                                            <InputField
                                                mbClassName="mb-3"
                                                type="text"
                                                selector="name"
                                                value={state.event.name}
                                                placeholder="Name"
                                                onHandleChange={handleInputChange}
                                                allBorders={true}
                                                errors={state.errors}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            {eventImages.map((image, index) => <button type="button" onClick={() => {
                                                setState((currentState) => ({
                                                    ...currentState,
                                                    event: {
                                                        ...currentState.event,
                                                        image: image,
                                                    }
                                                }));
                                            }} key={`event-image-${index}`} className={`btn btn-white text-center p-3 image-checkbox ${state.event.image === image ? 'checked' : ''}`}>
                                                <img src={`/assets/images/events/${image}`} />
                                                <span className="bi bi-check icon"></span>
                                            </button>)}
                                        </div>

                                        {/* <div className="d-flex justify-content-between mb-4">
                                            <label htmlFor="track-menu" className="btn btn-white pr-5 changed-checked-color">
                                                Track menus
                                                <input type="checkbox" checked={state.event.hasMenu} name="hasMenu" onChange={handleInputChange} id="track-menu" className="form-check-input w-h-17px theme-color-bg ml-2 mt-1 btn-styled-check" />
                                                <span className="badge"></span>
                                            </label>

                                            <label htmlFor="create-seating-chart" className="btn btn-white pr-5 changed-checked-color">
                                                Create seating chart
                                                <input type="checkbox" checked={state.event.hasSeatingChart} name="hasSeatingChart" onChange={handleInputChange} id="create-seating-chart" className="form-check-input w-h-17px theme-color-bg ml-2 mt-1 btn-styled-check" />
                                                <span className="badge"></span>
                                            </label>
                                        </div> */}

                                        {state.action === 'add' && <div className="mb-3">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="card mb-3">
                                                        <div className="card-header p-0 d-flex bg-white align-items-center justify-content-between">
                                                            <InputField
                                                                mbClassName="mb-0 w-100"
                                                                type="text"
                                                                selector="name"
                                                                value={state.group.name}
                                                                placeholder="Add new group"
                                                                onHandleChange={(e) => {
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        group: {
                                                                            ...currentState.group,
                                                                            name: e.target.value,
                                                                        }
                                                                    }));
                                                                }}
                                                                fieldClassName="white-bg no-brdr px-2 br-4 py-2 fs-12px"
                                                                errors={{}}
                                                            />
                                                            <button type="button" onClick={() => addItem('group')} className="btn btn-white p-2 no-brdr">
                                                                <span className="bi bi-plus-circle fs-20px"></span>
                                                            </button>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            <ul className="list-group">
                                                                {state.event.groups.map((group, index) => {
                                                                    return (<li className="list-group-item py-2 no-br no-b-lr d-flex justify-content-between align-items-center" key={`group-list-${index}`}>
                                                                        <span>{group.name}</span>
                                                                        <button type="button" onClick={() => removeItem('groups', group)} className="btn btn-white p-0 no-brdr">
                                                                            <span className="bi bi-dash-circle text-theme fs-20px"></span>
                                                                        </button>
                                                                    </li>);
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card mb-3">
                                                        <div className="card-header p-0 d-flex bg-white align-items-center justify-content-between">
                                                            <InputField
                                                                mbClassName="mb-0 w-100"
                                                                type="text"
                                                                selector="name"
                                                                value={state.menu.name}
                                                                placeholder="Add new menu choice"
                                                                onHandleChange={(e) => {
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        menu: {
                                                                            ...currentState.menu,
                                                                            name: e.target.value,
                                                                        }
                                                                    }));
                                                                }}
                                                                fieldClassName="white-bg no-brdr px-2 br-4 py-2 fs-12px"
                                                                errors={{}}
                                                            />
                                                            <button type="button" onClick={() => addItem('menu')} className="btn btn-white p-2 no-brdr">
                                                                <span className="bi bi-plus-circle fs-20px"></span>
                                                            </button>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            <ul className="list-group">
                                                                {state.event.menus.map((menu, index) => {
                                                                    return (<li className="list-group-item py-2 no-br no-b-lr d-flex justify-content-between align-items-center" key={`menu-list-${index}`}>
                                                                        <span>{menu.name}</span>
                                                                        <button type="button" onClick={() => removeItem('menus', menu)} className="btn btn-white p-0 no-brdr">
                                                                            <span className="bi bi-dash-circle text-theme fs-20px"></span>
                                                                        </button>
                                                                    </li>);
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card mb-3">
                                                        <div className="card-header p-0 d-flex bg-white align-items-center justify-content-between">
                                                            <InputField
                                                                mbClassName="mb-0 w-100"
                                                                type="text"
                                                                selector="name"
                                                                value={state.list.name}
                                                                placeholder="Add new list"
                                                                onHandleChange={(e) => {
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        list: {
                                                                            ...currentState.list,
                                                                            name: e.target.value,
                                                                        }
                                                                    }));
                                                                }}
                                                                fieldClassName="white-bg no-brdr px-2 br-4 py-2 fs-12px"
                                                                errors={{}}
                                                            />
                                                            <button type="button" onClick={() => addItem('list')} className="btn btn-white p-2 no-brdr">
                                                                <span className="bi bi-plus-circle fs-20px"></span>
                                                            </button>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            <ul className="list-group">
                                                                {state.event.lists.map((list, index) => {
                                                                    return (<li className="list-group-item py-2 no-br no-b-lr d-flex justify-content-between align-items-center" key={`list-list-${index}`}>
                                                                        <span>{list.name}</span>
                                                                        <button type="button" onClick={() => removeItem('lists', list)}
                                                                            className="btn btn-white p-0 no-brdr">
                                                                            <span className="bi bi-dash-circle text-theme fs-20px"></span>
                                                                        </button>
                                                                    </li>);
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="card mb-3">
                                                        <div className="card-header p-0 d-flex bg-white align-items-center justify-content-between">
                                                            <InputField
                                                                mbClassName="mb-0 w-100"
                                                                type="text"
                                                                selector="name"
                                                                value={state.table.name}
                                                                placeholder="Add new Table"
                                                                onHandleChange={(e) => {
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        table: {
                                                                            ...currentState.table,
                                                                            name: e.target.value,
                                                                        }
                                                                    }));
                                                                }}
                                                                fieldClassName="white-bg no-brdr px-2 br-4 py-2 fs-12px"
                                                                errors={{}}
                                                            />
                                                            <InputField
                                                                mbClassName="mb-0 w-100"
                                                                type="number"
                                                                selector="chairs"
                                                                value={state.table.chairs}
                                                                placeholder="Chairs?"
                                                                onHandleChange={(e) => {
                                                                    setState((currentState) => ({
                                                                        ...currentState,
                                                                        table: {
                                                                            ...currentState.table,
                                                                            chairs: e.target.value,
                                                                        }
                                                                    }));
                                                                }}
                                                                fieldClassName="white-bg no-brdr bl-1-grey px-2 br-4 py-2 fs-12px"
                                                                errors={{}}
                                                            />
                                                            <button type="button" onClick={() => addItem('table')} className="btn btn-white p-2 no-brdr">
                                                                <span className="bi bi-plus-circle fs-20px"></span>
                                                            </button>
                                                        </div>
                                                        <div className="card-body p-0">
                                                            <ul className="list-group">
                                                                {state.event.tables.map((table, index) => {
                                                                    return (<li className="list-group-item py-2 no-br no-b-lr d-flex justify-content-between align-items-center" key={`tables-list-${index}`}>
                                                                        <span>{table.name} ({table.chairs})</span>
                                                                        <button type="button" onClick={() => removeItem('tables', table)}
                                                                            className="btn btn-white p-0 no-brdr">
                                                                            <span className="bi bi-dash-circle text-theme fs-20px"></span>
                                                                        </button>
                                                                    </li>);
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}

                                        <hr />
                                        <div className="d-flex justify-content-end">
                                            {!state.deleteActionPerformed && <button type="button" onClick={props.onHideModal} className="btn btn-warning btn-sm mr-2">Cancel</button>}
                                            <button type="submit" className="btn btn-primary btn-sm">{state.action === 'add' ? 'Create' : 'Update'}</button>
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

export default WeddingEventModal;