import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import { formatDate } from '@utilities/CommonUtil';
import EventActionModal from "@components/vendor/storefront/events/EventActionModal";
import ReactPaginate from 'react-paginate';

export default function BusinessEvent() {
  const app = useSelector(state => state.app);
  const [state, setState] = useState({
    events: {
      data: [],
      totalItems: 0,
      itemsPerPage: 5
    },

    errors: {},
  });

  useEffect(() => {
    if (app.profile?.vendor?.id) {
      loadEvents(app.profile?.vendor?.id);

    }

  }, [app.profile?.vendor]);

  const dispatch = useDispatch();
  async function loadEvents(vendorId, page = null) {
    try {
      window.scrollTo(0, 0);
      dispatch(toggleLoading(true));
      const { data } = await vendorService.loadEvents(vendorId, state.events.itemsPerPage, page);

      setState((currentState) => ({
        ...currentState,
        events: data,
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  const eventActionModal = useRef(null);
  const showEventActionModal = (action, event = {}) => {
    eventActionModal.current.showModal(action, event);
  }
  const hideCreateEventModal = () => {
    eventActionModal.current.hideModal();
  }

  const addEvent = (event) => {
    const events = state.events.data;
    events.unshift(event);
    setState((currentState) => ({
      ...currentState,
      events: {
        ...currentState.events,
        data: events,
        totalItems: state.events.totalItems + 1
      },
    }));
  }

  const updateEvent = (event) => {
    const events = state.events.data;
    events[events.indexOf(events.find(e => e.id === event.id))] = event;

    setState((currentState) => ({
      ...currentState,
      events: {
        ...currentState.events,
        data: events
      },
    }));
  }


  async function deleteEvent(event) {
    try {
      if (!window.confirm(`Are you sure you want to delete ${event.name}`)) return;
      dispatch(toggleLoading(true));
      const { data } = await vendorService.deleteEvent(event.id);

      const events = state.events.data;
      events.splice(events.indexOf(event), 1);
      setState((currentState) => ({
        ...currentState,
        events: {
          ...currentState.events,
          data: events,
          totalItems: state.events.totalItems - 1
        },
      }));

      dispatch(toggleLoading(false));
      toast.success(data.message);
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  return (
    <div className="row">
      <section className="col-md-12">
        <div className="d-flex justify-content-between align-items-center">
          <div className="page-title">
            <h2>Events</h2> <small> &nbsp;({state.events.totalItems})</small>
          </div>
          {state.events?.data?.length > 0 && <button className="btn btn-primary btn-sm" onClick={() => showEventActionModal('create')}>
            Create event
          </button>}
        </div>
      </section>

      {state.events?.data?.length < 1 && <>
        <section className='col-md-12'>
          <div className="card mt-2">
            <div className="card-body d-flex grey-bg">
              <div>
                <strong>Add details about upcoming events you are hosting!</strong>
                <p>Events encourage couples to attend and learn more about your business. Please contact your account manager if you are unsure about whether you have paid for this feature.</p>
              </div>
            </div>
          </div>
        </section>
        <section className='col-md-12'>
          <div className="card mt-3">
            <div className="p-center text-center">
              <span className="bi bi-calendar-date" style={{ fontSize: '5rem' }}></span>
              <h5 className="mb-3 mt-3">
                Create your first event
              </h5>
              <h6 className="text-muted">Attract couples by announcing your events here</h6>
              <button className="btn btn-primary btn-sm mt-2" onClick={() => showEventActionModal('create')}>
                Create event
              </button>
            </div>
          </div>
        </section>
      </>}
      {state.events?.data?.length > 0 && <section className="col-md-12 mt-3">
        {state.events.data.map((event, index) => <div className="card mt-2">
          <div className="card-body row d-flex align-items-center" key={index}>
            <div className="col-md-2 d-flex flex-column justify-content-center align-items-center">
              <div className="card w-75 py-2">
                <h5 className="text-center mt-2">{formatDate(event.startDate, 'DD')}</h5>
                <h5 className="text-secondary text-center mb-2">{formatDate(event.startDate, 'MMM')}</h5>
              </div>
              <p className="text-theme mt-1 mb-0 ">PENDING</p>
            </div>
            <div className='col-md-7'>
              <p className='text-secondary  text-uppercase fs-1 mb-1' style={{ fontSize: '0.9rem' }}>{event.eventType}</p>
              <h6 style={{ fontSize: '1.05rem' }}>{event.name}</h6>
              <p className='text-secondary fs-1' style={{ fontSize: '0.9rem' }}>{`Start On ${formatDate(event.startDate, 'MMM Do YY')} (${event.startTime})`} <br /> {`End On ${formatDate(event.endDate, 'MMM Do YY')} ${event.endTime}`}</p>
            </div>
            <div className="col-md-3">
              <div className="d-flex justify-content-end">
                <button className="btn btn-sm btn-outline-primary mr-1" onClick={() => deleteEvent(event)}>
                  <span className="bi bi-trash"></span>
                </button>
                <button className="btn btn-primary btn-sm" onClick={() =>
                  showEventActionModal('edit', event)
                } >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>)}
      </section>}

      {state.events.totalItems > state.events.itemsPerPage && <section className="col-md-12 mt-3">
        <ReactPaginate
          nextLabel=">"
          onPageChange={(e) => { loadEvents(app.profile?.vendor?.id, e.selected) }}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(state.events.totalItems / state.events.itemsPerPage)}
          previousLabel="<"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination sm justify-content-center"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </section>}

      <EventActionModal ref={eventActionModal} onHideModal={hideCreateEventModal} app={app} onEventCreated={(event) => addEvent(event)} onEventUpdated={(event) => updateEvent(event)} />
    </div>
  );
}
