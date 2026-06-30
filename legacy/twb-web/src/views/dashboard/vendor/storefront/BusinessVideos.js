import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleLoading, authenticate } from "@store/AppSlice";
import * as vendorService from "@services/VendorService";
import { toast } from 'react-hot-toast';
import DragDrop from "@components/shared/DragDrop";
import { NavLink } from 'react-router-dom';
import { statusMessages } from "@utilities/CommonUtil";

export default function BusinessVideos() {
  const [state, setState] = useState({
    videos: [],

    display: false,
    errors: {},
  });

  useEffect(() => {
    // loadInitials();
  }, []);

  const dispatch = useDispatch();
  async function loadInitials() {
    try {
      dispatch(toggleLoading(true));
      const { data } = await vendorService.loadStoreFrontInitials();

      setState((currentState) => ({
        ...currentState,
        videos: data.vendorData,
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
      case "vendorStoreFiles":
        //! check image height and width before pushing for security reason
        // let vendorStoreFiles = state.videos.vendor.vendorStoreFiles;
        // if (action === "add") {
        //   let fileData = {
        //     vendorId: state.videos.vendor.id,
        //     description: "",
        //     name: "",
        //     path: "",
        //     extension: "",
        //     file: value,
        //     main: false,
        //   };
        //   vendorStoreFiles.push(fileData);
        // } else if (action === "delete") {
        //   vendorStoreFiles.splice(key, 1);
        // } else if (action === "main") {
        //   vendorStoreFiles.map((vendorFile, index) => {
        //     if (index === key) {
        //       vendorFile.main = true;
        //     } else {
        //       vendorFile.main = false;
        //     }
        //   });
        // } else if (action === "description") {
        //   vendorStoreFiles.map((vendorFile, index) => {
        //     if (index === key) {
        //       vendorFile.description = value;
        //     }
        //   });
        // }

        // setState((currentState) => ({
        //   ...currentState,
        //   videos: {
        //     ...currentState.videos,
        //     vendor: {
        //       ...currentState.videos.vendor,
        //       vendorStoreFiles: vendorStoreFiles,
        //     },
        //   },
        // }));
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
      // let mainExists = state.videos.vendor.vendorStoreFiles.find(
      //   (vendorFile) => vendorFile.main === true
      // );
      // if (!mainExists) {
      //   validationFlag = false;
      //   errors.images = ["Any one image should be selected as main"];
      // } else {
      //   let emptyDescription = state.videos.vendor.vendorStoreFiles.find(
      //     (vendorFile) => vendorFile.description === ""
      //   );
      //   if (emptyDescription) {
      //     validationFlag = false;
      //     errors.images = [
      //       "Every image description must contain a minimum of five characters.",
      //     ];
      //   }
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
      const videos = state.videos;
      videos.action = action;

      let formData = new FormData();
      for (const key in videos) {
        if (key === "vendor") {
          formData.append(key, JSON.stringify(videos[key]));
          for (const keyFile in videos[key]["vendorStoreFiles"]) {
            formData.append(
              `vendorStoreFiles${keyFile}`,
              videos[key]["vendorStoreFiles"][keyFile].file
            );
          }
        } else {
          formData.append(key, videos[key]);
        }
      }

      const { data } = await vendorService.updateStoreFront(formData);
      dispatch(authenticate(data.user));

      setState((currentState) => ({
        ...currentState,
        videos: {
          ...currentState.videos,
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

      // let vendorStoreFiles = state.videos.vendor.vendorStoreFiles;
      // vendorStoreFiles.splice(key, 1);

      // setState((currentState) => ({
      //   ...currentState,
      //   videos: {
      //     ...currentState.videos,
      //     vendor: {
      //       ...currentState.videos.vendor,
      //       vendorStoreFiles: vendorStoreFiles,
      //     },
      //   },
      // }));

      dispatch(toggleLoading(false));
      toast.success(data.message);
    } catch (error) {
      dispatch(toggleLoading(false));
      statusMessages(error);
    }
  }

  return (
    <>
      <div className="row">
        <section className="col-md-12">
          <h1 className="prepareTextTitle">
            Videos
          </h1>
          <div className="card mt-2">
            <div className="card-body d-flex grey-bg">
              <i className="bi bi-camera-reels fs-3rem mr-3"></i>
              <div>
                <strong>Showcase your work by adding videos to your storefront.</strong>
                <p className="m-0">Add unlimited videos related to your business and wedding services.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="col-md-12 mt-4">
          <h4>Drag or click to add video</h4>
          <div className="card mt-3">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <DragDrop
                    content={
                      <div className="text-center c-p p-5">
                        <i className="bi bi-camera-reels fs-6rem"></i> <br />
                        <small>AVI, FLV or MP4 format Max 500MB</small><br /> <br />
                        <p>Drag and drop your photos here. Once uploaded, you can select and drag images to reorder below.</p>
                      </div>
                    }
                    // fileUploaded={(file) => props.onInputChange('vendorStoreFiles', null, file, 'add')}
                    fileUploaded={(file) => { }}
                    accept={{
                      'image/*': ['.avi', '.flv', '.mp4']
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="col-md-12 mt-4">
          {
            state.errors.images &&
            <div className="invalid-feedback mb-3">
              {state.errors.images[0]}
            </div>
          }
          {state.videos && <div className="row">
            {state.videos.map((vendorFile, index) => <div className="col-md-3 mb-3" key={index}>
              <div className="card">
                <img src={vendorFile.file ? URL.createObjectURL(vendorFile.file) : (state.app.serverPath + vendorFile.path)} className="w-100" style={{ height: '150px' }} />
                <div className="card-body p-1">
                  <input
                    type="text"
                    placeholder="Enter title"
                    className="txt-card-transparent my-2"
                    value={vendorFile.description} onChange={(e) => handleInputChange('vendorStoreFiles', index, e.target.value, 'description')} />
                  <hr className="my-0" />
                  <div className="d-flex my-2" style={{ height: '30px' }}>
                    <select value={vendorFile.main} className="form-control mr-2 py-0" onChange={(e) => handleInputChange('vendorStoreFiles', index, e.target.value, 'main')}>
                      <option value="">Show as</option>
                      <option value={true}>Main</option>
                      <option value={false}>Normal</option>
                    </select>
                    <button className="btn btn-danger btn-sm ml-2 py-0" onClick={() => vendorFile.id ? deleteImage(index, vendorFile) : handleInputChange('vendorStoreFiles', index, vendorFile, 'delete')}>
                      <span className={`bi ${vendorFile.id ? 'bi-trash' : 'bi-x-lg'}`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
          </div>}
        </section>

        <section className="col-md-12 mt-2">
          <small>Published content must meet Tamil Wedding's Book <NavLink className="text-theme">Terms of Use</NavLink>.</small><br />
          <button className="btn bt-sm btn-primary" onClick={() => onSubmit('step3')}>Save</button>
        </section>
      </div>
    </>
  );
}