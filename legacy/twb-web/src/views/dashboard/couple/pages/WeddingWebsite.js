function WeddingWebsite() {
    return (
        <>
            <div>
                <div className="container wide-tb-50">
                    <div className="row">
                        <div className="col-md-6 ">
                            <img src="/assets/images/dashboard/wedding_website_photo.png" alt="" />
                        </div>
                        <div className="col-md-1"></div>
                        <div className="col-md-5 mt-5 text-end"> <br /><br /><br />
                            <h2 className="mt-3">Great choice, Kajee Kj! Who are you marrying?</h2>
                            <form action="">
                                <div className="row">
                                    <div className="col-md-6">
                                        <input className=" form-control border-bottom" type="text"
                                            placeholder="Your partner’s name" />
                                    </div>
                                    <div className="col-md-6">
                                        <input className="border-bottom form-control" type="text"
                                            placeholder="Your partner’s name" />
                                    </div>
                                    <div className="">
                                        <input className="border-bottom form-control" type="date"
                                            placeholder="24/03/2021" />
                                    </div>
                                </div>
                                <a href="wedding_template.html" className="btn rounded-pill btn-danger mt-5">Create My
                                    Website</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WeddingWebsite;