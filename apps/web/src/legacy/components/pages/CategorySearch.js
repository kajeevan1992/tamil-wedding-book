'use client';

import { useRef, useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
export default function CategorySearch(props) {
    const categoryRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (props.initialCategoryId && props.categories) {
            const initialCategory = props.categories.find(cat => cat.id === props.initialCategoryId);
            if (initialCategory) {
                categoryRef.current.setValue(initialCategory);
            }
        }
    }, [props.initialCategoryId, props.categories]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    }
    const handleSearch = (searchValue) => {
        return new Promise((resolve) => {
            let filtered = props.categories?.filter(category => (category.name.toLowerCase().includes(searchValue.toLowerCase()) && category.type !== 'category-megamenu-list-heading'));
            resolve(filtered);
        });
    };
    return (
        <AsyncSelect
            ref={categoryRef}
            className="select-theme-border filter no-br"
            cacheOptions
            isClearable={true}
            isSearchable={true}
            onInputChange={handleSearchChange}
            placeholder="Category"
            // onMenuOpen={activateMasonryLayout}
            onChange={(option) => {
                if (option !== null) {
                    props.state.searchData.categoryId = option.id
                } else {
                    props.state.searchData.categoryId = null;
                }

                props.state.searchData.name = null;
                props.onCategoryChanged();
            }}
            menuPortalTarget={document.body}
            formatOptionLabel={function (option) {
                return (<div className={option.type}>
                    {option.name}
                </div>);
            }}
            getOptionValue={(option) => option.id}
            components={{
                MenuList: (iProps) => (
                    <>
                        {searchTerm.length ? (
                            <div {...iProps.innerProps}>
                                {iProps.children}
                            </div>
                        ) : (
                            <div className="category-megamenu">
                                <div className="row">
                                    <div className="col-md-4 md-right-grey-border ">
                                        <ul className="p-0">
                                            <li className="w-100 category-megamenu-option category-megamenu-list-heading">Venues</li>
                                            {props.categories
                                                ?.filter((category) => category.type === 'venue')
                                                .map((category, index) => (
                                                    <li onClick={() => iProps.selectOption(category)} className="w-100 category-megamenu-option" key={`category-${index}`}>{category.name}</li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div className="col-md-4 md-right-grey-border">
                                        <ul className="p-0">
                                            <li className="w-100 category-megamenu-option category-megamenu-list-heading">Suppliers</li>
                                            {props.categories
                                                ?.filter((category) => category.type === 'supplier')
                                                .slice(0, 18)
                                                .map((category, index) => (
                                                    <li onClick={() => iProps.selectOption(category)} className="w-100 category-megamenu-option" key={`category-${index}`}>
                                                        {category.name}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div className="col-md-4">
                                        <ul className="p-0">
                                            {props.categories
                                                ?.filter((category) => category.type === 'supplier')
                                                .slice(18)
                                                .map((category, index) => (
                                                    <li onClick={() => iProps.selectOption(category)} className="w-100 category-megamenu-option" key={`category-${index + 18}`}>
                                                        {category.name}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ),
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
            }}
            defaultOptions={props.categories}
            loadOptions={handleSearch}
        />
    );
}