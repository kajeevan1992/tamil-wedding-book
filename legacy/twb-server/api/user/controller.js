const auth = require('../../services/auth_service');
const models = require('../../models');
const Validator = require('validatorjs');
const sendEmail = require('../../utilities/mailer');
const moment = require('moment/moment');

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

const filter = async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 9;
        const offset = (page - 1) * limit;

        const userWhereClause = {
            role: {
                [models.Sequelize.Op.or]: ['venue', 'supplier']
            },
            stepsDone: true,
            active: true,
            verified: true
        };

        if (req.body.name && req.body.name.trim()) {
            userWhereClause[models.Sequelize.Op.and] = models.Sequelize.literal(
                `lower("fullName") LIKE '%${req.body.name.trim().toLowerCase()}%'`
            );
        }

        if (req.body.lng && req.body.lat &&
            !isNaN(parseFloat(req.body.lng)) && !isNaN(parseFloat(req.body.lat)) &&
            parseFloat(req.body.lng) >= -180 && parseFloat(req.body.lng) <= 180 &&
            parseFloat(req.body.lat) >= -90 && parseFloat(req.body.lat) <= 90) {

            userWhereClause[models.Sequelize.Op.and] = models.Sequelize.literal(
                `ST_DWithin(
                    location::geography,
                    ST_SetSRID(ST_MakePoint(${parseFloat(req.body.lng)}, ${parseFloat(req.body.lat)}), 4326)::geography,
                    50000
                )`
            );
        }

        const categoryWhereClause = {};
        if (req.body.categoryId && !isNaN(parseInt(req.body.categoryId))) {
            categoryWhereClause['$vendor.category.id$'] = parseInt(req.body.categoryId);
        }

        // Get total count for pagination
        const totalCount = await models.User.count({
            where: {
                ...userWhereClause,
                ...categoryWhereClause,
            },
            include: [
                {
                    model: models.Vendor,
                    as: 'vendor',
                    include: {
                        model: models.Category,
                        as: 'category',
                        required: !!req.body.categoryId,
                    }
                }
            ]
        });

        const vendors = await models.User.findAll({
            where: {
                ...userWhereClause,
                ...categoryWhereClause,
            },
            limit,
            offset,
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
                        required: !!req.body.categoryId,
                    }
                }
            ]
        });

        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            message: 'Vendors filtered successfully',
            vendors: vendors,
            total: vendors.length,
            totalCount,
            totalPages,
            currentPage: page,
            filters: {
                name: req.body.name || null,
                categoryId: req.body.categoryId || null,
                location: (req.body.lng && req.body.lat) ? {
                    lng: parseFloat(req.body.lng),
                    lat: parseFloat(req.body.lat)
                } : null
            }
        });
    } catch (error) {
        console.error("Error during vendor filtering:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
            error: error.message
        });
    }
};

const loadVendor = async (req, res) => {
    try {
        const vendor = await models.User.findOne({
            where: {
                id: req.params.id,
                role: {
                    [models.Sequelize.Op.or]: ['venue', 'supplier']
                },
                stepsDone: true,
                active: true,
                verified: true
            },
            attributes: {
                exclude: [
                    'active',
                    'verified',
                    'stepsDone',
                    'storeFrontFirstStepDone',
                    'storeFrontSecondStepDone',
                    'storeFrontThirdStepDone',
                ]
            },
            include: [
                {
                    model: models.Vendor,
                    as: 'vendor',
                    attributes: { exclude: ['reviewTemplate'] },
                    include: {
                        model: models.Category,
                        as: 'category',
                    }
                },
            ]
        });

        return res.status(200).json(vendor);
    } catch (error) {
        console.error("Error during vendor loading:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
            error: error.message
        });
    }
};

const notifications = async (req, res) => {
    try {
        const notifications = await models.Notification.findAll({
            where: { userId: auth.getUserId(req), seen: false },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json(notifications);
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const loadGallery = async (req, res) => {
    try {
        const vendor = await models.Vendor.findOne({
            where: {
                id: req.params.id,
            }
        });

        if (!vendor) {
            return res.status(404).json({
                message: 'Vendor not found!',
            });
        }

        const gallery = await models.VendorStoreFiles.findAll({
            where: {
                vendorId: vendor.id
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        return res.status(200).json(gallery);
    } catch (error) {
        console.error("Error during gallery loading:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const loadReviews = async (req, res) => {
    try {
        const reviews = await models.VendorReviews.findAll({
            where: {
                vendorId: req.params.id,
            },
            include: [
                {
                    model: models.User,
                    as: 'user',
                    attributes: ['fullName', 'photo']
                }
            ]
        });

        return res.status(200).json(reviews);
    } catch (error) {
        console.error("Error during reviews loading:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}
const postReview = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'userId': 'required',
            'qualityOfService': 'required|min:1',
            'professionalism': 'required|min:1',
            'flexibility': 'required|min:1',
            'valueForMoney': 'required|min:1',
            'responseTime': 'required|min:1',
            'reviewText': 'required|min:50|max:250',
            'acceptTermAndPrivacyPolicy': 'required|boolean|accepted',
        });
        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const userId = auth.getUserId(req);
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const vendorUser = await models.User.findOne({
            where: {
                id: req.body.userId,
                role: {
                    [models.Sequelize.Op.or]: ['venue', 'supplier']
                },
                stepsDone: true,
                active: true,
                verified: true
            },
            include: [
                {
                    model: models.Vendor,
                    as: 'vendor',
                }
            ]
        });

        if (!vendorUser || !vendorUser.vendor) {
            return res.status(404).json({
                message: 'Vendor not found',
            });
        }

        const existingReview = await models.VendorReviews.findOne({
            where: {
                userId: userId,
                vendorId: vendorUser.vendor.id
            }
        });

        if (existingReview) {
            return res.status(400).json({
                message: 'You have already reviewed this vendor!',
            });
        }

        const review = await models.VendorReviews.create({
            ...req.body,
            userId: userId,
            vendorId: vendorUser.vendor.id
        });

        return res.status(200).json({
            message: 'Review posted successfully',
            review: review
        });
    } catch (error) {
        console.error("Error during review posting:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const requestPricing = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'fullName': 'required|min:3|max:100',
            'email': 'required|email|max:200',
            'phone': 'required|min:10|max:20',
            'eventDate': 'required|date',
            'guestsCount': 'required|integer|min:10|max:1000',
            'message': 'required|min:50|max:250',
        });
        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const userId = auth.getUserId(req);
        const vendor = await models.User.findOne({
            where: {
                id: req.body.vendorId,
                role: {
                    [models.Sequelize.Op.or]: ['venue', 'supplier']
                },
                stepsDone: true,
                active: true,
                verified: true
            },
            include: [
                {
                    model: models.Vendor,
                    as: 'vendor',
                }
            ]
        });

        if (!vendor) {
            return res.status(404).json({
                message: 'Something went wrong, please try again',
            });
        }

        await Promise.all([
            models.VendorEnquiries.create({
                ...req.body,
                userId: userId,
                vendorId: vendor.vendor.id,
                type: 'pricingRequest',
            }),
            models.Notification.create({
                userId: vendor.id,
                icon: 'bi bi-cash-coin',
                iconColor: '#4caf50',
                type: 'pricingRequest',
                title: 'Pricing Request Received',
                description: 'New pricing request received from ' + req.body.fullName,
            })
        ]);

        const mailData = {
            toName: vendor.fullName,
            toEmail: vendor.email,
            subject: "Pricing Request",
            requestedBy: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            eventDate: moment(req.body.eventDate).format('DD MMM YYYY'),
            guestsCount: req.body.guestsCount,
            message: req.body.message,
        }

        sendEmail(mailData, 'pricing-request.html');

        return res.status(200).json({
            message: 'Pricing request sent successfully',
        });
    } catch (error) {
        console.error("Error during pricing request:", error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }

}

module.exports = { search, filter, notifications, loadVendor, loadGallery, loadReviews, postReview, requestPricing }