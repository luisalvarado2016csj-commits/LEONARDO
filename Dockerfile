FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar archivos
COPY . .

# Cambiar directorio de trabajo al backend donde está app.py
WORKDIR /app/backend

# Exponer el puerto para Hugging Face
EXPOSE 7860

# Comando para ejecutar Flask con Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app", "--timeout", "120"]
