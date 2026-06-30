import { Outlet } from "react-router-dom";
import Sidebar from "@components/vendor/reviews/Sidebar";
import { useSelector } from "react-redux";

export default function ReviewsLayout() {
  const app = useSelector(state => state.app);

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
