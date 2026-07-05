import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.api import api_bp

# Configurar Flask para servir el frontend desde el directorio padre
frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')
app = Flask(__name__, static_folder=frontend_dir, static_url_path='/')
CORS(app)

app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    # Servir el archivo index.html por defecto
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("Servidor iniciando en http://0.0.0.0:7860")
    app.run(host='0.0.0.0', port=7860, debug=True)