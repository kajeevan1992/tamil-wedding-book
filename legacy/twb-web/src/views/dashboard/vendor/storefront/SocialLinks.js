import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import InputField from "@components/shared/InputField";
import * as validateUtil from '@utilities/ValidateUtil';
export default function SocialLinks() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    links: {
      vendorId: '',
      facebook: '',
      instagram: '',
      twitter: '',
      pinterest: ''
    },

    errors: {},
  });

  useEffect(() => {
    if (app.profile?.vendor?.id) {
      loadLinks(app.profile?.vendor?.id);
    }
  }, [app.profile?.vendor]);

  const dispatch = useDispatch();
  async function loadLinks(vendorId, page = null) {
    try {
      window.scrollTo(0, 0);
      dispatch(toggleLoading(true));
      const { data } = await vendorService.getSocialLinks(vendorId, page);

      if (data !== null) {
        setState((currentState) => ({
          ...currentState,
          links: data,
        }));
      }


      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  const handleInputChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setState((currentState) => ({
      ...currentState,
      links: {
        ...currentState.links,
        [name]: value,
      }
    }));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      window.scrollTo(0, 0);
      dispatch(toggleLoading(true));
      const { data } = await vendorService.updateSocialLinks(app.profile?.vendor?.id, state.links);

      if (data !== null) {
        setState((currentState) => ({
          ...currentState,
          links: data,
        }));
      }

      toast.success('Social links updated');
      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }
  return (<div className="row">
    <section className="col-md-12">
      <div className="d-flex justify-content-between align-items-center">
        <div className="page-title">
          <h2>Social networks</h2>
        </div>
      </div>
    </section>
    <section className="col-md-12">
      <div className="card mt-3 ">
        <div className="card-header social-div">

          <div className="card-title text-center">Showcase your personality and recent work by sharing your socials with couples on Tamil Wedding Book</div>
        </div>
        <div className="card-body">
          <div className="card-text text-center">Share your social handles with us and increase the chances to have your pictures posted on our socials. When we make a post with one of your photos, we'll tag your business</div>
          <form action="#" method="POST" onSubmit={onSubmit}>
            <div className="row mt-4 ">
              <div className="col-md-6">
                <InputField
                  icon="fa fa-facebook"
                  mbClassName="mb-3"
                  type="url"
                  selector="facebook"
                  value={state.links.facebook}
                  placeholder="https://www.facebook.com/business-details"
                  onHandleChange={handleInputChange}
                  errors={state.errors}
                />
              </div>
              <div className="col-md-6">
                <InputField
                  icon="fa fa-instagram"
                  mbClassName="mb-3"
                  type="url"
                  selector="instagram"
                  value={state.links.instagram}
                  placeholder="https://www.instagram.com/business-details"
                  onHandleChange={handleInputChange}
                  errors={state.errors}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <InputField
                  icon="fa fa-twitter"
                  mbClassName="mb-3"
                  type="url"
                  selector="twitter"
                  value={state.links.twitter}
                  placeholder="https://www.twitter.com/business-details"
                  onHandleChange={handleInputChange}
                  errors={state.errors}
                />
              </div>
              <div className="col-md-6">
                <InputField
                  icon="fa fa-pinterest"
                  mbClassName="mb-3"
                  type="url"
                  selector="pinterest"
                  value={state.links.pinterest}
                  placeholder="https://www.pinterest.com/business-details"
                  onHandleChange={handleInputChange}
                  errors={state.errors}
                />
              </div>
            </div>
            <div className="d-flex align-items-center flex-column">
              <button type='submit' className="btn btn-primary btn-sm mt-2">Save</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>)
}