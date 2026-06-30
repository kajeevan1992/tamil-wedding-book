import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import { isDateSameOrAfter } from '@utilities/CommonUtil';
import DealActionModal from "@components/vendor/storefront/deals/DealActionModal";
import ReactPaginate from 'react-paginate';
import moment from "moment";
export default function BusinessDeals() {
  const app = useSelector(state => state.app);
  const [state, setState] = useState({
    deals: {
      data: [],
      totalItems: 0,
      itemsPerPage: 5
    },

    errors: {},
  });
  useEffect(() => {
    if (app.profile?.vendor?.id) {
      loadDeals(app.profile?.vendor?.id);

    }

  }, [app.profile?.vendor]);
  const dispatch = useDispatch();
  async function loadDeals(vendorId, page = null) {
    try {
      window.scrollTo(0, 0);
      dispatch(toggleLoading(true));
      const { data } = await vendorService.loadDeals(vendorId, state.deals.itemsPerPage, page);

      setState((currentState) => ({
        ...currentState,
        deals: data,
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }
  const dealActionModal = useRef(null);
  const showDealActionModal = (action, deal = {}) => {
    dealActionModal.current.showModal(action, deal);
  }
  const hideCreateDealModal = () => {
    dealActionModal.current.hideModal();
  }
  const addDeal = (deal) => {
    const deals = state.deals.data;
    deals.unshift(deal);
    setState((currentState) => ({
      ...currentState,
      deals: {
        ...currentState.deals,
        data: deals,
        totalItems: state.deals.totalItems + 1
      },
    }));
  }
  const updateDeal = (deal) => {
    const deals = state.deals.data;
    deals[deals.indexOf(deals.find(e => e.id === deal.id))] = deal;

    setState((currentState) => ({
      ...currentState,
      deals: {
        ...currentState.deals,
        data: deals
      },
    }));
  }


  async function deleteDeal(deal) {
    try {
      if (!window.confirm(`Are you sure you want to delete ${deal.name}`)) return;
      dispatch(toggleLoading(true));
      const { data } = await vendorService.deleteDeal(deal.id);

      const deals = state.deals.data;
      deals.splice(deals.indexOf(deal), 1);
      setState((currentState) => ({
        ...currentState,
        deals: {
          ...currentState.deals,
          data: deals,
          totalItems: state.deals.totalItems - 1
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
            <h2>Deals</h2> <small> &nbsp;({state.deals.totalItems})</small>
          </div>
          {state.deals?.data?.length > 0 && <button className="btn btn-primary btn-sm" onClick={() => showDealActionModal('create')}>
            Create deal
          </button>}
        </div>
      </section>
      <section className="col-md-12">

        <div className="card mt-2">
          <div className="card-body d-flex grey-bg align-items-center ">
            <i className="bi bi-percent p-2 mr-4 dotted-circle" ></i>
            <div>
              <p className='mb-0 '>Add <b>special offers</b> to your listing to generate more interest and <b>receive more leads</b>.</p>
            </div>
          </div>
        </div>
      </section>
      {/* <section className='col-md-12'>
        <div className="card mt-3 ">
          <div className="card-header discount-div">
            <div className='card-title'><strong>Add a special discount for Hitched couples</strong></div>
            <div className='card-text w-75'>Offer a discount for couples who hire your services through Hitched. Discounts will apply to hired services.</div>
          </div>
          <div className='card-body d-flex justify-content-center '>

            <button className="btn btn-primary btn-sm mt-2" onClick={() => showDealActionModal('create')}>
              Save discount
            </button>
          </div>
        </div>
      </section> */}
      {state.deals.data.length === 0 ? <section className='col-md-12'>
        <div className="card mt-3 ">
          <div className="p-5 text-center">
            <div className='d-flex justify-content-center'>
              <i className="bi bi-percent p-2 mr-4 dotted-circle " style={{ fontSize: '2.5rem' }}></i>
            </div>

            <h5 className="mb-3 mt-3">
              Create your first deal
            </h5>
            <p className="text-muted">Offer a discount or special package to attract new business. Please contact your account manager if you are unsure about whether you have paid for the deals package</p>
            <button className="btn btn-primary btn-sm mt-2" onClick={() => showDealActionModal('create')}>
              Add deal
            </button>
          </div>
        </div>
      </section> : <section className="col-md-12 mt-3">
        <div className="page-title my-2">
          <h2 style={{ fontSize: "1.5rem" }}>Other deals</h2>
        </div>

        <div className="row">
          {/* <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column p-0 align-items-center justify-content-center">
                <div className='d-flex justify-content-center'>
                  <i className="bi bi-percent p-2 dotted-circle mb-2" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <button className="btn btn-primary btn-sm mt-2" onClick={() => showDealActionModal('create')}>
                  Add deal
                </button>
              </div>
            </div>
          </div> */}
          {state.deals.data.map((deal, key) => <div className="col-md-4 mb-4"><div className="card" key={`main-list-key-${key}`}>
            <div className="card-body position-relative p-0">
              <div className="card-tr-action-buttons w-25px">
                <button className="btn btn-sm btn-outline-primary p-2 mb-1" onClick={() => deleteDeal(deal)}>
                  <span className="bi bi-trash"></span>
                </button>
                <button className="btn btn-outline-primary btn-sm p-2" onClick={() =>
                  showDealActionModal('edit', deal)
                } >
                  <span className="bi bi-pencil"></span>
                </button>
              </div>
              {isDateSameOrAfter(deal.validity) ? (<p className="badge badge-success card-tl-status">Active</p>) : (<p className="badge badge-danger card-tl-status">Expired</p>)}

              <div className="d-flex align-items-center justify-content-center gift-icon-div">
                <i className="bi bi-gift gift-icon text-muted"></i>
              </div>

              {deal.image ? <img
                className="block app-tools-main-front-img dash-img  "
                src={app.serverPath + deal.image}
                alt="Deal Image"
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              /> : <img src="/assets/images/deal-icon-100px.png" className="block app-tools-main-front-img dash-img border-bottom border-secondary " alt="Deal Image" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
              <div className="p-3">
                <p className="text-secondary text-uppercase text-left mb-1">{deal?.type}</p>
                <h6 className=" text-capitalize text-left mb-1">{deal?.name}</h6>
                <p className="text-secondary text-left mb-0">End {moment(deal?.validity).format('DD/MM/YYYY')}</p>
              </div>
            </div>
          </div>
          </div>)}
        </div>
      </section>}

      {state.deals.totalItems > state.deals.itemsPerPage && <section className="col-md-12 mt-3">
        <ReactPaginate
          nextLabel=">"
          onPageChange={(e) => { loadDeals(app.profile?.vendor?.id, e.selected) }}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(state.deals.totalItems / state.deals.itemsPerPage)}
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

      <DealActionModal ref={dealActionModal} onHideModal={hideCreateDealModal} app={app} onDealCreated={(deal) => addDeal(deal)} onDealUpdated={(deal) => updateDeal(deal)} />
    </div>
  );
}
