import os
import numpy as np
from PIL import Image
import tensorflow as tf

# Cargar el modelo al inicio para evitar recargas
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'modelo_ligero.keras')

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print(f"Modelo cargado correctamente. Input shape: {model.input_shape}")
    
    # Extraer el tamaño de la imagen que espera el modelo (asumiendo input shape (None, H, W, C))
    input_shape = model.input_shape
    if len(input_shape) == 4:
        TARGET_SIZE = (input_shape[1], input_shape[2])
    else:
        TARGET_SIZE = (224, 224) # Fallback por defecto
except Exception as e:
    print(f"Error al cargar el modelo: {e}")
    model = None
    TARGET_SIZE = (224, 224)

def procesar_imagen_cnn(archivo):
    """
    Procesa la imagen y usa el modelo .keras cargado para la predicción real.
    """
    if model is None:
        return {
            "status": "error",
            "message": "El modelo no pudo ser cargado en el servidor."
        }
        
    try:
        # Abrir imagen con PIL
        img = Image.open(archivo).convert('RGB')
        
        # Redimensionar al tamaño esperado por el modelo
        img = img.resize(TARGET_SIZE)
        
        # Convertir a array (dejamos en 0-255 porque MobileNetV3 tiene una capa Rescaling interna)
        img_array = np.array(img, dtype=np.float32)
        
        # Expandir dimensiones (agregar batch dimension)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Realizar predicción
        prediction = model.predict(img_array)[0][0]
        
        # Interpretar resultado (0: Aprobado, 1: Defectuoso)
        if prediction > 0.5:
            estado_prediccion = "Defectuoso"
            confianza = float(prediction) * 100
        else:
            estado_prediccion = "Aprobado"
            confianza = float(1.0 - prediction) * 100
            
        return {
            "status": "success",
            "prediccion": estado_prediccion,
            "confianza": round(confianza, 2),
            "archivo_analizado": archivo.filename
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }