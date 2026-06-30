import MapView from "@components/shared/MapView";

export default function CreateStorefrontStep2(props) {
    return (
        <>
            <div className="row">
                <section className="col-md-12">
                    <h1 className="prepareTextTitle">
                        {props.title ? props.title : 'Add your address'}
                    </h1>
                    <div className="card mt-2">
                        <div className="card-body d-flex grey-bg">
                            <i className="bi bi-map fs-3rem mr-3"></i>
                            <div>
                                <strong>Update your business location by adding your address.</strong>
                                <p className="m-0">Address must contain the street name and any additional information (building number, floor, suite, etc.).</p>
                                <small>Example: Baker Street, 221B</small>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-4">
                    <h4>Location details</h4>
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="mb-4">
                                        {/* <InputFieldAddress
                                            icon="bi bi-geo-alt"
                                            placeholder="Where your business located..."
                                            selector="address"
                                            onPlaceSelected={(place) => {
                                                // todo set the map also here
                                                props.onInputChange('user', 'address', place);
                                            }}
                                            errors={props.errors}
                                        /> */}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <MapView
                                        searchProps={{
                                            mbClassName: 'mb-3',
                                            address: props.initialData.address,
                                            icon: 'bi bi-geo-alt',
                                            placeholder: 'Business location...',
                                            selector: 'address',
                                            inputClass: 'w-400px',
                                            errors: props.errors
                                        }}
                                        onPlaceSelected={(place) => {
                                            // todo set the map also here
                                            props.onInputChange('user', 'address', place);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-2">
                    <button className="btn bt-sm btn-primary" onClick={() => props.onSubmit('step2')}>Save</button>
                </section>
            </div>
        </>
    );
}