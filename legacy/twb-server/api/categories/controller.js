const models = require("../../models");

const categories = async (req, res) => {
    try {
        const categories = await models.Category.findAll();

        return res.status(200).json({
            categories: categories
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = { categories }