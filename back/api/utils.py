import base64
import matplotlib.pyplot as plt
from django.conf import settings

import cv2
import os

import pandas as pd

import numpy as np
import keras
from keras.utils import to_categorical
from sklearn.model_selection import train_test_split
import requests

def process_image(datas):
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
    
    os.remove("output.png")

    return img

def process_image_predict(datas, model_select):
    img = process_image(datas)
    img = img.reshape(1, 28, 28, 1)
    res = settings.IA_MODEL[model_select].predict(img)

    return res

def process_image_to_json(datas, label):
    res = {"label": label}

    img = process_image(datas)
    img = img.reshape(784)

    for elem in img:
        res["pixel"+str(img.tolist().index(elem))] = elem

    return res

def train_model(name):
    train_datas = requests.get("http://127.0.0.1:8000/api/get_train_datas/")
    extension_datas = requests.get("http://127.0.0.1:8000/api/get_extension_datas/")
    
    df_train = pd.DataFrame(train_datas.json())
    df_extend = pd.DataFrame(extension_datas.json())
    
    datas = pd.concat([df_train, df_extend], ignore_index=True)
    datas = datas.sample(frac=1).reset_index(drop=True)
    
    data_test = data_train.sample(frac=0.2, replace=False)
    data_train = data_train.drop(data_test.index)
    
    img_rows, img_cols = 28, 28
    input_shape = (img_rows, img_cols)
    
    X = np.array(data_train.iloc[:, 1:])
    y = to_categorical(np.array(data_train.iloc[:, 0]))
    
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=13)
    
    X_test = np.array(data_test.iloc[:, 1:])
    y_test = to_categorical(np.array(data_test.iloc[:, 0]))
    
    X_train = X_train.reshape(X_train.shape[0], img_rows, img_cols)
    X_test = X_test.reshape(X_test.shape[0], img_rows, img_cols)
    X_val = X_val.reshape(X_val.shape[0], img_rows, img_cols)
    
    X_train = X_train.astype('float32')
    X_test = X_test.astype('float32')
    X_val = X_val.astype('float32')
    X_train /= 255
    X_test /= 255
    X_val /= 255
    
    batch_size = 32
    num_classes = 10
    epochs = 2
    
    row, col = X_train.shape[1:]
    
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    models_files = os.listdir(models_dir)
    
    saved_model = None
    model_id_max = 0
    
    for model in models_files:
        if model.split('.')[0] == name:
            saved_model = keras.models.load_model('api/models/'+name+'.h5py')
    
            if int(name.split('-')[1].split('_')[0]) > model_id_max:
                model_id_max = int(name.split('-')[1].split('_')[0])
    
    
    if saved_model is None:
        return 0
    
    history = saved_model.fit(X_train, y_train,
            batch_size=batch_size,
            epochs=epochs,
            verbose=1,
            validation_data=(X_val, y_val))
    
    
    
    model_type = name.split('-')[0]
    
    model_id = model_id_max + 1
    model_dataset = "MNIST_EXTENDED"
    
    saved_model.save('api/models/'+model_type+'-'+model_id+'_'+model_dataset+'.h5py')

