const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();
const moment = require("moment");
const cryptoJs = require("crypto-js");
// const urlencode = require();
const path = require("path");
const models = require("../models");
const fs = require("fs");

const capitalizeFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDate = (date, format) => {
    return moment().format(format);
};

const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString("hex");
};

const trimToLower = (str) => {
    return str.trim().toLowerCase();
};

const hashPassword = async (password, saltRound) => {
    const hashPassword = await bcrypt.hash(password, saltRound);
    return hashPassword;
};

const isPasswordMatched = async (actualPassword, hashPassword) => {
    return await bcrypt.compare(
        actualPassword.toString(),
        hashPassword.toString()
    );
};

const generateRandomInt = (from, to) => {
    // Ex. from = 100000 & to = 900000 will generate 6 digit code
    return from + Math.floor(Math.random() * to);
};

const encryptData = (data) => {
    return cryptoJs.AES.encrypt(
        JSON.stringify(data),
        process.env.CRYPTO_JS_KEY
    ).ciphertext.toString();
};

const decryptData = (data) => {
    let decryptedData = cryptoJs.AES.decrypt(data, process.env.CRYPTO_JS_KEY);
    return JSON.parse(decryptedData.ciphertext.toString(cryptoJs.enc.Utf8));
};

const encryptAsUrl = (data) => {
    return btoa(JSON.stringify(data));
};

const decryptUrl = (data) => {
    return JSON.parse(atob(data));
};

const uploadFile = async (file, folder) => {
    //todo: check if the file is an image and if the image is not more than 5mb and the image should not be a file with image extension but exactly the image.... some time the user upload a script file with image extension and it will be uploaded and it will be a security issue
    const allowedExtension = [".png", ".jpg", ".jpeg", ".gif"];
    const extensionName = path.extname(file.name);

    if (!allowedExtension.includes(extensionName)) {
        return {
            success: false,
            message: "Invalid data format!",
            errors: {
                photo: ["Only .png, .jpg & .jpeg files are allowed"],
            },
        };
    }

    const fileName =
        folder +
        "/" +
        new Date().getTime() +
        generateRandomString(10) +
        extensionName;
    file.mv(path.join(__dirname, `../uploads`, fileName), (err) => {
        if (err) {
            return {
                success: false,
                message: "File upload error!",
                errors: {
                    photo: ["Photo not uploaded"],
                },
            };
        }
    });

    return {
        success: true,
        name: fileName,
        extension: extensionName,
    };
};

const getUserCoupleRecord = async (user) => {
    //! 1 => fresh, if link -> 2 => primary, else 3 => secondary
    let isCouple = await user.getCouple(); // -> partnerId null or exists
    // isCouple [userId, 1, partnerId: null]
    // isCouple [userId, 1, partnerId: 2]

    let isPartner = null;
    let partner = null;
    if (!isCouple.partnerId) {
        // -> null
        // isCouple [userId, 1, partnerId: null]
        isPartner = await models.Couple.findOne({
            // either patner or fresh
            where: { partnerId: user.id },
        });

        if (!isPartner) {
            // fresh
            user = user.toJSON();
            user.couple = isCouple.toJSON();
            user.couple.weddingDetail = await isCouple.getWeddingDetail();
            user.partner = null;
            user.primary = true; // to think
        } else {
            // if partner
            partner = await models.User.findByPk(isPartner.userId);

            user = user.toJSON();
            const userCouple = await partner.getCouple();
            user.couple = userCouple.toJSON();
            user.couple.weddingDetail = await userCouple.getWeddingDetail();
            user.partner = partner;
            user.primary = false;
        }
    } else {
        // partner exists and primary user
        partner = await models.User.findByPk(isCouple.partnerId);

        user = user.toJSON();
        user.couple = isCouple.toJSON();
        user.couple.weddingDetail = await isCouple.getWeddingDetail();
        user.partner = partner;
        user.primary = true; // to think
    }

    return user;
};

const getVendorRecord = async (user) => {
    let vendor = await user.getVendor();
    let vendorCategory = await vendor.getCategory();
    user = user.toJSON();
    vendor = vendor.toJSON();
    user.vendor = vendor;
    user.vendor.category = vendorCategory;

    return user;
};

const uploadVendorStoreFiles = async (req) => {
    //todo: check if the file is an image and if the image is not more than 5mb and the image should not be a file with image extension but exactly the image.... some time the user upload a script file with image extension and it will be uploaded and it will be a security issue
    return new Promise(function (resolve, reject) {
        const files = [];
        const vendor = JSON.parse(req.body.vendor);

        vendor.vendorStoreFiles.forEach(async (vendorStoreFile, keyFile) => {
            if (vendorStoreFile.file && vendorStoreFile.file.path) {
                let vendorStoreImage = req.files[`vendorStoreFiles${keyFile}`];
                if (vendorStoreImage) {
                    const image = await uploadFile(
                        vendorStoreImage,
                        "vendor-store"
                    );

                    if (image && image.success) {
                        files.push({
                            vendorId: vendor.id,
                            description: vendorStoreFile.description,
                            name: vendorStoreFile.file.path,
                            path: image.name,
                            extension: image.extension,
                            main: vendorStoreFile.main,
                        });
                    }
                }
            } else if (vendorStoreFile.id) {
                files.push({
                    id: vendorStoreFile.id,
                    vendorId: vendor.id,
                    description: vendorStoreFile.description,
                    name: vendorStoreFile.name,
                    path: vendorStoreFile.path,
                    extension: vendorStoreFile.extension,
                    main: vendorStoreFile.main,
                });
            }
        });

        resolve(files);
    });
};

const deleteFile = async (path) => {
    //? if file was exists will be deleted otherwise no.
    fs.rmSync(`uploads/${path}`, { force: true });

    //? helped me to correct the path if file not exists or directory not found will throw error fs.unlinkSync(`uploads/${path}`);
};

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (record, page, limit, itemsPerPage) => {
    const { count: totalItems, rows: data } = record;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, data, totalPages, currentPage, itemsPerPage };
};

const parseHtmlReplace = (html, data, next) => {
    let error, parsedHtml;

    // If not html given, sets error
    if (!html) {
        error = {
            name: "RequiredValue",
            message: "You need to specify a template to parse",
        };
    }

    // If not data given sets error
    if (!data) {
        error = {
            name: "RequiredValue",
            message: "You need to specify the data",
        };
    }

    // If error retunn error
    if (error) {
        if (next && typeof next === "function") next(error, null); // If there is a callback function, send the error
        return error;
    }

    // Repalces string between brackets
    parsedHtml = html.replace(/\{\{(.+?)\}\}/g, (_, g) => {
        // If there is a wrong data index, returns error
        if (!data[g.trim()]) {
            error = {
                name: "IndexDoesNotExists",
                message: "Index missing on data",
            };
            if (next && typeof next === "function") next(error, null);
            return error;
        }

        return data[g.trim()];
    });

    if (next && typeof next === "function") next(error, parsedHtml); // If there is a callback function, send the parsed html

    return parsedHtml;
};

const predefinedCoupleWeddingGroups = () => {
    return [
        { name: "Couple", displayOrder: 1 },
        { name: "Partner coworkers", displayOrder: 2 },
        { name: "My coworkers", displayOrder: 3 },
        { name: "Mutual friends", displayOrder: 4 },
        { name: "Partner friends", displayOrder: 5 },
        { name: "My friends", displayOrder: 6 },
        { name: "Partner Family", displayOrder: 7 },
        { name: "My Family", displayOrder: 8 },
    ];
};

const predefinedCoupleWeddingEventList = () => {
    return [{ name: "List A" }, { name: "List B" }, { name: "List C" }];
};

const predefineCoupleWeddingEventTables = () => {
    return [
        {
            name: "Top Table",
            type: "sc-one-sided-table",
            position: { x: 211, y: 122 },
            coupleWeddingEventTableChairs: [
                {
                    coupleWeddingGuestId: null,
                },
                {
                    coupleWeddingGuestId: null,
                },
                {
                    coupleWeddingGuestId: null,
                },
                {
                    coupleWeddingGuestId: null,
                },
                {
                    coupleWeddingGuestId: null,
                },
                {
                    coupleWeddingGuestId: null,
                },
            ],
        },
    ];
};

const predefineCoupleWeddingEventMenus = () => {
    return [
        { name: "Beef" },
        { name: "Chicken" },
        { name: "Fish" },
        { name: "Lamb" },
        { name: "Vegetarian" },
        { name: "Child Meal" },
        { name: "Other" },
    ];
};

const predefinedCoupleEvents = () => {
    return [
        {
            name: "Ceremony",
            image: "hall.png",
            displayOrder: 1,
            coupleWeddingEventGroups: predefinedCoupleWeddingGroups(),
            coupleWeddingEventLists: predefinedCoupleWeddingEventList(),
            coupleWeddingEventLists: predefinedCoupleWeddingEventList(),
            coupleWeddingEventTables: predefineCoupleWeddingEventTables(),
            coupleWeddingEventMenus: predefineCoupleWeddingEventMenus(),
        },
        {
            name: "Evening Reception",
            image: "wedding-reception.png",
            displayOrder: 2,
            coupleWeddingEventGroups: predefinedCoupleWeddingGroups(),
            coupleWeddingEventLists: predefinedCoupleWeddingEventList(),
            coupleWeddingEventTables: predefineCoupleWeddingEventTables(),
            coupleWeddingEventMenus: predefineCoupleWeddingEventMenus(),
        },
        {
            name: "Wedding Breakfast",
            image: "breakfast.png",
            displayOrder: 3,
            coupleWeddingEventGroups: predefinedCoupleWeddingGroups(),
            coupleWeddingEventLists: predefinedCoupleWeddingEventList(),
            coupleWeddingEventTables: predefineCoupleWeddingEventTables(),
            coupleWeddingEventMenus: predefineCoupleWeddingEventMenus(),
        },
    ];
};

const convertToNumber = (value) => {
    if (typeof value === "number") {
        return value;
    }

    return value.includes(".") ? parseFloat(value) : parseInt(value);
};

module.exports = {
    capitalizeFirst,
    formatDate,
    hashPassword,
    isPasswordMatched,
    generateRandomString,
    trimToLower,
    generateRandomInt,
    encryptData,
    decryptData,
    encryptAsUrl,
    decryptUrl,
    uploadFile,
    getUserCoupleRecord,
    getVendorRecord,
    uploadVendorStoreFiles,
    deleteFile,
    getPagination,
    getPagingData,
    parseHtmlReplace,
    predefinedCoupleWeddingGroups,
    predefinedCoupleWeddingEventList,
    predefineCoupleWeddingEventTables,
    predefineCoupleWeddingEventMenus,
    predefinedCoupleEvents,
    convertToNumber,
};
