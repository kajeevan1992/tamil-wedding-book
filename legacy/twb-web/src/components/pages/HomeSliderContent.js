import GlobalSearch from "./GlobalSearch";
export default function HomeSliderContent(props) {
    return (
        <div className="slider-content">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center text-white fw-6">Find the Perfect Wedding Vendor</h2>
                        <p className="lead txt-white text-center own-family mb-5">“Search Tamil Wedding Suppliers by Category,
                            Location or Name”</p>

                        <GlobalSearch app={props.app} />

                        <div className="d-none d-md-block">
                            <p className="lead txt-white text-center own-family my-sm-4 mt-md-5">Or browse popular searches</p>
                            <div className="slider-category gap-5">
                                <a className="text-center">
                                    <i className="tamilweddingbook_camera_alt"></i> <br />
                                    <span className="own-family">Photography</span>
                                </a>

                                <a className="text-center">
                                    <i className="tamilweddingbook_flowers"></i> <br />
                                    <span className="own-family">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Florist&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>

                                <a className="text-center">
                                    <i className="tamilweddingbook_music"></i> <br />
                                    <span className="own-family">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Music&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                </a>

                                <a className="text-center">
                                    <i className="tamilweddingbook_fashion"></i><br />
                                    <span className="own-family">&nbsp;&nbsp;Dressing&nbsp;&nbsp;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}