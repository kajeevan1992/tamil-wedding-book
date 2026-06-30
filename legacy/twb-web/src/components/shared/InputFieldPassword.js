import { useState } from "react";

export default function InputFieldPassword(props) {
    const [passwordHidden, setPasswordHidden] = useState(true);

    return (
        <>
            <div className={`${props.mbClassName ? props.mbClassName : 'mb-4'}`}>
                {props.label && <label className={`${props.labelClassName ? props.labelClassName : ''}`}>{props.label}</label>}
                <div className={`input-group password-hidden ${props.className ? props.className : ''}`}>
                    <input
                        type={passwordHidden ? 'password' : 'text'}
                        name={props.selector}
                        value={props.value}
                        id={props.selector}
                        onChange={props.onHandleChange}
                        placeholder={props.placeholder ? props.placeholder : ''}
                        className={`form-control own-input ${props?.allBorders ? '' : 'only-b-brdr-grey'} ${props.fieldClassName ? props.fieldClassName : ''}`}
                    />
                    <span
                        className={`input-group-text cursor-pointer  ${props?.allBorders ? 'borderd-password-toggle' : 'transparent-password-toggle'}`}
                        onClick={() => setPasswordHidden(!passwordHidden)}>
                        <i className={passwordHidden ?
                            'bi bi-eye' :
                            'bi bi-eye-slash'}></i>
                    </span>
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