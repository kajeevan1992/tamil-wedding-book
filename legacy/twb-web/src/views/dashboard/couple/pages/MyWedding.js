// import { useEffect, ref, useRef } from "react";
import Banner from "@components/couple/Banner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading } from "@store/AppSlice";
import { loadWeddingData } from "@services/CoupleService";

function MyWedding() {
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        weddingStats: {},
    });

    useEffect(() => {
        if (app.profile && app.profile.couple) {
            init(app.profile.couple.id);
        }
    }, [app.profile]);


    const init = async (coupleId) => {
        try {
            dispatch(toggleLoading(true));
            const { data } = await loadWeddingData(coupleId);
            console.log(data)
            setState((currentState) => ({
                ...currentState,
                weddingStats: data.weddingStats
            }));

            dispatch(toggleLoading(false));
        } catch (error) {
            dispatch(toggleLoading(false));
        }
    }
    return (
        <>
            <Banner weddingStats={state.weddingStats} />
        </>
    );
}

export default MyWedding;