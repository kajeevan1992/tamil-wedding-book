import Autocomplete from "react-google-autocomplete";

export default function InputFieldAddress(props) {
    return (
        <>
            <div className={`${props.mbClassName ? props.mbClassName : 'mb-4'}`}>
                {props.label && <label className={`${props.labelClassName ? props.labelClassName : ''}`}>{props.label}</label>}
                <div className={`${props.icon ? 'input-group password-hidden' : ''} ${props.className ? props.className : ''}`}>
                    <Autocomplete
                        apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                        onPlaceSelected={(place) => props.onPlaceChange(place)}
                        placeholder={props.placeholder}
                        className={`form-control own-input ${props?.allBorders ? '' : 'only-b-brdr-grey'} ${props.fieldClassName ? props.fieldClassName : ''}`}
                    />

                    {props.icon && <span
                        className={`input-group-text cursor-pointer  ${props.allBorders ? 'borderd-password-toggle' : 'transparent-password-toggle'}`}>
                        <i className={props.icon}></i>
                    </span>}
                </div>
                {
                    props.errors[props.selector] &&
                    <div className={`invalid-feedback ${props.errorClass ? props.errorClass : ''}`}>
                        {props.errors[props.selector][0]}
                    </div>
                }
            </div>
        </>
    )
}