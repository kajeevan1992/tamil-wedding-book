const auth = require('../../../services/auth_service');
const commonUtil = require("../../../utilities/common");
const validationUtil = require("../../../utilities/validation");
const models = require("../../../models");
const Validator = require('validatorjs');
const faqs = require('../../../constants/faqs');
const sendEmail = require('../../../utilities/mailer');

// Storefront
const storeFrontInitials = async (req, res) => {
    try {
        const vendorData = await models.User.findByPk(auth.getUserId(req), {
            include: {
                model: models.Vendor,
                as: 'vendor',
                include: [
                    {
                        model: models.VendorContact,
                        as: 'contactPerson'
                    },
                    {
                        model: models.VendorBusinessIdentity,
                        as: 'vendorBusinessIdentities',
                        include: {
                            model: models.BusinessIdentity,
                            as: 'businessIdentity'
                        }
                    },
                    {
                        model: models.VendorStoreFiles,
                        as: 'vendorStoreFiles'
                    }
                ]
            }
        });

        const businessIdentities = await models.BusinessIdentity.findAll();

        return res.status(200).json({ vendorData, businessIdentities });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createStoreFrontInitials = async (req, res) => {
    try {
        await validationUtil.validateStoreFrontSteps(req.body);

        let user = await models.User.findByPk(auth.getUserId(req), {
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
                        model: models.VendorBusinessIdentity,
                        as: 'vendorBusinessIdentities',
                        include: {
                            model: models.BusinessIdentity,
                            as: 'businessIdentity'
                        }
                    },
                    {
                        model: models.VendorStoreFiles,
                        as: 'vendorStoreFiles'
                    }
                ]
            }
        });

        let vendor = JSON.parse(req.body.vendor);

        if (req.body.action === 'step1') {
            if (req.body.username !== user.username) {
                const isUsernameExists = await models.User.findOne({
                    where: { username: req.body.username.trim().toLowerCase() },
                });

                if (isUsernameExists) {
                    return res.status(401).json({
                        message: "Username has already been taken"
                    });
                }

                //? Update username
                user.username = req.body.username.trim().toLowerCase();
            }

            if (req.body.changePasswordCheck === 'true' || req.body.changePasswordCheck === true) {
                const passwordMatched = await commonUtil.isPasswordMatched(req.body.currentPassword, user.password)
                if (!passwordMatched) {
                    return res.status(401).json({
                        message: 'Current password is wrong',
                    });
                }

                //? Update password
                user.password = await commonUtil.hashPassword(req.body.newPassword, 10);
            }

            //? Update storefront about
            user.vendor.aboutStoreFront = vendor.aboutStoreFront;

            //? Update storefront Identities
            let vendorBusinessIdentities = [];
            vendor.vendorBusinessIdentities.forEach(vendorBusinessIdentity => {
                vendorBusinessIdentities.push({
                    vendorId: vendor.id,
                    businessIdentityId: vendorBusinessIdentity
                });
            });

            //? Update vendor contact person
            user.vendor.contactPerson.fullName = vendor.contactPerson.fullName;
            user.vendor.contactPerson.email = vendor.contactPerson.email;
            user.vendor.contactPerson.telephone = vendor.contactPerson.telephone;
            user.vendor.contactPerson.mobile = vendor.contactPerson.mobile;
            user.vendor.contactPerson.fax = vendor.contactPerson.fax;
            user.vendor.contactPerson.website = vendor.contactPerson.website;

            //? Update vendor storeFrontFirstStepDone as done
            user.storeFrontFirstStepDone = true;

            if (user.storeFrontFirstStepDone &&
                user.storeFrontSecondStepDone &&
                user.storeFrontThirdStepDone) {
                user.stepsDone = true;
            }

            //? Execute all queries
            await Promise.all([
                user.save(),
                user.vendor.save(),
                user.vendor.contactPerson.save(),
                models.VendorBusinessIdentity.destroy({ where: { vendorId: vendor.id } }),
                models.VendorBusinessIdentity.bulkCreate(vendorBusinessIdentities)
            ]);
        } else if (req.body.action === 'step2') {
            user.address = req.body.address;
            user.location = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };

            //? Update vendor storeFrontFirstStepDone as done
            user.storeFrontSecondStepDone = true;

            if (user.storeFrontFirstStepDone &&
                user.storeFrontSecondStepDone &&
                user.storeFrontThirdStepDone) {
                user.stepsDone = true;
            }

            await user.save();
        } else if (req.body.action === 'step3') {
            console.log(req.files)
            let requestPhoto = req.files?.photo;
            if (requestPhoto) {
                const photo = await commonUtil.uploadFile(requestPhoto, 'vendor');

                if (!photo) {
                    return res.status(422).json({
                        message: 'Image upload error!',
                        errors: {
                            photo: ['Cover image not uploaded']
                        }
                    });
                } else if (!photo.success) {
                    return res.status(422).json({
                        message: 'Image upload error!',
                        errors: {
                            photo: ['Cover image not uploaded']
                        }
                    });
                } else if (photo && photo.success) {
                    let userPhoto = user.photo;
                    commonUtil.deleteFile(userPhoto);
                    user.photo = photo.name;

                    user.storeFrontThirdStepDone = true;

                    if (user.storeFrontFirstStepDone &&
                        user.storeFrontSecondStepDone &&
                        user.storeFrontThirdStepDone) {
                        user.stepsDone = true;
                    }

                    await user.save();
                }
            } else if (!user.photo || user.photo.length < 8) {
                return res.status(422).json({
                    message: 'Invalid data format!',
                    errors: {
                        photo: ['Cover image is required']
                    }
                });
            }

            const count = await models.VendorStoreFiles.count({ where: { vendorId: user.vendor.id } });
            if (count > 8) {
                return res.status(201).json({
                    message: 'Storefront updated successfully, make sure to upload 10 photos',
                    user: user,
                });
            }
            const vendorStoreFiles = await commonUtil.uploadVendorStoreFiles(req);
            await models.VendorStoreFiles.bulkCreate(vendorStoreFiles, { updateOnDuplicate: ['id', 'description'] }, /*, {returning: true}*/);

            //? Update vendor storeFrontFirstStepDone as done
            user.storeFrontThirdStepDone = true;

            if (user.storeFrontFirstStepDone &&
                user.storeFrontSecondStepDone &&
                user.storeFrontThirdStepDone) {
                user.stepsDone = true;
            }

            await user.save();
        }

        return res.status(201).json({
            message: 'Storefront updated successfully',
            user: user,
        });
    } catch (error) {
        console.log(error)
        if (error.type === 'validations') {
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: error.errors
            });
        }

        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteStorefrontImage = async (req, res) => {
    try {
        await models.VendorStoreFiles.destroy({ where: { id: req.body.id } });
        await commonUtil.deleteFile(req.body.path);

        return res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateFaqs = async (req, res) => {
    //todo: check like we did in the react side, or more better if the question type is at least one of the options is checked if its radio button then one option must be selected if textarea then the textarea must be filled same we do with type range
    try {
        let validation = new Validator(req.body, {
            'faqs': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        let user = await models.User.findByPk(auth.getUserId(req), {
            include: {
                model: models.Vendor,
                as: 'vendor',
            }
        });

        // let vendor = JSON.parse(req.body.faqs); //? use if you request is stringify

        user.vendor.faqs = req.body.faqs;
        await user.vendor.save();

        return res.status(201).json({
            message: 'Faqs updated successfully',
            faqs: user.vendor.faqs,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const getSocialLinks = async (req, res) => {
    try {
        if (!req.params.vendorId) {
            return res.status(422).json({
                message: 'Vendor is required!',
            });
        }

        let socialLinks = await models.VendorSocialLink.findOne({
            where: { vendorId: req.params.vendorId },
        });

        return res.status(200).json(socialLinks);
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateSocialLinks = async (req, res) => {
    try {
        let socialLinks = await models.VendorSocialLink.findOne({
            where: { vendorId: req.params.vendorId }
        });

        if (!socialLinks) {
            socialLinks = await models.VendorSocialLink.create({
                vendorId: req.params.vendorId,
                facebook: req.body.facebook,
                facebook: req.body.facebook,
                instagram: req.body.instagram,
                twitter: req.body.twitter,
                pinterest: req.body.pinterest,
            });
        } else {
            socialLinks.facebook = req.body.facebook;
            socialLinks.instagram = req.body.instagram;
            socialLinks.twitter = req.body.twitter;
            socialLinks.pinterest = req.body.pinterest;
            await socialLinks.save();
        }

        return res.status(201).json({
            message: 'Social links updated successfully',
            socialLinks: socialLinks,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createAndInviteVendor = async (req, res) => {
    let user = null;

    try {
        let validation = new Validator(req.body, {
            'vendorId': 'required',
            'fullName': 'required|min:3|max:150',
            'email': 'required|email|max:255',
            // 'username': 'required|max:191',
            'address': 'required|max:255',
            'telephone': 'required|max:50',
            'role': 'required',
            'businessCategory': 'required',
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
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: {
                    "email": [
                        "Business with the email already exists!"
                    ]
                }
            });
        }

        const hashPassword = await commonUtil.hashPassword(commonUtil.generateRandomString(20), 10);
        const point = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };
        const code = commonUtil.generateRandomInt(100000, 900000);

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
            // username: req.body.username.trim().toLowerCase(),
            email: req.body.email.trim().toLowerCase(),
            password: hashPassword,
            address: req.body.address,
            location: point,
            telephone: req.body.telephone,
            role: req.body.role,
            verificationCode: code,
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

        let preferVendor = await models.VendorPreferred.create({
            vendorId: req.body.vendorId,
            preferredVendorId: user.vendor.id,
        });

        preferVendor = preferVendor.toJSON();
        preferVendor.preferredVendor = user.vendor;
        preferVendor.preferredVendor.user = user;

        const currentUserFullName = auth.getUserFullName(req);
        const hash = commonUtil.encryptAsUrl({
            email: user.email,
            verificationCode: user.verificationCode,
            type: 'email-verification'
        });

        sendEmail({
            toName: user.fullName,
            toEmail: user.email,
            subject: "Invited and Preferred By Business",
            userRole: user.role,
            businessName: currentUserFullName,
            hash: hash,
        }, 'preferred-new-business.html');

        await models.Notification.create({
            userId: user.id,
            icon: 'bi bi-bell',
            iconColor: '#ff9800',
            type: 'preferredByBusiness',
            title: 'Preferred By Business',
            description: `${currentUserFullName} added you in their preferred businesses list`
        });

        return res.status(201).json({
            message: 'Invitation sent successfully',
            preferVendor: preferVendor
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

module.exports = {
    storeFrontInitials,
    createStoreFrontInitials,
    deleteStorefrontImage,
    updateFaqs,
    getSocialLinks,
    updateSocialLinks,
    createAndInviteVendor
}