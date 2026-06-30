const models = require("../../../models");
const Validator = require('validatorjs');
const commonUtil = require('../../../utilities/common');
const dotenv = require('dotenv');
dotenv.config();
const XLSX = require('xlsx');

const loadGuestsData = async (req, res) => {
    try {
        const weddingEvents = await models.CoupleWeddingEvent.findAll({
            where: { coupleId: req.params.coupleId },
            order: [
                ['displayOrder', 'ASC'],
                ['coupleWeddingEventLists', 'name', 'ASC'],
                ['coupleWeddingEventMenus', 'name', 'ASC'],
                ['coupleWeddingEventTables', 'id', 'ASC'],
            ],
            include: [
                {
                    model: models.CoupleWeddingEventList,
                    as: 'coupleWeddingEventLists',
                },
                {
                    model: models.CoupleWeddingEventMenu,
                    as: 'coupleWeddingEventMenus',
                },
                {
                    model: models.CoupleWeddingEventTable,
                    as: 'coupleWeddingEventTables',
                    include: {
                        separate: true,
                        model: models.CoupleWeddingEventTableChair,
                        as: 'coupleWeddingEventTableChairs',
                        include: {
                            model: models.CoupleWeddingGuest,
                            as: 'coupleWeddingGuest',
                        }
                        // where: {
                        //     coupleWeddingGuestId: {
                        //         [models.Sequelize.Op.is]: null
                        //     }
                        // }
                    }
                },
                {
                    model: models.CoupleWeddingEventGuest,
                    as: 'coupleWeddingEventGuests',
                }
            ],
        });

        const weddingGroups = commonUtil.predefinedCoupleWeddingGroups();
        const weddingMenus = commonUtil.predefineCoupleWeddingEventMenus();
        const weddingLists = commonUtil.predefinedCoupleWeddingEventList();
        const weddingTables = commonUtil.predefineCoupleWeddingEventTables();

        return res.status(200).json({
            weddingEvents: weddingEvents,
            weddingGroups: weddingGroups,
            weddingMenus: weddingMenus,
            weddingLists: weddingLists,
            weddingTables: weddingTables,
            inviteByLinkUrl: `${process.env.CLIENT_URL}/guest-invitation`,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createUpdateEvent = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required_if:action,edit',
            'coupleId': 'required_if:action,add',
            'name': 'required|min:3|max:255',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        let event = {
            name: req.body.name,
            image: req.body.image,
            displayOrder: req.body.displayOrder,
        };

        let eventId = '';
        if (req.body.action === 'add') {
            event.coupleId = req.body.coupleId;
            const newEvent = await models.CoupleWeddingEvent.create(event);
            eventId = newEvent.id;

            let coupleWeddingEventGroups = [];
            req.body.groups.map(group => {
                coupleWeddingEventGroups.push({
                    coupleWeddingEventId: eventId,
                    name: group.name,
                });
            });
            await models.CoupleWeddingEventGroup.bulkCreate(coupleWeddingEventGroups);

            let coupleWeddingEventMenus = [];
            req.body.menus.map(menu => {
                coupleWeddingEventMenus.push({
                    coupleWeddingEventId: eventId,
                    name: menu.name,
                });
            });
            await models.CoupleWeddingEventMenu.bulkCreate(coupleWeddingEventMenus);

            let coupleWeddingEventLists = [];
            req.body.lists.map(list => {
                coupleWeddingEventLists.push({
                    coupleWeddingEventId: eventId,
                    name: list.name,
                });
            });
            await models.CoupleWeddingEventList.bulkCreate(coupleWeddingEventLists);

            let coupleWeddingEventTables = [];
            req.body.tables.map(table => {
                coupleWeddingEventTables.push({
                    coupleWeddingEventId: eventId,
                    name: table.name,
                    type: 'sc-one-sided-table'
                });
            });
            await models.CoupleWeddingEventTable.bulkCreate(coupleWeddingEventTables);
        } else {
            await models.CoupleWeddingEvent.update(event, {
                where: { id: req.body.id }
            });

            eventId = req.body.id;
        }

        const weddingEvent = await models.CoupleWeddingEvent.findByPk(eventId, {
            order: [
                ['coupleWeddingEventLists', 'name', 'ASC'],
                ['coupleWeddingEventMenus', 'name', 'ASC'],
                ['coupleWeddingEventTables', 'id', 'ASC'],
            ],
            include: [
                {
                    model: models.CoupleWeddingEventList,
                    as: 'coupleWeddingEventLists',
                },
                {
                    model: models.CoupleWeddingEventMenu,
                    as: 'coupleWeddingEventMenus',
                },
                {
                    model: models.CoupleWeddingEventTable,
                    as: 'coupleWeddingEventTables',
                },
                {
                    model: models.CoupleWeddingEventGuest,
                    as: 'coupleWeddingEventGuests',
                }
            ],
        });

        return res.status(200).json({
            message: `Event ${req.body.action === 'add' ? 'created' : 'updated'} successfully`,
            event: weddingEvent,
        });
    } catch (error) {
        console.log('error', error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteEventOption = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required',
            'type': 'required',
        });

        if (validation.fails()) {
            return res.status(501).json({
                message: 'Some data are missing, please try again',
            });
        }

        switch (req.body.type) {
            case 'groups':
                await models.CoupleWeddingEventGroup.destroy({ where: { id: req.body.id } });
                break;
            case 'menus':
                await models.CoupleWeddingEventMenu.destroy({ where: { id: req.body.id } });
                break;
            case 'lists':
                await models.CoupleWeddingEventList.destroy({ where: { id: req.body.id } });
                break;
            case 'tables':
                await models.CoupleWeddingEventTable.destroy({ where: { id: req.body.id } });
                break;
            default:
                break;
        }

        return res.status(200).json({
            message: `${commonUtil.capitalizeFirst(req.body.type)} deleted successfully`,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteEvent = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        //? 1. check if event exists
        const event = await models.CoupleWeddingEvent.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({
                message: 'Event not found',
            });
        }

        //? 2. Get all guests of the event
        const eventGuests = await event.getCoupleWeddingEventGuests();

        //? 3. Delete the event
        await event.destroy();

        //? 4. Delete all guests of the event which is not in other event
        for (const eventGuest of eventGuests) {
            const guest = await eventGuest.getCoupleWeddingGuest();
            const otherEvent = await models.CoupleWeddingEventGuest.findOne({
                where: {
                    coupleWeddingEventId: { [models.Sequelize.Op.not]: event.id },
                    coupleWeddingGuestId: guest.id,
                },
            });

            if (!otherEvent) {
                await guest.destroy();
            }
        }
        return res.status(200).json({
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const loadSelectedFilterData = async (req, res) => {
    try {
        const order = [];
        const include = [
            {
                model: models.CoupleWeddingEventGuest,
                as: 'coupleWeddingEventGuests',
                include: {
                    model: models.CoupleWeddingGuest,
                    as: 'coupleWeddingGuest',
                }
            }
        ];

        if (req.body.filter === 'coupleWeddingEventGroups') {
            include.push({
                model: models.CoupleWeddingEventGroup,
                as: 'coupleWeddingEventGroups',
            });
            order.push([req.body.filter, 'displayOrder', 'ASC']);
        } else if (req.body.filter === 'coupleWeddingEventMenus') {
            include.push({
                model: models.CoupleWeddingEventMenu,
                as: 'coupleWeddingEventMenus',
            });
            order.push([req.body.filter, 'name', 'ASC']);
        } else if (req.body.filter === 'coupleWeddingEventTables') {
            include.push({
                model: models.CoupleWeddingEventTable,
                as: 'coupleWeddingEventTables',
            });
            order.push([req.body.filter, 'id', 'ASC']);
        } else if (req.body.filter === 'coupleWeddingEventLists') {
            include.push({
                model: models.CoupleWeddingEventList,
                as: 'coupleWeddingEventLists',
            });
            order.push([req.body.filter, 'name', 'ASC']);
        }

        const eventFilterData = await models.CoupleWeddingEvent.findByPk(req.body.eventId, {
            order: order,
            include: include,
        });

        return res.status(200).json({
            eventFilterData: eventFilterData,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const createUpdateItem = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required_if:action,edit',
            'coupleWeddingEventId': 'required',
            'model': 'required',
            'type': 'required',
            'name': 'required|min:3|max:191',
            'chairs': 'required_if:type,table',
            'tableType': 'required_if:type,table',
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        if (req.body.type === 'table') {
            let validationFlag = true;
            let errors = {};

            if (req.body.tableType === 'sc-one-sided-table') {
                if (req.body.chairs < 1) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 1 chairs'];
                }

                if (req.body.chairs > 50) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 50'];
                }
            }

            if (req.body.tableType === 'sc-two-sided-table') {
                if (req.body.chairs < 4) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 4 chairs'];
                }

                if (Math.abs(req.body.chairs % 2) === 1) {
                    validationFlag = false;
                    errors.chairs = ['Selected table chairs must be multiple of 2'];
                }

                if (req.body.chairs > 50) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 50'];
                }
            }

            if (req.body.tableType === 'sc-four-sided-table') {
                if (req.body.chairs < 4) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 4 chairs'];
                }

                if (Math.abs(req.body.chairs % 2) === 1) {
                    validationFlag = false;
                    errors.chairs = ['Selected table chairs must be multiple of 2'];
                }


                if (req.body.chairs > 50) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 50'];
                }
            }

            if (req.body.tableType === 'sc-rounded-table') {
                if (req.body.chairs < 4) {
                    validationFlag = false;
                    errors.chairs = ['Selected table required minimum of 4 chairs'];
                }

                if (req.body.chairs > 12) {
                    validationFlag = false;
                    errors.chairs = ['Selected table maximum chairs capacity is 12'];
                }
            }

            if (validationFlag === false) {
                return res.status(422).json({
                    message: 'Invalid data format!',
                    errors: errors
                });
            }
        }

        let item = {};
        let includeData = {};

        if (req.body.action === 'add') {
            let data = {
                coupleWeddingEventId: req.body.coupleWeddingEventId,
                name: req.body.name,
                displayOrder: req.body.displayOrder,
            };
            if (req.body.type === 'table') {
                data.type = req.body.tableType;
                data.coupleWeddingEventTableChairs = [];

                for (let chair = 0; chair < req.body.chairs; chair++) {
                    data.coupleWeddingEventTableChairs.push({
                        coupleWeddingGuestId: null
                    });
                }

                includeData = {
                    model: models.CoupleWeddingEventTableChair,
                    as: 'coupleWeddingEventTableChairs',
                };
            }
            item = await models[req.body.model].create(data, {
                include: includeData
            });
        } else {
            item = await models[req.body.model].findByPk(req.body.id);
            item.name = req.body.name;
            if (req.body.type === 'table') {
                // item.chairs = req.body.chairs;
            }
            await item.save();
        }

        return res.status(200).json({
            message: `${commonUtil.capitalizeFirst(req.body.type)} ${req.body.action === 'add' ? 'created' : 'updated'} successfully`,
            item: item,
        });
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const deleteItem = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required_if:action,edit',
            'model': 'required',
            'type': 'required',
        });

        if (validation.fails()) {
            return res.status(422).json({
                message: 'Some data are missing, please try again',
            });
        }

        await models[req.body.model].destroy({ where: { id: req.body.id } });

        return res.status(200).json({
            message: `${commonUtil.capitalizeFirst(req.body.type)} delete successfully`,
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const addGuest = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            // 'group.*.id': 'required',
            'coupleId': 'required',
            'fullName': 'required|min:3|max:191',
            'companions.*.coupleWeddingGuest.fullName': 'required|min:3|max:191',
            'age.*.value': 'required',
            'invitedTo': 'required',
            'invitedTo.*.name': 'required',
            'invitedTo.*.id': 'required',
            'email': 'email|max:255',
            'telephone': 'max:50',
            'mobile': 'max:50',
            'address': 'max:255',
        }, {
            // 'required.group.*.id': 'Group is required',
            'required.age.*.value': 'Age is required',
            'required.invitedTo': 'You must select at least 1 event',
            'required.invitedTo.*.name': 'Something wrong with the event',
            'required.invitedTo.*.id': 'Something wrong with the event',
            'required.companions.*.coupleWeddingGuest.fullName': 'Name is required',
            'min.companions.*.coupleWeddingGuest.fullName': 'Name must be at least 3 characters long',
            'max.companions.*.coupleWeddingGuest.fullName': 'Name must not be greater than 191 characters'
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const point = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };

        //? Create guest and invite to events
        const guest = await models.CoupleWeddingGuest.create({
            coupleId: req.body.coupleId,
            fullName: req.body.fullName,
            age: req.body.age.value,
            email: req.body.email,
            telephone: req.body.telephone,
            mobile: req.body.mobile,
            address: req.body.address,
            location: point,
        });
        const guestInvitedTo = [];
        req.body.invitedTo.map((invitation) => {
            guestInvitedTo.push({
                coupleWeddingEventId: invitation.id,
                // coupleWeddingEventGroupId: ,
                coupleWeddingGuestId: guest.id,
                status: 'confirmed',
            });
        });
        const invitations = await models.CoupleWeddingEventGuest.bulkCreate(guestInvitedTo);

        //? Create companions and invite to events
        const companions = [];
        req.body.companions.map((companion) => {
            companions.push({
                coupleId: req.body.coupleId,
                fullName: companion.coupleWeddingGuest.fullName,
                // age: req.body.age.value,
                email: req.body.email,
                telephone: req.body.telephone,
                mobile: req.body.mobile,
                address: req.body.address,
                location: point,
                companionOfId: guest.id,
            });
        });
        const guestCompanions = companions.length > 0 ? await models.CoupleWeddingGuest.bulkCreate(companions) : [];
        const companionsInvitedTo = [];
        guestCompanions.map(companion => {
            req.body.invitedTo.map((invitation) => {
                companionsInvitedTo.push({
                    coupleWeddingEventId: invitation.id,
                    // coupleWeddingEventGroupId: ,
                    coupleWeddingGuestId: companion.id,
                    status: 'confirmed',
                });
            });
        });
        await models.CoupleWeddingEventGuest.bulkCreate(companionsInvitedTo);

        let newGuest = guest.toJSON();
        newGuest.invitations = invitations;
        newGuest.companions = guestCompanions;
        return res.status(200).json({
            message: 'Guest created successfully',
            guest: newGuest,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const updateGuest = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            // 'group.*.id': 'required',
            'coupleId': 'required',
            'fullName': 'required|min:3|max:191',
            'companions.*.coupleWeddingGuest.fullName': 'required|min:3|max:191',
            'age.*.value': 'required',
            'invitedTo': 'required',
            'invitedTo.*.name': 'required',
            'invitedTo.*.id': 'required',
            'email': 'email|max:255',
            'telephone': 'max:50',
            'mobile': 'max:50',
            'address': 'max:255',
        }, {
            // 'required.group.*.id': 'Group is required',
            'required.age.*.value': 'Age is required',
            'required.invitedTo': 'You must select at least 1 event',
            'required.invitedTo.*.name': 'Something wrong with the event',
            'required.invitedTo.*.id': 'Something wrong with the event',
            'required.companions.*.coupleWeddingGuest.fullName': 'Name is required',
            'min.companions.*.coupleWeddingGuest.fullName': 'Name must be at least 3 characters long',
            'max.companions.*.coupleWeddingGuest.fullName': 'Name must not be greater than 191 characters'
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const guest = await models.CoupleWeddingGuest.findByPk(req.body.id);
        if (!guest) {
            return res.status(404).json({
                message: 'Guest not found',
            });
        }

        // let groupChanged = guest.coupleWeddingEventGroupId !== req.body.group.id;

        const point = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };

        // guest.coupleWeddingEventGroupId = req.body.group.id;
        guest.fullName = req.body.fullName;
        guest.age = req.body.age.value;
        guest.email = req.body.email;
        guest.telephone = req.body.telephone;
        guest.mobile = req.body.mobile;
        guest.address = req.body.address;
        guest.location = point;
        await guest.save();

        let oldEvents = await models.CoupleWeddingEventGuest.findAll({
            where: {
                coupleWeddingGuestId: guest.id
            },
            attributes: ['coupleWeddingEventId'],
            raw: true,
        });
        oldEvents = oldEvents.map((oe) => oe.coupleWeddingEventId);

        const guestInvitedTo = [];
        const requestEvents = [];
        const deleteEvents = [];

        req.body.invitedTo.map((invitation) => {
            if (!oldEvents.includes(invitation.id)) {
                guestInvitedTo.push({
                    coupleWeddingEventId: invitation.id,
                    // coupleWeddingEventGroupId: ,
                    coupleWeddingGuestId: guest.id,
                    status: 'confirmed',
                });
            }

            requestEvents.push(invitation.id);
        });
        oldEvents.map(oe => {
            if (!requestEvents.includes(oe)) {
                deleteEvents.push(oe);
            }
        });

        if (guestInvitedTo.length) {
            await models.CoupleWeddingEventGuest.bulkCreate(guestInvitedTo);
        }
        if (deleteEvents.length) {
            await models.CoupleWeddingEventGuest.destroy({
                where: {
                    coupleWeddingEventId: { [models.Sequelize.Op.in]: deleteEvents },
                    coupleWeddingGuestId: guest.id,
                }
            });
        }

        //? New and old companions data
        const newCompanions = [];
        const oldCompanions = [];
        req.body.companions?.map((companion) => {
            if (!companion.coupleWeddingGuest.id) {
                newCompanions.push({
                    coupleId: req.body.coupleId,
                    fullName: companion.coupleWeddingGuest.fullName,
                    // age: req.body.age.value,
                    companionOfId: guest.id,
                });
            }

            if (companion.coupleWeddingGuest.id) {
                oldCompanions.push(companion.coupleWeddingGuest);
            }
        });

        //? Updating old companions
        const oldCompanionInvitedTo = [];
        oldCompanions.map(oc => {
            guestInvitedTo.map(git => {
                oldCompanionInvitedTo.push({
                    coupleWeddingEventId: git.coupleWeddingEventId,
                    coupleWeddingGuestId: oc.id,
                    status: 'confirmed',
                });
            });
        });
        if (oldCompanionInvitedTo.length) {
            await models.CoupleWeddingEventGuest.bulkCreate(oldCompanionInvitedTo);
        }
        if (deleteEvents.length) {
            let companionIds = oldCompanions.map(oc => oc.id);
            await models.CoupleWeddingEventGuest.destroy({
                where: {
                    coupleWeddingEventId: { [models.Sequelize.Op.in]: deleteEvents },
                    coupleWeddingGuestId: companionIds,
                }
            });
        }

        //? Creating new companions & invitations
        const guestCompanions = newCompanions.length > 0 ? await models.CoupleWeddingGuest.bulkCreate(newCompanions) : [];
        const companionsInvitedTo = [];
        guestCompanions.map(companion => {
            req.body.invitedTo.map((invitation) => {
                companionsInvitedTo.push({
                    coupleWeddingEventId: invitation.id,
                    // coupleWeddingEventGroupId: ,
                    coupleWeddingGuestId: companion.id,
                    status: 'confirmed',
                });
            });
        });
        await models.CoupleWeddingEventGuest.bulkCreate(companionsInvitedTo);

        return res.status(200).json({
            message: 'Guest updated successfully',
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const actionOnCompanion = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'id': 'required',
            'action': 'required',
        });

        if (validation.fails()) {
            return res.status(501).json({
                message: 'Some data are missing, please try again',
            });
        }

        const guest = await models.CoupleWeddingGuest.findByPk(req.body.id);
        if (!guest) {
            return res.status(404).json({
                message: 'Companion not found',
            });
        }

        if (req.body.action === 'remove') {
            guest.companionOfId = null;
            await guest.save();

            return res.status(200).json({
                message: 'Guest removed as companion successfully',
            });
        } else if (req.body.action === 'delete') {
            await guest.destroy();
            return res.status(200).json({
                message: 'Companion delete successfully',
            });
        } else {
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

const deleteGuestWithCompanions = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(501).json({
                message: 'Some data are missing, please try again',
            });
        }

        // let guestId = null;
        // let eventId = null;
        const guestEvent = await models.CoupleWeddingEventGuest.findByPk(req.params.id);
        if (!guestEvent) {
            return res.status(404).json({
                message: 'Guest not found',
            });
        }

        // guestId = guestEvent.coupleWeddingGuestId;
        // eventId = guestEvent.coupleWeddingEventId;
        const guestId = guestEvent.coupleWeddingGuestId;
        await guestEvent.destroy();

        //? Delete guest if not in any event
        const guestInEvents = await models.CoupleWeddingEventGuest.findOne({
            where: {
                coupleWeddingGuestId: guestId,
            }
        });
        if (!guestInEvents) {
            await models.CoupleWeddingGuest.destroy({
                where: {
                    id: guestId,
                }
            })
        }

        // let companions = await models.CoupleWeddingGuest.findAll({
        //     where: {
        //         companionOfId: guestId
        //     },
        //     attributes: ['id'],
        //     raw: true,
        // });
        // let companionsIds = companions.map((e) => e.id);
        // await models.CoupleWeddingEventGuest.destroy({
        //     where: {
        //         coupleWeddingGuestId: companionsIds,
        //         coupleWeddingEventId: eventId,
        //     }
        // });

        return res.status(200).json({
            message: 'Guest delete successfully',
        });
    } catch (error) {
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const actionOnMultipleGuests = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'coupleId': 'required',
            'eventId': 'required',
            'action': 'required',
            'collection': 'required',
            'itemId': 'required_unless:action,delete',
            'selectedGuests': 'required|array',
        });

        if (validation.fails() || req.body.selectedGuests.length < 1) {
            const { errors } = validation.errors;
            console.log(errors)
            return res.status(501).json({
                message: 'Some data are missing, please try again',
            });
        }

        let result = null;
        if (req.body.action === 'delete') {
            result = await models.CoupleWeddingEventGuest.destroy({
                where: { id: req.body.selectedGuests },
            });

            // let events = await models.CoupleWeddingEventGuest.findAll({
            //     where: { id: req.body.selectedGuests },
            //     attributes: ['coupleWeddingGuestId'],
            //     raw: true,
            // });
            // let selectedGuests = events.map((e) => e.coupleWeddingGuestId);

            // result = await models.CoupleWeddingGuest.destroy({
            //     where: {
            //         id: selectedGuests
            //     }
            // });
        } else {
            result = await models.CoupleWeddingEventGuest.update({
                [req.body.collection === 'coupleWeddingEventAttendanceId' ? 'status' : req.body.collection]: req.body.itemId
            }, {
                where: { id: req.body.selectedGuests }
            });
        }

        if (result) {
            return res.status(200).json({
                message: 'Action successful',
            });
        } else {
            return res.status(501).json({
                message: 'Something went wrong, please try again',
            });
        }
    } catch (error) {
        console.log('error')
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const changeGuestEventStatus = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'type': 'required',
            'guestId': 'required',
            'eventId': 'required',
            'status': 'required_if:type,status',
            'menuId': 'required_if:type,menu',
            'listId': 'required_if:type,list',
            'tableId': 'required_if:type,table',
        });

        if (validation.fails()) {
            // const { errors } = validation.errors;
            return res.status(501).json({
                message: 'Some data are missing, please try again',
            });
        }

        const { type, guestId, eventId, status, menuId, listId, tableId } = req.body;
        const guestEvent = await models.CoupleWeddingEventGuest.findOne({
            where: {
                coupleWeddingEventId: eventId,
                coupleWeddingGuestId: guestId,
            }
        });
        if (!guestEvent) {
            return res.status(404).json({
                message: 'Guest not found',
            });
        }

        if (type === 'status') {
            guestEvent.status = status;
        } else if (type === 'menu') {
            guestEvent.coupleWeddingEventMenuId = menuId;
        } else if (type === 'list') {
            guestEvent.coupleWeddingEventListId = listId;
        } else if (type === 'table') {
            //? Find existing seat and remove
            const eventTables = await models.CoupleWeddingEventTable.findAll({
                where: {
                    coupleWeddingEventId: eventId,
                },
                attributes: ['id'],
                raw: true
            });
            const eventTableIds = eventTables.map(eventTable => eventTable.id);
            await models.CoupleWeddingEventTableChair.update({
                coupleWeddingGuestId: null
            }, {
                where: {
                    coupleWeddingEventTableId: {
                        [models.Sequelize.Op.in]: eventTableIds
                    },
                    coupleWeddingGuestId: guestId
                }
            });

            //? seat the guest
            const chair = await models.CoupleWeddingEventTableChair.findOne({
                where: {
                    coupleWeddingEventTableId: tableId,
                    coupleWeddingGuestId: null
                }
            });
            if (!chair) {
                return res.status(404).json({
                    message: 'Table is full',
                });
            }

            chair.coupleWeddingGuestId = guestId;
            await chair.save();

            guestEvent.coupleWeddingEventTableId = tableId;
        }

        await guestEvent.save();

        return res.status(200).json({
            message: 'Status changed successfully',
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const addGuestByLink = async (req, res) => {
    try {
        let validation = new Validator(req.body, {
            'coupleId': 'required',
            'fullName': 'required|min:3|max:191',
            'companions.*.coupleWeddingGuest.fullName': 'required|min:3|max:191',
            'age.*.value': 'required',
            'invitedTo.*.name': 'required',
            'invitedTo.*.id': 'required',
            'email': 'email|max:255',
            'telephone': 'max:50',
            'mobile': 'max:50',
            'address': 'max:255',
        }, {
            'required.age.*.value': 'Age is required',
            'required.companions.*.coupleWeddingGuest.fullName': 'Name is required',
            'min.companions.*.coupleWeddingGuest.fullName': 'Name must be at least 3 characters long',
            'max.companions.*.coupleWeddingGuest.fullName': 'Name must not be greater than 191 characters'
        });

        if (validation.fails()) {
            const { errors } = validation.errors;
            return res.status(422).json({
                message: 'Invalid data format!',
                errors: errors
            });
        }

        const point = { type: 'Point', coordinates: [req.body.lng, req.body.lat] };

        const isCoupleExists = await models.Couple.findByPk(req.body.coupleId, {
            include: {
                model: models.User,
                as: 'user',
            },
        });
        if (!isCoupleExists) {
            return res.status(501).json({
                message: 'The link has been expired',
            });
        }

        //? Create guest and invite to events
        const guest = await models.CoupleWeddingGuest.create({
            coupleId: req.body.coupleId,
            fullName: req.body.fullName,
            age: req.body.age.value,
            email: req.body.email,
            telephone: req.body.telephone,
            mobile: req.body.mobile,
            address: req.body.address,
            location: point,
        });

        const coupleEvents = await models.CoupleWeddingEvent.findAll({
            where: { coupleId: req.body.coupleId }
        });
        console.log(coupleEvents);
        const guestInvitedTo = [];
        coupleEvents.map((event) => {
            guestInvitedTo.push({
                coupleWeddingEventId: event.id,
                // coupleWeddingEventGroupId: ,
                coupleWeddingGuestId: guest.id,
                status: 'pending',
            });
        });
        await models.CoupleWeddingEventGuest.bulkCreate(guestInvitedTo);

        //? Create companions and invite to events
        const companions = [];
        req.body.companions.map((companion) => {
            companions.push({
                coupleId: req.body.coupleId,
                fullName: companion.coupleWeddingGuest.fullName,
                // age: req.body.age.value, 
                email: req.body.email,
                telephone: req.body.telephone,
                mobile: req.body.mobile,
                address: req.body.address,
                location: point,
                companionOfId: guest.id,
            });
        });
        const guestCompanions = companions.length > 0 ? await models.CoupleWeddingGuest.bulkCreate(companions) : [];
        const companionsInvitedTo = [];
        guestCompanions.map(companion => {
            coupleEvents.map((event) => {
                companionsInvitedTo.push({
                    coupleWeddingEventId: event.id,
                    // coupleWeddingEventGroupId: ,
                    coupleWeddingGuestId: companion.id,
                    status: 'pending',
                });
            });
        });
        await models.CoupleWeddingEventGuest.bulkCreate(companionsInvitedTo);

        await models.Notification.create({
            userId: isCoupleExists.user.id,
            icon: 'bi bi-person',
            iconColor: '#8bc34a',
            type: 'guestAddedByLink',
            title: 'Invitation link has been used',
            description: `${req.body.fullName} submit invitation using your link`,
        });

        return res.status(200).json({
            message: `We let the ${isCoupleExists.user.fullName}${isCoupleExists?.partnerName ? ' & ' + isCoupleExists?.partnerName : ''} know about invitation`,
        });
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

const bulkCreateBySpreadsheet = async (req, res) => {
    try {
        if (req.files) {
            let reqFile = req.files.spreadsheet;
            if (reqFile) {
                const workbook = XLSX.read(reqFile.data, { type: 'buffer' });
                const sheetName = workbook.SheetNames[0];
                const spreadsheet = workbook.Sheets[sheetName];
                const spreadsheetJson = XLSX.utils.sheet_to_json(spreadsheet, { raw: true });

                let spreadsheetGuests = spreadsheetJson.filter(sj => {
                    if (sj.Name?.length > 0) {
                        return {
                            coupleId: req.body.coupleId,
                            fullName: sj.Name,
                            age: sj.Age,
                            email: sj.Email,
                            telephone: sj.Telephone,
                            mobile: sj.Mobile,
                            address: sj.Address,
                        }
                    };
                });

                const guests = await models.CoupleWeddingGuest.bulkCreate(spreadsheetGuests);

                const coupleEvents = await models.CoupleWeddingEvent.findAll({
                    where: { coupleId: req.body.coupleId }
                });

                const guestsInvitedTo = [];
                guests.map(guest => {
                    coupleEvents.map((event) => {
                        guestsInvitedTo.push({
                            coupleWeddingEventId: event.id,
                            // coupleWeddingEventGroupId: ,
                            coupleWeddingGuestId: guest.id,
                            status: 'confirmed',
                        });
                    });
                });
                await models.CoupleWeddingEventGuest.bulkCreate(guestsInvitedTo);

                return res.status(201).json({
                    message: 'Guests created successfully',
                });
            } else {
                return res.status(501).json({
                    message: 'File is not valid or corrupt!',
                });
            }
        } else {
            return res.status(501).json({
                message: 'File is not valid or corrupt!',
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(501).json({
            message: 'Something went wrong, please try again',
        });
    }
}

module.exports = {
    loadGuestsData,
    createUpdateEvent,
    deleteEventOption,
    deleteEvent,
    loadSelectedFilterData,
    createUpdateItem,
    deleteItem,
    addGuest,
    updateGuest,
    actionOnCompanion,
    deleteGuestWithCompanions,
    actionOnMultipleGuests,
    changeGuestEventStatus,
    addGuestByLink,
    bulkCreateBySpreadsheet
}