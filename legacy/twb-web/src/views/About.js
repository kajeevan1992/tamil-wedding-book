import { useDispatch } from "react-redux";
import { authenticate } from "../store/AppSlice";
import { useSelector } from "react-router-dom";

function About() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();
    return (
        <>
            <h1>About {app.isLoggedIn ? 'true' : 'false'} {app.profile.role}</h1>
            <button onClick={() => dispatch(authenticate(true))}>Auth Change</button>
        </>
    );
}

export default About;