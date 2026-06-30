import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InputFieldDate(props) {
    return (
        <div className={`${props.mbClassName ? props.mbClassName : ''}`}>
            {props.label && <label>{props.label}</label>}
            <div className="input-group date-picker-wrapper">
                <DatePicker
                    showTimeSelect={props.showTime}
                    selected={props.selected}
                    dateFormat={props.format}
                    minDate={props.minDate ? props.minDate : null}
                    maxDate={props.maxDate ? props.maxDate : null}
                    onChange={(date) => props.onHandleChange(date)}
                    placeholderText={props.placeholder}
                    className={`form-control own-input ${props?.allBorders ? '' : 'only-b-brdr-grey'} ${props.fieldClassName ? props.fieldClassName : ''}`}
                    id={props.selector}
                />
                <label htmlFor={props.selector}
                    className={`input-group-text cursor-pointer  ${props?.allBorders ? 'date-picker-icon-wrapper' : 'transparent-password-toggle'}`}>
                    <i className="bi bi-calendar"></i>
                </label>
            </div>
            {
                props.errors[props.selector] &&
                <div className={`invalid-feedback ${props.errorClass ? props.errorClass : ''}`}>
                    {props.errors[props.selector][0]}
                </div>
            }
        </div>
    )
}