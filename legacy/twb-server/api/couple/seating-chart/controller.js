const models = require("../../../models");
const Validator = require('validatorjs');
const commonUtil = require('../../../utilities/common');
const dotenv = require('dotenv');
dotenv.config();

const loadWeddingEvents = async (req, res) => {
    try {
        const weddingEvents = await models.CoupleWeddingEvent.findAll({
            where: { coupleId: req.params.coupleId },
            order: [
                ['displayOrder', 'ASC'],
            ],
        });

        return res.status(200).json({
            weddingEvents: weddingEvents,
            inviteByLinkUrl: `${process.env.CLIENT_URL}/guest-invitation`,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const loadEventTablesAndGuests = async (req, res) => {
    try {
        const eventTables = await models.CoupleWeddingEventTable.findAll({
            where: { coupleWeddingEventId: req.params.eventId },
            order: [
                ['coupleWeddingEventTableChairs', 'id', 'ASC'],
            ],
            include: [
                {
                    model: models.CoupleWeddingEventTableChair,
                    as: 'coupleWeddingEventTableChairs',
                    include: {
                        model: models.CoupleWeddingGuest,
                        as: 'coupleWeddingGuest',
                    }
                },
            ]
        });

        const eventGuests = await models.CoupleWeddingEventGuest.findAll({
            where: {
                coupleWeddingEventId: req.params.eventId,
                coupleWeddingEventTableId: null
            },
            // order: [
            //     ['coupleWeddingEventTableChairs', 'id', 'ASC'],
            // ],
            include: {
                model: models.CoupleWeddingGuest,
                as: 'coupleWeddingGuest',
            }
        });

        return res.status(200).json({
            eventTables: eventTables,
            eventGuests: eventGuests,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const setTablePosition = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'tableId': 'required',
            'position': 'required',
            'position.x': 'required|numeric',
            'position.y': 'required|numeric',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Can\'t position the table',
                errors: errors
            });
        }

        const { tableId, position } = req.body;
        const eventTable = await models.CoupleWeddingEventTable.findByPk(tableId);
        if (!eventTable) {
            return res.status(404).json({
                message: 'Table not found!',
            });
        }

        eventTable.position = position;
        await eventTable.save();

        return res.status(200).json({
            message: 'Table position changed successfully',
            position: eventTable.position,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const setGuestSeat = async (req, res) => {
    try {
        const reqBody = commonUtil.decryptUrl(req.body.request);
        let validation = new Validator(reqBody, {
            'eventId': 'required',
            'guestId': 'required',
            'tableId': 'required',
            'chairId': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Can\'t seat the guest',
                errors: errors
            });
        }

        const { eventId, guestId, tableId, chairId } = reqBody;
        const [
            event,
            guest,
            table,
            chair,
        ] = await Promise.all([
            models.CoupleWeddingEventGuest.findOne({
                where: {
                    coupleWeddingEventId: eventId,
                    coupleWeddingGuestId: guestId,
                }
            }),
            models.CoupleWeddingGuest.findByPk(guestId),
            models.CoupleWeddingEventTable.findByPk(tableId),
            models.CoupleWeddingEventTableChair.findByPk(chairId),
        ]);

        if ([event, guest, table, chair].some(el => el == null)) {
            return res.status(422).json({
                message: 'Can\'t seat the guest',
            });
        }

        event.coupleWeddingEventTableId = table.id;
        chair.coupleWeddingGuestId = guest.id;

        await Promise.all([
            models.CoupleWeddingEventTableChair.update(
                { coupleWeddingGuestId: null },
                { where: { coupleWeddingGuestId: guest.id } }
            ),
            event.save(),
            chair.save(),
        ]);

        return res.status(200).json({
            guest: guest,
            message: 'Guest seated successfully',
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const unSeatGuest = async (req, res) => {
    try {
        const reqBody = commonUtil.decryptUrl(req.body.request);
        let validation = new Validator(reqBody, {
            'eventId': 'required',
            'guestId': 'required',
            'chairId': 'required',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Can\'t un-seat the guest',
                errors: errors
            });
        }

        const { eventId, guestId, chairId } = reqBody;
        const [
            event,
            chair,
        ] = await Promise.all([
            models.CoupleWeddingEventGuest.findOne({
                where: {
                    coupleWeddingEventId: eventId,
                    coupleWeddingGuestId: guestId,
                },
                include: {
                    model: models.CoupleWeddingGuest,
                    as: 'coupleWeddingGuest',
                }
            }),
            models.CoupleWeddingEventTableChair.findByPk(chairId),
        ]);

        if ([event, chair].some(el => el == null)) {
            return res.status(422).json({
                message: 'Can\'t un-seat the guest',
            });
        }

        event.coupleWeddingEventTableId = null;
        chair.coupleWeddingGuestId = null;

        await Promise.all([
            event.save(),
            chair.save(),
        ]);

        return res.status(200).json({
            eventGuest: event,
            message: 'Guest un-seated successfully',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteTable = async (req, res) => {
    try {
        const { eventId, tableId } = req.params;
        if (!eventId || !tableId) {
            return res.status(404).json({
                message: 'Can\'t delete the table',
            });
        }

        const [
            eventGuests,
            deleted
        ] = await Promise.all([
            models.CoupleWeddingEventGuest.findAll({
                where: {
                    coupleWeddingEventId: eventId,
                    coupleWeddingEventTableId: tableId
                },
                include: {
                    model: models.CoupleWeddingGuest,
                    as: 'coupleWeddingGuest',
                }
            }),
            models.CoupleWeddingEventTable.destroy({ where: { id: tableId } })
        ]);

        if (deleted) {
            return res.status(200).json({
                message: 'Table deleted successfully',
                eventGuests: eventGuests
            });
        } else {
            console.log(error)
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}


const changeWindowHeight = async (req, res) => {
    try {
        const { eventId, height } = req.body;
        if (!eventId || !height) {
            return res.status(404).json({
                message: 'Can\'t update window height',
            });
        }

        const weddingEvent = await models.CoupleWeddingEvent.findByPk(eventId);
        if (!weddingEvent) {
            return res.status(404).json({
                message: 'Can\'t update window height',
            });
        }

        weddingEvent.seatingChartWindowHeight = height;

        if (await weddingEvent.save()) {
            return res.status(200).json({
                message: 'Window height updated successfully',
            });
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
    loadWeddingEvents,
    loadEventTablesAndGuests,
    setTablePosition,
    setGuestSeat,
    unSeatGuest,
    deleteTable,
    changeWindowHeight,
}