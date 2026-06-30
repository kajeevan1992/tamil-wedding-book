import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "@utilities/Modal";
import ModalContent from "@components/shared/ModalContent";
import CountdownTimer from "@components/shared/CountdownTimer";
import { formatDate } from '@utilities/CommonUtil';
import html2canvas from 'html2canvas';

const ShareWeddingModal = forwardRef((props, ref) => {
    let modal = null;
    const htmlToImageRef = useRef(null);

    useImperativeHandle(ref, () => ({
        showModal() {
            modal = new Modal('#shareWeddingModal', {
                backdrop: true
            });

            modal.show();
        },
        hideModal() {
            modal = new Modal('#shareWeddingModal', {
                backdrop: true
            });

            modal.hide();
        },
    }));

    const convertHtmlToImage = () => {
        let htmlRef = htmlToImageRef.current;
        // var t = htmlRef.getContext('2d');


        html2canvas(htmlRef, { proxy: props.app.serverPath }).then(
            function (canvas) {
                const image = canvas.toDataURL("image/jpeg", 1.0);
                console.log(canvas);
                var link = document.createElement('a');
                link.download = `${props.app.profile.fullName}-wedding.jpeg`;
                link.style = "display:none;";
                link.href = image;
                link.click();

                link.remove();
            })
            .catch(function (error) {
                console.log(error);
                alert('Oops, something went wrong!');
            });


        // toJpeg(htmlToImageRef.current, { cacheBust: false })
        //     .then(function (dataUrl) {
        //         console.log(dataUrl);
        //         var link = document.createElement('a');
        //         link.download = 'my-image-name.jpeg';
        //         link.href = dataUrl;
        //         link.click();
        //         // var img = new Image();
        //         // img.src = dataUrl;
        //         // document.body.appendChild(img);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //         alert('Oops, something went wrong!');
        //     });
    }

    return (
        <>
            <ModalContent
                id="shareWeddingModal"
                title="Share your wedding countdown"
                onHide={props.onHideModal}
                body={props.app.profile.couple && <div className="row px-3">
                    <div className="col-12">
                        <p>Download and share on social media to count down with your friends and family!</p>
                        <div className="share-wedding-card-wrapper" ref={htmlToImageRef}>
                            <img src={`${props.app.serverPath + props.app.profile.couple.weddingDetail.cardPhoto}`} className="share-card-photo" />
                            <div className="share-wedding-card-header text-center">
                                <span className="bi bi-heart-fill"></span>
                                <h3>{props.app.profile.fullName}  {props.app.profile.partner ? ' & ' + props.app.profile.partner.fullName : props.app.profile.couple.weddingDetail.partnerName ? ' & ' + props.app.profile.couple.weddingDetail.partnerName : ''}</h3>
                                <p>
                                    {formatDate(props.app.profile.couple.weddingDetail.date, 'Mo of MMMM, YYYY')}
                                </p>
                            </div>
                            <div className="share-wedding-card-middle text-center">
                                <CountdownTimer date={props.app.profile.couple.weddingDetail.date} />
                            </div>
                            <div className="share-wedding-card-footer text-center">
                                <span>GET YOUR COUNTDOWN AT TAMILWEDDINGBOOK.COM</span>
                            </div>
                            <div className="share-wedding-card-overlay"></div>
                        </div>

                        <div className="pt-3 pb-1 text-center">
                            <button type="button" onClick={convertHtmlToImage} className="btn btn-primary btn-sm btn-block">Download</button>
                        </div>
                    </div>
                </div>}
            />
        </>
    );
});

export default ShareWeddingModal;