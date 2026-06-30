import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { Fragment, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import { searchSupplier } from "@services/UserService";

export default function VendorNameSearch(props) {
    const searchRef = useRef("");

    useEffect(() => {
        if (props.categoryChanged) {
            searchRef.current.setValue(null);
            props.onCategoryChanged();
        }
    }, [props.categoryChanged]);

    useEffect(() => {
        if (props.initialName) {
            // Create a synthetic option object for the initial value
            const initialOption = {
                fullName: props.initialName,
                vendor: { id: null } // We don't have the vendor ID for the initial value
            };
            searchRef.current.setValue(initialOption);
        }
    }, [props.initialName]);

    const Menu = (props) => {
        return (
            <Fragment>
                <components.Menu {...props}>
                    <div>
                        {props.selectProps.fetchingData ? (
                            <span className="fetching">Fetching data...</span>
                        ) : (
                            <div>{props.children}</div>
                        )}
                    </div>
                </components.Menu>
            </Fragment>
        );
    };

    const dispatch = useDispatch();

    const submit = async (search) => {
        if (search.length < 1) return;

        try {
            dispatch(toggleLoading(true));

            const { data } = await searchSupplier({ categoryId: props.state.searchData.categoryId, keyword: search });

            dispatch(toggleLoading(false));
            return data;
        } catch (error) {
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    return (
        <AsyncSelect
            className="select-theme-border filter header-search-vendor-name"
            loadOptions={submit}
            ref={searchRef}
            isClearable={true}
            placeholder="Vendor name"
            formatOptionLabel={(option) => option.fullName}
            getOptionValue={(option) => option?.vendor?.id}
            components={{
                Menu,
                DropdownIndicator: () => null, IndicatorSeparator: () => null,
            }}
            onChange={(option) => {
                if (option !== null) {
                    props.state.searchData.name = option.fullName
                } else {
                    props.state.searchData.name = null;
                }
            }}
        />
    );
}