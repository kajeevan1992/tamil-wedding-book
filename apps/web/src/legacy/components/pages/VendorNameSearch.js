'use client';

import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { Fragment, useEffect, useRef } from 'react';

export default function VendorNameSearch(props) {
    const searchRef = useRef(null);

    useEffect(() => {
        if (props.categoryChanged) {
            searchRef.current?.setValue(null);
            props.onCategoryChanged();
        }
    }, [props.categoryChanged]);

    useEffect(() => {
        if (props.initialName) {
            const initialOption = {
                fullName: props.initialName,
                vendor: { id: null }
            };
            searchRef.current?.setValue(initialOption);
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

    const submit = async () => [];

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
