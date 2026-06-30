const commonUtil = require("../../../../utilities/common");
const models = require("../../../../models");
const Validator = require('validatorjs');
const sequelize = models.Sequelize;
const auth = require('../../../../services/auth_service');
const sendEmail = require('../../../../utilities/mailer');

const index = async (req, res) => {
    try {
        const preferreds = await models.VendorPreferred.findAll({
            where: { vendorId: req.params.vendorId },
            order: [
                ['createdAt', 'DESC'],
            ],
            attributes: { exclude: ['faqs'] },
            include: {
                model: models.Vendor,
                as: 'preferredVendor',
                attributes: { exclude: ['faqs'] },
                include: [
                    {
                        model: models.User,
                        as: 'user'
                    },
                    {
                        model: models.VendorStoreFiles,
                        as: 'vendorStoreFiles',
                        where: {
                            main: true
                        }
                    }
                ]
            }
        });

        const preferredsByOther = await models.VendorPreferred.findAll({
            where: { preferredVendorId: req.params.vendorId },
            order: [
                ['createdAt', 'DESC'],
            ],
            attributes: { exclude: ['faqs', 'reviewTemplate'] },
            include: {
                model: models.Vendor,
                as: 'vendor',
                attributes: { exclude: ['faqs', 'reviewTemplate'] },
                include: [
                    {
                        model: models.User,
                        as: 'user'
                    }
                ]
            }
        });

        return res.status(200).json({ preferreds, preferredsByOther });
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

        let role = auth.getUserRole(req) === 'venue' ? 'supplier' : 'venue';
        const vendors = await models.User.findAll({
            where: {
                role: role,
                stepsDone: true,
                where: sequelize.where(sequelize.fn('lower', sequelize.col('fullName')), {
                    [sequelize.Op.like]: `${req.body.keyword.trim().toLowerCase()}%`
                }),
            },
            limit: 10,
            order: [
                ['fullName', 'ASC'],
            ],
            include: {
                model: models.Vendor,
                as: 'vendor',
                attributes: { exclude: ['faqs'] },
            }
        });

        return res.status(200).json(vendors);
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const store = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'vendorId': 'required',
            'preferredVendorId': 'required',
        });

        if (validation.fails()) {
            return res.status(404).json({
                message: 'Vendor not found!',
            });
        }

        const isExists = await models.VendorPreferred.findOne({
            where: {
                vendorId: req.body.vendorId,
                preferredVendorId: req.body.preferredVendorId
            },
        });

        if (isExists) {
            return res.status(409).json({
                message: 'Selected business is already exists in your preferred list'
            });
        }

        let preferVendor = await models.VendorPreferred.create({
            vendorId: req.body.vendorId,
            preferredVendorId: req.body.preferredVendorId,
        });

        let vendor = await preferVendor.getPreferredVendor();
        const user = await vendor.getUser();

        preferVendor = preferVendor.toJSON();
        preferVendor.preferredVendor = vendor;
        preferVendor.preferredVendor.user = user;

        const currentUserFullName = auth.getUserFullName(req);
        sendEmail({
            toName: user.fullName,
            toEmail: user.email,
            subject: "Preferred By Business",
            userRole: user.role,
            businessName: currentUserFullName,
        }, 'preferred-by-business.html');

        const notification = await models.Notification.create({
            userId: user.id,
            icon: 'bi bi-bell',
            iconColor: '#ff9800',
            type: 'preferredByBusiness',
            title: 'Preferred By Business',
            description: `${currentUserFullName} added you in their preferred businesses list`
        });

        return res.status(201).json({
            message: 'Invitation sent successfully',
            preferVendor: preferVendor,
            notification: notification
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const destroy = async (req, res) => {
    try {
        const preferredVendor = await models.VendorPreferred.findByPk(req.params.id);
        if (preferredVendor) {
            await preferredVendor.destroy();
            return res.status(200).json({
                message: 'Business removed from your preferred list successfully'
            });
        } else {
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const update = async (req, res) => {
    try {
        const preferredVendor = await models.VendorPreferred.findByPk(req.params.id);
        if (preferredVendor) {
            preferredVendor.status = true;
            await preferredVendor.save();
            return res.status(200).json({
                message: 'Invitation accepted successfully'
            });
        } else {
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    index,
    search,
    store,
    destroy,
    update
}