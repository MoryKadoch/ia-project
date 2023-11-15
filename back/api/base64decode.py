import base64
import matplotlib.pyplot as plt
from django.conf import settings

import cv2
import os


def process_image(datas, model_select):
    datas = base64.b64decode((datas))
    output = open("output.png", "wb")
    output.write(datas)
    output.close()
    img = cv2.imread("output.png", cv2.IMREAD_UNCHANGED)

    img = cv2.bitwise_not(img)
    
    trans_mask = img[:,:,3] == 0
    img[trans_mask] = [0, 0, 0, 255]
    img = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)
    
    img = cv2.bitwise_not(img)
    
    img = cv2.resize(img, (28, 28), interpolation=cv2.INTER_AREA )
    
    img = img.reshape(1, 28, 28, 1)
    
    res = settings.IA_MODEL.predict(img)
    os.remove("output.png")

    return res