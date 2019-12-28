const initialTime = Date.now(); // TODO change
console.log("initialTime", initialTime);

module.exports = {
    initialFunds: 50000,
    brokerageFees: 10, // per share
    
    developer: true,

    initialTime,
    buyingTimeLimit: initialTime + 1*60*1000, // milliseconds
    // buyingTimeLimit: initialTime + 5*60*1000, // milliseconds
    breakTimeStart: initialTime + 45*60*1000,
    breakTimeEnd: initialTime + 60*60*1000,
    endTime: initialTime + 105*60*1000,

    eventNewClient: "newClient",
    eventStockRateUpdate: "stockRateUpdate",
    eventOrderPlaced: "orderPlaced",

    defaultSuccessMessage: "Success",
    defaultErrorMessage: "Sorry, there was an error processing your request",
}