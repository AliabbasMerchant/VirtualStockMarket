const initialTime = + new Date; // TODO change
module.exports = {
    initialFunds: 100000,
    brokerageFees: 10,

    // initialQuantity: [1000,1000,1000,1000],

    initialTime,
    buyingTimeLimit: initialTime + 5*60*1000, // milliseconds
    breakTimeStart: initialTime + 90*60*1000,
    breakTimeEnd: initialTime + 120*60*1000,
    endTime: initialTime + 210*60*1000,

    eventNewClient: "newClient",
    eventStockRateUpdate: "stockRateUpdate",
    eventOrderPlaced: "orderPlaced",

    defaultSuccessMessage: "Success",
    defaultErrorMessage: "Sorry, there was an error processing your request",
}