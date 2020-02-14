module.exports = {
    initialFunds: 50000,
    brokerageRateFraction: 0.001, // suggestion: increase this
    capFraction: 0.2,
    exchangeLimit: 20,

    internalEventNotifyUser: "notifyUser",
    internalEventNotifyEveryone: "notifyEveryone",

    eventNewClient: "newClient",
    eventStockRateUpdate: "stockRateUpdate",
    eventOrderPlaced: "orderPlaced",

    ordersLock: "orders:lock",
    stocksLock: "stocks:lock",

    defaultSuccessMessage: "Success",
    defaultErrorMessage: "Sorry, there was an error processing your request",
}