import { useSelector } from "react-redux";

function Loading() {
    const app = useSelector(state => state.app);

    return (
        <>
            {
                app.isLoading &&
                <div className="preloader">
                    {/* <div className="loading-custom top-30prcnt">
                        <h4>Please wait...</h4>
                        <span><i></i><i></i></span>
                    </div> */}
                </div>
            }
        </>

    );
}

export default Loading;