import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { statusMessages } from "@utilities/CommonUtil";
import { bulkCreateBySpreadsheet } from "@services/CoupleService";

export default function UploadBySpreadsheet(props) {
    const dispatch = useDispatch();

    async function uploadSpreadsheet(e) {
        if (!e.target.files[0]) {
            return;
        }

        try {
            dispatch(toggleLoading(true));

            let formData = new FormData();
            formData.append('coupleId', props.app.profile.couple.id);
            formData.append('spreadsheet', e.target.files[0]);

            const { data } = await bulkCreateBySpreadsheet(formData);
            e.target.value = null;
            props.onHideWithMajorAction();

            toast.success(data.message);
            dispatch(toggleLoading(false));
        } catch (error) {
            console.log(error)
            dispatch(toggleLoading(false));
            statusMessages(error);
        }
    }

    return (
        <div className="row justify-content-center text-center my-4">
            <div className="col-md-6">
                <h4 className="mb-4">Import guests</h4>
                <p>Easily organize and import your guest list using our template.</p>
                <div className="d-flex flex-column">
                    <a href={`${props.app.serverPath}Guests-Template.xlsx`} download className="btn btn-outline-primary btn-sm my-3">Download Template</a>
                    <label htmlFor="inputFileSpreadsheet" className="btn btn-primary btn-sm">
                        {props.app.isLoading ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>) : 'Upload Spreadsheet'}
                    </label>
                    <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden id="inputFileSpreadsheet" onChange={(e) => uploadSpreadsheet(e)} />
                </div>
            </div>
        </div>
    );
}