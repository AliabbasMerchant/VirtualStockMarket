# WARNING: MAY BE BROKEN A BIT

from pprint import pprint
import json

from config import DEVELOPER_TOKEN, URL
from dev_routes import *

def getRates():
    stocks = getMemory()['result']['stocks']
    rates = {}
    for stockIndex in stocks:
        rates[stockIndex] = stocks[stockIndex]['rate']
    return rates


def get_holdings(executed_orders, rates):
    holdings = {}
    for order in executed_orders:
        stockIndex = order['stockIndex']
        if holdings.get(stockIndex) is None:
            holdings[stockIndex] = {'rate': 0,
                                    'quantity': 0, 'stockIndex': stockIndex}
        holding = holdings[stockIndex]
        quantity = holding['quantity'] + order['quantity']
        if quantity != 0:
            holding['rate'] = (holding['rate'] * holding['quantity'] +
                               order['rate'] * order['quantity']) / quantity
        else:
            holding['rate'] = 0
        holding['quantity'] = quantity
    for h in holdings.values():
        h['rate'] = abs(h['rate'])
        h['quantity'] = abs(h['quantity'])
        h['price'] = round(h['rate'] * h['quantity'], 2)
        h['price2'] = round(rates[str(h['stockIndex'])] * h['quantity'], 2)
    return holdings


def getPrices(holdings):
    p = 0
    for h in holdings.values():
        p += h['price2']
    return p


def main():
    db_json = getDB()
    # print(db_json)
    users = db_json['users']

    rates = getRates()

    # pprint(rates)

    users_list = []
    results = []
    for user in users:
        d = {}
        holdings = get_holdings(user['executedOrders'], rates)
        d['username'] = user['username']
        d['name'] = user['name']
        d['funds'] = user['funds']
        d['holdings'] = holdings
        d['assets'] = round(d['funds'] + getPrices(holdings), 2)
        users_list.append(d)
        results.append(
            {'username': d['username'], 'name': d['name'], 'assets': d['assets']})
    # pprint(users_list)
    # pprint(results)
    pprint(sorted(results, key=lambda i: i['assets']))


if __name__ == "__main__":
    main()
