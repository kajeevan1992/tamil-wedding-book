import moment from "moment";

export default function BPPdfHeader(props) {
    return (
        <div className="bp-header">
            <div className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <img
                            src="/assets/images/about/Tamil_Wedding_Book.png"
                            alt="Tamil Wedding Book"
                            className="header-logo"
                        />
                        <h2>
                            {`${props.app.profile.fullName} ${props.app.profile?.couple?.weddingDetail?.partnerName ? '& ' + props.app.profile?.couple?.weddingDetail?.partnerName : ''}`}</h2>
                    </div>

                    <div className="text-right">
                        <h4 className="m-0">Budget Planner</h4>
                        <small>{moment().format('LL')}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}