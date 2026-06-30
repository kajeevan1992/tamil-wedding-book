import { useControls } from "react-zoom-pan-pinch";

export const ChartActions = () => {
    const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

    return (
        <div className="sc-tools d-table gap-5">
            <button type="button" className="btn btn-outline-primary bg-white p-2" onClick={() => zoomIn()}>
                <span className="bi bi-plus"></span>
            </button>
            <button type="button" className="btn btn-outline-primary bg-white p-2" onClick={() => zoomOut()}>
                <span className="bi bi-dash"></span>
            </button>
            <button type="button" className="btn btn-outline-primary bg-white p-2" onClick={() => resetTransform()}>
                <span className="bi bi-arrow-repeat"></span>
            </button>
            <button type="button" className="btn btn-outline-primary bg-white p-2" onClick={() => centerView()}>
                <span className="bi bi-border-center"></span>
            </button>
        </div>
    );
}

export const EventsAndExport = (props) => {
    return (
        <div className="events">
            <div className="btn-group mr-2">
                <button type="button" className="btn btn-white btn-sm text-danger dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    {props.selectedEvent.name}
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                    {props.weddingEvents.map((weddingEvent, evnetIndex) => <button
                        className="dropdown-item fs-13px px-2"
                        type="button"
                        key={`w-e-${evnetIndex}`}
                        disabled={props.selectedEvent.id === weddingEvent.id}
                        onClick={() => props.onSelectEvent(weddingEvent)}
                    >{weddingEvent.name}</button>)}
                </div>
            </div>
            {props.contentView === 'list' ? (<button
                type="button"
                onClick={() => props.changeChartView('chart')}
                disabled={props.contentView === 'chart'}
                className="btn btn-white btn-sm text-danger"
            >
                <span className="bi bi-diagram-2-fill"></span> Chart
            </button>) :
                (<button
                    type="button"
                    onClick={() => props.changeChartView('list')}
                    disabled={props.contentView === 'list'}
                    className="btn btn-white btn-sm text-danger"
                >
                    <span className="bi bi-view-list"></span> List
                </button>)}
            <button type="button" onClick={() => props.onExportToPdf()} className="btn btn-white btn-sm text-danger">
                <span className="bi bi-cloud-download"></span> PDF
            </button>
        </div>
    );
}