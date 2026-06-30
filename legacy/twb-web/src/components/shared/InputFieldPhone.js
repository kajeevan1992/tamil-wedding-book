import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function InputFieldPhone(props) {
    return (
        <>
            <div className={`${props.mbClassName ? props.mbClassName : 'mb-4'}`}>
                {props.label && <label className={`${props.labelClassName ? props.labelClassName : ''}`}>{props.label}</label>}
                <div className={`${props.icon ? 'input-group password-hidden' : ''} ${props.className !== null ? props.className : ''}`}>
                    <PhoneInput
                        name={props.selector}
                        value={props.value}
                        id={props.selector}
                        onChange={(value) => { props.onHandleChange(value) }}
                        placeholder={props.placeholder ? props.placeholder : ''}
                        className={`form-control own-input ${props?.allBorders ? 'phone-field-borders' : 'only-b-brdr-grey'} phone-field ${props.value === '' ? 'hidden-flag' : ''} ${props.fieldClassName !== null ? props.fieldClassName : ''}`}
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