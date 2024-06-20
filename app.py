from flask import Flask, render_template, request, jsonify
import re
import os
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

        # Validar que la expresión contenga solo caracteres permitidos
        if not re.match(r'^[\d\.\+\-\*\/\(\) ]+$', expression):
            return jsonify(result='Error: Expresión contiene caracteres no permitidos')

        # Validar cada operando según los requisitos
        def validate_operand(operand):
            # Separar parte entera y decimal
            parts = operand.split('.')
            if len(parts[0]) > 9:
                return f'Parte entera de "{operand}" excede los 9 dígitos'
            if len(parts) > 1 and len(parts[1]) > 5:
                return f'Parte decimal de "{operand}" excede los 5 dígitos'
            return None

        # Encontrar todos los operandos en la expresión
        operands = re.findall(r'\d+\.*\d*', expression)
        
        # Validar cada operando encontrado
        for operand in operands:
            error = validate_operand(operand)
            if error:
                return jsonify(result=f'Error: {error}')

        result = eval(expression)
        return jsonify(result=str(result))

    except Exception as e:
        return jsonify(result='Error')

port = int(os.environ.get("PORT", 5000))
app.run(debug=True, host='0.0.0.0', port=port)
