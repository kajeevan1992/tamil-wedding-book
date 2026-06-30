import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "@utilities/Modal";
import InputField from "@components/shared/InputField";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from "react-redux";
import * as validateUtil from '@utilities/ValidateUtil';
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import { copyToClipboard } from "@utilities/CommonUtil";

const BadgeCodeActionModal = forwardRef((props, ref) => {
  const [state, setState] = useState({
    badgeCode: `<a rel='nofollow' href='https://www.hitched.co.uk' title='Hitched.co.uk'><img alt='Hitched.co.uk' src='https://www.hitched.co.uk/images/sellos/partner--pp345323.png' style='border-width:0px;' /></a>`,
    action: 'create',
    errors: {},
  });




  let modal = null;
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    showModal(action, badgeCode) {
      modal = new Modal('#createBadgeCodeModal', {
        backdrop: true
      });

      setState((currentState) => ({
        ...currentState,
        badgeCode: action === 'edit' ? badgeCode : {
          name: '',
          description: '',
          price: ''
        },

        action: action,
      }));




      modal.show();
    },
    hideModal() {
      modal = new Modal('#createBadgeCodeModal', {
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
      badgeCode: {
        ...currentState.badgeCode,
        [name]: value,
      }
    }));
  }

  return (
    <>
      <div className="modal fade" id="createBadgeCodeModal" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="createBadgeCodeModal">
        <div className="modal-dialog couple-dashboard-step-modal">
          <div className="modal-content">
            <div className="modal-header fs-16px">
              <div className="modal-title text-capitalize">Your BadgeCode</div>
              <button className="btn p-0" onClick={props.onHideModal}>
                <span className="bi bi-x-lg"></span>
              </button>
            </div>
            <div className="modal-body w-100">
              <div className="row mr-0 ml-0 w-100">
                <div className="col-12 w-100 d-flex justify-content-center">
                  <div className="col-md-12 pb-3">
                    <div className="row">
                      <div className="col-md-12 d-flex flex-column align-items-center  ">
                        <textarea id="badgeCode" name="badgeCode" rows="4" cols="50" className="textarea-input p-3">
                          {state.badgeCode}
                        </textarea>
                        <button className="btn btn-primary btn-sm mt-3 text-uppercase " onClick={() => { copyToClipboard(state.badgeCode) }}>
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default BadgeCodeActionModal;