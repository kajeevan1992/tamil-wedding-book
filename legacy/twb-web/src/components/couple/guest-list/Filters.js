export default function GuestListFilters(props) {
    const filters = [
        {
            label: 'Group',
            id: 'coupleWeddingEventGroupId',
            model: 'CoupleWeddingEventGroup',
            name: 'coupleWeddingEventGroups',
            actionType: 'group',
        },
        {
            label: 'Menu',
            id: 'coupleWeddingEventMenuId',
            model: 'CoupleWeddingEventMenu',
            name: 'coupleWeddingEventMenus',
            actionType: 'menu',
        },
        {
            label: 'Seating Chart',
            id: 'coupleWeddingEventTableId',
            model: 'CoupleWeddingEventTable',
            name: 'coupleWeddingEventTables',
            actionType: 'table',
        },
        {
            label: 'Attendance',
            id: 'coupleWeddingEventAttendanceId',
            model: 'CoupleWeddingEventAttendance',
            name: 'coupleWeddingEventAttendances',
            actionType: 'attendance',
        },
        {
            label: 'Lists',
            id: 'coupleWeddingEventListId',
            model: 'CoupleWeddingEventList',
            name: 'coupleWeddingEventLists',
            actionType: 'list',
        },
    ]
    return (
        <nav className="nav pb-1 pt-2 d-flex justify-content-center align-items-center bg-light">
            {filters.map((filter, indexF) => {
                return (
                    <button type="button" onClick={() => props.selectedFilter.id != filter.id ? props.onSelectFilter(filter) : {}} className={`btn nav-link pt-0 ${props.selectedFilter.id === filter.id ? 'text-theme' : 'grey-color'}`} key={`filter-${indexF}`}>
                        {filter.label}
                    </button>
                );
            })}
        </nav>
    );
}