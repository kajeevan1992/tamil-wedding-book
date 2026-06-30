'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleWeddingGuests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupleId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Couples',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      // coupleWeddingEventGroupId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model:
      //     {
      //       tableName: 'CoupleWeddingEventGroups',
      //       field: 'id'
      //     },
      //     key: 'id',
      //   },
      //   allowNull: true,
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE'
      // },
      // coupleWeddingEventListId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model:
      //     {
      //       tableName: 'CoupleWeddingEventLists',
      //       field: 'id'
      //     },
      //     key: 'id',
      //   },
      //   allowNull: true,
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE'
      // },
      // coupleWeddingEventTableId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model:
      //     {
      //       tableName: 'CoupleWeddingEventTables',
      //       field: 'id'
      //     },
      //     key: 'id',
      //   },
      //   allowNull: true,
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE'
      // },
      // coupleWeddingEventMenuId: {
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model:
      //     {
      //       tableName: 'CoupleWeddingEventMenus',
      //       field: 'id'
      //     },
      //     key: 'id',
      //   },
      //   allowNull: true,
      //   onDelete: 'CASCADE',
      //   onUpdate: 'CASCADE'
      // },
      fullName: {
        type: Sequelize.STRING(191)
      },
      age: {
        type: Sequelize.ENUM,
        // defaultValue: 'Adult',
        values: [
          'Adult',
          'Child',
          'Baby',
        ]
      },
      email: {
        type: Sequelize.STRING(255)
      },
      telephone: Sequelize.STRING(50),
      mobile: Sequelize.STRING(50),
      address: Sequelize.STRING(255),
      location: Sequelize.GEOMETRY,
      // atttendance: {
      //   type: Sequelize.ENUM,
      //   defaultValue: 'Pending',
      //   values: [
      //     'Confirmed',
      //     'Pending',
      //     'Declined',
      //   ]
      // },
      // invitedTo: Sequelize.JSONB,
      companionOfId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingGuests',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CoupleWeddingGuests');
  }
};