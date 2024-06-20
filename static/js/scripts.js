// calculator.test.js
const { JSDOM } = require('jsdom');
global.fetch = require('jest-fetch-mock');

describe('Funcionalidad de la calculadora', () => {
  let document;
  let window;
  let display;

  beforeEach(() => {
    const dom = new JSDOM(`
      <html>
        <body>
          <input type="text" id="display" value="">
          <script>
            // Funciones simuladas de la calculadora
            window.appendCharacter = function(character) {
              const currentValue = display.value;

              // Limitar la cantidad de dígitos enteros a 9 y decimales a 5
              const integerDigits = currentValue.split('.')[0].length;
              const decimalDigits = currentValue.split('.')[1] ? currentValue.split('.')[1].length : 0;

              if (
                (/\d/.test(character) && integerDigits < 9) ||  // Permitir dígitos si no se alcanzó el límite de enteros
                (character === '.' && decimalDigits < 5) ||     // Permitir punto decimal si no se alcanzó el límite de decimales
                /[+\-*/]/.test(character)                       // Permitir operadores siempre
              ) {
                display.value += character;
              }
            };

            window.clearDisplay = function() {
              display.value = '';
            };

            window.backspace = function() {
              display.value = display.value.slice(0, -1);
            };

            window.calculateResult = async function() {
              const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: \`expression=\${encodeURIComponent(display.value)}\`,
              });
              const data = await response.json();
              if (data.result === 'Infinity') {
                display.value = 'Error';
              } else {
                display.value = data.result;
              }
            };
          </script>
        </body>
      </html>
    `, { runScripts: 'dangerously' });

    window = dom.window;
    document = window.document;
    display = document.getElementById('display');
  });

  test('debería limitar dígitos enteros a 9 y decimales a 5', () => {
    // Prueba agregar dígitos
    display.value = '123456789';  // 9 dígitos enteros
    window.appendCharacter('1');  // Intentar agregar otro dígito
    expect(display.value).toBe('123456789');  // No debería cambiar

    // Prueba agregar punto decimal y dígitos después
    display.value = '123.45678';  // 3 dígitos enteros, 5 decimales
    window.appendCharacter('9');  // Intentar agregar otro dígito decimal
    expect(display.value).toBe('123.45678');  // No debería cambiar

    // Prueba agregar otro dígito después de 9 enteros
    display.value = '123456789';  // 9 dígitos enteros
    window.appendCharacter('0');
    expect(display.value).toBe('123456789');  // No debería cambiar

    // Prueba agregar más de 5 decimales
    display.value = '123.456';  // 3 dígitos enteros, 3 decimales
    window.appendCharacter('78901');
    expect(display.value).toBe('123.45678');  // Debería agregar solo hasta 5 decimales
  });

  test('debería manejar números decimales correctamente', () => {
    // Prueba agregar número decimal dentro de los límites
    display.value = '123';  // Comienza con un entero
    window.appendCharacter('.');
    window.appendCharacter('4');
    window.appendCharacter('5');
    window.appendCharacter('6');
    window.appendCharacter('7');
    window.appendCharacter('8');
    expect(display.value).toBe('123.45678');  // Debería agregar hasta 5 decimales

    // Prueba agregar más de 5 decimales después de un punto
    display.value = '123.456';  // 3 dígitos enteros, 3 decimales
    window.appendCharacter('78901');
    expect(display.value).toBe('123.45678');  // Debería agregar solo hasta 5 decimales
  });

});
