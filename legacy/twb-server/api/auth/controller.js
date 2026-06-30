const auth = require('../../services/auth_service');
const commonUtil = require("../../utilities/common");
const models = require("../../models");
const Op = models.Sequelize.Op;
const Validator = require('validatorjs');
const moment = require('moment');
const sendEmail = require('../../utilities/mailer');
const faqs = require('../../constants/faqs');

const register = async (req, res) => {
    let user = null;

    try {
        let validation = new Validator(req.body, {
            'fullName': 'required|min:3|max:191',
            'email': 'required|email|max:255',
            'password': 'required|min:8|max:100',
            'address': 'required|max:255',
            // 'lng': 'required|min:5|max:191',
            // 'lat': 'required|min:5|max:191',
            'weddingStyle': 'required|in:Traditional Hindu Wedding,Brahmin Wedding,Christian Wedding,Muslim Wedding,Arya Vysya Wedding,Dravidian (Non-Brahmin) Wedding,Destination Weddings,Simplified/Elopement Weddings,Mixed Faith Weddings',
            'weddingDate': 'required|date',
            'telephone': 'required|max:50',
            'acceptTermAndPrivacyPolicy': 'required|accepted',
        }, {
            'in.weddingStyle': 'Selected wedding style is invalid',
            'required.acceptTermAndPrivacyPolicy': 'You must accept our term of service and privacy policy'
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const isUserExists = await models.User.findOne({
            where: { email: req.body.email.trim().toLowerCase() },
        });

        if (isUserExists) {
            return res.status(401).json({
                message: "User with the email already exists!"
            });
        }

        const point = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };
        user = await models.User.create({
            fullName: req.body.fullName,
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password,
            address: req.body.address,
            location: point,
            weddingStyle: req.body.weddingStyle,
            date: req.body.date,
            telephone: req.body.telephone,
            role: 'couple',
            verified: req.body.linkAccount ? true : false,
            couple: {
                weddingDetail: {
                    date: req.body.weddingDate,
                },
                coupleWeddingEvents: commonUtil.predefinedCoupleEvents(),
                coupleWeddingGuests: [
                    {
                        fullName: req.body.fullName,
                        age: 'Adult',
                        email: req.body.email,
                        telephone: req.body.telephone,
                        address: req.body.address,
                        location: point,
                    },
                    {
                        fullName: "Partner's name",
                        age: 'Adult',
                        email: req.body.email,
                        telephone: req.body.telephone,
                        address: req.body.address,
                        location: point,
                    }
                ]
            }
        }, {
            include: {
                model: models.Couple,
                as: 'couple',
                include: [
                    {
                        model: models.WeddingDetail,
                        as: 'weddingDetail'
                    },
                    {
                        model: models.CoupleWeddingEvent,
                        as: 'coupleWeddingEvents',
                        include: [
                            {
                                model: models.CoupleWeddingEventGroup,
                                as: 'coupleWeddingEventGroups',
                            },
                            {
                                model: models.CoupleWeddingEventList,
                                as: 'coupleWeddingEventLists'
                            },
                            {
                                model: models.CoupleWeddingEventTable,
                                as: 'coupleWeddingEventTables',
                                include: {
                                    model: models.CoupleWeddingEventTableChair,
                                    as: 'coupleWeddingEventTableChairs',
                                },
                            },
                            {
                                model: models.CoupleWeddingEventMenu,
                                as: 'coupleWeddingEventMenus',
                            },
                        ]
                    },
                    {
                        model: models.CoupleWeddingGuest,
                        as: 'coupleWeddingGuests',
                        include: {
                            model: models.CoupleWeddingEventGuest,
                            as: 'coupleWeddingGuestEvents',
                        },
                    }
                ],
            }
        });

        let eventGuests = [];
        let topTableCoupleChairs = [];
        user.couple.coupleWeddingEvents.map(cwe => {
            user.couple.coupleWeddingGuests.map(cwg => {
                eventGuests.push({
                    coupleWeddingEventId: cwe.id,
                    coupleWeddingGuestId: cwg.id,
                    coupleWeddingEventGroupId: cwe.coupleWeddingEventGroups[0].id,
                    coupleWeddingEventTableId: cwe.coupleWeddingEventTables[0].id,
                });
            });

            let coupleChair = cwe.coupleWeddingEventTables[0].coupleWeddingEventTableChairs[2];
            coupleChair.coupleWeddingGuestId = user.couple.coupleWeddingGuests[0].id;
            topTableCoupleChairs.push(coupleChair);

            let couplePartnerChair = cwe.coupleWeddingEventTables[0].coupleWeddingEventTableChairs[3];
            couplePartnerChair.coupleWeddingGuestId = user.couple.coupleWeddingGuests[1].id;
            topTableCoupleChairs.push(couplePartnerChair);
        });
        await models.CoupleWeddingEventGuest.bulkCreate(eventGuests);
        await Promise.all([
            topTableCoupleChairs[0].save(),
            topTableCoupleChairs[1].save(),
            topTableCoupleChairs[2].save(),
            topTableCoupleChairs[3].save(),
            topTableCoupleChairs[4].save(),
            topTableCoupleChairs[5].save(),
        ]);

        if (req.body.linkAccount) {
            await linkAccounts(req.body.linkAccount);
        }

        return res.status(201).json({
            message: 'You are now registered successfully!',
            token: auth.generateJWT(user),
            user: await commonUtil.getUserCoupleRecord(user),
        });
    } catch (error) {
        console.log(error)
        if (user) {
            await user.destroy();
        }

        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const login = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            email: 'required',
            password: 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        let user;
        if (req.body.vendorLogin) {
            user = await models.User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email: req.body.email
                        },
                        {
                            username: req.body.email
                        },
                    ]
                }
            });
        } else {
            user = await models.User.findOne({
                where: {
                    email: commonUtil.trimToLower(req.body.email),
                }
            });
        }

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentails!',
            });
        }

        const password_matched = await commonUtil.isPasswordMatched(req.body.password, user.password)
        if (!password_matched) {
            return res.status(401).json({
                message: 'Invalid credentails!',
            });
        }

        let userRecord = user;
        if (user.role === 'couple') {
            userRecord = await commonUtil.getUserCoupleRecord(user);
        } else if (user.role === 'venue' || user.role === 'supplier') {
            userRecord = await commonUtil.getVendorRecord(user);
        }

        const token = auth.generateJWT(user);
        return res.status(200).json({
            message: 'You are now logged in successfully!',
            token: token,
            user: userRecord,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const profile = async (req, res) => {
    try {
        const userId = auth.getUserId(req);
        const user = await models.User.findByPk(userId);
        // const user = await models.User.findByPk(userId, {
        //     include: {
        //         model: models.Couple,
        //         as: 'couple',
        //         include: {
        //             model: models.WeddingDetail,
        //             as: 'weddingDetail'
        //         }
        //     }
        // });

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
            });
        }

        let userRecord = user;
        if (user.role === 'couple') {
            userRecord = await commonUtil.getUserCoupleRecord(user);
        } else if (user.role === 'venue' || user.role === 'supplier') {
            userRecord = await commonUtil.getVendorRecord(user);
        }
        return res.status(200).json({
            user: userRecord,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const requestResetPassword = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'email': 'required|email|max:255',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const user = await models.User.findOne({
            where: { email: req.body.email.trim().toLowerCase() },
        });

        if (!user) {
            return res.status(200).json({
                message: 'We have just sent you an email with instructions to recover your password.',
            });
        }

        const code = commonUtil.generateRandomInt(100000, 900000);

        user.verificationCode = code;
        user.verificationCodeExpiry = moment().add(1, 'days');
        await user.save();

        const hash = commonUtil.encryptAsUrl({
            email: user.email,
            verificationCode: user.verificationCode,
            type: 'request-reset-password'
        });

        const mailData = {
            toName: user.fullName,
            toEmail: user.email,
            subject: "Reset Password",
            hash: hash,
        }

        /*const info =*/ sendEmail(mailData, 'reset-password-request.html');

        return res.status(200).json({
            message: 'We have just sent you an email with instructions to recover your password.',
            // info: info
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const verifyUser = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'hash': 'required',
        });

        if (validation.fails()) {
            return res.status(401).json({
                message: 'Verification link has been expired!',
            });
        }

        const decrypted = commonUtil.decryptUrl(req.body.hash);

        const user = await models.User.findOne({
            where: { email: decrypted.email.trim().toLowerCase() },
        });

        if (!user) {
            return res.status(401).json({
                message: 'Verification link has been expired!',
            });
        }

        if (decrypted.type === 'request-reset-password') {
            if (user.verificationCode != decrypted.verificationCode && moment().isSameOrBefore(user.verificationCodeExpiry) === false) {
                return res.status(401).json({
                    message: 'Verification link has been expired!',
                });
            }

            user.verified = true;
            await user.save();
        } else {
            if (user.verificationCode != decrypted.verificationCode) {
                return res.status(401).json({
                    message: 'Verification link has been expired!',
                });
            }

            user.verificationCode = null;
            user.verified = true;
            await user.save();
        }

        return res.status(200).json({
            message: 'Verification successful!',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'password': 'required|min:8|max:100|confirmed',
            'hash': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const decrypted = commonUtil.decryptUrl(req.body.hash);

        const user = await models.User.findOne({
            where: { email: decrypted.email.trim().toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Something went wrong, please try again',
            });
        }

        if (user.verificationCode != decrypted.verificationCode && moment().isSameOrBefore(user.verificationCodeExpiry) === false) {
            return res.status(401).json({
                message: 'Request time out, please request again for reset password',
            });
        }

        // const hashPassword = await commonUtil.hashPassword(req.body.password, 10);
        user.password = req.body.password;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;
        await user.save();

        const token = auth.generateJWT(user);
        return res.status(200).json({
            message: 'Password has been reset successfully!',
            token: token,
            user: await commonUtil.getUserCoupleRecord(user),
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const resendVerificationEmail = async (req, res) => {
    try {
        const userId = auth.getUserId(req);
        const user = await models.User.findByPk(userId);
        if (user === null) {
            return res.status(401).json({
                message: 'User not found',
            });
        }

        const code = commonUtil.generateRandomInt(100000, 900000);
        user.verificationCode = code;
        await user.save();

        const hash = commonUtil.encryptAsUrl({
            email: user.email,
            verificationCode: user.verificationCode,
            type: 'email-verification'
        });

        const mailData = {
            toName: user.fullName,
            toEmail: user.email,
            subject: "Email Verification",
            hash: hash,
        }

        /*const info =*/ sendEmail(mailData, 'welcome.html');

        return res.status(200).json({
            message: 'Verification email has been sent',
            user: user,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

// async function getUserCoupleRecord(user) {
//     //! 1 => fresh, if link -> 2 => primary, else 3 => secondary
//     let isCouple = await user.getCouple(); // -> partnerId null or exists
//     // isCouple [userId, 1, partnerId: null]
//     // isCouple [userId, 1, partnerId: 2]

//     let isPartner = null;
//     let partner = null;
//     if (!isCouple.partnerId) { // -> null
//         // isCouple [userId, 1, partnerId: null]
//         isPartner = await models.Couple.findOne({  // either patner or fresh
//             where: { partnerId: user.id }
//         });

//         if (!isPartner) { // fresh
//             user = user.toJSON();
//             user.couple = isCouple.toJSON();
//             user.couple.weddingDetail = await isCouple.getWeddingDetail();
//             user.partner = null;
//             user.primary = true; // to think
//         } else { // if partner
//             partner = await models.User.findByPk(isPartner.userId);

//             user = user.toJSON();
//             const userCouple = await partner.getCouple();
//             user.couple = userCouple.toJSON();
//             user.couple.weddingDetail = await userCouple.getWeddingDetail();
//             user.partner = partner;
//             user.primary = false;
//         }
//     } else {
//         // partner exists and primary user
//         partner = await models.User.findByPk(isCouple.partnerId);

//         user = user.toJSON();
//         user.couple = isCouple.toJSON();
//         user.couple.weddingDetail = await isCouple.getWeddingDetail();
//         user.partner = partner;
//         user.primary = true; // to think
//     }

//     return user;
// }

async function linkAccounts(hash) {
    const decrypted = commonUtil.decryptUrl(hash);

    //? User who invited this person
    const invitedByUser = await models.User.findOne({
        where: { email: decrypted.email.trim().toLowerCase() },
        include: {
            model: models.Couple,
            as: 'couple',
        }
    });

    //? User who has been invited
    const partner = await models.User.findOne({
        where: { email: decrypted.partnerEmail.trim().toLowerCase() },
        include: {
            model: models.Couple,
            as: 'couple',
        }
    });

    if (invitedByUser && partner) {
        partner.couple.partnerId = null;
        await partner.couple.save();
        invitedByUser.couple.partnerId = partner.id;
        await invitedByUser.couple.save();
    }
}

const registerVendor = async (req, res) => {
    let user = null;

    try {
        let validation = new Validator(req.body, {
            'fullName': 'required|min:3|max:150',
            'email': 'required|email|max:255',
            'username': 'required|max:191',
            'password': 'required|min:8|max:100',
            'address': 'required|max:255',
            'telephone': 'required|max:50',
            'role': 'required',
            'businessCategory': 'required',
            'acceptTermAndPrivacyPolicy': 'required|accepted',
        }, {
            'required.acceptTermAndPrivacyPolicy': 'You must accept our term of service and privacy policy'
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const isUserEmailExists = await models.User.findOne({
            where: { email: req.body.email.trim().toLowerCase() },
        });

        if (isUserEmailExists) {
            return res.status(401).json({
                message: "User with the email already exists!"
            });
        }

        const isUsernameExists = await models.User.findOne({
            where: { username: req.body.username.trim().toLowerCase() },
        });

        if (isUsernameExists) {
            return res.status(401).json({
                message: "Username has already been taken"
            });
        }

        // const hashPassword = await commonUtil.hashPassword(req.body.password, 10);
        const point = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };
        // const code = commonUtil.generateRandomInt(100000, 900000);

        let vendorFaqs = {};
        const category = await models.Category.findByPk(req.body.businessCategory);
        if (!category) {
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }

        if (req.body.role === 'venue') {
            vendorFaqs = faqs.venueFaqs[category.slug];
        } else {
            vendorFaqs = faqs.supplierFaqs[category.slug]
        }

        user = await models.User.create({
            fullName: req.body.fullName,
            username: req.body.username.trim().toLowerCase(),
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password,
            address: req.body.address,
            location: point,
            // date: req.body.date,
            telephone: req.body.telephone,
            role: req.body.role,
            // verificationCode: code,
            verified: false,
            vendor: {
                categoryId: req.body.businessCategory,
                faqs: vendorFaqs,
                contactPerson: {
                    email: req.body.email.trim().toLowerCase(),
                    telephone: req.body.telephone,
                },
                vendorSetting: {}
            }
        }, {
            include: {
                model: models.Vendor,
                as: 'vendor',
                include: [
                    {
                        model: models.Category,
                        as: 'category',
                    },
                    {
                        model: models.VendorContact,
                        as: 'contactPerson'
                    },
                    {
                        model: models.VendorSetting,
                        as: 'vendorSetting'
                    },
                ]
            }
        });

        let template = 'vendor-welcome.html';
        let mailData = {};

        const hash = commonUtil.encryptAsUrl({
            email: user.email,
            verificationCode: user.verificationCode,
            type: 'email-verification'
        });

        mailData = {
            toName: user.fullName,
            toEmail: user.email,
            subject: "Email Verification",
            hash: hash,
        }

        /*const info =*/ sendEmail(mailData, template);

        const token = auth.generateJWT(user);

        return res.status(201).json({
            message: 'You are now registered successfully!',
            token: token,
            user: user,
        });
    } catch (error) {
        console.log(error);
        if (user) {
            await user.destroy();
        }

        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = { login, register, profile, requestResetPassword, verifyUser, resetPassword, resendVerificationEmail, registerVendor }