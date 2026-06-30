import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Modal } from "@utilities/Modal";
import Croppie from "croppie";
import 'croppie/croppie.css';

const ImageCropperModal = forwardRef((props, ref) => {
    const [croppie, setCroppie] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(null);
    const [objectUrl, setObjectUrl] = useState(null);

    let modal = null;

    // Cleanup function to prevent memory leaks
    const cleanup = () => {
        if (croppie) {
            croppie.destroy();
            setCroppie(null);
        }
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            setObjectUrl(null);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    useImperativeHandle(ref, () => ({
        showModal(image, type, options = {
            enableExif: true,
            viewport: {
                height: 250,
                width: 250,
                type: 'square'
            },
            boundary: {
                height: 280,
                width: 400,
            },
        }) {
            modal = new Modal(`#imageCropperModal${props.id}`, {
                backdrop: true
            });

            setImage(image);
            setType(type);

            const el = document.getElementById(`image-cropper-wrapper-${props.id}`);
            console.log(el);
            if (el) {
                const reader = new FileReader();
                reader.readAsDataURL(image);

                let croppieInstance = new Croppie(el, options);
                reader.onload = () => {
                    const url = reader.result;
                    setObjectUrl(url);
                    croppieInstance.bind({ url: url });
                };

                setCroppie(croppieInstance);
                modal.show();
            }
        },
        hideModal() {
            cleanup();

            let backdrop = false;
            if (props.id !== 'banner-edit-profiles') {
                backdrop = true;
            }
            modal = new Modal(`#imageCropperModal${props.id}`, {
                backdrop: backdrop
            });

            modal.hide();
        },
    }));

    const cropImage = () => {
        if (croppie !== null) {
            croppie
                .result({
                    type: 'blob',
                    // size: {
                    //     width: 250,
                    //     height: 250,
                    // },
                    // format: 'png'
                })
                .then((blob) => {
                    const imageFile = new File([blob], 'image.jpg', {
                        type: blob.type,
                    });
                    props.onHideModal(imageFile, type);

                }).catch(error => {
                    if (error) {
                        console.log(error);
                        alert('Something went wrong during cropping, please try again!');
                    }
                });
        }
    };

    const cancleCropping = () => {
        props.onHideModal(image, type);
    }

    return (
        <>
            <div className="modal fade" id={`imageCropperModal${props.id}`} data-keyboard="false" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog couple-dashboard-step-modal">
                    <div className="modal-content">
                        <div className="modal-header fs-16px d-flex justify-content-center">
                            <div className="modal-title ">Crop your photo</div>
                        </div>
                        <div className="modal-body">
                            <div className="row px-3">
                                <div id={`image-cropper-wrapper-${props.id}`}></div>
                                <hr />
                                <div className="text-center w-100">
                                    <button type="button" onClick={cropImage} className="btn btn-primary">Crop</button> <br /><br />
                                    <button type="button" onClick={cancleCropping} className="btn btn-link text-secondary">Don't Crop</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default ImageCropperModal;