const db = require("../models")
const { Op } = require("sequelize")
const { CronJob } = require("cron");

const TestJob = new CronJob(
  "0 * * * *",
  async function () {
    const currentDate = new Date()
    await db.ModalName.update(
      { active: false },
      {
        where: {
          endDate: { [Op.lt]: currentDate },
          active: true,
        },
        returning: true,
      }
    )
  },
  null,
  true,
  "Asia/Karachi"
);

module.exports = { TestJob }