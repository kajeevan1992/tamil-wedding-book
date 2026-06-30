export default function SocialSignin() {
    return (
        <ul className="list-unstyled w-100">
            <li>
                <a href="#" className="btn btn-white px-2 py-1 m-2 d-block no-hr-effect" onClick={event => event.preventDefault()}>
                    <i className="fa fa-facebook-f text-blue float-left mt-1" ></i>
                    <span className="login-with">Sign in with Facebook</span>
                </a>
            </li>
            <li>
                <a href="#" className="btn btn-white px-2 py-1 m-2 d-block no-hr-effect" onClick={event => event.preventDefault()}>
                    <i className="fa fa-google text-theme float-left mt-1" ></i>
                    <span className="login-with">Sign in with Google</span>
                </a>
            </li>
            <li>
                <a href="#" className="btn btn-white px-2 py-1 m-2 d-block no-hr-effect" onClick={event => event.preventDefault()}>
                    <i className="fa fa-apple text-dark float-left mt-1" ></i>
                    <span className="login-with">Sign in with Apple</span>
                </a>
            </li>
        </ul>
    );
}