from config import DEVELOPER_TOKEN, URL
from pprint import pprint

import requests


def init(unsafe=False):
    if unsafe:
        r = requests.post(f"{URL}/dev/init", {'userToken': DEVELOPER_TOKEN, 'unsafe': 'unsafe'})
        # This is because JS cannot understand 'False' as boolean false. It takes it as a string, hence considering it true
    else:
        r = requests.post(f"{URL}/dev/init", {'userToken': DEVELOPER_TOKEN})
    print(r.text)


def startTrading():
    r = requests.post(f"{URL}/dev/startTrading",
                      {'userToken': DEVELOPER_TOKEN})
    print(r.text)


def take_a_break():
    r = requests.post(f"{URL}/dev/break", {'userToken': DEVELOPER_TOKEN})
    print(r.text)


def restart():
    r = requests.post(f"{URL}/dev/restart", {'userToken': DEVELOPER_TOKEN})
    print(r.text)


def getMemory():
    r = requests.post(f"{URL}/dev/getMemory", {'userToken': DEVELOPER_TOKEN})
    pprint(r.json())


def getDB():
    r = requests.post(f"{URL}/dev/getDB", {'userToken': DEVELOPER_TOKEN})
    pprint(r.json())
