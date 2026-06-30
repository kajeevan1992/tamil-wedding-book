const jwt = require('jsonwebtoken');
const models = require('../models');

const generateJWT = (user) => {
    const tokenData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    };

    return jwt.sign({ user: tokenData }, process.env.TOKEN_SECRET);
}

const requireLogin = (req, res, next) => {
    const token = decodeToken(req);
    if (!token) {
        return res.status(401).json({ errors: 'Invalid access!' });
    }

    next();
}

const onlyAdmin = (req, res, next) => {
    const role = getUserRole(req);

    if (!role || role !== 'admin') {
        return res.status(401).json({ errors: 'Invalid access!' });
    }

    next();
}

const onlyCouple = (req, res, next) => {
    const role = getUserRole(req);
    if (!role || role !== 'couple') {
        return res.status(401).json({ errors: 'Invalid access!' });
    }

    next();
}

const onlyVendor = (req, res, next) => {
    const role = getUserRole(req);
    if (!role || (role !== 'venue' && role !== 'supplier')) {
        return res.status(401).json({ errors: 'Invalid access!' });
    }

    next();
}


const decodeToken = (req) => {
    const token = req.headers.authorization || req.headers['authorization'];

    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

const getUserEmail = (req) => {
    const token = decodeToken(req);
    if (!token) {
        return null;
    }

    return token.user.email;
}

const getUserId = (req) => {
    const token = decodeToken(req);
    if (!token) {
        return null;
    }

    return token.user.id;
}

const getUserRole = (req) => {
    const token = decodeToken(req);
    if (!token) {
        return null;
    }

    return token.user.role;
}

const getUserFullName = (req) => {
    const token = decodeToken(req);
    if (!token) {
        return null;
    }

    return token.user.fullName;
}

const getUserAndCoupleRecord = async (userId) => {
    let user = await models.User.findByPk(userId);
    let isCouple = await user.getCouple();

    let isPartner = null;
    let partner = null;

    if (!isCouple.partnerId) {
        isPartner = await models.Couple.findOne({
            where: { partnerId: user.id }
        });

        if (!isPartner) {
            user = user.toJSON();
            user.couple = isCouple.toJSON();
        } else {
            partner = await models.User.findByPk(isPartner.userId);

            user = user.toJSON();
            const userCouple = await partner.getCouple();
            user.couple = userCouple.toJSON();
        }
    } else {
        partner = await models.User.findByPk(isCouple.partnerId);

        user = user.toJSON();
        user.couple = isCouple.toJSON();
    }

    return user;
}

module.exports = {
    generateJWT,
    requireLogin,
    onlyAdmin,
    onlyCouple,
    onlyVendor,
    getUserEmail,
    getUserId,
    getUserRole,
    getUserFullName,
    getUserAndCoupleRecord,
};

// bin/kc.sh start-dev --db postgres --db-url-host localhost --db-schema orayarupio --db-username postgres --db-password root --hostname=fedora --https-key-store-password=secret

// bin/kc.sh start-dev --db postgres --db-url-host localhost --db-schema orayarupio --db-username postgres --db-password root --https-key-store-password=secret