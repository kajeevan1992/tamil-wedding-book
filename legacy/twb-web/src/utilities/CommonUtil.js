import copy from "copy-to-clipboard";
import moment from "moment";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";

export function formatDate(date, format) {
    return moment(date).format(format);
}

export function convertDateToObject(date) {
    return moment(date).toDate();
}

export function timeAgo(date) {
    return moment(date).fromNow();
}

export function isDateBefore(date, checkDate = moment()) {
    return moment(date).isBefore(checkDate);
}

export function isDateAfter(date, checkDate = moment()) {
    return moment(date).isAfter(checkDate);
}

export function isDateSameOrAfter(date, checkDate = moment()) {
    console.log(moment(date).toDate(), moment(checkDate).toDate());
    return moment(date).isSameOrAfter(moment(checkDate));
}

export function isDateSameOrBefore(date, checkDate = moment()) {
    return moment(date).isSameOrBefore(checkDate);
}

export function subtractAndformatDate(date, subtract, subtractType, format) {
    return moment(date).subtract(subtract, subtractType).format(format);
}

export function addAndformatDate(date, add, addType, format) {
    return moment(date).add(add, addType).format(format);
}

export function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function timeOptions(addOptions = []) {
    let options = [
        { label: "00:00", name: "00:00" },
        { label: "00:30", name: "00:30" },
        { label: "01:00", name: "01:00" },
        { label: "01:30", name: "01:30" },
        { label: "02:00", name: "02:00" },
        { label: "02:30", name: "02:30" },
        { label: "03:00", name: "03:00" },
        { label: "03:30", name: "03:30" },
        { label: "04:00", name: "04:00" },
        { label: "04:30", name: "04:30" },
        { label: "05:00", name: "05:00" },
        { label: "05:30", name: "05:30" },
        { label: "06:00", name: "06:00" },
        { label: "06:30", name: "06:30" },
        { label: "07:00", name: "07:00" },
        { label: "07:30", name: "07:30" },
        { label: "08:00", name: "08:00" },
        { label: "08:30", name: "08:30" },
        { label: "09:00", name: "09:00" },
        { label: "09:30", name: "09:30" },
        { label: "10:00", name: "10:00" },
        { label: "10:30", name: "10:30" },
        { label: "11:00", name: "11:00" },
        { label: "11:30", name: "11:30" },
        { label: "12:00", name: "12:00" },
        { label: "12:30", name: "12:30" },
        { label: "13:00", name: "13:00" },
        { label: "13:30", name: "13:30" },
        { label: "14:00", name: "14:00" },
        { label: "14:30", name: "14:30" },
        { label: "15:00", name: "15:00" },
        { label: "15:30", name: "15:30" },
        { label: "16:00", name: "16:00" },
        { label: "16:30", name: "16:30" },
        { label: "17:00", name: "17:00" },
        { label: "17:30", name: "17:30" },
        { label: "18:00", name: "18:00" },
        { label: "18:30", name: "18:30" },
        { label: "19:00", name: "19:00" },
        { label: "19:30", name: "19:30" },
        { label: "20:00", name: "20:00" },
        { label: "20:30", name: "20:30" },
        { label: "21:00", name: "21:00" },
        { label: "21:30", name: "21:30" },
        { label: "22:00", name: "22:00" },
        { label: "22:30", name: "22:30" },
        { label: "23:00", name: "23:00" },
        { label: "23:30", name: "23:30" },
    ];

    Array.prototype.push.apply(addOptions, options);

    return addOptions;
}

export const vendorTypes = [
    {
        name: "venue",
        label: "Wedding Venues",
    },
    {
        name: "supplier",
        label: "Wedding Suppliers",
    },
];
export function copyToClipboard(text) {
    copy(text);
    toast.success(`Copied to clipboard`);
}

export function statusMessages(error) {
    if (error?.response?.status) {
        switch (error?.response?.status) {
            case 400:
                toast.error(error.response.data.message);
                break;
            case 401:
                toast.error(error.response.data.message);
                break;
            case 422:
                toast.error(error.response.data.message);
                return "validation-errors";
            case 404:
                toast.error(error.response.data.message);
                break;
            case 409:
                toast.error(error.response.data.message);
                break;
            case 413:
                toast.error("One or more file size limit has been reached ");
                break;
            case 501:
                toast.error(error.response.data.message);
                break;
            default:
                toast.error("Something went wrong, please try again");
                break;
        }
    } else {
        toast.error("Something went wrong, please try again");
    }
}

export const vendorLinks = (role) => {
    return [
        { name: "Home", href: `/${role}`, icon: "bi-briefcase" },
        {
            name: "Storefront",
            href: `/${role}/storefront`,
            icon: "bi-shop-window",
        },
        { name: "Enquiries", href: `/${role}/enquiries`, icon: "bi-envelope" },
        { name: "Reviews", href: `/${role}/reviews`, icon: "bi-star" },
        {
            name: "Invoices",
            href: `/${role}/invoices`,
            icon: "bi-receipt-cutoff",
        },
        { name: "Settings", href: `/${role}/settings`, icon: "bi-gear" },
    ];
};

export const coupleLinks = () => {
    const baseUrl = "/couple";
    const iconBase = "tamilweddingbook_";
    return [
        {
            name: "My Wedding",
            href: `${baseUrl}`,
            icon: `${iconBase}ring_double`,
        },
        {
            name: "Checklist",
            href: `${baseUrl}/check-list`,
            icon: `${iconBase}checklist`,
        },
        {
            name: "Suppliers",
            href: `${baseUrl}/vendors`,
            icon: `${iconBase}vendor_manager`,
        },
        {
            name: "Guest List",
            href: `${baseUrl}/guest-list`,
            icon: `${iconBase}guest_member`,
        },
        {
            name: "Seating Chart",
            href: `${baseUrl}/seating-chart`,
            icon: `${iconBase}seating_chart`,
        },
        {
            name: "Budget Planner",
            href: `${baseUrl}/budget-planner`,
            icon: `${iconBase}budget`,
        },
        {
            name: "Dresses",
            href: `${baseUrl}/dresses`,
            icon: `${iconBase}fashion`,
        },
        {
            name: "Wedding Website",
            href: `${baseUrl}/wedding-website`,
            icon: `${iconBase}websote_demo`,
        },
        {
            name: "WedShoots",
            href: `${baseUrl}/web-shoots`,
            icon: `${iconBase}camera_alt`,
        },
    ];
};

export const selectColorStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                ? "#ec2128"
                : isFocused
                ? "rgb(228 31 39 / 50%)"
                : undefined,
            color: isDisabled
                ? undefined
                : isSelected
                ? "#ffffff"
                : isFocused
                ? "ffffff"
                : undefined,
        };
    },
};

export const encryptAsUrl = (data) => {
    return btoa(JSON.stringify(data));
};

export const decryptUrl = (data) => {
    return JSON.parse(atob(data));
};

export const tables = [
    {
        type: "sc-one-sided-table",
        icon: "one-sided-table.png",
    },
    {
        type: "sc-two-sided-table",
        icon: "two-sided-table.png",
    },
    {
        type: "sc-four-sided-table",
        icon: "four-sided-table.png",
    },
    {
        type: "sc-rounded-table",
        icon: "rounded-table.png",
    },
];

export const sortGuestCompanions = (data) => {
    let companions = data.filter(
        (object) => object.coupleWeddingGuest.companionOfId
    );
    let guests = data.filter(
        (object) => !object.coupleWeddingGuest.companionOfId
    );

    companions.map((companion) => {
        let guest = guests.find(
            (g) =>
                g.coupleWeddingGuest.id ===
                companion.coupleWeddingGuest.companionOfId
        );
        if (guest) {
            if (!guest?.coupleWeddingGuest?.companions) {
                guest.coupleWeddingGuest.companions = [];
            }

            let isExists = guest.coupleWeddingGuest.companions.find(
                (c) => c.id === companion.id
            );
            if (!isExists) {
                guest.coupleWeddingGuest.companions.push(companion);
            }
        } else {
            guests.push(companion);
        }
    });

    return guests;
};

export const appIcons = [
    "bi-house-heart",
    "bi-house-door",
    "bi-music-note-beamed",
    "bi-envelope-arrow-up",
    "bi-gift",
    "bi-flower2",
    "bi-camera-reels",
    "bi-bus-front",
    "bi-gem",
    "bi-person-dash",
    "bi-person-add",
    "bi-backpack3",
    "bi-airplane",
    "bi-list-ul",
    "bi-globe",
    "bi-shield-lock",
    "bi-calendar-event",
    "bi-book",
    "bi-wrench",
    "bi-heart",
    "bi-star",
    "bi-cart-check",
    "bi-clock-history",
    "bi-alarm",
    "bi-palette",
    "bi-brush",
    "bi-music-note-list",
    "bi-film",
    "bi-gamepad",
];

export const convertToNumber = (value) => {
    if (typeof value === "number") {
        return value;
    }

    return value.includes(".") ? parseFloat(value) : parseInt(value);
};

export const weddingThemeColors = [
    "rgb(229, 204, 203)",
    "rgb(211, 223, 158)",
    "rgb(234, 215, 195)",
    "rgb(223, 241, 237)",
    "rgb(251, 206, 117)",
    "rgb(192, 191, 165)",
    "rgb(234, 182, 173)",
    "rgb(154, 169, 176)",
    "rgb(188, 175, 181)",
    "rgb(255, 255, 255)",
    "rgb(239, 239, 239)",
];

// Planning Tools right side content
const PlanningToolsRightContent = () => (
    <>
        <div className="own-lg-column p-3 d-flex align-items-center">
            <div className="row">
                <div className="col-lg-9">
                    <h6 className="fs-12px">Download the Tamilwedding App</h6>
                    <p className="own-paragraph-1 text-wrap mb-0">
                        Get the Tamilwedding App. Dream it. Plan it. Book it.
                        wherever you are.
                    </p>
                </div>
                <div className="col-lg-3 d-flex align-items-center ">
                    <img
                        src="/assets/images/small-logo.png"
                        alt="download"
                        className="mb-0"
                        style={{ width: "48px", height: "48px" }}
                    />
                </div>
            </div>
        </div>
        <div className="mt-3 own-lg-column p-3 d-flex align-items-center">
            <div className="row">
                <div className="col-lg-9">
                    <h6 className="fs-12px">Wedshoots</h6>
                    <p className="own-paragraph-1 text-wrap mb-0">
                        Share with your guests to easily collect all your
                        wedding photos.
                    </p>
                </div>
                <div className="col-lg-3 d-flex align-items-center">
                    <img
                        src="/assets/images/ico_wedshoots.svg"
                        alt=""
                        className="mb-0"
                        style={{ width: "48px", height: "48px" }}
                    />
                </div>
            </div>
        </div>
    </>
);

// Venues right side content
const VenuesRightContent = () => (
    <>
        <div className="own-lg-column p-3 d-flex align-items-center">
            <div className="row p-3">
                <div className="col-lg-9 d-flex flex-column justify-content-center ">
                    <h6>Destination Weddings</h6>
                    <p className=" text-wrap fs-12px mb-0">
                        Plan your wedding abroad.
                    </p>
                </div>
                <div className="col-lg-3 d-flex align-items-center justify-content-center ">
                    <img
                        src="/assets/images/about/plane_destination.svg"
                        alt=""
                    />
                </div>
            </div>
        </div>
    </>
);

// Dresses right side content
const DressesRightContent = () => (
    <>
        <div className="own-lg-column p-3 d-flex align-items-center">
            <div className="row">
                <div className="col-lg-4 d-flex align-items-center ">
                    <img
                        src="/assets/images/ideas-tip/dress-1.png"
                        alt="download"
                        className="mb-0 w-100"
                    />
                </div>
                <div className="col-lg-4 d-flex align-items-center ">
                    <img
                        src="/assets/images/ideas-tip/dress-1.png"
                        alt="download"
                        className="mb-0 w-100"
                    />
                </div>
                <div className="col-lg-4 d-flex align-items-center ">
                    <img
                        src="/assets/images/ideas-tip/dress-1.png"
                        alt="download"
                        className="mb-0 w-100"
                    />
                </div>
            </div>
        </div>
    </>
);

// Ideas right side content
const IdeasRightContent = () => (
    <>
        <div className="own-lg-column p-3 d-flex align-items-center">
            <div className="row">
                <div className="col-lg-5">
                    <img
                        src="/assets/images/about/image_2025Z.png"
                        alt=""
                        className="border-top-radius h-100 "
                    />
                </div>
                <div className="col-lg-7 mt-3">
                    <h4 className="mt-1">Real Weddings</h4>
                    <p className="own-paragraph mt-1 text-wrap  fs-12px">
                        Find weddings inspiration that fits your style with
                        photos from real couples.
                    </p>
                </div>
            </div>
        </div>
    </>
);

// Forums right side content
const ForumsRightContent = () => {
    const forumLinks = [
        { label: "Discussions", path: "/forums/discussions" },
        { label: "Photos", path: "/forums/photos" },
        { label: "Videos", path: "/forums/videos" },
        { label: "Members", path: "/forums/members" },
    ];

    return (
        <div className="own-lg-column p-3 d-flex align-items-center">
            <div className="row">
                <div className="col-12">
                    <h4 className="own-title-2 text-uppercase pt-3">
                        Check out The Latest
                    </h4>
                </div>
                {forumLinks.map((link, index) => (
                    <div key={index} className="col-lg-12 mt-1">
                        <NavLink
                            to={link.path}
                            className="own-card own-family p-0 border-bottom-0"
                        >
                            <p className="own-card-3 text-wrap">{link.label}</p>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const navigations = (role, categories) => [
    {
        name: "PLANNING TOOLS",
        href: `/${role && role === "couple" ? "couple/" : ""}checklist`,
        subMenuHeading: "Plan your unique wedding",
        subMenu: [
            {
                name: "Checklist",
                href: `/${
                    role && role === "couple" ? "couple/" : ""
                }check-list`,
                icon: "tamilweddingbook_checklist",
            },
            {
                name: "Guestlist",
                href: `/${
                    role && role === "couple" ? "couple/" : ""
                }guest-list`,
                icon: "tamilweddingbook_guest_member",
            },
            {
                name: "Seating Chart",
                href: `/${
                    role && role === "couple" ? "couple/" : ""
                }seating-chart`,
                icon: "tamilweddingbook_seating_chart",
            },
            {
                name: "Budget Planner",
                href: `/${
                    role && role === "couple" ? "couple/" : ""
                }budget-planner`,
                icon: "tamilweddingbook_budget",
            },
            {
                name: "Wedding Suppliers",
                href: `/${role && role === "couple" ? "couple/" : ""}vendors`,
                icon: "tamilweddingbook_vendor_manager",
            },
            {
                name: "Wedding Dresses",
                href: `/${role && role === "couple" ? "couple/" : ""}dresses`,
                icon: "tamilweddingbook_fashion",
            },
            {
                name: "Wedding Website",
                href: `/${
                    role && role === "couple" ? "couple/" : ""
                }wedding-website`,
                icon: "tamilweddingbook_websote_demo",
            },
            {
                name: "Wedding Shoots",
                href: `/${
                    role && role === "couple" ? "couple/" : ""
                }wedding-shoots`,
                icon: "tamilweddingbook_camera_alt",
            },
        ],
        rightSideContent: PlanningToolsRightContent,
    },
    {
        name: "VENUES",
        href: "/checklist",
        subMenuHeading: "Let's Find Your Wedding Venue",
        subMenu: categories
            ?.filter((category) => category.type === "venue")
            .map((category) => ({
                ...category,
                href: `/venues/${category.slug}`,
            })),
        rightSideContent: VenuesRightContent,
    },
    {
        name: "SUPPLIERS",
        href: "/checklist",
        subMenuHeading: "Let's Find Your Wedding Venue",
        subMenu: categories
            ?.filter((category) => category.type === "supplier")
            .map((category) => ({
                ...category,
                href: `/suppliers/${category.slug}`,
            })),
        rightSideContent: VenuesRightContent,
    },
    {
        name: "DRESSES",
        href: "/dresses",
        subMenuHeading: "Attire for the entire wedding party",
        subMenu: [
            {
                name: "Bride",
                href: "/dresses/bride",
                icon: "tamilweddingbook_heart_hand",
            },
            {
                name: "Jewellery",
                href: "/dresses/jewellery",
                icon: "bi bi-suit-diamond",
            },
            {
                name: "Rings",
                href: "/dresses/rings",
                icon: "bi bi-box2-heart",
            },
            {
                name: "Groom",
                href: "/dresses/groom",
                icon: "bi bi-person-workspace",
            },
            {
                name: "Shoes",
                href: "/dresses/shoes",
                icon: "tamilweddingbook_bell",
            },
            {
                name: "Underwear",
                href: "/dresses/underwear",
                icon: "tamilweddingbook_fashion",
            },
            {
                name: "Bridesmaids",
                href: "/dresses/bridesmaids",
                icon: "bi bi-camera",
            },
            {
                name: "Cufflinks",
                href: "/dresses/cufflinks",
                icon: "tamilweddingbook_fashion",
            },
            {
                name: "Mother of the Bride",
                href: "/dresses/mother-of-the-bride",
                icon: "bi bi-camera",
            },
        ],
        rightSideContent: DressesRightContent,
    },
    {
        name: "IDEAS",
        href: "/ideas",
        subMenuHeading: "Wedding Inspiration and Ideas",
        subMenu: [
            {
                name: "Real Weddings",
                href: "/ideas/real-weddings",
                icon: null,
            },
            {
                name: "Ceremony and Reception",
                href: "/ideas/ceremony-and-reception",
                icon: null,
            },
            {
                name: "Photography",
                href: "/ideas/photography",
                icon: null,
            },
            {
                name: "News",
                href: "/ideas/news",
                icon: null,
            },
            {
                name: "Planning Essentials",
                href: "/ideas/planning-essentials",
                icon: null,
            },
            {
                name: "Entertainment",
                href: "/ideas/entertainment",
                icon: null,
            },
            {
                name: "Beauty and Wellbeing",
                href: "/ideas/beauty-and-wellbeing",
                icon: null,
            },
            {
                name: "Promotionals",
                href: "/ideas/promotionals",
                icon: null,
            },
            {
                name: "Honeymoons",
                href: "/ideas/honeymoons",
                icon: null,
            },
            {
                name: "Wedding Fashion",
                href: "/ideas/wedding-fashion",
                icon: null,
            },
            {
                name: "Wedding DIY",
                href: "/ideas/wedding-diy",
                icon: null,
            },
            {
                name: "Wedding Songs",
                href: "/ideas/wedding-songs",
                icon: null,
            },
            {
                name: "Budget",
                href: "/ideas/budget",
                icon: null,
            },
            {
                name: "Flowers",
                href: "/ideas/flowers",
                icon: null,
            },
            {
                name: "Stationery and Wording Ideas",
                href: "/ideas/stationery-and-wording-ideas",
                icon: null,
            },
            {
                name: "Stag and Hen",
                href: "/ideas/stag-and-hen",
                icon: null,
            },
            {
                name: "Cakes",
                href: "/ideas/cakes",
                icon: null,
            },
            {
                name: "Wedding Speeches",
                href: "/ideas/wedding-speeches",
                icon: null,
            },
        ],
        rightSideContent: IdeasRightContent,
    },
    {
        name: "FORUMS",
        href: "/forums",
        subMenuHeading: "Forums",
        subMenu: [
            {
                name: "Wedding Attire",
                href: "/forums/wedding-attire",
                icon: null,
            },
            {
                name: "Beauty and Wellbeing",
                href: "/forums/beauty-and-wellbeing",
                icon: null,
            },
            {
                name: "Etiquette and Advice",
                href: "/forums/etiquette-and-advice",
                icon: null,
            },
            {
                name: "Off Topic Posts",
                href: "/forums/off-topic-posts",
                icon: null,
            },
            {
                name: "Feedback to Tamilwedding",
                href: "/forums/feedback-to-tamilwedding",
                icon: null,
            },
            {
                name: "Wanted",
                href: "/forums/wanted",
                icon: null,
            },
            {
                name: "Planning",
                href: "/forums/planning",
                icon: null,
            },
            {
                name: "Just Married",
                href: "/forums/just-married",
                icon: null,
            },
            {
                name: "For Sale",
                href: "/forums/for-sale",
                icon: null,
            },
        ],
        rightSideContent: ForumsRightContent,
    },
    {
        name: "GIFT LIST",
        href: "gift list",
        subMenuHeading: "",
        subMenu: [],
        rightSideContent: null,
    },
    {
        name: "INVITATIONS",
        href: "invitations",
        subMenuHeading: "",
        subMenu: [],
        rightSideContent: null,
    },
    {
        name: "SHOP",
        href: "shop",
        subMenuHeading: "",
        subMenu: [],
        rightSideContent: null,
    },
];

export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return {
            qualityOfService: 0,
            professionalism: 0,
            flexibility: 0,
            valueForMoney: 0,
            responseTime: 0,
            averageRating: 0,
        };
    }

    const qualityOfService =
        reviews.reduce((acc, review) => acc + review.qualityOfService, 0) /
        reviews.length;
    const professionalism =
        reviews.reduce((acc, review) => acc + review.professionalism, 0) /
        reviews.length;
    const flexibility =
        reviews.reduce((acc, review) => acc + review.flexibility, 0) /
        reviews.length;
    const valueForMoney =
        reviews.reduce((acc, review) => acc + review.valueForMoney, 0) /
        reviews.length;
    const responseTime =
        reviews.reduce((acc, review) => acc + review.responseTime, 0) /
        reviews.length;
    const averageRating =
        (qualityOfService +
            professionalism +
            flexibility +
            valueForMoney +
            responseTime) /
        5;

    return {
        qualityOfService,
        professionalism,
        flexibility,
        valueForMoney,
        responseTime,
        averageRating,
    };
};
