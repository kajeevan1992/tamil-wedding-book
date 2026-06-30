import React from "react";
import PaymentMethodComp from "@components/vendor/invoices/PaymentMethodComp";
import { useSelector } from "react-redux";
export default function PaymentsMethods() {
  const app = useSelector(state => state.app);
  return (
    <React.Fragment>
      <PaymentMethodComp app={app} />
    </React.Fragment>
  );
}
