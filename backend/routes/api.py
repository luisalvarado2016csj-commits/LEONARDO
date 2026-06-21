from flask import Blueprint, request, jsonify
from services.model_service import procesar_imagen_cnn

api_bp = Blueprint('api', __name__)

@api_bp.route('/analizar', methods=['POST'])
def analizar():

    if 'imagen' not in request.files:
        return jsonify({"error": "No se encontró la imagen"}), 400
    
    archivo = request.files['imagen']
    if archivo.filename == '':
        return jsonify({"error": "Archivo vacío"}), 400

    resultado = procesar_imagen_cnn(archivo)
    return jsonify(resultado)