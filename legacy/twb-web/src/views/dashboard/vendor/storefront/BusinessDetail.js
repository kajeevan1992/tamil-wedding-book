import CreateStorefrontStep1 from "@components/vendor/storefront/CreateStorefrontStep1";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import * as validateUtil from "@utilities/ValidateUtil";
import { statusMessages } from "@utilities/CommonUtil";

export default function BusinessDetail() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    initialData: {
      location: {},
      vendor: {
        contactPerson: {},
        businessIdentity: {},
      },
    },

    businessIdentities: [],
    changePasswordCheck: false,

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

      data.currentPassword = "";
      data.newPassword = "";
      data.newPasswordConfirmation = "";

      data.vendorData.vendor.vendorBusinessIdentities =
        data.vendorData.vendor.vendorBusinessIdentities.map(
          (vendorBusinessIdentity) => {
            return vendorBusinessIdentity.businessIdentityId;
          }
        );

      setState((currentState) => ({
        ...currentState,
        initialData: data.vendorData,
        businessIdentities: data.businessIdentities,
        display: true
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  const handleInputChange = (dataType, key, value, name = null, checked = null, action = null) => {
    switch (dataType) {
      case 'user':
        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            [key]: value,
          }
        }));
        break;
      case 'vendor':
        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              [key]: value,
            }
          }
        }));
        break;
      case 'businessIdentity':
        let vendorBusinessIdentities = state.initialData.vendor.vendorBusinessIdentities;
        // todo fix for None of these apply option after other is selected if it exists remove it
        if (checked === true && name === 'None of these apply') {
          vendorBusinessIdentities = [];
          vendorBusinessIdentities.push(value)
        } else {
          let find = vendorBusinessIdentities.indexOf(value);
          if (find > -1) {
            vendorBusinessIdentities.splice(find, 1)
          } else {
            vendorBusinessIdentities.push(value)
          }

          let noneOption = state.businessIdentities.find(e => e.name === 'None of these apply');
          if (vendorBusinessIdentities.indexOf(noneOption.id) > -1) {
            vendorBusinessIdentities.splice(vendorBusinessIdentities.indexOf(noneOption.id), 1);
          }
        }

        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              vendorBusinessIdentities: vendorBusinessIdentities,
            }
          }
        }));
        break;
      case 'contactPerson':
        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              contactPerson: {
                ...currentState.initialData.vendor.contactPerson,
                [key]: value,
              }
            }
          }
        }));
        break;
      case 'general':
        setState((currentState) => ({
          ...currentState,
          [key]: value
        }));
        break;
      default:
        break;
    }
  }

  const onSubmit = async (action) => {
    setState((currentState) => ({
      ...currentState,
      errors: {},
    }));

    let errors = {};
    let validationFlag = true;

    if (action === "step1") {
      if (validateUtil.isEmpty(state.initialData.username)) {
        validationFlag = false;
        errors.username = ["Username is required"];
      } else if (validateUtil.isLessThan(state.initialData.username, 5)) {
        validationFlag = false;
        errors.username = ["Username must be at least 5 characters long."];
      } else if (validateUtil.isGreaterThan(state.initialData.username, 191)) {
        validationFlag = false;
        errors.username = ["Username must not be greater than 191 characters!"];
      }

      if (state.changePasswordCheck) {
        if (validateUtil.isEmpty(state.initialData.currentPassword)) {
          validationFlag = false;
          errors.currentPassword = ["Current Password is required"];
        }

        if (validateUtil.isLessThan(state.initialData.newPassword, 8)) {
          validationFlag = false;
          errors.newPassword = ["Password must be at least 8 characters long"];
        } else if (validateUtil.isGreaterThan(state.user.newPassword, 100)) {
          validationFlag = false;
          errors.newPassword = [
            "Password must not be greater than 100 characters",
          ];
        }

        if (
          validateUtil.isNotSame(
            state.initialData.newPassword,
            state.initialData.confirmPassword
          )
        ) {
          validationFlag = false;
          errors.newPassword = ["New and confirm password must be same"];
        }
      }

      if (
        validateUtil.isEmpty(state.initialData.vendor.aboutStoreFront) ||
        validateUtil.isLessThan(state.initialData.vendor.aboutStoreFront, 200)
      ) {
        validationFlag = false;
        errors.aboutStoreFront = [
          "The description must contain a minimum of 200 characters",
        ];
      }

      if (
        validateUtil.isEmpty(state.initialData.vendor.contactPerson.fullName)
      ) {
        validationFlag = false;
        errors.fullName = ["Contact person name is required"];
      } else if (
        validateUtil.isGreaterThan(
          state.initialData.vendor.contactPerson.fullName,
          150
        )
      ) {
        validationFlag = false;
        errors.fullName = ["Password must not be greater than 150 characters"];
      }

      if (validateUtil.isEmpty(state.initialData.vendor.contactPerson.email)) {
        validationFlag = false;
        errors.email = ["Email is required"];
      } else if (
        validateUtil.isNotEmail(state.initialData.vendor.contactPerson.email)
      ) {
        validationFlag = false;
        errors.email = [
          "Invalid email address, please make sure the spelling!",
        ];
      } else if (
        validateUtil.isGreaterThan(
          state.initialData.vendor.contactPerson.email,
          255
        )
      ) {
        validationFlag = false;
        errors.email = ["Email must not be greater than 255 characters!"];
      }

      if (
        validateUtil.isEmpty(state.initialData.vendor.contactPerson.telephone)
      ) {
        validationFlag = false;
        errors.telephone = ["Your phone number is required"];
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
      initialData.changePasswordCheck = state.changePasswordCheck;

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

      setState((currentState) => ({
        ...currentState,
        initialData: {
          ...currentState.initialData,
        },
      }));

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
      {state.display && <CreateStorefrontStep1
        title="Edit your business information"
        app={app}
        initialData={state.initialData}
        changePasswordCheck={state.changePasswordCheck}
        businessIdentities={state.businessIdentities}
        onInputChange={(dataType, key, value) => handleInputChange(dataType, key, value)}
        onIdentityChange={(dataType, key, value, name, checked) => handleInputChange(dataType, key, value, name, checked)}
        onSubmit={(action) => onSubmit(action)}
        errors={state.errors}
      />}
    </>
  );
}
