import CreateStorefrontStep2 from "@components/vendor/storefront/CreateStorefrontStep2";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import * as validateUtil from "@utilities/ValidateUtil";
import { statusMessages } from "@utilities/CommonUtil";

export default function BusinessLocation() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    initialData: {},

    display: false,

    errors: {},
  });

  useEffect(() => {
    loadInitials();
  }, []);

  const dispatch = useDispatch();
  async function loadInitials() {
    try {
      dispatch(toggleLoading(true));
      const { data } = await vendorService.loadStoreFrontInitials();

      setState((currentState) => ({
        ...currentState,
        initialData: data.vendorData,
        display: true
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  const handleInputChange = (
    dataType,
    key,
    value,
    name = null,
    checked = null,
    action = null
  ) => {
    switch (dataType) {
      case "user":
        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            [key]: value,
          },
        }));
        break;
      default:
        break;
    }
  };

  const onSubmit = async (action) => {
    setState((currentState) => ({
      ...currentState,
      errors: {},
    }));

    let errors = {};
    let validationFlag = true;

    if (action === "step2") {
      if (validateUtil.isEmpty(state.initialData.address)) {
        validationFlag = false;
        errors.address = ["Store location is required"];
      } else if (validateUtil.isGreaterThan(state.initialData.address, 255)) {
        validationFlag = false;
        errors.address = [
          "Store location must not be greater than 255 characters!",
        ];
      }
    }

    if (!validationFlag) {
      setState((currentState) => ({
        ...currentState,
        errors: errors,
      }));
      toast.error("The given data are invalid!");
    } else {
      submit(action);
    }
  };

  async function submit(action) {
    try {
      setState((currentState) => ({
        ...currentState,
        errors: {},
      }));

      dispatch(toggleLoading(true));
      const initialData = state.initialData;
      initialData.action = action;

      let formData = new FormData();
      for (const key in initialData) {
        if (key === "vendor") {
          formData.append(key, JSON.stringify(initialData[key]));
          for (const keyFile in initialData[key]["vendorStoreFiles"]) {
            formData.append(
              `vendorStoreFiles${keyFile}`,
              initialData[key]["vendorStoreFiles"][keyFile].file
            );
          }
        } else {
          formData.append(key, initialData[key]);
        }
      }

      const { data } = await vendorService.updateStoreFront(formData);
      dispatch(authenticate(data.user));

      dispatch(toggleLoading(false));
      toast.success(data.message);
    } catch (error) {
      dispatch(toggleLoading(false));
      if (statusMessages(error) === 'validation-errors') {
        setState((currentState) => ({
          ...currentState,
          errors: error.response.data.errors
        }));
      }
    }
  }

  return (
    <>
      <CreateStorefrontStep2
        title="Edit location"
        app={app}
        initialData={state.initialData}
        onInputChange={(dataType, key, value) =>
          handleInputChange(dataType, key, value)
        }
        onSubmit={(action) => onSubmit(action)}
        errors={state.errors}
      />
    </>
  );
}
