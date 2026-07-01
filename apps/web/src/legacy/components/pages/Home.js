'use client';

import HomeScreenSlider from "./HomeScreenSlider";
import MultiCarosel from '../shared/MultiCarosel';

import { NavLink } from '../NextNavLink';
import HomePageToolsSection from './HomePageToolsSection';

function Home(props) {
  const app = props.app;

  return (
    <>
      <HomeScreenSlider app={app} />

      <HomePageToolsSection app={app} />

      <section className="wide-tb-50 ">
        <div className="container">
          <div className="mb-5 text-center">
            <h2>Featured Wedding Venues in London</h2>
          </div>
          <MultiCarosel>
            <div key={1} className="mx-1">
              <div className="wedding-listing">
                <div className="img">
                  <a href="listing-singular.html">
                    <img
                      src="/assets/images/about/pexels-luis-quintero-1560303.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center ">
                      <a href="venue.html">
                        Name<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>Address (Town, City)</small>{" "}
                    </div>
                    <div className=" text-center">
                      <span className="stars">
                        <i className="fa fa-star mt-3 fn-orange ls-1px">
                          <span className="own-text own-family">5.0 </span>
                        </i>
                      </span>
                      <small>(25)</small>
                    </div>
                    <div className="text-center mt-3">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div className="reviews mb-2">
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-size">Capacity</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-size">Starting at</span>
                      </div>
                      <div className="col-lg-4 col">
                        <span className="own-font-size"> Menu from</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-style">50-200</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-style">£10,800</span>
                      </div>
                      <div className="col-lg-4 col text-center">
                        <span className="own-font-style"> $20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div key={2} className="mx-1">
              <div className="wedding-listing">
                <div className="img">
                  <a href="venue.html">
                    <img
                      src="/assets/images/about/pexels-dimitri-kuliuk-949223.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center ">
                      <a href="venue.html">
                        Name<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>Address (Town, City)</small>{" "}
                    </div>
                    <div className=" text-center">
                      <span className="stars">
                        <i className="fa fa-star mt-3 fn-orange ls-1px">
                          <span className="own-text own-family">5.0 </span>
                        </i>
                      </span>
                      <small>(25)</small>
                    </div>
                    <div className="text-center mt-3">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div className="reviews mb-2">
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-size">Capacity</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-size">Starting at</span>
                      </div>
                      <div className="col-lg-4 col">
                        <span className="own-font-size"> Menu from</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-style">50-200</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-style">£10,800</span>
                      </div>
                      <div className="col-lg-4 col text-center">
                        <span className="own-font-style"> $20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div key={3} className="mx-1">
              <div className="wedding-listing">
                <div className="img">
                  <a href="venue.html">
                    <img
                      src="/assets/images/about/pexels-dimitri-kuliuk-1488315.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center ">
                      <a href="venue.html">
                        Name<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>Address (Town, City)</small>{" "}
                    </div>
                    <div className=" text-center">
                      <span className="stars">
                        <i className="fa fa-star mt-3 fn-orange ls-1px">
                          <span className="own-text own-family">5.0 </span>
                        </i>
                      </span>
                      <small>(25)</small>
                    </div>
                    <div className="text-center mt-3">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div className="reviews mb-2">
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-size">Capacity</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-size">Starting at</span>
                      </div>
                      <div className="col-lg-4 col">
                        <span className="own-font-size"> Menu from</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-style">50-200</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-style">£10,800</span>
                      </div>
                      <div className="col-lg-4 col text-center">
                        <span className="own-font-style"> $20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div key={4} className="mx-1">
              <div className="wedding-listing">
                <div className="img">
                  <a href="venue.html">
                    <img
                      src="/assets/images/about/pexels-krishna-studio-2293102.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center ">
                      <a href="venue.html">
                        Name<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>Address (Town, City)</small>{" "}
                    </div>
                    <div className=" text-center">
                      <span className="stars">
                        <i className="fa fa-star mt-3 fn-orange ls-1px">
                          <span className="own-text own-family">5.0 </span>
                        </i>
                      </span>
                      <small>(25)</small>
                    </div>
                    <div className="text-center mt-3">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div className="reviews mb-2">
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-size">Capacity</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-size">Starting at</span>
                      </div>
                      <div className="col-lg-4 col">
                        <span className="own-font-size"> Menu from</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col">
                        <span className="own-font-style">50-200</span>
                      </div>

                      <div className="col-lg-4 col">
                        <span className="own-font-style">£10,800</span>
                      </div>
                      <div className="col-lg-4 col text-center">
                        <span className="own-font-style"> $20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MultiCarosel>
          <div className="row">
            <div className="container ">
              <div className="row mt-4">
                <div className="col-12 d-flex flex-wrap  justify-content-center">
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Venue Catergory{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Venue Catergory{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Venue Catergory
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Venue Catergory{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Venue Catergory{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Venue Catergory
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 ">
        <div className="container">
          <div className=" mb-5 text-center">
            <h2>Featured Wedding Vendors in London</h2>
          </div>
          <MultiCarosel>
            <div className="mx-1" key={1}>
              <div className="wedding-listing">
                <div className="img">
                  <a href="Vendor.html">
                    <img
                      src="/assets/images/about/pexels-luis-quintero-1560303.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center">
                      <a href="listing-singular.html">
                        Capim Limão<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>City of London, Central London</small>
                    </div>
                    <div className=" d-flex justify-content-around  align-items-center mt-2 ">
                      <small>
                        From &nbsp; <span className="fw-7">$2,500</span>{" "}
                      </small>

                      <small>
                        <span className="stars">
                          <i className="fa fa-star  fn-orange ls-1px">
                            <span className="own-text own-family">5.0 </span>
                          </i>
                        </span>
                        <small>(25)</small>
                      </small>
                    </div>
                    <div className="text-center mt-2">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <div className=" col-12 d-flex justify-content-center ">
                        <span className="order-lg-last d-inline-flex  mb-3">
                          <a
                            className="btn btn-primary own-button"
                            href="#"
                            role="button"
                            data-toggle="modal"
                            data-target="#login_form"
                          >
                            {" "}
                            Request Pricing
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-1" key={2}>
              <div className="wedding-listing">
                <div className="img">
                  <a href="listing-singular.html">
                    <img
                      src="/assets/images/about/pexels-dimitri-kuliuk-949223.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center">
                      <a href="listing-singular.html">
                        Capim Limão<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>City of London, Central London</small>
                    </div>
                    <div className=" d-flex justify-content-around  align-items-center mt-2 ">
                      <small>
                        From &nbsp; <span className="fw-7">$2,500</span>{" "}
                      </small>

                      <small>
                        <span className="stars">
                          <i className="fa fa-star  fn-orange ls-1px">
                            <span className="own-text own-family">5.0 </span>
                          </i>
                        </span>
                        <small>(25)</small>
                      </small>
                    </div>
                    <div className="text-center mt-2">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <div className=" col-12 d-flex justify-content-center ">
                        <span className="order-lg-last d-inline-flex  mb-3">
                          <a
                            className="btn btn-primary own-button"
                            href="#"
                            role="button"
                            data-toggle="modal"
                            data-target="#login_form"
                          >
                            {" "}
                            Request Pricing
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-1" key={3}>
              <div className="wedding-listing">
                <div className="img">
                  <a href="listing-singular.html">
                    <img
                      src="/assets/images/about/pexels-dimitri-kuliuk-1488315.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center">
                      <a href="listing-singular.html">
                        Capim Limão<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>City of London, Central London</small>
                    </div>
                    <div className=" d-flex justify-content-around  align-items-center mt-2 ">
                      <small>
                        From &nbsp; <span className="fw-7">$2,500</span>{" "}
                      </small>

                      <small>
                        <span className="stars">
                          <i className="fa fa-star  fn-orange ls-1px">
                            <span className="own-text own-family">5.0 </span>
                          </i>
                        </span>
                        <small>(25)</small>
                      </small>
                    </div>
                    <div className="text-center mt-2">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <div className=" col-12 d-flex justify-content-center ">
                        <span className="order-lg-last d-inline-flex  mb-3">
                          <a
                            className="btn btn-primary own-button"
                            href="#"
                            role="button"
                            data-toggle="modal"
                            data-target="#login_form"
                          >
                            {" "}
                            Request Pricing
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-1" key={4}>
              <div className="wedding-listing">
                <div className="img">
                  <a href="listing-singular.html">
                    <img
                      src="/assets/images/about/pexels-krishna-studio-2293102.jpg"
                      alt=""
                    />
                  </a>
                  <div className="img-content">
                    <div className="top">
                      <a className="tags own-badge own-family" href="#">
                        Premium
                      </a>
                    </div>
                  </div>
                </div>
                <div className="content  rounded">
                  <div className="gap">
                    <h6 className="text-center text-muted">VENUE CATERGORY</h6>
                    <h5 className="text-center">
                      <a href="listing-singular.html">
                        Capim Limão<span className="verified"></span>
                      </a>
                    </h5>
                    <div className="text-center">
                      <small>City of London, Central London</small>
                    </div>
                    <div className=" d-flex justify-content-around  align-items-center mt-2 ">
                      <small>
                        From &nbsp; <span className="fw-7">$2,500</span>{" "}
                      </small>

                      <small>
                        <span className="stars">
                          <i className="fa fa-star  fn-orange ls-1px">
                            <span className="own-text own-family">5.0 </span>
                          </i>
                        </span>
                        <small>(25)</small>
                      </small>
                    </div>
                    <div className="text-center mt-2">
                      <i className="fa fa-tag own-text-pink"></i>
                      <span className="own-text-pink">
                        1 Promtion-10% Discount
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <div className=" col-12 d-flex justify-content-center ">
                        <span className="order-lg-last d-inline-flex  mb-3">
                          <a
                            className="btn btn-primary own-button"
                            href="#"
                            role="button"
                            data-toggle="modal"
                            data-target="#login_form"
                          >
                            {" "}
                            Request Pricing
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </MultiCarosel>
          <div className="row">
            <div className="container ">
              <div className="row mt-4">
                <div className="col-12 d-flex flex-wrap  justify-content-center">
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Espaço casamento{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Decoração casamento{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Fotógrafo casamento
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Música de casamento{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Cerimonialista{" "}
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Convites de casamento
                  </a>
                  <a className="own-buttonn mx-1 my-1" href="#">
                    Carros casamento{" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 ">
        <div className="container">
          <div className="section-title text-center">
            <h2>Real Wedding</h2>
            <p className="own-family">
              Get inspired by real couples in your area and find wedding
              suppliers you love
            </p>
          </div>
          <MultiCarosel>
            <div className="mx-1" key={1}>
              <div className="real-wedding-wrap top-heading mb-0">
                <div className="real-wedding">
                  <div className="img">
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      <img
                        src="/assets/images/realwedding/real_wedding_2.jpg"
                        className="wedding-listing "
                        alt=""
                      />
                    </a>
                  </div>
                  <ul className="list-unstyled gallery">
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_1.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_2.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <div className="load-more">
                          <small className="own-family">
                            {" "}
                            53 <br />
                            Photos
                          </small>
                        </div>
                        <img
                          src="/assets/images/realwedding/gallery_3.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="head ml-2">
                  <h6>
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      Gabriele & Vinicius
                    </a>
                  </h6>
                  <p>
                    <small>São Paulo, São Paulo </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-1" key={2}>
              <div className="real-wedding-wrap top-heading mb-0">
                <div className="real-wedding">
                  <div className="img">
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      <img
                        src="/assets/images/realwedding/real_wedding_3.jpg"
                        className="wedding-listing "
                        alt=""
                      />
                    </a>
                  </div>
                  <ul className="list-unstyled gallery">
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_4.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_5.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <div className="load-more">
                          <small className="own-family">
                            {" "}
                            53 <br />
                            Photos
                          </small>
                        </div>
                        <img
                          src="/assets/images/realwedding/gallery_6.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="head ml-2">
                  <h6>
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      Gabriele & Vinicius
                    </a>
                  </h6>
                  <p>
                    <small>São Paulo, São Paulo </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-1" key={3}>
              <div className="real-wedding-wrap top-heading mb-0">
                <div className="real-wedding">
                  <div className="img">
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      <img
                        src="/assets/images/realwedding/real_wedding_1.jpg"
                        className="wedding-listing "
                        alt=""
                      />
                    </a>
                  </div>
                  <ul className="list-unstyled gallery ">
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_7.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_8.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <div className="load-more">
                          <small className="own-family">
                            {" "}
                            53 <br />
                            Photos
                          </small>
                        </div>
                        <img
                          src="/assets/images/realwedding/gallery_9.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="head ml-2">
                  <h6>
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      Gabriele & Vinicius
                    </a>
                  </h6>
                  <p>
                    <small>São Paulo, São Paulo </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-1" key={4}>
              <div className="real-wedding-wrap top-heading mb-0">
                <div className="real-wedding">
                  <div className="img">
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      <img
                        src="/assets/images/realwedding/real_wedding_2.jpg"
                        className="wedding-listing "
                        alt=""
                      />
                    </a>
                  </div>
                  <ul className="list-unstyled gallery">
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_4.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <img
                          src="/assets/images/realwedding/gallery_5.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                    <li>
                      <a href="Wedding-Ideas-Real-Weddings.html">
                        <div className="load-more">
                          <small className="own-family">
                            {" "}
                            53 <br />
                            Photos
                          </small>
                        </div>
                        <img
                          src="/assets/images/realwedding/gallery_6.jpg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="head ml-2">
                  <h6>
                    <a href="Wedding-Ideas-Real-Weddings.html">
                      Gabriele & Vinicius
                    </a>
                  </h6>
                  <p>
                    <small>São Paulo, São Paulo </small>
                  </p>
                </div>
              </div>

            </div>
          </MultiCarosel>
          <div className="text-center mt-4">
            <button type="button" className="btn btn-outline-primary">
              View More Real Weddings <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
      <section className="callout-main">
        <div className="container-fluid pl-0">
          <div className="row callout-second">
            <div className="col-lg-6 offset-lg-1  d-flex flex-column justify-content-center ">
              <div className="ml-lg-4">
                <h1>
                  PLAN YOUR WEDDING ON THE GO
                </h1>
                <p className="lead ">
                  Download our App to Plan Anytime, Anywhere
                </p>
              </div>

              <div className="row ml-md-2 playstore-buttons">
                <div className="col-5 col-md-2 pr-3px">
                  <img src="/assets/images/about/app-store.png" alt="" />
                </div>
                <div className="col col-5 col-md-2 pl-3px">
                  <img src="/assets/images/about/google-play.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-5 mb-0 pr-0">
              <img src="/assets/images/categories/tool444.png" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 pb-30px">
        <div className="container">
          <div className="section-title text-center">
            <h2>Wedding Ideas and Tips</h2>
            <p className="own-family">
              Get inspired with the latest trends and advice from our wedding
              experts
            </p>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 no-gutters  homeCategoryItem app-article-category-item">
              <div className="homeCategoryItem__image">
                <img src="https://www.weddingwire.com/assets/img/articles/categories/articles-cat-global-1.jpg" />
              </div>
              <div className="homeCategoryItem__title">
                <a href="https://www.weddingwire.com/wedding-ideas/planning-basics--t1"
                  className="app-article-category-item-link">
                  Wedding Speeches </a>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 no-gutters homeCategoryItem app-article-category-item">
              <div className="homeCategoryItem__image">
                <img src="https://www.weddingwire.com/assets/img/articles/categories/articles-cat-global-2.jpg" />
              </div>
              <div className="homeCategoryItem__title">
                <a href="https://www.weddingwire.com/wedding-ideas/ceremony--t2"
                  className="app-article-category-item-link">
                  Real Weddings </a>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 no-gutters homeCategoryItem app-article-category-item">
              <div className="homeCategoryItem__image">
                <img src="https://www.weddingwire.com/assets/img/articles/categories/articles-cat-global-3.jpg" />
              </div>
              <div className="homeCategoryItem__title">
                <a href="https://www.weddingwire.com/wedding-ideas/reception--t3"
                  className="app-article-category-item-link">
                  Planning Essentials </a>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 no-gutters homeCategoryItem app-article-category-item">
              <div className="homeCategoryItem__image">
                <img src="https://www.weddingwire.com/assets/img/articles/categories/articles-cat-global-4.jpg" />
              </div>
              <div className="homeCategoryItem__title">
                <a href="https://www.weddingwire.com/wedding-ideas/services--t4"
                  className="app-article-category-item-link">
                  Stationery &amp; Ideas </a>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 no-gutters homeCategoryItem app-article-category-item">
              <div className="homeCategoryItem__image">
                <img src="https://www.weddingwire.com/assets/img/articles/categories/articles-cat-global-5.jpg" />
              </div>
              <div className="homeCategoryItem__title">
                <a href="https://www.weddingwire.com/wedding-ideas/fashion--t6"
                  className="app-article-category-item-link">
                  Budget </a>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4 no-gutters homeCategoryItem app-article-category-item">
              <div className="homeCategoryItem__image">
                <img src="https://www.weddingwire.com/assets/img/articles/categories/articles-cat-global-6.jpg" />
              </div>
              <div className="homeCategoryItem__title">
                <a href="https://www.weddingwire.com/wedding-ideas/health-beauty--t5"
                  className="app-article-category-item-link">
                  Stag &amp; Hen </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="popular-locations-alternate mb-0">
                <div className="wedding-listing-1">
                  <div className="img">
                    <div className="overlay-box black-bg"></div>
                    <a href="listing-singular.html">
                      <img src="/assets/images/categories/idea-1.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="content border-none mt-3">
                <div className="gap">
                  <h6 className="text-center">Wedding Hall</h6>
                  <h5 className="text-center">
                    <a href="listing-singular.html">
                      The Best Celebrity Weddings of 2021
                      <span className="verified"></span>
                    </a>
                  </h5>
                </div>
                <div></div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="popular-locations-alternate mb-0">
                <div className="wedding-listing-1">
                  <div className="img">
                    <div className="overlay-box black-bg"></div>
                    <a href="listing-singular.html">
                      <img src="/assets/images/categories/idea-2.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="content border-none mt-3">
                <div className="gap">
                  <h6 className="text-center">Wedding Hall</h6>
                  <h5 className="text-center">
                    <a href="listing-singular.html">
                      The 51 Best Engagement Gifts for Couples in 2022
                      <span className="verified"></span>
                    </a>
                  </h5>
                </div>
                <div></div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="popular-locations-alternate mb-0">
                <div className="wedding-listing-1">
                  <div className="img">
                    <div className="overlay-box black-bg"></div>
                    <a href="listing-singular.html">
                      <img src="/assets/images/categories/idea-3.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="content border-none mt-3">
                <div className="gap">
                  <h6 className="text-center">Wedding Hall</h6>
                  <h5 className="text-center">
                    <a href="listing-singular.html">
                      The 22 Wedding Gifts Guests Love to Give
                      <span className="verified"></span>
                    </a>
                  </h5>
                </div>
                <div></div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="popular-locations-alternate mb-0">
                <div className="wedding-listing-1">
                  <div className="img">
                    <div className="overlay-box black-bg"></div>
                    <a href="listing-singular.html">
                      <img src="/assets/images/categories/idea-4.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="content border-none mt-3">
                <div className="gap">
                  <h6 className="text-center">Wedding Hall</h6>
                  <h5 className="text-center">
                    <a href="listing-singular.html">
                      17 Best Plus Size Bridal Boutiques in the UK
                      <span className="verified"></span>
                    </a>
                  </h5>
                </div>
                <div></div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="text-center mt-lg-5">
                <div className="text-center">
                  <button type="button" className="btn btn-outline-primary">
                    View All Articles <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 ">
        <div className="container">
          <div className="section-title text-center">
            <h2>Join The Conversation</h2>
            <p className="own-family">
              Ask questions and get answers with the help of other engaged
              couples
            </p>
          </div>

          <div className="row">
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div className="card-shadow pos-rel box-hover">
                <div className="card-shadow-header no-brdr">
                  <h6>Wedding Shop/ Boutique</h6>
                </div>
                <div className="card-shadow-body">
                  <p className="mt-27">
                    Hitesh &amp; Priyanka were introduced to each other by their
                    respective families{" "}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center   mb-2">
                <div className="mr-3">
                  <img
                    src="/assets/images/blogs/blog_standard_img_5.jpg"
                    className="img-radius-home"
                    alt=""
                  />
                </div>
                <div className="flex-lg-grow-1  mt-text">
                  <h6 className="m-0">Micheal</h6>
                  <small>Today at 18:06</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div className="card-shadow pos-rel box-hover">
                <div className="card-shadow-header no-brdr">
                  <h6>Wedding Shop/ Boutique</h6>
                </div>
                <div className="card-shadow-body">
                  <p className="mt-27">
                    Hitesh &amp; Priyanka were introduced to each other by their
                    respective families{" "}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="mr-3">
                  <img
                    src="/assets/images/blogs/blog_standard_img_5.jpg"
                    className="img-radius-home"
                    alt=""
                  />
                </div>
                <div className="flex-lg-grow-1  mt-text">
                  <h6 className="m-0">Micheal</h6>
                  <small>Today at 18:06</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div className="card-shadow pos-rel box-hover">
                <div className="card-shadow-header no-brdr">
                  <h6>Wedding Shop/ Boutique</h6>
                </div>
                <div className="card-shadow-body">
                  <p className="mt-27">
                    Hitesh &amp; Priyanka were introduced to each other by their
                    respective families{" "}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="mr-3">
                  <img
                    src="/assets/images/blogs/blog_standard_img_5.jpg"
                    className="img-radius-home"
                    alt=""
                  />
                </div>
                <div className="flex-lg-grow-1  mt-text">
                  <h6 className="m-0">Micheal</h6>
                  <small>Today at 18:06</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div className="card-shadow pos-rel box-hover">
                <div className="card-shadow-header no-brdr">
                  <h6>Wedding Shop/ Boutique</h6>
                </div>
                <div className="card-shadow-body">
                  <p className="mt-27">
                    Hitesh &amp; Priyanka were introduced to each other by their
                    respective families{" "}
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center  mb-2">
                <div className="mr-3">
                  <img
                    src="/assets/images/blogs/blog_standard_img_5.jpg"
                    className="img-radius-home"
                    alt=""
                  />
                </div>
                <div className="flex-lg-grow-1  mt-text">
                  <h6 className="m-0">Micheal</h6>
                  <small>Today at 18:06</small>
                </div>
              </div>
            </div>


          </div>
          <div className="col-md-12">
            <div className="text-center mt-lg-5">
              <div className="text-center">
                <button type="button" className="btn btn-outline-primary">
                  View All Discussions <i className="fa fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 ">
        <div className="container">
          <h3 className="mb-3 text-left ">Dress Finder</h3>
          <div className="row">
            <div className="col-sm-6 col-md-5">
              <small className="own-family mb-5">
                Discover the latest trends in wedding dresses by top
                designers and bridesmaid dresses. Choose your favorite from
                our catalog!
              </small>
              <div className="row mt-4">
                <div className="col-7">
                  <div className="">
                    <div className="">
                      <ul className="list-unstyled  mb-0 widget-listing arrow">
                        <li className="list-style-widget">
                          <a href="dresses.html">
                            {" "}
                            <small>Wedding</small>{" "}
                          </a>
                        </li>
                        <li className="list-style-widget">
                          <a href="dresses.html">
                            <small>Wedding Dresses</small>
                          </a>
                        </li>
                        <li className="list-style-widget">
                          <a href="dress-bridesmaid.html">
                            <small>Bridesmaid Dresses</small>
                          </a>
                        </li>
                        <li className="list-style-widget">
                          <a href="dresses.html">
                            <small>Wedding Dress</small>
                          </a>
                        </li>


                      </ul>


                    </div>
                  </div>
                </div>

                <div className="col-5">
                  <div className="">
                    <div className="">
                      <ul className="list-unstyled  mb-0 widget-listing arrow">
                        <li className="list-style-widget">
                          <a href="dresses.html">
                            <small>Wedding</small>{" "}
                          </a>
                        </li>
                        <li className="list-style-widget">
                          <a href="dress-bridesmaid.html">
                            <small>Bridesmaid Dresses</small>{" "}
                          </a>
                        </li>
                        <li className="list-style-widget">
                          <a href="#">
                            <small>Wedding Dress</small>{" "}
                          </a>
                        </li>
                        <li className="list-style-widget">
                          <a href="#">
                            <small>Wedding Dresses</small>{" "}
                          </a>
                        </li>
                      </ul>

                      <div className="share-icon"></div>
                    </div>
                  </div>
                </div>
                <div className="my-3 col-12">
                  <a
                    href="dresses.html"
                    type="button"
                    className="btn btn-outline-primary fs-12px"
                  >
                    Find Your Dress{" "}
                    <i className="fa fa-arrow-right"></i>
                  </a>
                  <div className="share-icon"></div>
                </div>

              </div>
            </div>

            <div className="col-sm-6 col-md-7">
              <MultiCarosel>
                <div className="mx-1" key={1}>
                  <div className="team-style-default">
                    <div className="social-wrap">
                      <img
                        src="/assets/images/categories/dress6.png"
                        className="borderr-left-radius"
                        alt=""
                      />
                    </div>
                    <div className="tabs-text-center">
                      <p className="text-center">Wilderly Bride</p>
                    </div>
                  </div>

                </div>
                <div className="mx-1" key={2}>
                  <div className="team-style-default">
                    <div className="social-wrap">
                      <img
                        src="/assets/images/categories/dress6.png"
                        className="borderr-left-radius"
                        alt=""
                      />
                    </div>
                    <div className="tabs-text-center">
                      <p className="text-center">Le Blanc</p>
                    </div>
                  </div>
                </div>
                <div className="mx-1" key={3}>
                  <div className="team-style-default">
                    <div className="social-wrap">
                      <img
                        src="/assets/images/categories/dress6.png"
                        className="borderr-left-radius"
                        alt=""
                      />
                    </div>
                    <div className="tabs-text-center">
                      <p className="text-center">White One</p>
                    </div>
                  </div>
                </div>
                <div className="mx-1" key={4}>
                  <div className="team-style-default">
                    <div className="social-wrap">
                      <img
                        src="/assets/images/categories/dress6.png"
                        className="borderr-left-radius"
                        alt=""
                      />
                    </div>
                    <div className="tabs-text-center">
                      <p className="text-center">Pronovias</p>
                    </div>
                  </div>

                </div>
              </MultiCarosel>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 ">
        <div className="container">
          <div className="section-title text-center">
            <h2>Plan Your Destination Wedding </h2>
            <small className="own-family">
              No matter where in the world you want to get married,
              TamilWeddingBook’s directory of international wedding suppliers
              can help you celebrate
            </small>
          </div>
          <MultiCarosel lg={6} tab={5} mobile={2}>
            <div className="mx-1" key={1}>
              <div className="popular-locations-alternate mb-0 mt-4">
                <div className="overlay-box-location">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="destination-wedding.html"
                        className="text-middle"
                      >
                        Mumbai
                      </a>
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/search/location-1.png"
                  alt=""
                  className="own-image"
                />
              </div>
            </div>

            <div className="mx-1" key={2}>
              <div className="popular-locations-alternate mb-0 mt-4">
                <div className="overlay-box-location">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="destination-wedding.html"
                        className="text-middle"
                      >
                        Ahmedabad
                      </a>
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/search/location-2.png"
                  alt=""
                  className="own-image"
                />
              </div>
            </div>

            <div className="mx-1" key={3}>
              <div className="popular-locations-alternate mb-0 mt-4">
                <div className="overlay-box-location">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="destination-wedding.html"
                        className="text-middle"
                      >
                        Koltaka
                      </a>{" "}
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/search/location-3.png"
                  alt=""
                  className="own-image"
                />
              </div>
            </div>

            <div className="mx-1" key={4}>
              <div className="popular-locations-alternate mb-0 mt-4">
                <div className="overlay-box-location">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="destination-wedding.html"
                        className="text-middle"
                      >
                        Noida
                      </a>{" "}
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/search/location-4.png"
                  alt=""
                  className="own-image"
                />
              </div>
            </div>
            <div className="mx-1" key={5}>
              <div className="popular-locations-alternate mb-0 mt-4">
                <div className="overlay-box-location">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="destination-wedding.html"
                        className="text-middle"
                      >
                        Noida
                      </a>{" "}
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/search/location-5.png"
                  alt=""
                  className="own-image"
                />
              </div>
            </div>
            <div className="mx-1" key={6}>
              <div className="popular-locations-alternate mb-0 mt-4">
                <div className="overlay-box-location">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="destination-wedding.html"
                        className="text-middle"
                      >
                        Noida
                      </a>{" "}
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/search/location-6.png"
                  alt=""
                  className="own-image"
                />
              </div>

            </div>
          </MultiCarosel>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="text-center mt-lg-5">
                <div className="text-center">
                  <button type="button" className="btn btn-outline-primary">
                    See All Destination <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50">
        <div className="container">
          <div className="section-title">
            <h2>Search by Category to Find Your Wedding Suppliers</h2>
          </div>
          <div className="row justify-content-center ">

            <div className="col-11 col-sm-6 col-lg-4  pr-sm-0 mb-3" >
              <div className="popular-locations-alternate">
                <div className="overlay-box">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="right-side-map-listing.html"
                        className="text-middle"
                      >
                        WEDDING SUPPLIERS
                      </a>
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/locations/location_img_7.jpg"
                  alt=""
                  className="own-image-2"
                />
              </div>

              <div className="footer-widget">
                <ul className="list-unstyled mb-0 widget-listing arrow own-fonts-small-size">
                  {app?.categories?.map((category, index) => category?.type === 'supplier' && <li key={index} className="col-6  float-left  footer-widget-section text-break ">
                    <NavLink href="/">{category?.name}</NavLink>
                  </li>)}
                </ul>
              </div>
            </div>
            <div className="col-11 col-sm-6 col-lg-4  pr-sm-0 mb-3">
              <div className="popular-locations-alternate">
                <div className="overlay-box">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="right-side-map-listing.html"
                        className="text-middle"
                      >
                        WEDDING VENUES
                      </a>
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/locations/location_img_6.jpg"
                  alt=""
                  className="own-image-2"
                />
              </div>

              <div className="footer-widget">
                <ul className="list-unstyled mb-0 widget-listing arrow own-fonts-small-size">
                  {app?.categories?.map((category, index) => category?.type === 'venue' && <li key={index} className="col-6 float-left  footer-widget-section text-break ">
                    <NavLink href="/">{category?.name}</NavLink>
                  </li>)}
                </ul>
              </div>
            </div>
            <div className="col-11 col-sm-6 col-lg-2  pr-sm-0 mb-3">
              <div className="popular-locations-alternate">
                <div className="overlay-box">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="right-side-map-listing.html"
                        className="text-middle"
                      >
                        BRIDES
                      </a>
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/locations/location_img_7.jpg"
                  alt=""
                  className="own-image-2"
                />
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="footer-widget">
                    <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                      <li className="footer-widget-section">
                        <a href="#">Mobile Bar Services</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Music and DJs</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Stationery</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Videographers</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Planners</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Albums and Guest Books</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Fireworks</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Celebrants</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Drones</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-11 col-sm-6 col-lg-2 pr-sm-0 mb-3">
              <div className="popular-locations-alternate">
                <div className="overlay-box">
                  <div className="mt-auto">
                    <h3>
                      <a
                        href="right-side-map-listing.html"
                        className="text-middle"
                      >
                        GROOMS
                      </a>
                    </h3>
                  </div>
                </div>
                <img
                  src="/assets/images/locations/location_img_7.jpg"
                  alt=""
                  className="own-image-2"
                />
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="footer-widget">
                    <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                      <li className="footer-widget-section">
                        <a href="#">Something Different</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Speechwriting Services</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Catering</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Cars and Travel</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Accessories</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Chair Covers</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">First Dance Choreography</a>
                      </li>
                      <li className="footer-widget-section">
                        <a href="#">Nannies</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50">
        <div className="container">
          <div className="section-title ">
            <h2 className="p-0"> Wedding Suppliers by Location</h2>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="footer-widget">
                <h6 className="widget-title footer-widget-padding">
                  Channel Islands
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Guernsey</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Jersey</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-3 footer-widget-padding">
                  East Midlands - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Derbyshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Leicestershire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Lincolnshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Nottinghamshire</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-3 footer-widget-padding">
                  East – England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Bedfordshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Cambridgeshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Essex</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Hertfordshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Norfolk</a>
                  </li>
                </ul>

                <ul className="list-unstyled mt-3  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Amalfi Coast</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Basilicata</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Bologna</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Calabria</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Capri</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <h6 className="widget-title footer-widget-padding">London</h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues East Central London</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues East London</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues North London</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues North West London</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues South East London</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-5 footer-widget-padding">
                  North East – England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Durham</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Northumberland</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Tyne & Wear</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  North West - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Cheshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Cumbria</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Greater Manchester</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Isle of Man</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Lancashire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <h6 className="widget-title  footer-widget-padding">
                  Northern Ireland
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Co Antrim</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  Scotland
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Aberdeen & Deeside</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Argyll</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Central & Glasgow</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Dumfries Galloway & Ayrshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Fife & Angus</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-3 footer-widget-padding">
                  South East - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Berkshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Buckinghamshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues East Sussex</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Hampshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Isle of Wight</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-3 footer-widget-padding">
                  South West - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Bristol</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Cornwall</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Devon</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Dorset</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Gloucestershire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <h6 className="widget-title footer-widget-padding">Wales</h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Cardiff</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Carmarthenshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Ceredigion</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Conwy</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Denbighshire</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  West Midlands - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Herefordshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Shropshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Staffordshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Warwickshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues West Midlands</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  Yorkshire & Humberside
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues East Riding of Yorkshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues North Yorkshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues South Yorkshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues West Yorkshire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <h6 className="widget-title  footer-widget-padding">
                  Northern Ireland
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Co Antrim</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  Scotland
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Aberdeen & Deeside</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Argyll</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Central & Glasgow</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Dumfries Galloway & Ayrshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Fife & Angus</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  South East - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Berkshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Buckinghamshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues East Sussex</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Hampshire</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Isle of Wight</a>
                  </li>
                </ul>
                <h6 className="widget-title mt-4 footer-widget-padding">
                  South West - England
                </h6>
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Bristol</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Cornwall</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Devon</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Dorset</a>
                  </li>
                  <li className="footer-widget-padding">
                    <a href="#">Wedding Venues Gloucestershire</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50 bg-light">
        <div className="container">
          <div className="pos-rel">
            <div className="card-shadow-header py-1 px0">
              <h2 className="text-center "> TamilWeddingBook</h2>
            </div>
            <div className="card-shadow-body p-0">
              <p>
                Hitesh &amp; Priyanka were introduced to each other by their
                respective families and seemed to develop a strong liking
                towards each other instantly. They didn’t waste much time and
                gave the go-ahead to their families to take things to the next
                stage. Hence, a grand roka followed by multiple dates soon after
                and this lovely couple found themselves to be madly in love with
                each other!{" "}
              </p>

              <p>
                In short, theirs is a sweet, old-school and a happy love story.
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-dark grey-brdr"
                  placeholder="Get Latest Blog Alert"
                />
              </div>
            </div>
            <div className="col-lg-4 col-sm-4 col-4 mt-3 mt-sm-0">
              <button type="button" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="wide-tb-50">
        <div className="container">
          <div className="section-title">
            <h2 className="p-0"> Wedding Suppliers by Country</h2>
          </div>
          <div className="row">
            <div className="col-md">
              <div className="footer-widget">
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-list">
                    <a href="#">Channel Islands</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Guernsey</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Jersey</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Derbyshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Leicestershire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Lincolnshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Nottinghamshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Bedfordshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Cambridgeshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Essex</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Hertfordshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Norfolk</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Amalfi Coast</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Basilicata</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues South Yorkshire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-list">
                    <a href="#">London</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues East Central London</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues East London</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues North London</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues North West London</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">North East – England</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Durham</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Northumberland</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Tyne & Wear</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">North West - England</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Cheshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Cumbria</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Isle of Man</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Lancashire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues West Yorkshire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-list">
                    <a href="#">Northern Ireland</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Co Antrim</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Scotland</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Aberdeen & Deeside</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Argyll</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Central & Glasgow</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Fife & Angus</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">South East - England</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Berkshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Buckinghamshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Bologna</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Calabria</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Capri</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues North Yorkshire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-list">
                    <a href="#">Wales</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Cardiff</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Carmarthenshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Ceredigion</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Conwy</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Denbighshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">West Midlands - England</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Herefordshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Shropshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Staffordshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Warwickshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues West Midlands</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Yorkshire & Humberside</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues East Riding of Yorkshire</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md">
              <div className="footer-widget">
                <ul className="list-unstyled  mb-0 widget-listing arrow own-fonts-small-size">
                  <li className="footer-list">
                    <a href="#">Northern Ireland</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Co Antrim</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Scotland</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Aberdeen & Deeside</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Argyll</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues East Sussex</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Hampshire</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Isle of Wight</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">South West - England</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Bristol</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Cornwall</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Devon</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Dorset</a>
                  </li>
                  <li className="footer-list">
                    <a href="#">Wedding Venues Gloucestershire</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



    </>
  );
}

export default Home;
