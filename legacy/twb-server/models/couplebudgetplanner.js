'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleBudgetPlanner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleBudgetPlanner.belongsTo(models.Couple, { as: 'couple', foreignKey: 'coupleId' });
      CoupleBudgetPlanner.hasMany(models.CoupleBudgetPlannerCategory, { as: 'budgetPlannerCategories', foreignKey: 'coupleBudgetPlannerId' });
    }
  }
  CoupleBudgetPlanner.init({
    coupleId: DataTypes.INTEGER,
    // estimatedCost: DataTypes.DECIMAL,
  }, {
    hooks: {
      afterCreate: (coupleBudgetPlanner, options) => {
        sequelize.models.CoupleBudgetPlannerCategory.bulkCreate(preListedCategories(coupleBudgetPlanner), {
          include: {
            model: sequelize.models.CoupleBudgetPlannerCategoryExpense,
            as: 'categoryExpenses',
          }
        });
      },
    },
    sequelize,
    modelName: 'CoupleBudgetPlanner',
  });
  return CoupleBudgetPlanner;
};


const preListedCategories = (coupleBudgetPlanner) => {
  return [
    {
      name: 'Ceremony', icon: 'bi bi-house-heart',
      categoryExpenses: [
        { name: 'Giving Notice', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Reception', icon: 'bi bi-house-door',
      categoryExpenses: [
        { name: 'Menu per person', estimatedCost: 567, finalCost: 0 },
        { name: 'Free Bar', estimatedCost: 30, finalCost: 0 },
        { name: 'Catering', estimatedCost: 0, finalCost: 0 },
        { name: 'Furniture hire', estimatedCost: 0, finalCost: 0 },
        { name: 'Venue rental', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Music', icon: 'bi bi-music-note-beamed',
      categoryExpenses: [
        { name: 'Ceremony Music', estimatedCost: 70, finalCost: 0 },
        { name: 'Reception Music', estimatedCost: 348, finalCost: 0 },
      ]
    },
    {
      name: 'Invitations', icon: 'bi bi-envelope-arrow-up',
      categoryExpenses: [
        { name: 'Wedding Invitation', estimatedCost: 100, finalCost: 0 },
        { name: 'Thank You Cards', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Wedding Favours', icon: 'bi bi-gift',
      categoryExpenses: [
        { name: 'Wedding Favours', estimatedCost: 155, finalCost: 0 },
        { name: 'Gifts For Children', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Flowers and Decoration', icon: 'bi bi-flower2',
      categoryExpenses: [
        { name: 'Wedding Party Flowers', estimatedCost: 62, finalCost: 0 },
        { name: 'Ceremony Decoration', estimatedCost: 117, finalCost: 0 },
        { name: 'Reception Decoration', estimatedCost: 117, finalCost: 0 },
      ]
    },
    {
      name: 'Photos and Video', icon: 'bi bi-camera-reels',
      categoryExpenses: [
        { name: 'Wedding Photos', estimatedCost: 695, finalCost: 0 },
        { name: 'Ceremony Videos', estimatedCost: 465, finalCost: 0 },
        { name: 'Reception Videos', estimatedCost: 465, finalCost: 0 },
      ]
    },
    {
      name: 'Transport', icon: 'bi bi-bus-front',
      categoryExpenses: [
        { name: 'Car For Newlyweds', estimatedCost: 250, finalCost: 0 },
        { name: 'Bus for guests', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Jewellery', icon: 'bi bi-gem',
      categoryExpenses: [
        { name: 'Wedding Rings', estimatedCost: 275, finalCost: 0 },
        { name: 'My Jewellery', estimatedCost: 0, finalCost: 0 },
        { name: 'Partner\'s Jewellery', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Bridal accessories', icon: 'bi bi-person-dash',
      categoryExpenses: [
        { name: 'Wedding Dress', estimatedCost: 705, finalCost: 0 },
        { name: 'Shoes', estimatedCost: 62, finalCost: 0 },
        { name: 'Lingerie', estimatedCost: 39, finalCost: 0 },
        { name: 'Hair Accessories', estimatedCost: 0, finalCost: 0 },
        { name: 'Veil', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Groom\'s accessories', icon: 'bi bi-person-add',
      categoryExpenses: [
        { name: 'Groom\'s Suit', estimatedCost: 205, finalCost: 0 },
        { name: 'Shoes', estimatedCost: 55, finalCost: 0 },
        { name: 'Tie & Waistcoat', estimatedCost: 39, finalCost: 0 },
        { name: 'Shirt', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Health & Beauty', icon: 'bi bi-backpack3',
      categoryExpenses: [
        { name: 'Hair', estimatedCost: 53, finalCost: 0 },
        { name: 'Make Up', estimatedCost: 45, finalCost: 0 },
        { name: 'Beauty Treatments', estimatedCost: 0, finalCost: 0 },
        { name: 'Partner\'s Hair', estimatedCost: 0, finalCost: 0 },
        { name: 'Partner\'s Beauty Treatment', estimatedCost: 0, finalCost: 0 },
      ]
    },
    {
      name: 'Honeymoon', icon: 'bi bi-airplane',
      categoryExpenses: [
        { name: 'Honeymoon Packages', estimatedCost: 1577, finalCost: 0 },
      ]
    },
    { name: 'Other', icon: 'bi bi-list-ul', },
  ].map(category => {
    return {
      coupleBudgetPlannerId: coupleBudgetPlanner.id,
      ...category,
    }
  });
} 