import { useEffect, useState } from "react";
import CategorySearch from "./CategorySearch";
import InputFieldAddress from "@components/shared/InputFieldAddress";
import VendorNameSearch from "./VendorNameSearch";
import { useNavigate } from "react-router-dom";
import { encryptAsUrl } from "@utilities/CommonUtil";

export default function GlobalSearch(props) {
    const navigate = useNavigate();
    const [state, setState] = useState({
        categories: [],
        categoryChanged: false,
        searchData: {
            categoryId: props.filter?.categoryId || '',
            location: props.filter?.location || '',
            name: props.filter?.name || '',
            lng: props.filter?.lng || '',
            lat: props.filter?.lat || ''
        },
        errors: {}
    });

    const sortCategories = (categories) => {
        const venues = categories.filter(c => c.type === 'venue').sort((a, b) => a.name.localeCompare(b.name));
        const suppliers = categories.filter(c => c.type === 'supplier').sort((a, b) => a.name.localeCompare(b.name));

        const sortedCategories = [];

        if (venues.length > 0) {
            sortedCategories.push({ name: 'Venues', type: 'category-megamenu-list-heading' });
            sortedCategories.push(...venues);
        }

        if (suppliers.length > 0) {
            sortedCategories.push({ name: 'Suppliers', type: 'category-megamenu-list-heading' });
            sortedCategories.push(...suppliers);
        }

        return sortedCategories;
    }

    useEffect(() => {
        if (props.app?.categories.length > 0) {
            setState((currentState) => ({
                ...currentState,
                categories: sortCategories(props.app?.categories)
            }))
        }
    }, [props.app?.categories])

    // Effect to handle filter props changes
    useEffect(() => {
        if (props.filter) {
            setState((currentState) => ({
                ...currentState,
                searchData: {
                    categoryId: props.filter.categoryId || currentState.searchData.categoryId,
                    location: props.filter.location || currentState.searchData.location,
                    name: props.filter.name || currentState.searchData.name,
                    lng: props.filter.lng || currentState.searchData.lng,
                    lat: props.filter.lat || currentState.searchData.lat
                }
            }));
        }
    }, [props.filter]);

    const toggleCategory = (value) => {
        setState((currentState) => ({
            ...currentState,
            categoryChanged: value,
        }));
    }

    const searchVednors = () => {
        const { categoryId, name, lng, lat } = state.searchData;
        if (props.onSearch) {
            // If onSearch prop is provided (for SearchVendor), call it with search data
            props.onSearch(state.searchData);
        } else {
            // Default behavior (for Home.js) - navigate to search page with encrypted params
            const params = {
                categoryId,
                name,
                lng,
                lat
            };
            const encryptedParams = encryptAsUrl(params);
            navigate(`/search-vendor?q=${encryptedParams}`);
        }
    }

    return (
        <div className="global-search-wrap container">
            {state.categories.length > 0 && <div className="row">
                <div className="field-1 col-md-3 p-0">
                    <CategorySearch
                        categories={state.categories}
                        state={state}
                        onCategoryChanged={() => toggleCategory(true)}
                        initialCategoryId={props.filter?.categoryId}
                    />
                </div>
                <div className="field-2 col-md-3 p-0">
                    <InputFieldAddress
                        mbClassName="header-location-search-bg"
                        icon="bi bi-geo-alt"
                        placeholder="Business location"
                        selector="address"
                        allBorders={true}
                        initialValue={props.filter?.location}
                        onPlaceChange={(place) => {
                            setState((currentState) => ({
                                ...currentState,
                                searchData: {
                                    ...currentState.searchData,
                                    location: place.formatted_address,
                                    lng: place.geometry.location.lng(),
                                    lat: place.geometry.location.lat(),
                                },
                            }));
                        }}
                        errors={state.errors}
                    />
                </div>
                <div className="field-3 col-md-3 p-0">
                    <VendorNameSearch
                        state={state}
                        categoryChanged={state.categoryChanged}
                        onCategoryChanged={() => toggleCategory(false)}
                        initialName={props.filter?.name}
                    />
                </div>
                <div className="field-4 col-md-1 p-0">
                    <button type="button" onClick={() => searchVednors()} className="btn btn-primary br-0 w-100 p-10px"><i
                        className="fa fa-search mb-0 " style={{ fontSize: '1.5rem' }}></i></button>
                </div>
            </div>}
        </div>
    );
}