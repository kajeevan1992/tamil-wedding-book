export default function InputOption(props) {
    return (
        <>
            <div className={`${props.mbClassName ? props.mbClassName : 'mb-4'}`}>
                <div className={`form-check ${props.className ? props.className : 'mb-4'}`}>
                    <input
                        type={props.type}
                        name={props.selector}
                        value={props.value}
                        id={props.selector}
                        onChange={props.onHandleChange}
                        checked={props.checked}
                        className={`form-check-input theme-color-bg w-h-17px ${props.fieldClassName ? props.fieldClassName : ''}`}
                    />
                    {props.label && <label className={`form-check-label ${props.labelClassName ? props.labelClassName : ''}`} htmlFor={props.selector}>{props.label}</label>}
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