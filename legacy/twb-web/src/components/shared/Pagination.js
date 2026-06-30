function Pages(props) {
    const listItems = [];
    for (let page = 1; page <= props.totalPages; page++) {
        listItems.push(
            <li className={`page-item ${page == props.currentPage ? 'active' : ''}`} key={`pagination-${page}`}>
                <a className={`page-link ${page == props.currentPage ? 'isDisabled-link' : ''}`}
                    onClick={(event) => { event.stopPropagation(); props.pageChanged(page) }}
                >
                    {page}
                </a>
            </li>
        );
    }

    return listItems;
}

function Pagination(props) {
    return (
        props.links.totalPages > 1 &&
        <section className="px-3">
            <div className="row">
                <div className="col-sm-12 d-flex justify-content-end">
                    <nav aria-label="Page navigation example">
                        <ul className="pagination mt-2">
                            <li className="page-item prev-item">
                                <a className={`page-link ${props.links.hasPrevious == false ? 'isDisabled-link' : ''}`}
                                    onClick={(event) => { event.stopPropagation(); props.pageChanged(props.links.currentPage - 1) }}
                                ></a>
                            </li>

                            <Pages totalPages={props.links.totalPages} currentPage={props.links.currentPage} pageChanged={(page) => { props.pageChanged(page) }} />

                            <li className="page-item next-item">
                                <a className={`page-link ${props.links.hasNext == false ? 'isDisabled-link' : ''}`}
                                    onClick={(event) => { event.stopPropagation(); props.pageChanged(props.links.currentPage + 1) }}
                                ></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </section>
    );
}

export default Pagination;