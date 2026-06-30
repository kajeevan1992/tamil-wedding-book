import {
    FacebookShareButton,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
    EmailShareButton,
    EmailIcon,
    // GabShareButton,
    // HatenaShareButton,
    // InstapaperShareButton,
    // LineShareButton,
    // LinkedinShareButton,
    // LivejournalShareButton,
    // MailruShareButton,
    // OKShareButton,
    // PinterestShareButton,
    // PocketShareButton,
    // RedditShareButton,
    // TelegramShareButton,
    // TumblrShareButton,
    // TwitterShareButton,
    // ViberShareButton,
    // VKShareButton,
    // WorkplaceShareButton,
} from "react-share";
import { copyToClipboard } from "@utilities/CommonUtil";

export default function InviteByLink(props) {
    return (
        <div className="d-flex flex-column text-center mt-4">
            <h4 className="mb-4">Collect addresses from all your guests with just one link.</h4>
            <ol className="invite-by-link-ol mb-4">
                <li>Send your link to family and friends.</li>
                <li>Guests fill out their contact details.</li>
                <li>That's it - they're on your list.</li>
            </ol>

            <div className="d-flex justify-content-between w-50 m-auto gap-10px">
                <input
                    className="form-control form-control-sm disabled"
                    value={props.inviteByLinkUrl} />
                <button
                    type="button"
                    onClick={() => { copyToClipboard(props.inviteByLinkUrl) }}
                    className="btn btn-primary btn-sm"
                >Copy</button>
            </div>

            <div className="my-5 d-flex justify-content-center">
                <FacebookShareButton
                    url={props.inviteByLinkUrl}
                    quote={"something here"}
                    hashtag={"#tamilWeddingBook"}
                    description={"something here too"}
                    className="mx-3"
                >
                    <FacebookIcon size={50} round />
                    <div className="mt-2">
                        <small>Facebook</small>
                    </div>
                </FacebookShareButton>
                <WhatsappShareButton
                    url={props.inviteByLinkUrl}
                    quote={"something here"}
                    hashtag={"#tamilWeddingBook"}
                    description={"something here too"}
                    className="mx-3"
                >
                    <WhatsappIcon size={50} round />
                    <div className="mt-2">
                        <small>Whatsapp</small>
                    </div>
                </WhatsappShareButton>
                <EmailShareButton
                    url={props.inviteByLinkUrl}
                    quote={"something here"}
                    hashtag={"#tamilWeddingBook"}
                    description={"something here too"}
                    className="mx-3"
                >
                    <EmailIcon size={50} round />
                    <div className="mt-2">
                        <small>Email</small>
                    </div>
                </EmailShareButton>
            </div>
        </div>
    );
}