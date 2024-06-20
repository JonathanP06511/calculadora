import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        expression = request.form['expression']
        # Verificar longitud de la expresión antes de evaluarla
        if len(expression) > 20:
            return jsonify(result='Error: La expresión es demasiado larga')
        result = eval(expression)
        return jsonify(result=str(result))
    except Exception as e:
        return jsonify(result='Error')

# Elimina el bloque "if __name__ == '__main__':"
port = int(os.environ.get("PORT", 5000))  # Utiliza el puerto predeterminado de Heroku (5000)
app.run(debug=True, host='0.0.0.0', port=port)  # Cambia host a '0.0.0.0' para que sea accesible desde cualquier dirección
