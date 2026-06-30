const models = require("../../../models");
const Validator = require("validatorjs");
const commonUtil = require("../../../utilities/common");
const auth = require("../../../services/auth_service");
const moment = require("moment");
const sendEmail = require("../../../utilities/mailer");
const { Op } = require("sequelize");
const XLSX = require("xlsx");

const getEnquiryStats = async (vendorId) => {
    const [totalCount, unreadCount, readCount, respondedCount, bookedCount] =
        await Promise.all([
            models.VendorEnquiries.count({
                where: { vendorId: vendorId },
            }),
            models.VendorEnquiries.count({
                where: {
                    vendorId: vendorId,
                    readByVendor: false,
                },
            }),
            models.VendorEnquiries.count({
                where: {
                    vendorId: vendorId,
                    readByVendor: true,
                },
            }),
            models.VendorEnquiries.count({
                where: {
                    vendorId: vendorId,
                    status: "responded",
                },
            }),
            models.VendorEnquiries.count({
                where: {
                    vendorId: vendorId,
                    status: "booked",
                },
            }),
        ]);

    // Calculate pending count (total - responded - booked)
    const pendingCount = totalCount - respondedCount - bookedCount;

    return {
        totalCount: totalCount,
        unreadCount: unreadCount,
        readCount: readCount,
        respondedCount: respondedCount,
        bookedCount: bookedCount,
        pendingCount: pendingCount,
    };
};
const loadEnquiries = async (req, res) => {
    try {
        let validation = new Validator(req.params, {
            vendorId: "required",
        });

        if (validation.fails()) {
            return res.status(422).json({
                message: "Invalid data format!",
            });
        }

        let vendor = await models.Vendor.findByPk(req.params.vendorId);
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }

        let itemsPerPage = req.query.itemsPerPage || 5;
        const { limit, offset } = commonUtil.getPagination(
            req.query.page,
            itemsPerPage
        );

        // Build where clause based on filter
        const whereClause = { vendorId: req.params.vendorId };
        const filter = req.query.filter;

        if (filter === "unread") {
            whereClause.readByVendor = false;
        } else if (filter === "read") {
            whereClause.readByVendor = true;
        } else if (filter === "pending") {
            whereClause.status = {
                [Op.notIn]: ["responded", "booked"],
            };
        } else if (filter === "responded") {
            whereClause.status = "responded";
        } else if (filter === "booked") {
            whereClause.status = "booked";
        }

        const enquiries = await models.VendorEnquiries.findAndCountAll({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: models.User,
                    as: "user",
                },
            ],
        });

        const stats = await getEnquiryStats(req.params.vendorId);

        return res.status(200).json({
            enquiries: commonUtil.getPagingData(
                enquiries,
                req.query.page,
                limit,
                itemsPerPage
            ),
            ...stats,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: "Something went wrong, please try again",
        });
    }
};

const loadEnquiry = async (req, res) => {
    try {
        let validation = new Validator(req.params, {
            vendorId: "required",
            enquiryId: "required",
        });

        if (validation.fails()) {
            return res.status(422).json({
                message: "Invalid data format!",
            });
        }

        let enquiry = await models.VendorEnquiries.findOne({
            where: {
                id: req.params.enquiryId,
                vendorId: req.params.vendorId,
            },
        });

        if (!enquiry) {
            return res.status(404).json({
                message: "Enquiry not found",
            });
        }

        enquiry.readByVendor = true;
        await enquiry.save();

        return res.status(200).json(enquiry);
    } catch (error) {
        return res.status(501).json({
            message: "Something went wrong, please try again",
        });
    }
};

const postEnquiryReply = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            enquiryId: "required",
            vendorId: "required",
            replyText: "required|min:10|max:250",
        });

        if (validation.fails()) {
            return res.status(422).json({
                message: "Invalid data format!",
            });
        }
        const userId = auth.getUserId(req);
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const vendor = await models.Vendor.findOne({
            where: {
                id: req.body.vendorId,
                userId: user.id,
            },
        });
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }

        const enquiry = await models.VendorEnquiries.findOne({
            where: {
                id: req.body.enquiryId,
                vendorId: vendor.id,
            },
        });

        if (!enquiry) {
            return res.status(404).json({
                message: "Enquiry not found",
            });
        }

        enquiry.status = "responded";
        enquiry.replyText = req.body.replyText;
        await enquiry.save();

        const mailData = {
            toName: enquiry.fullName,
            toEmail: enquiry.email,
            subject: "Enquiry Reply",
            fromName: user.fullName,
            // fromEmail: user.email,
            // fromPhone: user.phone,
            replyText: req.body.replyText,
            eventDate: moment(enquiry.eventDate).format("DD MMM YYYY"),
            guestsCount: enquiry.guestsCount,
        };

        sendEmail(mailData, "enquiry-reply.html");

        return res.status(200).json({
            message: "Enquiry reply sent successfully",
            enquiry: enquiry,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: "Something went wrong, please try again",
        });
    }
};

const deleteEnquiry = async (req, res) => {
    try {
        let validation = new Validator(req.params, {
            vendorId: "required",
            enquiryId: "required",
        });

        if (validation.fails()) {
            return res.status(422).json({
                message: "Invalid data format!",
            });
        }

        const userId = auth.getUserId(req);
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const vendor = await models.Vendor.findOne({
            where: {
                id: req.params.vendorId,
                userId: user.id,
            },
        });

        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }

        const enquiry = await models.VendorEnquiries.findOne({
            where: {
                id: req.params.enquiryId,
                vendorId: vendor.id,
            },
        });

        if (!enquiry) {
            return res.status(404).json({
                message: "Enquiry not found",
            });
        }

        await enquiry.destroy();

        return res.status(200).json({
            message: "Enquiry deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: "Something went wrong, please try again",
        });
    }
};

const exportToExcel = async (req, res) => {
    try {
        const vendorId = req.query.vendorId;
        const filter = req.query.filter;

        if (!vendorId) {
            return res.status(422).json({
                message: "Vendor ID is required",
            });
        }

        // Verify vendor exists
        const vendor = await models.Vendor.findByPk(vendorId);
        if (!vendor) {
            return res.status(404).json({
                message: "Vendor not found",
            });
        }

        // Build where clause based on filter (same logic as loadEnquiries)
        const whereClause = { vendorId: vendorId };
        if (filter === "unread") {
            whereClause.readByVendor = false;
        } else if (filter === "read") {
            whereClause.readByVendor = true;
        } else if (filter === "pending") {
            whereClause.status = {
                [Op.notIn]: ["responded", "booked"],
            };
        } else if (filter === "responded") {
            whereClause.status = "responded";
        } else if (filter === "booked") {
            whereClause.status = "booked";
        }

        // Get total count for progress tracking
        const totalCount = await models.VendorEnquiries.count({
            where: whereClause,
        });

        if (totalCount === 0) {
            return res.status(404).json({
                message: "No enquiries found to export",
            });
        }

        // Process in chunks to avoid memory issues
        const CHUNK_SIZE = 1000; // Process 1000 records at a time
        const allEnquiries = [];

        // Fetch data in chunks
        for (let offset = 0; offset < totalCount; offset += CHUNK_SIZE) {
            const chunk = await models.VendorEnquiries.findAll({
                where: whereClause,
                limit: CHUNK_SIZE,
                offset: offset,
                order: [["createdAt", "DESC"]],
                attributes: [
                    "id",
                    "fullName",
                    "email",
                    "phone",
                    "eventDate",
                    "guestsCount",
                    "message",
                    "status",
                    "replyText",
                    "readByVendor",
                    "createdAt",
                    "updatedAt",
                ],
                include: [
                    {
                        model: models.User,
                        as: "user",
                        attributes: ["fullName", "email", "telephone"],
                        required: false, // LEFT JOIN to include enquiries without user
                    },
                ],
                raw: false, // Keep as Sequelize instances to access associations
            });

            // Transform chunk data
            const transformedChunk = chunk.map((enquiry) => {
                const enquiryData = enquiry.toJSON();
                return {
                    ID: enquiryData.id,
                    "Full Name": enquiryData.user
                        ? enquiryData.user.fullName
                        : enquiryData.fullName,
                    Email: enquiryData.user
                        ? enquiryData.user.email
                        : enquiryData.email,
                    Phone: enquiryData.user
                        ? enquiryData.user.telephone
                        : enquiryData.phone,
                    "Event Date": enquiryData.eventDate
                        ? moment(enquiryData.eventDate).format("YYYY-MM-DD")
                        : "",
                    "Guests Count": enquiryData.guestsCount || "",
                    Message: enquiryData.message || "",
                    Status: enquiryData.status || "Pending",
                    "Reply Text": enquiryData.replyText || "",
                    "Read by Vendor": enquiryData.readByVendor ? "Yes" : "No",
                    "Created At": moment(enquiryData.createdAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                    "Updated At": moment(enquiryData.updatedAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                    ),
                };
            });

            allEnquiries.push(...transformedChunk);
        }

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(allEnquiries);

        // Set column widths for better readability
        const columnWidths = [
            { wch: 8 }, // ID
            { wch: 25 }, // Full Name
            { wch: 30 }, // Email
            { wch: 15 }, // Phone
            { wch: 12 }, // Event Date
            { wch: 12 }, // Guests Count
            { wch: 50 }, // Message
            { wch: 12 }, // Status
            { wch: 50 }, // Reply Text
            { wch: 15 }, // Read by Vendor
            { wch: 20 }, // Created At
            { wch: 20 }, // Updated At
        ];
        worksheet["!cols"] = columnWidths;

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

        // Generate buffer
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });

        // Set response headers
        const filterLabel =
            filter === "unread"
                ? "Unread"
                : filter === "read"
                ? "Read"
                : filter === "pending"
                ? "Pending"
                : filter === "responded"
                ? "Responded"
                : filter === "booked"
                ? "Booked"
                : "All";
        const filename = `enquiries-${filterLabel.toLowerCase()}-${moment().format(
            "YYYY-MM-DD"
        )}.xlsx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );
        res.setHeader("Content-Length", buffer.length);

        // Send the file
        res.send(buffer);
    } catch (error) {
        console.error("Export error:", error);
        return res.status(501).json({
            message: "Something went wrong while exporting enquiries",
        });
    }
};

module.exports = {
    loadEnquiries,
    loadEnquiry,
    postEnquiryReply,
    deleteEnquiry,
    exportToExcel,
};
