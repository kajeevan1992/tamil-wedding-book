import { Outlet } from "react-router-dom";
import Sidebar from "@components/vendor/storefront/Sidebar";
import { useSelector } from "react-redux";
// import { useEffect } from "react";

export default function StorefrontLayout() {
  const app = useSelector(state => state.app);

  // useEffect(() => {
  //   loadStoreFrontInitials()
  // }, []);

  // async function loadStoreFrontInitials() {
  //   try {
  //     dispatch(toggleLoading(true));
  //     const { data } = await vendorService.loadStoreFrontInitials();

  //     data.currentPassword = '';
  //     data.newPassword = '';
  //     data.newPasswordConfirmation = '';

  //     data.vendorData.vendor.vendorBusinessIdentities = data.vendorData.vendor.vendorBusinessIdentities.map((vendorBusinessIdentity) => {
  //       return vendorBusinessIdentity.businessIdentityId;
  //     });

  //     setState((currentState) => ({
  //       ...currentState,
  //       initialData: data.vendorData,
  //       businessIdentities: data.businessIdentities
  //     }));

  //     dispatch(toggleLoading(false));
  //   } catch (error) {
  //     dispatch(toggleLoading(false));
  //     toast.error('Something went wrong, please try again');
  //   }
  // }

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-3">
            <Sidebar app={app} />
          </div>
          <div className="col-md-9">
            <Outlet context={app} />
          </div>
        </div>
      </div>
    </>
  );
}

