// running this file will seed the database's bank table with bank data
const bank = require("../models/bank");
const bankData = require("../data/banks");

// running this file will seed the database with courses

async function doAddBanks(data) {
  await bank.addNewBank(data);
}

for (let bank of bankData) {
  doAddBanks(bank);
}
