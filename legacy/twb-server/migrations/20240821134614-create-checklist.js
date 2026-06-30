'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Checklists', {
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
      checklistCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'ChecklistCategories',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      vendorType: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      vendorCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Categories',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      budgetPlannerCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleBudgetPlannerCategories',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      checklistFilterId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'ChecklistFilters',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255)
      },
      description: {
        type: Sequelize.TEXT
      },
      note: {
        type: Sequelize.TEXT
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Checklists');
  }
};