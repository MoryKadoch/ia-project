import base64
import matplotlib.pyplot as plt
import keras

#res = base64.b64decode((file))

#output = open("output.png", "wb")
#output.write(res)
#output.close()

import cv2

#img = cv2.imread("output.png", cv2.IMREAD_UNCHANGED)

#img = cv2.bitwise_not(img)

#trans_mask = img[:,:,3] == 0
#img[trans_mask] = [0, 0, 0, 255]
#img = cv2.cvtColor(img, cv2.COLOR_BGRA2GRAY)

#img = cv2.bitwise_not(img)

#img = cv2.resize(img, (28, 28), interpolation=cv2.INTER_LINEAR)


#img = img.reshape(1, 28, 28, 1)

#model = keras.models.load_model('back/projet_ia/models/LSTM-1_MNIST.h5py')

#res = model.predict(img).argmax(axis=1)

#print(res[0])

def process_image(datas, model):
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
    
    img = cv2.resize(img, (28, 28), interpolation=cv2.INTER_LINEAR)
    
    
    img = img.reshape(1, 28, 28, 1)
    
    model = keras.models.load_model('back/projet_ia/models/LSTM-1_MNIST.h5py')
    
    res = model.predict(img).argmax(axis=1)[0]

    return res