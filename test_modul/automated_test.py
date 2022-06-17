import requests

baseUrl = "http://52.57.196.190:6969/"
trialsCount = 30

def ping():
    try:
        return requests.get(baseUrl).json()
    except Exception as e:
        print(e)


for i in range(trialsCount):
    print(ping())
