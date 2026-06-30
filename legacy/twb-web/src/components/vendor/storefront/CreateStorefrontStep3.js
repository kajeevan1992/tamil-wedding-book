import DragDrop from "@components/shared/DragDrop";
import { NavLink } from 'react-router-dom';

export default function CreateStorefrontStep3(props) {
    console.log(props.initialData)
    return (
        <>
            <div className="row">
                <section className="col-md-12">
                    <h1 className="prepareTextTitle">
                        {props.title ? props.title : 'Add 10 photos including cover image'}
                    </h1>
                    <div className="card mt-2">
                        <div className="card-body d-flex grey-bg">
                            <i className="bi bi-camera fs-3rem mr-3"></i>
                            <div>
                                <strong>The best way to showcase your products or services to couples is to include at least 8 photos to summarise your best work.</strong>
                                <p className="m-0">Storefronts with more photos typically receive more enquiries.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-4">
                    <h4>Drag or click to add photos</h4>
                    <div className="card mt-3">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12">
                                    <DragDrop
                                        content={
                                            <div className="text-center c-p p-5">
                                                <i className="bi bi-images fs-6rem"></i> <br />
                                                <small>GIF, JPG or PNG format Max 5MB</small><br /> <br />
                                                <p>Drag and drop your photos here. Once uploaded, you can select and drag images to reorder below.</p>
                                            </div>
                                        }
                                        fileUploaded={(file) => props.onInputChange('vendorStoreFiles', null, file, 'add')}
                                        accept={{
                                            'image/*': ['.jpeg', '.png', '.jpg', '.gif']
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="col-md-12 mt-4">
                    {
                        props.errors.images &&
                        <div className="invalid-feedback mb-3">
                            {props.errors.images[0]}
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="card">
                                <img src={props.initialData.photo?.name ? URL.createObjectURL(props.initialData.photo) : props.initialData.photo ? (props.app.serverPath + props.initialData.photo) : '/assets/images/placeholder.png'} className="w-100" style={{ height: '150px', objectFit: 'cover' }} alt="Storefront main" />
                                <input type="file" hidden id="storefront-main-image" onChange={(e) => props.onInputChange('user', 'photo', e, 'change')} accept="image/jpeg, image/png, image/jpg, image/gif" />
                                <div className="card-body p-1">
                                    <p className="my-2 fs-13px">Cover Image</p>
                                    <hr className="my-0" />
                                    <div className="d-flex align-items-center my-2" style={{ height: '32px' }}>
                                        <hr className="my-0" />
                                        <label htmlFor="storefront-main-image" className="btn btn-info btn-sm m-0 btn-block"><span className="bi bi-arrow-repeat"></span> Change</label>
                                    </div>
                                </div>
                            </div>
                            {
                                props.errors.photo &&
                                <div className="invalid-feedback mb-3">
                                    {props.errors.photo[0]}
                                </div>
                            }
                        </div>
                        {props.initialData.vendor.vendorStoreFiles && <>
                            {props.initialData.vendor.vendorStoreFiles.map((vendorFile, index) => <div className="col-md-3 mb-3" key={index}>
                                <div className="card">
                                    <img src={vendorFile.file ? URL.createObjectURL(vendorFile.file) : (props.app.serverPath + vendorFile.path)} className="w-100" style={{ height: '150px', objectFit: 'cover' }} alt="Storefront" />
                                    <div className="card-body p-1">
                                        <input
                                            type="text"
                                            placeholder="Enter title"
                                            className="txt-card-transparent my-2"
                                            value={vendorFile.description} onChange={(e) => props.onInputChange('vendorStoreFiles', index, e.target.value, 'description')} />
                                        <hr className="my-0" />
                                        <div className="d-flex align-items-center my-2" style={{ height: '30px' }}>
                                            <button className="btn btn-danger btn-sm btn-block" onClick={() => vendorFile.id ? props.deleteImage(index, vendorFile) : props.onInputChange('vendorStoreFiles', index, vendorFile, 'delete')}>
                                                <span className={`bi ${vendorFile.id ? 'bi-trash' : 'bi-x-lg'}`}></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                        </>}
                    </div>
                </section>

                <section className="col-md-12 mt-2">
                    <small>Published content must meet Tamil Wedding's Book <NavLink className="text-theme">Terms of Use</NavLink>.</small><br />
                    <button className="btn bt-sm btn-primary" onClick={() => props.onSubmit('step3')}>Save</button>
                </section>
            </div>
        </>
    );
}