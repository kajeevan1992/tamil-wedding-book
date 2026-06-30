const commonUtil = require("../../../../utilities/common");
const models = require("../../../../models");
const Validator = require('validatorjs');

const index = async (req, res) => {
    try {
        let itemsPerPage = req.query.itemsPerPage || 5;
        const { limit, offset } = commonUtil.getPagination(
            req.query.page, itemsPerPage
        );

        const deals = await models.VendorDeal.findAndCountAll({
            where: { vendorId: req.params.vendorId },
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC'],
            ]
        });


        return res.status(200).json(
            commonUtil.getPagingData(deals, req.params.page, limit, itemsPerPage)
        );
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const store = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'vendorId': 'required',
            'name': 'required|string|max:255',
            'type': 'required|string|max:50',
            'validity': 'required|date',
            'discount': 'required_if:type,Discount',
            'description': 'required|min:10',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const deal = await models.VendorDeal.create({
            vendorId: req.body.vendorId,
            name: req.body.name,
            type: req.body.type,
            validity: req.body.validity,
            description: req.body.description,
        });

        if (req.body.type === 'Discount') {
            deal.discount = req.body.discount;
        }

        if (req.files) {
            let requestFile = req.files.image;
            if (requestFile) {
                const file = await commonUtil.uploadFile(requestFile, 'vendor-deals');

                if (!file) {
                    return res.status(422).json({
                        message: 'Image upload error!',
                        errors: {
                            image: ['Image not uploaded']
                        }
                    });
                } else if (!file.success) {
                    return res.status(422).json({
                        message: 'File upload error!',
                        errors: {
                            image: ['Image not uploaded']
                        }
                    });
                } else if (file && file.success) {
                    deal.image = file.name;
                }
            }
        }

        await deal.save();

        return res.status(201).json({
            message: 'Deal created successfully',
            deal: deal,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const update = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'vendorId': 'required',
            'name': 'required|string|max:255',
            'type': 'required|string|max:50',
            'validity': 'required|date',
            'discount': 'required_if:type,Discount',
            'description': 'required|min:10',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const deal = await models.VendorDeal.findByPk(req.params.id);
        if (!deal) {
            return res.status(404).json({
                message: 'Deal not found',
            });
        }

        deal.name = req.body.name;
        deal.type = req.body.type;
        deal.validity = req.body.validity;

        if (req.body.type === 'Discount') {
            deal.discount = req.body.discount;
        } else {
            deal.discount = null;
        }

        deal.description = req.body.description;

        if (req.files) {
            let requestFile = req.files.image;
            if (requestFile) {
                const file = await commonUtil.uploadFile(requestFile, 'vendor-deals');

                if (!file) {
                    return res.status(422).json({
                        message: 'Image upload error!',
                        errors: {
                            image: ['Image not uploaded']
                        }
                    });
                } else if (!file.success) {
                    return res.status(422).json({
                        message: 'File upload error!',
                        errors: {
                            image: ['Image not uploaded']
                        }
                    });
                } else if (file && file.success) {
                    await commonUtil.deleteFile(deal.image);
                    deal.image = file.name;
                }
            }
        }

        await deal.save();

        return res.status(201).json({
            message: 'Deal updated successfully',
            deal: deal,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const destroy = async (req, res) => {
    try {
        const deal = await models.VendorDeal.findByPk(req.params.id);
        if (deal) {
            await deal.destroy();
            await commonUtil.deleteFile(deal.image);
            return res.status(200).json({ message: 'Deal deleted successfully' });
        } else {
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    index,
    store,
    update,
    destroy,
}