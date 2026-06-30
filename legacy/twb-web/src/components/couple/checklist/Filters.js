import { slugify } from "@utilities/CommonUtil";

export default function BPPdfHeader(props) {
    return (
        <div className="row">
            <div className="col-md-12 mt-3">
                <h5>Results</h5>
            </div>
            <div className="col-md-12 mt-2">
                {props.state.resultsFilters.map((resultsFilter, indexResultsFilter) =>
                    <button key={`date-filters-${indexResultsFilter}`} className="btn btn-sm rounded-pill bg-white mb-1" onClick={() => props.removeFilter(resultsFilter)}>
                        <span className="text-muted">{resultsFilter.name}</span>
                        <i className="bi bi-x-lg ml-1"></i>
                    </button>
                )}
            </div>
            <div className="col-md-12 mt-4">
                <h5>Status</h5>
            </div>
            <div className="col-md-12">
                {props.state.counts.completed > 0 && <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex gap-5">
                        <div>
                            <i className="bi bi-circle-fill text-success fs-12px"></i>
                        </div>
                        <a className={`btn-link text-dark ${props.state.resultsFilters.find(e => e.name === 'Done') ? 'active-filter' : ''}`} onClick={() => props.addFilter({ name: 'Done', type: 'status', className: 'done' })}>Done</a>
                    </div>
                    <span className="fn-grey">{props.state.counts.completed}</span>
                </div>}

                {(props.state.counts.total - props.state.counts.completed) > 0 && <div className="d-flex justify-content-between">
                    <div className="d-flex gap-5">
                        <div>
                            <i className="bi bi-circle-fill text-warning fs-12px"></i>
                        </div>
                        <a className={`btn-link text-dark ${props.state.resultsFilters.find(e => e.name === 'To Do') ? 'active-filter' : ''}`} onClick={() => props.addFilter({ name: 'To Do', type: 'status', className: 'to-do' })}>To Do</a>
                    </div>
                    <span className="fn-grey">{props.state.counts.total - props.state.counts.completed}</span>
                </div>}
            </div>
            <div className="col-md-12 mt-5">
                <h5>By date</h5>
            </div>
            <div className="col-md-12 mt-3">
                <div className="timeline">
                    <div className="timeline-outer">
                        {props.state.dateGrouped.map((filter, indexFilter) =>
                            <div className="timeline-inner mb-3" key={`date-filters-${indexFilter}`}>
                                <div className="timeline-info">
                                    <a className={`timeline-title pl-3 ${props.state.resultsFilters.find(e => e.name == filter.name) ? 'active-filter' : ''}`} onClick={() => props.addFilter({ name: filter.name, type: 'date', className: slugify(filter.name === '2 weeks' ? 'weeks-2' : filter.name) })}>{filter.name}</a>
                                    <span className="fn-grey">{filter.count}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-12 mt-5">
                <h5>By Category</h5>
            </div>
            <div className="col-md-12 mt-3">
                {props.state.categoryGrouped.map((category, indexCategory) =>
                    <div className="d-flex justify-content-between" key={`categories-filters-${indexCategory}`}>
                        <a className={`timeline-title pl-3 mb-2 ${props.state.resultsFilters.find(e => e.name == category.name) ? 'active-filter' : ''}`} onClick={() => props.addFilter({ name: category.name, type: 'category', className: slugify(category.name) })}>{category.name}</a>
                        <span className="fn-grey">{category.count}</span>
                    </div>
                )}
            </div>
        </div>
    );
}