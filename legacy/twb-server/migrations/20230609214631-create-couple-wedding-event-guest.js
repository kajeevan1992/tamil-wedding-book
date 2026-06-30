'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleWeddingEventGuests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupleWeddingEventId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingEvents',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      coupleWeddingGuestId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingGuests',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      coupleWeddingEventGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingEventGroups',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      coupleWeddingEventListId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingEventLists',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      coupleWeddingEventTableId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingEventTables',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      coupleWeddingEventMenuId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingEventMenus',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      status: {
        type: Sequelize.STRING(50),
        defaultValue: 'confirmed'
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
    await queryInterface.dropTable('CoupleWeddingEventGuests');
  }
};