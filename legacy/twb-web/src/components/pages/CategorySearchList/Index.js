import React, { useState, useEffect, useRef } from 'react';
import './style.css';

const SearchDropdown = ({ options, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Filter options based on search term
        const filterOptions = () => {
            if (!searchTerm) {
                setFilteredOptions([]);
                return;
            }
            const filtered = options.filter(option =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOptions(filtered);
        };

        filterOptions();
    }, [searchTerm, options]);

    useEffect(() => {
        // Handle click outside of the dropdown to close it
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        setShowDropdown(true); // Show dropdown on input change
    };

    const handleOptionClick = (option) => {
        setSearchTerm(option);
        onSelect(option); // Call the parent's onSelect function
        setShowDropdown(false); // Close the dropdown after selection
    };

    return (
        <div className="category-search-list" ref={dropdownRef}>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search..."
                className="category-search-input"
                onClick={() => setShowDropdown(true)} // Open dropdown on input click
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul className="category-dropdown-list">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="category-dropdown-item"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            {showDropdown && filteredOptions.length === 0 && searchTerm && ( // Display "No results"
                <ul className="category-dropdown-list">
                    <li className="category-dropdown-item category-no-results">No results found.</li>
                </ul>
            )}
        </div>
    );
};


// Example usage:
const CategorySearchList = () => {
    const availableOptions = [
        'Apple',
        'Banana',
        'Orange',
        'Grape',
        'Watermelon',
        'Mango',
        'Kiwi',
        'Pineapple',
    ];

    const handleSelect = (selectedOption) => {
        console.log('Selected:', selectedOption);
    };

    return (
        <div className="category-app-container">
            <SearchDropdown options={availableOptions} onSelect={handleSelect} />
        </div>
    );
};

export default CategorySearchList;