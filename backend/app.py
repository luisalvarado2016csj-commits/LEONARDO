from flask import Flask
from flask_cors import CORS
from routes.api import api_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return "🚀 El motor de Inteligencia Artificial está corriendo al 100%"
if __name__ == '__main__':
    print("Servidor DEVIOZ iniciando en http://127.0.0.1:5000")
    app.run(debug=True, port=5000)