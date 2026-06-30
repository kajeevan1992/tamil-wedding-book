const commonUtil = require("../../../../utilities/common");
const models = require("../../../../models");
const Validator = require('validatorjs');

const index = async (req, res) => {
    try {
        let itemsPerPage = req.query.itemsPerPage || 5;
        const { limit, offset } = commonUtil.getPagination(
            req.query.page, itemsPerPage
        );

        const menus = await models.VendorMenu.findAndCountAll({
            where: { vendorId: req.params.vendorId },
            limit: limit,
            offset: offset,
            order: [
                ['createdAt', 'DESC'],
            ]
        });


        return res.status(200).json(
            commonUtil.getPagingData(menus, req.params.page, limit, itemsPerPage)
        );
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
            'name': 'required|string|max:255',
            'description': 'required|min:10',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const menu = await models.VendorMenu.create({
            vendorId: req.body.vendorId,
            name: req.body.name,
            description: req.body.description,
        });

        if (req.body.price !== '' && req.body.price !== null) {
            menu.price = req.body.price;
        }

        await menu.save();

        return res.status(201).json({
            message: 'Menu created successfully',
            menu: menu,
        });
    } catch (error) {
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
            'description': 'required|min:10',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const menu = await models.VendorMenu.findByPk(req.params.id);
        if (!menu) {
            return res.status(404).json({
                message: 'Menu not found',
            });
        }

        menu.name = req.body.name;
        menu.description = req.body.description;
        menu.price = req.body.price;

        await menu.save();

        return res.status(201).json({
            message: 'Menu updated successfully',
            menu: menu,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const destroy = async (req, res) => {
    try {
        const menu = await models.VendorMenu.findByPk(req.params.id);
        if (menu) {
            await menu.destroy();
            await commonUtil.deleteFile(menu.image);
            return res.status(200).json({ message: 'Menu deleted successfully' });
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