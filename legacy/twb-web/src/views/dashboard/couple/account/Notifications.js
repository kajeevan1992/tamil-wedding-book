import CoupleAccountSidebar from "@components/couple/account/Sidebar";

function AccountNotifications() {
    return (
        <>
            <div className="container spacer">
                <div className="row">
                    <div className="col-md-3">
                        <CoupleAccountSidebar />
                    </div>
                    <div className="col-md-9">
                        <h3>Settings</h3>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AccountNotifications;