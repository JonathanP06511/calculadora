// calculator.test.js
const { JSDOM } = require('jsdom');
global.fetch = require('jest-fetch-mock');

describe('Calculator functionality', () => {
  let document;
  let window;
  let display;

  beforeEach(() => {
    const dom = new JSDOM(`
      <html>
        <body>
          <input type="text" id="display" value="">
          <script>
            // Funciones de la calculadora simuladas
            window.appendCharacter = function(character) {
              display.value += character;
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

  test('should append character to display', () => {
    window.appendCharacter('1');
    expect(display.value).toBe('1');

    window.appendCharacter('2');
    expect(display.value).toBe('12');
  });

  test('should clear display', () => {
    display.value = '123';
    window.clearDisplay();
    expect(display.value).toBe('');
  });

  test('should remove last character on backspace', () => {
    display.value = '123';
    window.backspace();
    expect(display.value).toBe('12');
  });

});
