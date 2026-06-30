const commonUtil = require("../../../../utilities/common");
const models = require("../../../../models");
const Validator = require('validatorjs');

const index = async (req, res) => {
    try {
        let itemsPerPage = req.query.itemsPerPage || 5;
        const { limit, offset } = commonUtil.getPagination(
            req.query.page, itemsPerPage
        );

        const events = await models.VendorEvent.findAndCountAll({
            where: { vendorId: req.params.vendorId },
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC'],
            ]
        });


        return res.status(200).json(
            commonUtil.getPagingData(events, req.params.page, limit, itemsPerPage)
        );
    } catch (error) {
        console.log(error);
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
            'startDate': 'required|date',
            'startTime': 'required|string|max:25',
            'endDate': 'required|date',
            'endTime': 'required|string|max:25',
            'address': 'required',
            'description': 'required|min:25',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const event = await models.VendorEvent.create({
            vendorId: req.body.vendorId,
            name: req.body.name,
            type: req.body.type,
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            endDate: req.body.endDate,
            endTime: req.body.endTime,
            address: req.body.address,
            location: { type: 'Point', coordinates: [req.body.lng, req.body.lat] },
            description: req.body.description,
        });

        if (req.files) {
            let requestFile = req.files.image;
            if (requestFile) {
                const file = await commonUtil.uploadFile(requestFile, 'vendor-events');

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
                    event.image = file.name;
                }
            }
        } else {
            return res.status(422).json({
                message: 'Image upload error!',
                errors: {
                    image: ['Image is required']
                }
            });
        }

        await event.save();

        return res.status(201).json({
            message: 'Event created successfully',
            event: event,
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
            'name': 'required|string|max:255',
            'type': 'required|string|max:50',
            'startDate': 'required|date',
            'startTime': 'required|string|max:25',
            'endDate': 'required|date',
            'endTime': 'required|string|max:25',
            'address': 'required',
            'description': 'required|min:25',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const event = await models.VendorEvent.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        event.name = req.body.name;
        event.type = req.body.type;
        event.startDate = req.body.startDate;
        event.startTime = req.body.startTime;
        event.endDate = req.body.endDate;
        event.endTime = req.body.endTime;
        event.address = req.body.address;
        event.location = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };
        event.description = req.body.description;

        if (req.files) {
            let requestFile = req.files.image;
            if (requestFile) {
                const file = await commonUtil.uploadFile(requestFile, 'vendor-events');

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
                    await commonUtil.deleteFile(event.image);
                    event.image = file.name;
                }
            }
        }

        await event.save();

        return res.status(201).json({
            message: 'Event updated successfully',
            event: event,
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
        const event = await models.VendorEvent.findByPk(req.params.id);
        if (event) {
            await event.destroy();
            await commonUtil.deleteFile(event.image);
            return res.status(200).json({ message: 'Event deleted successfully' });
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