import { useState } from 'react'
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DataLabelChart from "@components/shared/DataLabelChart";
import { Rating } from 'react-simple-star-rating';

export default function Dashboard() {
  const [activeTab, setactiveTab] = useState('impressions')
  const app = useSelector(state => state.app);
  let stepsCount = 0;
  if (app.profile.storeFrontFirstStepDone) stepsCount++;
  if (app.profile.storeFrontSecondStepDone) stepsCount++;
  if (app.profile.storeFrontThirdStepDone) stepsCount++;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body d-flex justify-content-between">
          <div className="text-center">
            <img
              src="/assets/images/blogs/icon-dashboard.png"
              className=""
              width="30%"
              alt=""
            />
            <div className="mt-3">
              <h5><a href="">Leads received</a></h5>
              <small className="mt-3">in the last 12 months</small>
            </div>
          </div>

          <div className="text-center">
            <img
              src="/assets/images/blogs/icon-dashboard-2.png"
              className=""
              width="30%"
              alt=""
            />
            <div className="mt-3">
              <h5><a href="">Reviews</a></h5>
              <small className="mt-3">in the last 12 months</small>
            </div>
          </div>

          <div className="text-center">
            <img
              src="/assets/images/blogs/icon-dashboard-3.png"
              className=""
              width="30%"
              alt=""
            />
            <div className="mt-3">
              <h5><a href="">Storefront impressions</a></h5>
              <small className="mt-3">in the last 12 months</small>
            </div>
          </div>

          <div className="text-center">
            <img
              src="/assets/images/blogs/icon-dashboard-4.png"
              className=""
              width="30%"
              alt=""
            />
            <div className="mt-3">
              <h5><a href="">number views</a></h5>
              <small className="mt-3">in the last 12 months</small>
            </div>
          </div>
        </div>
      </div>

      {app.profile.stepsDone ? (
        <section className="alert alert-info mt-5">
          <div>
            <h4>Your business information is being verified.</h4>
            <small>
              Click the link in the email we just sent you to confirm your
              Tamil Wedding Book account.
              <br />
              Our Content Team is in the process of{" "}
              <b>verifying your business information</b> and will publish
              your Shopfront once approved.
            </small>
            <br />
            <div className="mt-4">
              <small>
                Telephone: 0700 205 1531 - Email:
                feedback@tamilweddingbook.email.com
              </small>
            </div>
          </div>
        </section>
      ) : (<section className="alert alert-danger mt-5">
        <strong>Your storefront isn't active yet</strong>
        <p className="mt-2 mb-0">Complete the steps to activate your storefront so couples can find you on Tamil Wedding Book. <NavLink to="create-storefront">Go back to the steps</NavLink></p>
      </section>)}


      <section className="mt-5">
        <div className="container p-0">
          <div className="row">
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mt-3">Analytics</h3>
                <div>
                  <select
                    className="theme-combo adminFiltersBox__select"
                    name="state"
                    data-select2-id="select2-data-1-0k65"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <option
                      value="AL"
                      data-select2-id="select2-data-3-qowf"
                    >
                      Last 12 Months
                    </option>
                    <option
                      value="WY"
                      data-select2-id="select2-data-7-y5v7"
                    >
                      Rating: Lowest
                    </option>
                    <option
                      value="WY"
                      data-select2-id="select2-data-8-y70v"
                    >
                      Rating: Dates
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <div className="page mt-3">
                  <div className="nesttabs">
                    <div className="card">
                      <div className="row">
                        <div className="col-3">
                          <div
                            className="nav flex-column"
                            id="v-pills-tab"
                            role="tablist"
                            aria-orientation="vertical"
                          >
                            <a
                              className="nav-link active"
                              id="v-pills-home-tab"
                              data-toggle="pill"
                              href="#v-pills-home"
                              role="tab"
                              aria-controls="v-pills-home"
                              aria-selected="false"
                              onClick={() => setactiveTab('impressions')}
                            >
                              <div className="descrip">
                                <h3 className="text-center">0</h3>
                                <h6 className="text-center">
                                  Storefront Impressions
                                </h6>
                              </div>
                            </a>
                            <a
                              className="nav-link"
                              id="v-pills-profile-tab"
                              data-toggle="pill"
                              href="#v-pills-profile"
                              role="tab"
                              aria-controls="v-pills-profile"
                              aria-selected="false"
                              onClick={() => setactiveTab('leads')}
                            >
                              <div className="descrip">
                                <h3 className="text-center">0</h3>
                                <h6 className="text-center">Lead Received</h6>
                              </div>
                            </a>
                            <a
                              className="nav-link"
                              id="v-pills-messages-tab"
                              data-toggle="pill"
                              href="#v-pills-messages"
                              role="tab"
                              aria-controls="v-pills-messages"
                              aria-selected="false"
                              onClick={() => setactiveTab('')}
                            >
                              <div className="descrip">
                                <h3 className="text-center">0</h3>
                                <h6 className="text-center">
                                  Viewed phone number
                                </h6>
                              </div>
                            </a>
                            <a
                              className="nav-link"
                              id="v-pills-settings-tab"
                              data-toggle="pill"
                              href="#v-pills-settings"
                              role="tab"
                              aria-controls="v-pills-settings"
                              aria-selected="false"
                              onClick={() => setactiveTab('website')}
                            >
                              <div className="descrip">
                                <h3 className="text-center">0</h3>
                                <h6 className="text-center">
                                  {" "}
                                  Website Clicks
                                </h6>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div className="col-9 nesttabscontent">
                          <div
                            className="tab-content"
                            id="v-pills-tabContent"
                          >
                            <div
                              className="tab-pane fade active show"
                              id="v-pills-home"
                              role="tabpanel"
                              aria-labelledby="v-pills-home-tab"
                            >
                              <div className="mt-4">
                                <h4>Storefront impressions</h4>
                                <p className="mt-3">
                                  View the monthly storefront impressions you received on Tamil Wedding Book.
                                </p>
                              </div>
                              <div className="row">
                                <div className="col-md-11">
                                  <DataLabelChart />
                                </div>
                              </div>

                              <div className="mt-3 d-flex justify-content-end">
                                <p className="mr-3">
                                  Last 12 months: <b>0</b>
                                </p>
                                <p className="mr-4">
                                  {" "}
                                  Total: <b>0</b>
                                </p>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="v-pills-profile"
                              role="tabpanel"
                              aria-labelledby="v-pills-profile-tab"
                            >
                              <div className="mt-4">
                                <h4>Leads received</h4>
                                <p className="mt-3">
                                  View the monthly leads you received on Tamil Wedding Book.
                                </p>
                              </div>
                              <div className="row">
                                <div className="col-md-11">
                                  <DataLabelChart />
                                </div>
                              </div>

                              <div className="mt-3 d-flex justify-content-end">
                                <p className="mr-3">
                                  Last 12 months: <b>0</b>
                                </p>
                                <p className="mr-4">
                                  {" "}
                                  Total: <b>0</b>
                                </p>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade "
                              id="v-pills-messages"
                              role="tabpanel"
                              aria-labelledby="v-pills-messages-tab"
                            >
                              <div className="mt-4">
                                <h4>Clicks to view phone number</h4>
                                <p className="mt-3">
                                  This graph shows the number of times couples interested in your services have clicked to view your telephone.
                                </p>
                              </div>
                              <div className="row">
                                <div className="col-md-11">
                                  <DataLabelChart />
                                </div>
                              </div>

                              <div className="mt-3 d-flex justify-content-end">
                                <p className="mr-3">
                                  Last 12 months: <b>0</b>
                                </p>
                                <p className="mr-4">
                                  {" "}
                                  Total: <b>0</b>
                                </p>
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="v-pills-settings"
                              role="tabpanel"
                              aria-labelledby="v-pills-settings-tab"
                            >
                              <div className="mt-4">
                                <h4>Website clicks</h4>

                              </div>
                              <div className="row">
                                <div className="col-md-11">
                                  <DataLabelChart />
                                </div>
                              </div>

                              <div className="mt-3 d-flex justify-content-end">
                                <p className="mr-3">
                                  Last 12 months: <b>0</b>
                                </p>
                                <p className="mr-4">
                                  {" "}
                                  Total: <b>0</b>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {activeTab !== "" && <hr className="mt-0" />}
                      {activeTab === 'impressions' ? <div className="card-body text-center">
                        <h5 className="mt-0">How can I get more impressions?</h5>
                        <button className="btn btn-sm btn-primary mt-2">Upgrade</button>
                      </div> : activeTab === "leads" ? <div className="card-body ">
                        <h5 className="mt-0">Want more leads?</h5>
                        <div className="row">
                          <div className="col-md-10">
                            <div className="row">
                              <div className="col-md-6">
                                <NavLink className='d-flex align-items-center'>
                                  <i className="bi bi-check2 check-icon mr-1"></i>
                                  <a style={{ fontSize: '0.85rem' }}>Update your photo gallery</a>
                                </NavLink>
                              </div>
                              <div className="col-md-6">
                                <NavLink className='d-flex '>
                                  <i className="bi bi-check2 check-icon mr-1"></i>
                                  <a style={{ fontSize: '0.85rem' }}>Request reviews from past clients</a>
                                </NavLink>
                              </div>
                              <div className="col-md-6">
                                <NavLink className='d-flex '>
                                  <i className="bi bi-check2 check-icon mr-1"></i>
                                  <a style={{ fontSize: '0.85rem' }}>Publish promostions and special offers</a>
                                </NavLink>
                              </div>
                              <div className="col-md-6">
                                <NavLink className='d-flex align-items-center'>
                                  <i className="bi bi-check2 check-icon mr-1"></i>
                                  <a style={{ fontSize: '0.85rem' }}>Promote your events</a>
                                </NavLink>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <button className="btn btn-sm btn-primary mt-2">Upgrade</button>
                          </div>
                        </div>

                      </div> : activeTab === "website" ? <div className="card-body text-center">
                        <h5 className="mt-0">Want to display your website URL on your Listing and track website clicks?</h5>
                        <button className="btn btn-sm btn-primary mt-2">Upgrade</button>
                      </div> : null}
                    </div>
                  </div>
                </div>
              </div>
              <section className="card mt-5">
                <div className="p-center text-center">
                  <span className="bi bi-envelope" style={{ fontSize: '3rem' }}></span>
                  <h5 className="mb-3 mt-3">
                    You haven't received any enquiries yet.
                  </h5>
                  <h6 className="text-muted">Want to get more enquiries?</h6>
                  <button className="btn btn-primary btn-sm mt-2">
                    Upgrade
                  </button>
                </div>
              </section>
              <section className="card mt-5">
                <div className="p-center text-center">
                  <span className="bi bi-stars" style={{ fontSize: '3rem' }}></span>
                  <h5 className="mb-3 mt-3">
                    You haven't received any reviews yet!
                  </h5>
                  <h6 className="text-muted">
                    Reviews are critical when it comes the time to choose
                    a supplier. Encourage your past couples to leave
                    reviews about their experience with your business.
                  </h6>
                  <button className="btn btn-primary mt-2 btn-sm">
                    Request Reviews
                  </button>
                </div>
              </section>
            </div>
            <div className="col-lg-4 p-0">
              <div className="sidebar-secondary col-lg-12 col-md-6">
                <div className="">
                  <div className="own-show">
                    <div>
                      <div className="inner ">
                        <div className="card-body row border-bottom">
                          <div className="col-lg-8">
                            <h5 className="text-muted">
                              Complete Your Listing
                            </h5>
                            <p className="mt-3">
                              Only 7 steps left to <br />
                              complete your listing!
                            </p>
                          </div>
                          <div className="col-lg-4 p-0">
                            <CircularProgressbar value={stepsCount} maxValue={3} text={`${stepsCount} / 3`} styles={buildStyles({
                              trailColor: '#d6d6d6',
                              pathColor: '#28a745',
                              textColor: '#555555',
                            })} />
                          </div>
                        </div>
                        <div className="card-bottom mt-3 mb-3">
                          <div className="text-center">
                            <NavLink to={`/${app.profile.role}/create-storefront`}
                              end className="btn btn-sm btn-link text-theme">Complete Storefront</NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sidebar-secondary col-lg-12 col-md-6 mt-5">
                <div className="">
                  <div className="own-show">
                    <div>
                      <div className="inner ">
                        <div className="card-body row border-bottom">
                          <div className="col-lg-12">
                            <h5 className="text-muted">
                              FEATURE HIGHLIGHT
                            </h5>
                            <div className="">
                              <Rating
                                initialValue={0}
                                readonly={true}
                                size={20}
                                allowFraction={true}
                              /> &nbsp;
                              <small>0.0 / 0.5</small>
                            </div>
                            <h5 className="text-muted mt-3">
                              Boost your credibility with reviews
                            </h5>
                            <p className="text-muted mt-3">
                              Quickly and easily request reviews with a
                              customised email to your past couples.
                            </p>
                          </div>
                        </div>
                        <div className="card-bottom mt-3 mb-3">
                          <div className="text-center">
                            <NavLink to={`/${app.profile.role}/reviews`}
                              end className="btn btn-sm btn-link text-theme">Request Review</NavLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-secondary col-lg-12 col-md-6 mt-5">
                <div
                  className="widget"
                  style={{ backgroundColor: "#efefef" }}
                >
                  <div className="footer-widget">
                    <h3 className="widget-title">
                      Plan your wedding from your smartphone
                    </h3>
                    <div className="widget-contact">
                      <div className="row">
                        <div className="col-lg-3 col-md-2">
                          <img
                            src="/assets/images/blogs/logo-dummy.png"
                            alt=""
                          />
                        </div>
                        <div className="col-lg-9 col-md-10">
                          <p>
                            Plan your wedding wherever and whenever you want
                            on the TamilWeddingBook App.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <img
                          src="/assets/images/about/app-store.png"
                          alt=""
                        />
                      </div>
                      <div className="col">
                        <img
                          src="/assets/images/about/google-play.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
