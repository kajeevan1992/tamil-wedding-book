const auth = require('../../../services/auth_service');
const commonUtil = require("../../../utilities/common");
const models = require("../../../models");
const Validator = require('validatorjs');
const sendEmail = require('../../../utilities/mailer');

const getWeddingDetails = async (req, res) => {
    try {
        const { CoupleWeddingGuest, CoupleWeddingEventGuest, Sequelize } = models;
        // const userId = auth.getUserId(req);
        const [
            hiredVendors,
            tasksStats,
            totalGuests,
            totalEvents,
            attendingGuests,
            seatedGuests,
        ] = await Promise.all([
            models.CoupleVendor.count({
                coupleId: req.params.coupleId,
                status: 'Hired',
            }),
            models.Checklist.findAll({
                where: {
                    coupleId: req.params.coupleId,
                },
                attributes: [
                    [models.Sequelize.fn('COUNT', models.Sequelize.col('id')), 'totalChecklists'], // Count all checklists
                    [
                        models.Sequelize.fn(
                            'SUM', // Use SUM for conditional counting
                            models.Sequelize.cast(models.Sequelize.col('completed'), 'int') // Cast boolean to integer (1 or 0)
                        ),
                        'completedChecklists',
                    ],
                ],
                group: ['coupleId'], // Important: Group by coupleId
                raw: true, // Return plain objects for easier access
            }),
            models.CoupleWeddingGuest.count({
                where: { coupleId: req.params.coupleId }
            }),
            models.CoupleWeddingEventGuest.count({
                where: {
                    '$coupleWeddingGuest.coupleId$': req.params.coupleId
                },
                include: [{
                    model: CoupleWeddingGuest,
                    as: 'coupleWeddingGuest'
                }]
            }),
            models.CoupleWeddingEventGuest.count({
                where: {
                    status: 'confirmed',
                    '$coupleWeddingGuest.coupleId$': req.params.coupleId
                },
                include: [{
                    model: CoupleWeddingGuest,
                    as: 'coupleWeddingGuest'
                }]
            }),
            models.CoupleWeddingEventGuest.count({
                where: {
                    coupleWeddingEventTableId: {
                        [Sequelize.Op.ne]: null
                    },
                    '$coupleWeddingGuest.coupleId$': req.params.coupleId
                },
                include: [{
                    model: CoupleWeddingGuest,
                    as: 'coupleWeddingGuest'
                }]
            }),
        ]);

        return res.status(200).json({
            weddingStats: {
                hiredVendors: hiredVendors,
                tasksStats: tasksStats.length > 0 ? {
                    completedChecklists: parseInt(tasksStats[0].completedChecklists),
                    totalChecklists: parseInt(tasksStats[0].totalChecklists)
                } : {
                    completedChecklists: 0,
                    totalChecklists: 0,
                },
                totalGuests: totalGuests,
                totalEvents: totalEvents,
                attendingGuests: attendingGuests,
                seatedGuests: seatedGuests,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateLastStepWeddingDetails = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'fullName': 'required|min:3|max:191',
            'partnerName': 'required|min:3|max:191',
            'date': 'required|date',
            'guests': 'required|max:50000',
            'address': 'required|max:255'
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const userId = auth.getUserId(req);
        let user = await models.User.findByPk(userId, {
            include: {
                model: models.Couple,
                as: 'couple',
                include: {
                    model: models.WeddingDetail,
                    as: 'weddingDetail'
                }
            }
        });

        user.fullName = req.body.fullName;
        user.stepsDone = true;

        user.couple.weddingDetail.partnerName = req.body.partnerName;
        user.couple.weddingDetail.date = req.body.date;
        user.couple.weddingDetail.guests = req.body.guests;
        user.couple.weddingDetail.address = req.body.address;
        user.couple.weddingDetail.location = {
            type: 'Point',
            coordinates: [req.body.lng, req.body.lat]
        };
        await user.couple.weddingDetail.save();

        const weddingCategories = [];
        req.body.categories.forEach(category => {
            if (category != 'venues') {
                weddingCategories.push({
                    coupleId: user.couple.id,
                    categoryId: category,
                });
            }
        });

        if (req.body.categories.includes('venues')) {
            const venues = await models.Category.findAll({
                where: { type: 'venue' }
            });

            venues.forEach(venue => {
                weddingCategories.push({
                    coupleId: user.couple.id,
                    categoryId: venue.id,
                });
            });
        }

        await models.CoupleCategory.bulkCreate(weddingCategories);

        await user.save();

        user = user.toJSON();
        user.primary = true;
        return res.status(200).json({
            message: 'Information updated successfully!',
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const linkAccountInvitation = async (req, res) => {
    let user = {};
    try {
        let validation = new Validator(req.body, {
            'email': 'required|email|max:255',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const isExists = await models.WeddingDetail.findOne({
            where: { partnerEmail: req.body.email.trim().toLowerCase() }
        });
        if (isExists) {
            return res.status(409).json({
                message: 'This is email is already been linked or invited by someone else!',
            });
        }

        const userId = auth.getUserId(req);
        user = await models.User.findByPk(userId, {
            include: {
                model: models.Couple,
                as: 'couple',
                include: {
                    model: models.WeddingDetail,
                    as: 'weddingDetail'
                }
            }
        });

        user.couple.weddingDetail.partnerEmail = req.body.email.trim().toLowerCase();
        await user.couple.weddingDetail.save();
        const hash = commonUtil.encryptAsUrl({
            email: user.email,
            partnerEmail: user.couple.weddingDetail.partnerEmail,
            type: 'link-account-invitation'
        });

        const mailData = {
            toName: user.couple.weddingDetail.partnerName,
            fromName: user.fullName,
            toEmail: user.couple.weddingDetail.partnerEmail,
            subject: user.fullName + ' would like to link accounts',
            hash: hash,
        }

        /*const info =*/  sendEmail(mailData, 'link-account-invitation.html');

        user = user.toJSON();
        user.primary = true;
        return res.status(201).json({
            message: 'Invitation has been sent to this email',
            user: user
        });
    } catch (error) {
        user.couple.weddingDetail.partnerEmail = null;
        await user.couple.weddingDetail.save();
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const removeLinkedAccount = async (req, res) => {
    try {
        const userId = auth.getUserId(req);
        let user = await models.User.findByPk(userId, {
            include: {
                model: models.Couple,
                as: 'couple',
                include: {
                    model: models.WeddingDetail,
                    as: 'weddingDetail'
                }
            }
        });

        user.couple.partnerId = null;
        await user.couple.save();

        user.couple.weddingDetail.partnerEmail = null;
        await user.couple.weddingDetail.save();

        // todo remove also partner id in case of partner couple
        //! update also on frontend

        user = user.toJSON();
        user.primary = true;

        return res.status(200).json({
            message: 'Account has been unlinked successfully!',
            user: user
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const acceptLinkingAccountInvitation = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'hash': 'required',
        });

        if (validation.fails()) {
            return res.status(401).json({
                message: 'Invitation link has been expired!',
            });
        }

        const decrypted = commonUtil.decryptUrl(req.body.hash);

        //? User who invited this person
        const invitedByUser = await models.User.findOne({
            where: { email: decrypted.email.trim().toLowerCase() },
            include: {
                model: models.Couple,
                as: 'couple',
                include: {
                    model: models.WeddingDetail,
                    as: 'weddingDetail'
                }
            }
        });

        //? User who has been invited
        const partner = await models.User.findOne({
            where: { email: decrypted.partnerEmail.trim().toLowerCase() },
            include: {
                model: models.Couple,
                as: 'couple',
            }
        });

        const userId = auth.getUserId(req);
        let type = '';
        if (userId) {
            const userEmail = auth.getUserEmail(req);
            if (decrypted.partnerEmail === userEmail) {
                type = 'loggedInAndMatched';
            } else {
                type = 'loggedInButNotMatched';
            }
        } else if (partner) {
            type = 'existsAndMatched';
        } else {
            type = 'notExists';
        }

        let user = null;
        if (type === 'loggedInAndMatched' || type === 'existsAndMatched') {
            //? Link accounts
            partner.couple.partnerId = null;
            await partner.couple.save();
            invitedByUser.couple.partnerId = partner.id;
            await invitedByUser.couple.save();

            if (type === 'loggedInAndMatched') {
                user = await models.User.findOne({
                    where: { email: decrypted.partnerEmail.trim().toLowerCase() },
                });

                user = user.toJSON();
                user.couple = invitedByUser.couple;
                user.partner = invitedByUser;
                user.primary = false;
            }
        }

        return res.status(200).json({
            type: type,
            user: user,
            email: decrypted.partnerEmail
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateProfileAndWeddingDetail = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'coupleId': 'required',
            'fullName': 'required|min:3|max:191',
            'partnerName': 'required|min:3|max:191',
            'weddingDate': 'required|date',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const userId = auth.getUserId(req);
        const user = await models.User.findByPk(userId);
        user.fullName = req.body.fullName;

        const couple = await models.Couple.findByPk(req.body.coupleId, {
            include: {
                model: models.WeddingDetail,
                as: 'weddingDetail'
            }
        });

        couple.weddingDetail.partnerName = req.body.partnerName;
        couple.weddingDetail.date = req.body.weddingDate;
        couple.weddingDetail.venue = req.body.venue;
        couple.weddingDetail.startTime = req.body.startTime;
        couple.weddingDetail.endTime = req.body.endTime;
        couple.weddingDetail.color = req.body.color;

        if (req.files) {
            let requestPhoto = req.files.photo;
            if (requestPhoto) {
                const photo = await commonUtil.uploadFile(requestPhoto, 'couple');

                if (!photo) {
                    return res.status(422).json({
                        message: 'File upload error!',
                        errors: {
                            photo: ['Photo not uploaded']
                        }
                    });
                } else if (!photo.success) {
                    return res.status(422).json(photo);
                } else if (photo && photo.success) {
                    user.photo = photo.name;
                }
            }

            let requestPartnerPhoto = req.files.partnerPhoto;
            if (requestPartnerPhoto) {
                const partnerPhoto = await commonUtil.uploadFile(requestPartnerPhoto, 'couple');
                if (!partnerPhoto) {
                    return res.status(422).json({
                        message: 'File upload error!',
                        errors: {
                            partnerPhoto: ['Photo not uploaded']
                        }
                    });
                } else if (!partnerPhoto.success) {
                    return res.status(422).json(partnerPhoto);
                } else if (partnerPhoto && partnerPhoto.success) {
                    if (couple.partnerId) {
                        let partner;
                        if (couple.userId === userId) {
                            partner = await models.User.findByPk(couple.partnerId);
                        } else if (couple.partnerId === userId) {
                            partner = await models.User.findByPk(couple.userId);
                        }

                        partner.photo = partnerPhoto.name;
                        await partner.save();
                    }

                    couple.weddingDetail.partnerPhoto = partnerPhoto.name;
                }
            }
        }

        await user.save();
        await couple.save();
        await couple.weddingDetail.save();

        // todo start above and then break react in components if time
        return res.status(200).json({
            message: 'Profile & wedding detail updated successfully!',
            user: await commonUtil.getUserCoupleRecord(user),
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateWeddingCardPhoto = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'weddingDetailId': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        if (req.files) {
            const weddingDetail = await models.WeddingDetail.findByPk(req.body.weddingDetailId);

            let requestPhoto = req.files.photo;
            if (requestPhoto) {
                const photo = await commonUtil.uploadFile(requestPhoto, 'wedding');

                if (!photo) {
                    return res.status(422).json({
                        message: 'File upload error!',
                        errors: {
                            photo: ['Photo not uploaded']
                        }
                    });
                } else if (!photo.success) {
                    return res.status(422).json(photo);
                } else if (photo && photo.success) {
                    weddingDetail.cardPhoto = photo.name;
                    console.log(weddingDetail.photo);
                }
            }

            await weddingDetail.save();

            return res.status(200).json({
                message: 'Wedding card photo updated successfully!',
                cardPhoto: weddingDetail.cardPhoto
            });
        }

        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    getWeddingDetails,
    updateLastStepWeddingDetails,
    linkAccountInvitation,
    removeLinkedAccount,
    acceptLinkingAccountInvitation,
    updateProfileAndWeddingDetail,
    updateWeddingCardPhoto
}