order = {
    "orderId": "string",
    "quantity": "+- int",
    "rate": "float",
    "stockIndex": "int",
    "userId": "string"
}

holding = {
    "stockIndex": "int",
    "rate": "float",
    "quantity": "int",
    "price": "float",
}

user = {
    "_id": "mongoID"
}

stock = {
    "name": "Mno Company",
    "scrip": "String",
    "rate": "float",
    "rates": {"time":"rate"}
}

// Buying -> quantity is -ve