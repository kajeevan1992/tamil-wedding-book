const models = require("../../../models");
const Validator = require("validatorjs");
const sendEmail = require("../../../utilities/mailer");

const reviewRequest = async (req, res) => {
    try {
        let validation = new Validator(
            req.body,
            {
                vendorId: "required",
                recipients: "required",
                "recipients.*.name": "required",
                "recipients.*.email": "required",
                reviewTemplate: "required|min:50",
            },
            {
                "required.recipients": "At least 1 Recipients is required",
            }
        );

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: "Invalid data format!",
                errors: errors,
            });
        }

        // Check for duplicate emails in recipients (case-insensitive)
        if (req.body.recipients && Array.isArray(req.body.recipients)) {
            const emailMap = new Map();
            const duplicateEmails = [];

            req.body.recipients.forEach((recipient, index) => {
                if (recipient.email) {
                    const normalizedEmail = recipient.email
                        .trim()
                        .toLowerCase();
                    if (emailMap.has(normalizedEmail)) {
                        duplicateEmails.push({
                            index: index,
                            email: recipient.email,
                        });
                    } else {
                        emailMap.set(normalizedEmail, index);
                    }
                }
            });

            if (duplicateEmails.length > 0) {
                return res.status(422).json({
                    message: "Invalid data format!",
                    errors: {
                        recipients: [
                            `Duplicate email addresses found. Each recipient must have a unique email address.`,
                        ],
                    },
                });
            }
        }

        let vendor = await models.Vendor.findByPk(req.body.vendorId);
        if (!vendor) {
            return res.status(500).json({
                message: "Something went wrong, please try again later",
            });
        }

        if (req.body.saveTemplate == true) {
            vendor.reviewTemplate = req.body.reviewTemplate.trim();
            await vendor.save();
        }
        let user = await vendor.getUser();

        let template = "review-request.html";
        let reviewTemplate = req.body.reviewTemplate;

        req.body.recipients.forEach((recipient) => {
            let mailData = {
                url: `${process.env.CLIENT_URL}/vendor-detail/${user.id}?writeReview=true`,
                requestedBy: user.fullName,
                toName: recipient.name,
                toEmail: recipient.email.trim().toLowerCase(),
                subject: "Review Request",
                content: reviewTemplate.replaceAll(
                    /\[recipient name\]/g,
                    recipient.name
                ),
                cc: [user.email],
            };

            sendEmail(mailData, template);
        });

        return res.status(200).json({
            message: "Review request sent successfully",
        });
    } catch (error) {
        return res.status(501).json({
            message: "Something went wrong, please try again",
        });
    }
};

const loadReviews = async (req, res) => {
    try {
        const vendor = await models.Vendor.findByPk(req.params.vendorId);
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }

        const reviews = await models.VendorReviews.findAll({
            where: {
                vendorId: vendor.id,
            },
            include: [
                {
                    model: models.User,
                    as: "user",
                    attributes: ["fullName", "photo"],
                },
            ],
        });

        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(501).json({
            message: "Something went wrong, please try again",
        });
    }
};

module.exports = {
    reviewRequest,
    loadReviews,
};
