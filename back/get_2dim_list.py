import requests
import json
import numpy as np

res = requests.get("http://127.0.0.1:8000/api/45/")

res = res.json()

tab = []
for i in range(0, 784):
    tab.append(res["pixel"+str(i)])

tab = np.asarray(tab).reshape(28,28)
print(tab)
print(res["label"])