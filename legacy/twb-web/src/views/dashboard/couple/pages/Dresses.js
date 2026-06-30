function Dresses() {
    return (
        <>
            <div>
                <div className="container wide-tb-50">
                    <div className="row">
                        <div className="col-lg-12 mt-3">
                            <ul className="nav nav-pills my-listing-tab  justify-content-center nav-fill"
                                id="pills-tab1" role="tablist">
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-dresses-manage-tab" data-toggle="pill"
                                        href="#all-dresses-manage" role="tab" aria-controls="all-dresses-manage"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-1.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Dresses</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-suits-manage-tab" data-toggle="pill"
                                        href="#all-suits-manage" role="tab" aria-controls="all-suits-manage"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-2.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Suits</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="mother-of-bride-tab" data-toggle="pill"
                                        href="#mother-of-bride" role="tab" aria-controls="mother-of-bride"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-3.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Mother of the bride</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-bridesmaids-tab" data-toggle="pill"
                                        href="#all-bridesmaids" role="tab" aria-controls="all-bridesmaids"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-4.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Bridesmaids</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-jewellery-manage-tab" data-toggle="pill"
                                        href="#all-jewellery-manage" role="tab" aria-controls="all-jewellery-manage"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-j.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Jewellery</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-shoes-manage-tab" data-toggle="pill"
                                        href="#all-shoes-manage" role="tab" aria-controls="all-shoes-manage"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-6.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Shoes</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-underwear-manage-tab" data-toggle="pill"
                                        href="#all-underwear-manage" role="tab" aria-controls="all-underwear-manage"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-7.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Underwear</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" id="all-cufflinks-manage-tab" data-toggle="pill"
                                        href="#all-cufflinks-manage" role="tab" aria-controls="all-cufflinks-manage"
                                        aria-selected="false">
                                        <img src="/assets/images/dashboard/nav-image-8.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Cufflinks</small>
                                    </a>
                                </li>
                                <li className="nav-item nav-bottom-link" role="presentation">
                                    <a className="nav-link" href="all-ring-manage.html">
                                        <img src="/assets/images/dashboard/nav-image-9.png" width="40" height="40"
                                            alt="" />
                                        <small className="d-block mt-2 fn-bold">Rings</small>
                                    </a>
                                </li>
                            </ul>
                            <hr />
                            <div className="tab-content" id="pills-tabContent2">
                                <div className="tab-pane fade show active" id="all-dresses-manage" role="tabpanel"
                                    aria-labelledby="all-dresses-manage-tab">
                                    <div className="container wide-tb-50">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <h5 className="text-danger mx-3">Categories</h5>
                                                <div className="nav flex-column nav-pills budget-tab" id="v-pills-tab"
                                                    role="tablist" aria-orientation="vertical">
                                                    <a className="nav-link  nav-list-item" id="v-pills-venue-tab"
                                                        data-toggle="pill" href="#v-pills-venue" role="tab"
                                                        aria-controls="v-pills-venue" aria-selected="false"><i
                                                            className="tamilweddingbook_venue"></i> <span>All</span>
                                                    </a>
                                                    <a className="nav-link nav-list-item" id="v-pills-videographer-tab"
                                                        data-toggle="pill" href="#v-pills-videographer" role="tab"
                                                        aria-controls="v-pills-videographer"
                                                        aria-selected="false"><i
                                                            className="tamilweddingbook_location_heart"></i>
                                                        <span>Dresses</span> </a>
                                                    <a className="nav-link nav-list-item" id="v-pills-invitations-tab"
                                                        data-toggle="pill" href="#v-pills-invitations" role="tab"
                                                        aria-controls="v-pills-invitations" aria-selected="false"><i
                                                            className="tamilweddingbook_heart_envelope"></i>
                                                        <span>Suits</span> </a>
                                                    <a className="nav-link  nav-list-item" id="v-pills-favors-gifts-tab"
                                                        data-toggle="pill" href="#v-pills-favors-gifts" role="tab"
                                                        aria-controls="v-pills-favors-gifts"
                                                        aria-selected="false"><i
                                                            className="tamilweddingbook_love_gift"></i>
                                                        <span>Mother of the bride</span> </a>
                                                    <a className="nav-link  nav-list-item" id="v-pills-cake-tab"
                                                        data-toggle="pill" href="#v-pills-cake" role="tab"
                                                        aria-controls="v-pills-cake" aria-selected="false"><i
                                                            className="tamilweddingbook_cake_floor"></i>
                                                        <span>Bridesmaids </span> </a>
                                                    <a className="nav-link nav-list-item" id="v-pills-dress-attire-tab"
                                                        data-toggle="pill" href="#v-pills-dress-attire" role="tab"
                                                        aria-controls="v-pills-dress-attire"
                                                        aria-selected="false"><i
                                                            className="tamilweddingbook_fashion"></i>
                                                        <span>Jewellery</span> </a>
                                                    <a className="nav-link nav-list-item" id="v-pills-dress-attire-tab"
                                                        data-toggle="pill" href="#v-pills-dress-attire" role="tab"
                                                        aria-controls="v-pills-dress-attire"
                                                        aria-selected="false"><i
                                                            className="tamilweddingbook_fashion"></i>
                                                        <span>Shoes</span> </a>
                                                    <a className="nav-link nav-list-item" id="v-pills-dress-attire-tab"
                                                        data-toggle="pill" href="#v-pills-dress-attire" role="tab"
                                                        aria-controls="v-pills-dress-attire"
                                                        aria-selected="false"><i
                                                            className="tamilweddingbook_fashion"></i>
                                                        <span>Rings</span> </a>


                                                </div>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="row">
                                                    <div className="col-md-12  mb-4">
                                                        <h3>Bridesmaids Dreseses</h3>
                                                    </div>
                                                    <div className="col-md-12 text-center">
                                                        <div className="custom-card">
                                                            <img src="/assets/images/dashboard/nav-image-10.png"
                                                                width="96" height="111" alt="" />
                                                            <p className="mt-5">You Don't Have Any Wedding Dresses Saved
                                                            </p>
                                                            <a href="browse_wedding_dresses.html"
                                                                className="btn rounded-pill btn-danger">Browse
                                                                Wedding
                                                                Dresses</a>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 mt-5">
                                                        <h5>Top Wedding Dreseses desingers</h5>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-2.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Martina
                                                                                        Liana</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-3.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Moonlight
                                                                                        Bridal</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-4.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Etoile</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-5.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Allure
                                                                                        Bridals</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-6.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Essense of
                                                                                        Austrila</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-7.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Ladybird</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">
                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-2.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight">
                                                                                        Sottero and
                                                                                        Midgley</h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6 col-6 pr-0 mt-2">
                                                                <a href="couples-dashboard-all-dresses-detail.html"
                                                                    blank="_blank">

                                                                    <div className="blog-wrap-home">
                                                                        <div className="post-content">
                                                                            <div className="post-img">
                                                                                <img src="/assets/images/dashboard/gallery-image-3.png"
                                                                                    height="150" alt="" />
                                                                            </div>
                                                                            <div className="home-content">
                                                                                <div className="mt-auto">
                                                                                    <h4
                                                                                        className="blog-title post-title own-weight post-title own-weight">
                                                                                        Madison James
                                                                                    </h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="custom-button text-center mt-4">
                                                            <a href="couples-dashboard-all-dresses.html"
                                                                className="btn btn-outline-danger btn-sm text-center">View
                                                                More Design
                                                                <i className="fa fa-arrow-right"></i>
                                                            </a>
                                                        </div>
                                                        <div className="mt-3">
                                                            <h5>You Might Be Interested in These Suppliers for
                                                                Your
                                                                Wedding</h5>
                                                        </div>
                                                        <div className="row card-shadow-body">
                                                            <div className="col-lg-3 col-md-6">
                                                                <div className="wedding-listing own-wedding-list">
                                                                    <div className="img">
                                                                        <a href="listing-singular.html">
                                                                            <img src="/assets/images/dashboard/card-gallery-image-1.png"
                                                                                alt="" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="content border-none">
                                                                        <div className="gap">
                                                                            <h3 className="fs-14px">Benvenuto
                                                                            </h3>
                                                                            <small className="text-muted">Bridalwear
                                                                                Shops
                                                                            </small>
                                                                            <h6 className="mt-3"><a
                                                                                href="listing-singular.html"><i
                                                                                    className="fa fa-star text-warning"></i>
                                                                                3.9 (22)
                                                                                West London</a></h6>
                                                                        </div>
                                                                        <div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button type="button" role="presentation"
                                                                    className="owl-prev own-prev-btn"><i
                                                                        className="fa fa-chevron-left"></i></button>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6">
                                                                <div className="wedding-listing own-wedding-list">
                                                                    <div className="img">
                                                                        <a href="#">
                                                                            <img src="/assets/images/dashboard/card-gallery-image-2.png"
                                                                                alt="" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="content border-none">
                                                                        <div className="gap">
                                                                            <h3 className="fs-14px">Chelsea
                                                                                Peers
                                                                            </h3>
                                                                            <small className="text-muted">Bridalwear
                                                                                Shops
                                                                            </small>
                                                                            <h6 className="mt-3"><a
                                                                                href="listing-singular.html"><i
                                                                                    className="fa fa-star text-warning"></i>
                                                                                2.8 (89)
                                                                                Ewell, Surrey</a></h6>
                                                                        </div>
                                                                        <div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6">
                                                                <div className="wedding-listing own-wedding-list">
                                                                    <div className="img">
                                                                        <a href="#">
                                                                            <img src="/assets/images/dashboard/card-gallery-image-3.png"
                                                                                alt="" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="content border-none">
                                                                        <div className="gap">
                                                                            <h3 className="fs-14px">The Elegant
                                                                                Harp
                                                                            </h3>
                                                                            <small className="text-muted">Bridalwear
                                                                                Shops
                                                                            </small>
                                                                            <h6 className="mt-3"><a
                                                                                href="listing-singular.html"><i
                                                                                    className="fa fa-star text-warning"></i>
                                                                                1.0 (1)
                                                                                South West London</a></h6>
                                                                        </div>
                                                                        <div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3 col-md-6">
                                                                <div className="wedding-listing own-wedding-list">
                                                                    <div className="img">
                                                                        <a href="#">
                                                                            <img src="/assets/images/dashboard/card-gallery-image-4.png"
                                                                                alt="" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="content border-none">
                                                                        <div className="gap">
                                                                            <h3 className="fs-14px"> Daniel
                                                                                Bridal Couture
                                                                            </h3>
                                                                            <small className="text-muted">Bridalwear
                                                                                Shops
                                                                            </small>
                                                                            <h6 className="mt-3"><a
                                                                                href="listing-singular.html"><i
                                                                                    className="fa fa-star text-warning"></i>
                                                                                3.8 (3)
                                                                                South West London</a></h6>
                                                                        </div>
                                                                        <div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button type="button" role="presentation"
                                                                    className="owl-next own-next-btn"><i
                                                                        className="fa fa-chevron-right"></i></button>
                                                            </div>
                                                        </div>
                                                        <div className="custom-button text-center mt-3">
                                                            <button
                                                                className="btn btn-outline-danger btn-sm text-center">View
                                                                More
                                                                <i className="fa fa-arrow-right"></i>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dresses;