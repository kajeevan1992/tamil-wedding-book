import { TbUserDollar } from "react-icons/tb";
import { AiFillCheckCircle } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { IoImagesOutline } from "react-icons/io5";
import CreateStorefrontStep1 from "@components/vendor/storefront/CreateStorefrontStep1";
import CreateStorefrontStep2 from "@components/vendor/storefront/CreateStorefrontStep2";
import CreateStorefrontStep3 from "@components/vendor/storefront/CreateStorefrontStep3";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import * as validateUtil from "@utilities/ValidateUtil";
import { statusMessages } from "@utilities/CommonUtil";

export default function CreateStorefront() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    steps: {
      main: true,
      step1: false,
      step2: false,
      step3: false,
    },

    initialData: {
      location: {},
      vendor: {
        contactPerson: {},
        businessIdentity: {},
      },
    },

    businessIdentities: [],
    changePasswordCheck: false,

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
      }));

      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
      toast.error("Something went wrong, please try again");
    }
  }

  const changeStep = (step) => {
    setState((currentState) => ({
      ...currentState,
      steps: {
        ...currentState.steps,
        main: false,
        step1: false,
        step2: false,
        step3: false,
        [step]: true,
      },
    }));
  };

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
        if (key === "address") {
          setState((currentState) => ({
            ...currentState,
            initialData: {
              ...currentState.initialData,
              address: value.formatted_address,
              lng: value.geometry.location.lng(),
              lat: value.geometry.location.lat(),
            },
          }));
        } else if (key === 'photo') {
          let file = value.target.files[0];
          if (file) {
            setState((currentState) => ({
              ...currentState,
              initialData: {
                ...currentState.initialData,
                [key]: file,
              },
            }));
          }
        } else {
          setState((currentState) => ({
            ...currentState,
            initialData: {
              ...currentState.initialData,
              [key]: value,
            },
          }));
        }
        break;
      case "vendor":
        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              [key]: value,
            },
          },
        }));
        break;
      case "businessIdentity":
        console.log(dataType, key, value, name, checked);
        let vendorBusinessIdentities =
          state.initialData.vendor.vendorBusinessIdentities;
        // todo fix for None of these apply option after other is selected if it exists remove it
        if (checked === true && name === "None of these apply") {
          vendorBusinessIdentities = [];
          vendorBusinessIdentities.push(value);
        } else {
          let find = vendorBusinessIdentities.indexOf(value);
          if (find > -1) {
            vendorBusinessIdentities.splice(find, 1);
          } else {
            vendorBusinessIdentities.push(value);
          }

          let noneOption = state.businessIdentities.find(
            (e) => e.name === "None of these apply"
          );
          if (vendorBusinessIdentities.indexOf(noneOption.id) > -1) {
            vendorBusinessIdentities.splice(
              vendorBusinessIdentities.indexOf(noneOption.id),
              1
            );
          }
        }

        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              vendorBusinessIdentities: vendorBusinessIdentities,
            },
          },
        }));
        break;
      case "contactPerson":
        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              contactPerson: {
                ...currentState.initialData.vendor.contactPerson,
                [key]: value,
              },
            },
          },
        }));
        break;
      case "vendorStoreFiles":
        //! check image height and width before pushing for security reason
        let vendorStoreFiles = state.initialData.vendor.vendorStoreFiles;
        if (action === "add") {
          let fileData = {
            vendorId: state.initialData.vendor.id,
            description: "",
            name: "",
            path: "",
            extension: "",
            file: value,
            main: false,
          };
          vendorStoreFiles.push(fileData);
        } else if (action === "delete") {
          vendorStoreFiles.splice(key, 1);
        }
        // else if (action === "main") {
        //   vendorStoreFiles.map((vendorFile, index) => {
        //     if (index === key) {
        //       vendorFile.main = true;
        //     } else {
        //       vendorFile.main = false;
        //     }
        //   });
        // } 
        else if (action === "description") {
          vendorStoreFiles.map((vendorFile, index) => {
            if (index === key) {
              vendorFile.description = value;
            }
          });
        }

        setState((currentState) => ({
          ...currentState,
          initialData: {
            ...currentState.initialData,
            vendor: {
              ...currentState.initialData.vendor,
              vendorStoreFiles: vendorStoreFiles,
            },
          },
        }));
        break;
      case "general":
        setState((currentState) => ({
          ...currentState,
          [key]: value,
        }));
        break;
      default:
        break;
    }
  };

  const stepsData = [
    {
      status: state.initialData.storeFrontFirstStepDone,
      Icon: state.initialData.storeFrontFirstStepDone
        ? AiFillCheckCircle
        : TbUserDollar,
      step: 1,
      title: "Add information about your business",
      description: "Estimated completion time: 3 min",
      changeStep: () => changeStep("step1"),
    },
    {
      status: state.initialData.storeFrontSecondStepDone,
      Icon: state.initialData.storeFrontSecondStepDone
        ? AiFillCheckCircle
        : GoLocation,
      step: 2,
      title: "Include your business address",
      description: "Estimated completion time: 2 min",
      changeStep: () => changeStep("step2"),
    },
    {
      status: state.initialData.storeFrontThirdStepDone,
      Icon: state.initialData.storeFrontThirdStepDone
        ? AiFillCheckCircle
        : IoImagesOutline,
      step: 3,
      title: "Upload 8 high quality photos",
      description: "Estimated completion time: 2 min",
      changeStep: () => changeStep("step3"),
    },
  ];

  function MainStep() {
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <h1 className="prepareTextTitle">
              Prepare your storefront and stand out!
            </h1>
            <p className="prepareTextDesc">
              Complete these simple steps to publish your storefront. Our team
              will review the information and contact you soon. Need help? Look
              at this storefront <a className="prepareTextLink">example</a>
            </p>
          </div>
          <div className="d-flex justify-content-between col-md-12 mt-3">
            {stepsData.map((step, index) => (
              <a
                className={`d-flex align-items-center  flex-column justify-content-around stepDiv ${step.status ? "grey-bg" : ""
                  }`}
                key={index}
                onClick={() => step.changeStep()}
              >
                <step.Icon
                  className={`stepIcon ${step.status ? "text-success" : ""}`}
                />
                <p className="stepText">step{step.step}</p>
                <p className="stepTitle">{step.title}</p>
                <p className="stepDesc">
                  {step.status ? "Complete" : step.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </>
    );
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
    } else if (action === "step2") {
      if (validateUtil.isEmpty(state.initialData.address)) {
        validationFlag = false;
        errors.address = ["Store location is required"];
      } else if (validateUtil.isGreaterThan(state.initialData.address, 255)) {
        validationFlag = false;
        errors.address = [
          "Store location must not be greater than 255 characters!",
        ];
      }
    } else if (action === "step3") {
      // let mainExists = state.initialData.vendor.vendorStoreFiles.find(
      //   (vendorFile) => vendorFile.main === true
      // );
      // if (!mainExists) {
      //   validationFlag = false;
      //   errors.images = ["Any one image should be selected as main"];
      // } else {
      let emptyDescription = state.initialData.vendor.vendorStoreFiles.find(
        (vendorFile) => vendorFile.description === ""
      );
      if (emptyDescription) {
        validationFlag = false;
        errors.images = [
          "Every image description must contain a minimum of five characters.",
        ];
      }
      // }
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
          stepsDone: data.user.stepsDone,
          storeFrontFirstStepDone: data.user.storeFrontFirstStepDone,
          storeFrontSecondStepDone: data.user.storeFrontSecondStepDone,
          storeFrontThirdStepDone: data.user.storeFrontThirdStepDone,
        },
        steps: {
          ...currentState.steps,
          main: true,
          step1: false,
          step2: false,
          step3: false,
        },
      }));

      dispatch(toggleLoading(false));
      toast.success(data.message);
      window.scroll(0, 0);
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

  async function deleteImage(key, file) {
    try {
      if (
        !window.confirm(`Are you sure, you want to delete ${file.description}`)
      )
        return;

      dispatch(toggleLoading(true));
      const { data } = await vendorService.deleteStorefrontImage(file);

      let vendorStoreFiles = state.initialData.vendor.vendorStoreFiles;
      vendorStoreFiles.splice(key, 1);

      setState((currentState) => ({
        ...currentState,
        initialData: {
          ...currentState.initialData,
          vendor: {
            ...currentState.initialData.vendor,
            vendorStoreFiles: vendorStoreFiles,
          },
        },
      }));

      dispatch(toggleLoading(false));
      toast.success(data.message);
    } catch (error) {
      dispatch(toggleLoading(false));
      statusMessages(error);
    }
  }

  return (
    <>
      <div className="container mt-5">
        {!state.steps.main && (
          <button
            type="button"
            onClick={() => changeStep("main")}
            className="btn pl-0 pt-0 btn-lg"
          >
            <i className="bi bi-arrow-left text-theme"></i> Back
          </button>
        )}
        {state.steps.main && <MainStep />}
        {state.steps.step1 && (
          <CreateStorefrontStep1
            app={app}
            initialData={state.initialData}
            changePasswordCheck={state.changePasswordCheck}
            businessIdentities={state.businessIdentities}
            onInputChange={(dataType, key, value) =>
              handleInputChange(dataType, key, value)
            }
            onIdentityChange={(dataType, key, value, name, checked) =>
              handleInputChange(dataType, key, value, name, checked)
            }
            onSubmit={(action) => onSubmit(action)}
            errors={state.errors}
          />
        )}
        {state.steps.step2 && (
          <CreateStorefrontStep2
            app={app}
            initialData={state.initialData}
            onInputChange={(dataType, key, value) =>
              handleInputChange(dataType, key, value)
            }
            onSubmit={(action) => onSubmit(action)}
            errors={state.errors}
          />
        )}
        {state.steps.step3 && (
          <CreateStorefrontStep3
            app={app}
            initialData={state.initialData}
            onInputChange={(dataType, key, value, action) =>
              handleInputChange(dataType, key, value, null, null, action)
            }
            deleteImage={(key, id) => deleteImage(key, id)}
            onSubmit={(action) => onSubmit(action)}
            errors={state.errors}
          />
        )}
      </div>
    </>
  );
}
