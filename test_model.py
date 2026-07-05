import os
import tensorflow as tf

def test():
    print(f"TensorFlow version: {tf.__version__}")
    
    model_path = os.path.join(os.path.dirname(__file__), 'backend', 'modelo_ligero.keras')
    print(f"Loading from: {model_path}")
    
    try:
        model = tf.keras.models.load_model(model_path)
        print("Success!")
        print(model.input_shape)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test()
