export default function AuthFooter() {
    return (
        <>
            <div className="col-md-12 mt-4 text-center fs-12px text-muted fw-500">
                <ul className="w-100">
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Sign up with Tamil Wedding Book</a></li>
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Are You a Wedding Business?</a></li>
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Contact Us</a></li>
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Terms of Use</a></li>
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Privacy Policy</a></li>
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">Cookies Policy</a></li>
                    <li className="inline-block mx-2">
                        <a href="#" className="light-grey-color fw-500">Do Not Sell My Personal Information</a>
                    </li>
                    <li className="inline-block mx-2"><a href="#" className="light-grey-color fw-500">About Tamile Wedding Book</a></li>
                </ul>
                <p className="layout-auth-footer-copyright">© {new Date().getFullYear()} tamilweddingbook.co.uk</p>
            </div>
        </>
    );
}