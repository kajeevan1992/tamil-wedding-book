import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { IoMdHeartEmpty } from "react-icons/io";
import { changeSelectedVendor, removeSelectedVendor } from "@services/CoupleService";
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import { toast } from 'react-hot-toast';

function FilteredVendors(props) {
    const [state, setState] = useState({
        selectedVendor: {
            coupleVendor: null,
            noteActive: false,
            telActive: false,
        },

        errors: {}
    });

    const toggleCardBody = (coupleVendor, activeTab) => {
        let selectedVendor = {
            coupleVendor: coupleVendor,
            activeTab: activeTab,
        };
        setState((currentState) => ({
            ...currentState,
            selectedVendor: selectedVendor,
        }));
    }

    const dispatch = useDispatch();
    const submit = async (selected, key, value, e = null) => {
        try {
            // dispatch(toggleLoading(true));

            const coupleVendor = { ...selected };
            coupleVendor[key] = value;
            await changeSelectedVendor(coupleVendor);

            // dispatch(toggleLoading(false));
        } catch (error) {
            // dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    const removeVendor = async (vendor) => {
        if (!window.confirm('Are you sure you want to remove selected vendor')) {
            return;
        }
        try {
            dispatch(toggleLoading(true));
            const { data } = await removeSelectedVendor({ id: vendor.id });
            props.onRemoveVendor(vendor.id);
            dispatch(toggleLoading(false));
            toast.success(data.message);
        } catch (error) {
            dispatch(toggleLoading(false));
            if (statusMessages(error) === 'validation-errors') {
                setState((currentState) => ({
                    ...currentState,
                    errors: error.response.data.errors
                }));
            }
        }
    }

    function VendorsList() {
        return props.selectedCategory.map((category, key) => {
            return (
                <div className="col-lg-4 col-md-6 text-center mb-4" key={`main-category-${key}`}>
                    <div className="card img-fluid w-h-100 relative">
                        <button onClick={() => removeVendor(category)} className="btn btn-primary px-2 py-0 abs-r-10-t-10 z-1 ">
                            <span className="bi bi-x-lg"></span>
                        </button>
                        <img className="card-img-top card-cat-img" src={`${category.coupleVendor.user.photo ? props.app.serverPath + category.coupleVendor.user.photo : '/assets/images/placeholder.png'}`}
                            alt="" />

                        <div className="card-img-overlay card-cat-img text-left">
                            <div className="mt-3">
                                <small className="badge badge-warning mt-3">
                                    {category.coupleVendor.category.name}
                                </small>
                                <strong className="text-light block mt-1">{category.coupleVendor.user.fullName}</strong>
                                <small className="block text-light">
                                    {category.coupleVendor.user.address}
                                </small>
                                <div className="card-rating">
                                    <Rating
                                        initialValue={3}
                                        readonly={true}
                                        size={12}
                                        allowFraction={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-3 h-190px">
                            {state.selectedVendor.coupleVendor && state.selectedVendor.coupleVendor.id === category.coupleVendor.id ?
                                (<div>
                                    {state.selectedVendor.activeTab === 'note' ? (<div className="text-left">
                                        <h6>Notes</h6>
                                        <textarea
                                            id={`textArea${category.id}`} className="form-control"
                                            placeholder="Add a note..." rows="3"
                                            onChange={(e) => submit(category, 'note', e.target.value)}
                                            // onChange={(e) => console.log(e.target.value)}
                                            defaultValue={category.note}
                                        >

                                        </textarea>
                                        <div className="mt-2">
                                            <button type="button" className="btn btn-secondary btn-sm py-1" onClick={() => toggleCardBody({}, '')}>Okay</button>
                                        </div>
                                    </div>) : (<div>
                                        <h6>Telephone</h6>
                                        <hr />
                                        <h5>01329822622</h5>
                                        <small>Don't forget to say you came from <br /><span className="text-theme">TamilWeddingBook</span>!</small>
                                    </div>)}
                                </div>) :
                                (<div>
                                    <select className="form-control p-2" defaultValue={category.status} onChange={(e) => submit(category, 'status', e.target.value)}>
                                        {props.statuses.map((status, statusKey) => {
                                            return <option value={status} key={`status-${statusKey}`}>{status}</option>
                                        })}
                                    </select>
                                    <div className="d-flex justify-content-between my-3">
                                        <div className="text-left w-100">
                                            <div className="card-rating-wrapper">
                                                <Rating
                                                    initialValue={category.rating}
                                                    emptyIcon={<IoMdHeartEmpty size={20} />}
                                                    fillIcon={<IoMdHeartEmpty size={20} />}
                                                    // fillIcon={<MdFavorite size={50} />}
                                                    // size={30}
                                                    showTooltip={true}
                                                    tooltipClassName="card-rating-tooltip"
                                                    tooltipDefaultText="What you think?"
                                                    // emptyColor="#673ab7"
                                                    fillColor="#673ab7"
                                                    tooltipArray={[
                                                        'POOR',
                                                        'AVERAGE',
                                                        'GOOD',
                                                        'VERY GOOD',
                                                        'EXCELLENT',
                                                    ]}
                                                    onClick={(value) => submit(category, 'rating', value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className="m-0">Price £</p>
                                            <input
                                                type="number"
                                                className="form-control number-without-arrows  card-cat-input-price"
                                                // value={category.price}
                                                placeholder="0"
                                                defaultValue={category.price}
                                                onChange={
                                                    (e) => submit(category, 'price', e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="text-left mb-3">
                                        <button type="button" onClick={() => toggleCardBody(category.coupleVendor, 'note')} className="btn btn-sm p-0"><span className="bi bi-clipboard-plus"></span> Add Note</button>
                                    </div>
                                </div>)}
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <button type="button" onClick={() => state.selectedVendor.activeTab === 'tel' ? toggleCardBody({}, '') : toggleCardBody(category.coupleVendor, 'tel')} className="btn btn-sm p-0"><span className="bi bi-telephone"></span> {state.selectedVendor.activeTab === 'tel' ? 'Hide' : 'Show Tel.'}</button>
                            <button className="btn btn-sm p-0"><span className="bi bi-envelope"></span> Contact</button>
                        </div>
                    </div>
                </div>
            );
        });
    }

    return (<VendorsList />);
}

export default FilteredVendors;