import React, { useRef } from "react";
import { useSelector } from "react-redux";
import BadgeCodeActionModal from "../../../../components/vendor/storefront/tamilWeddingBookButton/BadgeCodeActionModal";
export default function TamilWeddingBookButton() {
  const app = useSelector(state => state.app);

  const badgeCodeActionModal = useRef(null);
  const showBadgeCodeActionModal = (action, badgeCode = {}) => {
    badgeCodeActionModal.current.showModal(action, badgeCode);
  }
  const hideCreateBadgeCodeModal = () => {
    badgeCodeActionModal.current.hideModal();
  }

  return (<div className="row">
    <section className="col-md-12">
      <div className="d-flex justify-content-between align-items-center">
        <div className="page-title">
          <h2>TamilWeddingBook button</h2>
        </div>
      </div>
    </section>
    <section className='col-md-12'>
      <div className="card mt-2">
        <div className="card-body d-flex grey-bg align-items-center">
          <i className="bi bi-arrow-repeat fs-3rem mr-3 align-items-center "></i>
          <div>
            <strong>We are happy to help you generate more business.</strong>
            <p className="mb-0">Choose the size that best suits your website and paste the HTML code of your TamilWeddingBook button onto your site. Thank you very much for working with us!</p>
          </div>
        </div>
      </div>
    </section>
    <section className='col-md-12'>
      <div className="row">
        <div className="col-md-6">
          <div className="card mt-3 ">
            <div className='card-body d-flex flex-column align-items-center'>
              <img className=" my-3 badge-image" src="/assets/images/about/Tamil_Wedding_Book.png" alt='logo' />
              <p>154 x 45</p>
              <button className="btn btn-primary btn-sm mt-2 mb-3" onClick={() => { showBadgeCodeActionModal('create') }}>
                Get badge code
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mt-3 ">
            <div className='card-body d-flex flex-column align-items-center'>
              <img className=" my-3 badge-image" src="/assets/images/about/Tamil_Wedding_Book.png" alt='logo' />
              <p>250 x 73</p>
              <button className="btn btn-primary btn-sm mt-2 mb-3" onClick={() => { showBadgeCodeActionModal('create') }}>
                Get badge code
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <BadgeCodeActionModal ref={badgeCodeActionModal} onHideModal={hideCreateBadgeCodeModal} app={app} onBadgeCodeCreated={(badgeCode) => { }} onBadgeCodeUpdated={(badgeCode) => { }} />
  </div>);
}