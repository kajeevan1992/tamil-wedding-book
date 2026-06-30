import React, { useState } from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
    const [hoveredTab, setHoveredTab] = useState(null);

    return (
        <div className="bg-light border-bottom">
            <div className="container">
                {/*  Scrollable wrapper to handle mobile overflow */}
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }} className="d-flex d-md-block">
                    <ul className="nav mb-0 flex-nowrap justify-content-start justify-content-md-center w-100">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const isHovered = hoveredTab === tab.id;

                            return (
                                <li key={tab.id} className="nav-item mx-2 mx-md-3">
                                    <button
                                        className={`nav-link border-0 fw-600 px-3 px-md-4 py-3 bg-transparent position-relative ${isActive ? 'text-theme' : 'text-dark'}`}
                                        onClick={() => onTabChange(tab.id)}
                                        onMouseEnter={() => setHoveredTab(tab.id)}
                                        onMouseLeave={() => setHoveredTab(null)}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            background: 'transparent',
                                            border: 'none',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {tab.label}

                                        {/* Underline for Active or Hover state */}
                                        {(isActive || isHovered) && (
                                            <div
                                                className="position-absolute w-100 bg-theme"
                                                style={{
                                                    height: isActive ? '3px' : '2px',
                                                    bottom: 0,
                                                    left: 0,
                                                    opacity: isActive ? 1 : 0.6,
                                                    borderRadius: '2px 2px 0 0',
                                                    transition: 'all 0.2s'
                                                }}
                                            />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TabNavigation;