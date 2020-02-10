module.exports = {
    initialFunds: 50000,
    brokerageRateFraction: 0.001,

    // initialTime,
    // buyingTimeLimit: initialTime + 10*60*1000, // milliseconds
    // breakTimeStart: initialTime + 45*60*1000,
    // breakTimeEnd: initialTime + 60*60*1000,
    // endTime: initialTime + 105*60*1000,

    internalEventNotifyUser: "notifyUser",
    internalEventNotifyEveryone: "notifyEveryone",

    eventNewClient: "newClient",
    eventStockRateUpdate: "stockRateUpdate",
    eventOrderPlaced: "orderPlaced",

    defaultSuccessMessage: "Success",
    defaultErrorMessage: "Sorry, there was an error processing your request",

    capFraction: 0.2,
}