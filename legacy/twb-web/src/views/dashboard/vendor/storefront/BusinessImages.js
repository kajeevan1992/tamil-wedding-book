import CreateStorefrontStep3 from "@components/vendor/storefront/CreateStorefrontStep3";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import { statusMessages } from "@utilities/CommonUtil";

export default function BusinessImages() {
  const app = useSelector(state => state.app);

  const [state, setState] = useState({
    initialData: {
      location: {},
      vendor: {
        contactPerson: {},
        businessIdentity: {},
      },
    },

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
    console.log('dataType, key, value, name, checked, action')
    console.log(dataType, key, value, name, checked, action)

    switch (dataType) {
      case "user":
        if (key === 'photo') {
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
        }
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

    if (action === "step3") {
      let emptyDescription = state.initialData.vendor.vendorStoreFiles.find(
        (vendorFile) => vendorFile.description === ""
      );
      if (emptyDescription) {
        validationFlag = false;
        errors.images = [
          "Every image description must contain a minimum of five characters.",
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
      {state.display && <CreateStorefrontStep3
        title={`Photos (${state.initialData.vendor.vendorStoreFiles ? state.initialData.vendor.vendorStoreFiles.length + 1 : 1})`}
        app={app}
        initialData={state.initialData}
        onInputChange={(dataType, key, value, action) =>
          handleInputChange(dataType, key, value, null, null, action)
        }
        deleteImage={(key, id) => deleteImage(key, id)}
        onSubmit={(action) => onSubmit(action)}
        errors={state.errors}
      />}
    </>
  );
}