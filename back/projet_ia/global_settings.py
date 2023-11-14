import keras

def _load_model_once():
    return keras.models.load_model('projet_ia/models/LSTM-1_MNIST.h5py')

ia_model = _load_model_once()