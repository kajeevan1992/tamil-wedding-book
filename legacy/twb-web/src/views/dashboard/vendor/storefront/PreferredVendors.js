import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import SearchVendorModal from "@components/vendor/storefront/preferred_vendor/SearchVendorModal";
import PreferredVendors from "@components/vendor/storefront/preferred_vendor/PreferredVendors";
import PreferredByOtherVendors from "@components/vendor/storefront/preferred_vendor/PreferredByOtherVendors";
import { useSearchParams } from 'react-router-dom';

export default function PreferredSuppliers() {
  const app = useSelector(state => state.app);
  const [state, setState] = useState({
    preferredVendors: [],
    preferredByOther: [],
    preferredVendorIds: [],
    // preferredByOtherVendorIds: [],
    preferredType: 'by-me',

    errors: {},
  });

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (app.profile?.vendor?.id) {
      loadPreferredVendors(app.profile?.vendor?.id);

      if (searchParams.has('preferredtab')) {
        setState((currentState) => ({
          ...currentState,
          preferredType: 'by-them'
        }));
      }
    }

  }, [app.profile?.vendor]);

  const dispatch = useDispatch();
  async function loadPreferredVendors(vendorId) {
    try {
      window.scrollTo(0, 0);
      dispatch(toggleLoading(true));
      const { data } = await vendorService.loadPreferredVendors(vendorId);
      const preferredVendorIds = data.preferreds.map(vendor => {
        return vendor.preferredVendor.id;
      });
      // const preferredByOtherVendorIds = data.preferredsByOther.map(vendor => {
      //   return vendor.preferredVendor.id;
      // });
      setState((currentState) => ({
        ...currentState,
        preferredVendors: data.preferreds,
        preferredByOther: data.preferredsByOther,
        preferredVendorIds: preferredVendorIds,
        // preferredByOtherVendorIds: preferredByOtherVendorIds
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }
  const vendorSearchModal = useRef(null);
  const showSearchVendorModal = (action, deal = {}) => {
    vendorSearchModal.current.showModal(action, deal);
  }
  const hideSearchVendorModal = () => {
    vendorSearchModal.current.hideModal();
  }
  const addVendor = (vendor) => {
    const vendors = state.preferredVendors;
    vendors.unshift(vendor);
    const preferredVendorIds = state.preferredVendorIds;
    preferredVendorIds.push(vendor.preferredVendor.id);

    setState((currentState) => ({
      ...currentState,
      preferredVendors: vendors,
      preferredVendorIds: preferredVendorIds
    }));
  }

  async function deletePreferredVendor(vendor, type) {
    try {
      if (!window.confirm(`Are you sure you want to delete ${vendor[type === 'by-me' ? 'preferredVendor' : 'vendor'].user.fullName}`)) return;
      dispatch(toggleLoading(true));
      const { data } = await vendorService.deletePreferredVendor(vendor.id);

      if (type === 'by-me') {
        const preferredVendors = state.preferredVendors;
        preferredVendors.splice(preferredVendors.indexOf(vendor), 1);
        setState((currentState) => ({
          ...currentState,
          preferredVendors: preferredVendors,
        }));
      } else {
        const preferredByOther = state.preferredByOther;
        preferredByOther.splice(preferredByOther.indexOf(vendor), 1);
        setState((currentState) => ({
          ...currentState,
          preferredByOther: preferredByOther,
        }));
      }


      dispatch(toggleLoading(false));
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  async function acceptPreferredVendorInvitation(vendor) {
    try {
      dispatch(toggleLoading(true));
      const { data } = await vendorService.acceptPreferredVendorInvitation(vendor.id);

      const preferredByOther = state.preferredByOther;
      preferredByOther[preferredByOther.indexOf(vendor)].status = true;
      setState((currentState) => ({
        ...currentState,
        preferredByOther: preferredByOther,
      }));

      dispatch(toggleLoading(false));
      toast.success(data.message);
    } catch (error) {
      console.log(error)
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  return (<div className="row">
    <div className="col-md-12 mb-3">
      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item">
          <button type="button" className={`nav-link ${state.preferredType === 'by-me' ? 'active' : ''}`} onClick={() => {
            setState((currentState) => ({
              ...currentState,
              preferredType: 'by-me',
            }));
          }}>My Preferred</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link ${state.preferredType === 'by-them' ? 'active' : ''}`} onClick={() => {
            setState((currentState) => ({
              ...currentState,
              preferredType: 'by-them',
            }));
          }}>Preferred Me</button>
        </li>
      </ul>
    </div>


    {(state.preferredType === 'by-me' ? <PreferredVendors app={app} preferredVendors={state.preferredVendors} onDelete={(vendor) => deletePreferredVendor(vendor,)} onShowModal={() => showSearchVendorModal()} /> :

      <PreferredByOtherVendors app={app} preferredVendors={state.preferredByOther} onDelete={(vendor) => deletePreferredVendor(vendor, 'by-them')} onAccept={(vendor) => acceptPreferredVendorInvitation(vendor)} />)}

    <SearchVendorModal ref={vendorSearchModal} preferredVendorIds={state.preferredVendorIds} onHideModal={hideSearchVendorModal} app={app} onVendorAdded={(vendor) => addVendor(vendor)} />
  </div>)
}