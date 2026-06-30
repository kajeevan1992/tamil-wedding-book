const models = require("../../../models");
const Validator = require('validatorjs');

const getSettings = async (req, res) => {
    try {
        if (!req.params.vendorId) {
            return res.status(422).json({
                message: 'Vendor is required!',
            });
        }

        let settings = await models.VendorSetting.findOne({
            where: { vendorId: req.params.vendorId },
        });

        return res.status(200).json(settings);
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateSettings = async (req, res) => {
    try {
        let settings = await models.VendorSetting.findByPk(req.params.id);

        settings.monthlyNewsletter = req.body.monthlyNewsletter;
        settings.trainingEmails = req.body.trainingEmails;
        settings.improvementTips = req.body.improvementTips;
        await settings.save();

        return res.status(201).json({
            message: 'Settings updated successfully',
            settings: settings,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    getSettings,
    updateSettings,
}