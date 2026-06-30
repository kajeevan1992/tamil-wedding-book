import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toggleLoading } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import * as validateUtil from '@utilities/ValidateUtil';
import 'react-quill/dist/quill.snow.css';
import { Rating } from 'react-simple-star-rating';
import { statusMessages } from "@utilities/CommonUtil";

export default function Badges() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    reviews: [],

    errors: {},
  });

  useEffect(() => {
    if (app.profile?.vendor?.id) {
      // todo load reviews
    }
  }, [app.profile?.vendor]);

  const dispatch = useDispatch();

  return (<div className="row">
    <section className="col-md-12">
      <h1 className="prepareTextTitle">Tamil Wedding Book Rated™</h1>
      <div className="card mt-2">
        <div className="card-body d-flex grey-bg d-flex justify-content-between align-items-center">
          <span className="stars">
            <i
              className="fa fa-star"
              aria-hidden="true"
              style={{ fontSize: "50px" }}
            ></i>
          </span>
          <div className="ml-3">
            <h4>Get reviews from your couples</h4>
            <div>
              <small>
                Reviews are critical when it comes time to choose a supplier. Encourage your past couples to leave a review about their experience with your business.
              </small>
            </div>
          </div>
          <div className="ml-3">
            <NavLink to={`/${app.profile.role}/reviews`}
              end className="btn btn-sm btn-primary" style={{ width: '150px' }}>Request Review</NavLink>
          </div>
        </div>
      </div>
    </section>

    <section className="col-md-12 mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <img src="https://cdn1.hitched.co.uk/assets/img/badges/rated/badge-rated-2.png" style={{ width: '80%' }} />
              <div className="mt-2 mb-1">
                <div className="card-title mb-1">
                  <strong>2 reviews</strong>
                </div>
                <small>Get 2 more reviews to earn the next Hitched Rated badge.</small>
              </div>
            </div>
            <div className="card-footer">
              <NavLink to={`/${app.profile.role}/reviews`}
                end className="btn btn-sm btn-primary" style={{ width: '150px' }}>Request Review</NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>)
}