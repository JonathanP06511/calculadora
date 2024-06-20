document.addEventListener('DOMContentLoaded', (event) => {
  const display = document.getElementById('display');

  window.appendCharacter = function(character) {
      const currentValue = display.value;
      if (currentValue.length >= 20) {
          return;  // No agregar más caracteres si la longitud de la expresión es 20 o más
      }

      const lastChar = currentValue.slice(-1);
      const isOperator = /[+\-*/]/.test(character);
      const lastIsOperator = /[+\-*/]/.test(lastChar);

      if (isOperator && lastIsOperator) {
          return;  // No permitir operadores consecutivos
      }

      const lastOperand = currentValue.split(/[+\-*/]/).pop();

      if (/\d/.test(character) || (character === '.' && lastOperand.indexOf('.') === -1) || /[+\-*/()]/.test(character)) {
          const integerDigits = lastOperand.split('.')[0].length;
          const decimalDigits = lastOperand.split('.')[1] ? lastOperand.split('.')[1].length : 0;

          if (/[+\-*/()]/.test(character)) {
              if (character === '(') {
                  display.value += character;
              } else if (character === ')') {
                  const openParens = (currentValue.match(/\(/g) || []).length;
                  const closeParens = (currentValue.match(/\)/g) || []).length;
                  if (openParens > closeParens && !/[+\-*/]$/.test(currentValue)) {
                      display.value += character;
                  }
              } else if (character === '-' && (currentValue === '' || /[+\-*/(]$/.test(currentValue))) {
                  display.value += character;
              } else if (!/[+\-*/]$/.test(currentValue) && currentValue !== '') {
                  display.value += character;
              }
          } else if (lastOperand.includes('.')) {
              if (decimalDigits < 5) {
                  display.value += character;
              }
          } else {
              if (integerDigits < 9 || (integerDigits < 10 && character === '.')) {
                  display.value += character;
              }
          }
      }
  };

  window.clearDisplay = function() {
      display.value = '';
  };

  window.backspace = function() {
      display.value = display.value.slice(0, -1);
  };

  window.calculateResult = function() {
      const expression = display.value;
      fetch('/calculate', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `expression=${encodeURIComponent(expression)}`,
      })
      .then(response => response.json())
      .then(data => {
          display.value = data.result;
      })
      .catch(error => {
          display.value = 'Error';
      });
  };
});