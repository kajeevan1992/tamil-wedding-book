import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import MenuActionModal from "@components/vendor/storefront/menus/MenuActionModal";

export default function BusinessMenus() {
  const app = useSelector(state => state.app);
  const [state, setState] = useState({
    menus: {
      data: [],
      totalItems: 0,
      itemsPerPage: 8
    },

    errors: {},
  });

  useEffect(() => {
    if (app.profile?.vendor?.id) {
      loadMenus(app.profile?.vendor?.id);

    }

  }, [app.profile?.vendor]);

  const dispatch = useDispatch();
  async function loadMenus(vendorId, page = null) {
    try {
      window.scrollTo(0, 0);
      dispatch(toggleLoading(true));
      const { data } = await vendorService.loadMenus(vendorId, state.menus.itemsPerPage, page);

      setState((currentState) => ({
        ...currentState,
        menus: data,
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  const menuActionModal = useRef(null);
  const showMenuActionModal = (action, menu = {}) => {
    menuActionModal.current.showModal(action, menu);
  }
  const hideCreateMenuModal = () => {
    menuActionModal.current.hideModal();
  }

  const addMenu = (menu) => {
    const menus = state.menus.data;
    menus.unshift(menu);
    setState((currentState) => ({
      ...currentState,
      menus: {
        ...currentState.menus,
        data: menus,
        totalItems: state.menus.totalItems + 1
      },
    }));
  }

  const updateMenu = (menu) => {
    const menus = state.menus.data;
    menus[menus.indexOf(menus.find(e => e.id === menu.id))] = menu;

    setState((currentState) => ({
      ...currentState,
      menus: {
        ...currentState.menus,
        data: menus
      },
    }));
  }


  async function deleteMenu(menu) {
    try {
      if (!window.confirm(`Are you sure you want to delete ${menu.name}`)) return;
      dispatch(toggleLoading(true));
      const { data } = await vendorService.deleteMenu(menu.id);

      const menus = state.menus.data;
      menus.splice(menus.indexOf(menu), 1);
      setState((currentState) => ({
        ...currentState,
        menus: {
          ...currentState.menus,
          data: menus,
          totalItems: state.menus.totalItems - 1
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
            <h2>Menu</h2> <small> &nbsp;({state.menus.totalItems})</small>
          </div>
        </div>
      </section>
      <section className='col-md-12'>
        <div className="card mt-2">
          <div className="card-body d-flex grey-bg">
            <i className="bi bi-cup-hot fs-3rem mr-3 align-items-center "></i>
            <div>
              <strong>Add the Menus You Offer to Couples</strong>
              <p className="mb-0">Share menus highlighting the cuisines you offer, serving style, bar options, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {state.menus?.data?.length < 1 ?
        <section className='col-md-12'>
          <div className="card mt-3">
            <div className="p-center text-center">
              <span className="bi bi-cup-hot" style={{ fontSize: '5rem' }}></span>
              <h5 className="mb-3 mt-3">
                Add your first menu
              </h5>
              <h6 className="text-muted">Attract couples by announcing your menus here</h6>
              <button className="btn btn-primary btn-sm mt-2" onClick={() => showMenuActionModal('create')}>
                Add menu
              </button>
            </div>
          </div>
        </section> : <section className="col-md-12 mt-3"><div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column p-0 align-items-center justify-content-center">
                <div className='d-flex justify-content-center'>
                  <i className="bi bi-cup-hot p-2 dotted-circle mb-2" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <button className="btn btn-primary btn-sm mt-2" onClick={() => showMenuActionModal('create')}>
                  Add Menu
                </button>
              </div>
            </div>
          </div>

          {state.menus.data.map((menu, key) => <div className="col-md-4 mb-4"><div className="card" key={`main-list-key-${key}`}>
            <div className="card-body position-relative p-0">
              <div className="card-tr-action-buttons w-25px">
                <button className="btn btn-sm btn-outline-primary p-2 mb-1" onClick={() => deleteMenu(menu)}>
                  <span className="bi bi-trash"></span>
                </button>
                <button className="btn btn-outline-primary btn-sm p-2" onClick={() =>
                  showMenuActionModal('edit', menu)
                } >
                  <span className="bi bi-pencil"></span>
                </button>
              </div>

              <img src="/assets/images/menu-icon.png" className="block app-tools-main-front-img dash-img border-bottom border-secondary " alt="Menu Image" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <div className="p-3 text-center">
                <h6 className="text-capitalize mb-1">{menu?.name}</h6>
              </div>
            </div>
          </div>
          </div>)}
        </div>
        </section>}

      {state.menus.totalItems > state.menus.itemsPerPage && <section className="col-md-12 mt-3">
        <ReactPaginate
          nextLabel=">"
          onPageChange={(e) => { loadMenus(app.profile?.vendor?.id, e.selected) }}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={Math.ceil(state.menus.totalItems / state.menus.itemsPerPage)}
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

      <MenuActionModal ref={menuActionModal} onHideModal={hideCreateMenuModal} app={app} onMenuCreated={(menu) => addMenu(menu)} onMenuUpdated={(menu) => updateMenu(menu)} />
    </div>
  );
}
