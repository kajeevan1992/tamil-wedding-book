"use strict"
const { Model } = require("sequelize");
const sendEmail = require("../utilities/mailer");
const bcrypt = require("bcrypt");
const PROTECTED_ATTRIBUTES = ['password', 'verificationCode', 'verificationCodeExpiry'];

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Couple, { as: 'couple', foreignKey: 'userId' });
      User.hasOne(models.Vendor, { as: 'vendor', foreignKey: 'userId' });
    }

    toJSON() {
      let attributes = Object.assign({}, this.get());
      for (let pa of PROTECTED_ATTRIBUTES) {
        delete attributes[pa]
      }

      return attributes
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    photo: DataTypes.STRING,
    address: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    weddingStyle: DataTypes.STRING,
    telephone: DataTypes.STRING,
    role: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    verificationCode: DataTypes.INTEGER,
    verificationCodeExpiry: DataTypes.DATE,
    verified: DataTypes.BOOLEAN,
    stepsDone: DataTypes.BOOLEAN,
    storeFrontFirstStepDone: DataTypes.BOOLEAN,
    storeFrontSecondStepDone: DataTypes.BOOLEAN,
    storeFrontThirdStepDone: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    //? https://sequelize.org/docs/v6/other-topics/hooks/
    hooks: {
      beforeCreate: async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
        user.verificationCode = (100000 + Math.floor(Math.random() * 900000));
      },
      afterCreate: (user, options) => {
        let template = 'welcome.html';
        let mailData = {
          toName: user.fullName,
          toEmail: user.email,
          subject: "Email Verification",
          hash: ''
        };

        if (user.verified) {
          template = 'partner-welcome.html';
          mailData.subject = `Welcome, ${user.fullName}! Let\'s get started.`;
        } else {
          mailData.hash = btoa(JSON.stringify({
            email: user.email,
            verificationCode: user.verificationCode,
            type: 'email-verification'
          }));
        }

        sendEmail(mailData, template);
      },
      beforeUpdate: async (user, options) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    sequelize,
    modelName: "User",
    scopes: {
      withoutPassword: {
        attributes: { exclude: ["password"] },
      },
    },
  });

  return User
}
