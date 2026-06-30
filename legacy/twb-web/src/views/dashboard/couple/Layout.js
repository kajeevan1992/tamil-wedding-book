import { Outlet } from 'react-router-dom';
import CoupleLinks from '@components/couple/CoupleLinks';
import { useEffect, useRef } from 'react';
import LastStepModal from '@components/couple/LastStepModal';
import { useSelector } from 'react-redux';

function Dashboard() {
    const app = useSelector(state => state.app);
    const lastStepModal = useRef(null);

    useEffect(() => {
        if (app.profile.role === 'couple' && !app.profile.stepsDone) {
            if (app.profile.primary) {
                showLastStepModal();
            }
        }
    }, [app.profile]);

    const showLastStepModal = () => {
        lastStepModal.current.showModal();
    }
    const hideLastStepModal = () => {
        lastStepModal.current.hideModal();
    }

    return (
        <>
            <CoupleLinks />

            <section>
                <div>
                    <Outlet context={app} />
                </div>
            </section>

            <LastStepModal ref={lastStepModal} appState={app} onHideModal={hideLastStepModal} />
        </>
    );
}

export default Dashboard;