function NetworkError() {
    return (
        <>
            <section className="wide-tb-90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 mx-auto col-md-8">
                            <div className="text-center">
                                <div className="notfound">
                                    <div className="notfound-404">
                                        <h1>5<span>0</span><span>0</span></h1>
                                    </div>
                                </div>
                                <h2>Network Error!</h2>
                                <p>There was a problem connecting to network</p>
                                <a href="/" className="btn btn-primary btn-sm mt-4">Try again?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default NetworkError;