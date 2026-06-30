import moment from "moment";

export default function SCHeader(props) {
    return (
        <div className="sc-header">
            <div className="card d-flex">
                <div className="card-body">
                    <img
                        src="/assets/images/about/Tamil_Wedding_Book.png"
                        alt="Tamil Wedding Book"
                        className="header-logo"
                    />
                    <h2>
                        {`${props.profile.fullName} ${props.profile?.couple?.weddingDetail?.partnerName ? '& ' + props.profile?.couple?.weddingDetail?.partnerName : ''}`}</h2>
                    <h3 className="m-0">
                        <span className="badge badge-warning">
                            {props.selectedEvent.name}
                        </span>
                    </h3>

                    <h4 className="m-0">Venue name, need to discuss</h4>
                    <small className="badge badge-info">{moment(props.profile?.couple?.weddingDetail?.date).format('LL')}</small>
                </div>
            </div>
        </div>
    );
}