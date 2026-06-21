import time
import random

def procesar_imagen_cnn(archivo):
    """
    Aquí es donde en el futuro se carga el modelo .tflite o .h5
    Por ahora, simulamos el procesamiento de los tensores.
    """
    time.sleep(1.5)
    
    prediccion = random.choice(["Aprobado", "Defectuoso"])
    confianza = round(random.uniform(92.5, 99.8), 2)
    
    return {
        "status": "success",
        "prediccion": prediccion,
        "confianza": confianza,
        "archivo_analizado": archivo.filename
    }