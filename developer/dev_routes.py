from config import DEVELOPER_TOKEN, URL

import requests

def init():
    r = requests.post(f"{URL}/dev/init", {'userToken': DEVELOPER_TOKEN})
    print(r.text)

def startTrading():
    r = requests.post(f"{URL}/dev/startTrading", {'userToken': DEVELOPER_TOKEN})
    print(r.text)

def take_a_break():
    r = requests.post(f"{URL}/dev/break", {'userToken': DEVELOPER_TOKEN})
    print(r.text)

def restart():
    r = requests.post(f"{URL}/dev/restart", {'userToken': DEVELOPER_TOKEN})
    print(r.text)

if __name__ == "__main__":
    init()
