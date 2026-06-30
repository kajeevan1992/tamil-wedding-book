const models = require("../../../models");
// const Op = models.Sequelize.Op;
const Validator = require('validatorjs');
const auth = require('../../../services/auth_service');
const commonUtil = require("../../../utilities/common");
const faqs = require('../../../constants/faqs');
const sendEmail = require('../../../utilities/mailer');

const loadSuppliers = async (req, res) => {
    try {
        const suppliers = await models.CoupleVendor.findAll({
            where: { coupleId: req.params.coupleId },
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                {
                    model: models.Vendor,
                    as: 'coupleVendor',
                    include: [
                        {
                            model: models.Category,
                            as: 'category',
                        },
                        {
                            model: models.User,
                            as: 'user',
                        },
                    ]
                }
            ],
        });

        return res.status(200).json({
            suppliers: suppliers,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const loadVendorsByCategory = async (req, res) => {
    try {
        const vendors = await models.CoupleVendor.findAll({
            where: { coupleId: req.params.coupleId },
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [
                {
                    model: models.Vendor,
                    as: 'coupleVendor',
                    where: {
                        categoryId: req.params.vendorCategoryId,
                    },
                    attributes: { exclude: ['faqs'] },
                    include: [
                        {
                            model: models.Category,
                            as: 'category',
                        },
                        {
                            model: models.User,
                            as: 'user',
                        },
                    ]
                }
            ],
        });

        return res.status(200).json({
            vendors: vendors,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const search = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'keyword': 'required|min:1',
        });
        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const userWhereClause = {
            role: {
                [models.Sequelize.Op.or]: ['venue', 'supplier']
            },
            stepsDone: true,
            active: true,
            verified: true,
            [models.Sequelize.Op.and]: models.Sequelize.literal(`lower("fullName") LIKE '%${req.body.keyword.trim().toLowerCase()}%'`),
        };

        const categoryWhereClause = {};
        if (req.body.categoryId) {
            categoryWhereClause['$vendor.category.id$'] = req.body.categoryId; // Assuming Category's primary key is 'id' and alias is 'category'
        }

        const vendors = await models.User.findAll({
            where: {
                ...userWhereClause,
                ...categoryWhereClause, // Combine user and category where clauses
            },
            limit: 10,
            order: [
                ['fullName', 'ASC'],
            ],
            include: [
                {
                    model: models.Vendor,
                    as: 'vendor',
                    attributes: { exclude: ['faqs'] },
                    include: {
                        model: models.Category,
                        as: 'category',
                        required: !!req.body.categoryId, // Make the join required if categoryId exists
                        // You might not need a separate where here if you're filtering at the top level
                        // where: categoryWhereClause,
                    }
                }
            ]
        });

        return res.status(200).json(vendors);
    } catch (error) {
        console.error("Error during search:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
};

const storeSupplier = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'coupleId': 'required',
            'vendorId': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        let supplier = await models.CoupleVendor.findOrCreate({
            where: {
                coupleId: req.body.coupleId,
                vendorId: req.body.vendorId,
            },
            defaults: {
                coupleId: req.body.coupleId,
                vendorId: req.body.vendorId,
            },
        });

        if (supplier[1]) { //? supplier[1] = true if created false if found
            let coupleVendor = await supplier[0].getCoupleVendor();
            let category = await coupleVendor.getCategory();
            let user = await coupleVendor.getUser();
            supplier = supplier[0].toJSON();
            coupleVendor = coupleVendor.toJSON();
            supplier.coupleVendor = coupleVendor;
            supplier.coupleVendor.category = category;
            supplier.coupleVendor.user = user;

            return res.status(201).json({
                message: 'Supplier added successfully',
                supplier: supplier
            });
        }

        return res.status(200).json({
            message: 'Supplier already exists in your list',
            supplier: supplier[0]
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
            'coupleId': 'required',
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

        console.log(user.vendor.category)

        let vendor = await models.CoupleVendor.create({
            coupleId: req.body.coupleId,
            vendorId: user.vendor.id,
        });
        vendor = await models.CoupleVendor.findByPk(vendor.id, {
            include: [
                {
                    model: models.Vendor,
                    as: 'coupleVendor',
                    include: [
                        {
                            model: models.Category,
                            as: 'category',
                        },
                        {
                            model: models.User,
                            as: 'user',
                        },
                    ]
                }
            ],
        });

        // supplier = supplier.toJSON();
        // let vendorCategory = await models.Category.findByPk(user.vendor.categoryId);
        // console.log(vendorCategory);
        // supplier.coupleVendor = user.vendor;
        // supplier.coupleVendor.category = vendorCategory;
        // supplier.coupleVendor.user = user;

        const currentUserFullName = auth.getUserFullName(req);
        const hash = commonUtil.encryptAsUrl({
            email: user.email,
            verificationCode: user.verificationCode,
            type: 'email-verification'
        });

        sendEmail({
            toName: user.fullName,
            toEmail: user.email,
            subject: "Invited and couple for his wedding",
            userRole: user.role,
            coupleName: currentUserFullName,
            hash: hash,
        }, 'couple-invite-new-business.html');

        await models.Notification.create({
            userId: user.id,
            icon: 'bi bi-bell',
            iconColor: '#ff9800',
            type: 'invitedByCouple',
            title: 'Invited By couple',
            description: `${currentUserFullName} added you in his/her supplier list`
        });

        return res.status(201).json({
            message: 'Invitation sent successfully',
            vendor: vendor
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

const changeSelectedVendor = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const coupleVendor = await models.CoupleVendor.findByPk(req.body.id);
        if (!coupleVendor) {
            return res.status(404).json({
                message: 'Vendor not found!',
            });
        }

        coupleVendor.status = req.body.status ? req.body.status : coupleVendor.status;
        coupleVendor.note = req.body.note ? req.body.note : coupleVendor.note;
        coupleVendor.rating = req.body.rating ? req.body.rating : coupleVendor.rating;
        coupleVendor.price = req.body.price ? req.body.price : coupleVendor.price;

        await coupleVendor.save();

        return res.status(200).json({
            message: 'Vendor selection updated successfully',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const removeSelectedVendor = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const coupleVendor = await models.CoupleVendor.findByPk(req.body.id);
        if (!coupleVendor) {
            return res.status(404).json({
                message: 'Vendor not found!',
            });
        }

        await coupleVendor.destroy();

        return res.status(200).json({
            message: 'Vendor removed successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    loadSuppliers,
    loadVendorsByCategory,
    storeSupplier,
    search,
    createAndInviteVendor,
    changeSelectedVendor,
    removeSelectedVendor,
}