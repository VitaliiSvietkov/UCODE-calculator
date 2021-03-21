let signChange = 1; // used to change sign by clicking the ±
let calcMode = 'dec';
let systemMode = 10;

// Set events on buttons
function setHandlers() {
  let arr = document.getElementsByClassName('btn');
  for (let i = 0; i < arr.length; ++i) {
    if (!excludeNonOperation(arr[i]))
      arr[i].addEventListener('click', appendElement);
  }
}

function toggleSign() {
  let input = document.getElementById('input');
  if (!isNaN(+input.innerHTML)) {
    +input.innerHTML < 0 ? input.innerHTML = input.innerHTML.slice(1) : input.innerHTML = '-' + input.innerHTML;
  }
  else
    signChange *= -1;
}

function excludeNonOperation(data) {
  return /[=±˅xA-Z]/gi.test(data.innerHTML);
}

// Make the content of pressed button be added to the input field
// ===============================================================
function appendElement(event) {
  if (calcMode === 'convert')
    return;
  let input = document.getElementById('input').innerHTML;
  let number = event.target.innerHTML;
  if (number === '%' && (/%$/g.test(input) || input === '0' || /[\+\-×÷]$/g.test(input)))
    return;
  if (/[\+\-×÷]$/g.test(document.getElementById('input').innerHTML) && /[\+\-×÷]$/g.test(number))
    return;
  if (document.getElementById('input').innerHTML === '0' && systemMode !== 2)
    document.getElementById('input').innerHTML = '';
  document.getElementById('input').innerHTML += number;
}
function append(sym) {
  let input = document.getElementById('input').innerHTML;
  if (sym === '√') {
    if (input === '0')
      document.getElementById('input').innerHTML = '√';
    else if (/[0-9]$/g.test(document.getElementById('input').innerHTML))
      return;
  }
  if (sym === '^' && document.getElementById('input').innerHTML.length < 1)
    return;
  if (/[!^√]$/g.test(document.getElementById('input').innerHTML) && /[!^√]$/g.test(sym))
      return;
  if (sym !== undefined)
      document.getElementById('input').innerHTML += sym;
}
// ===============================================================

// Clear/remove from input field or history
// ===============================================================
function fieldClear() {
  if (calcMode === 'convert')
    document.getElementById('initial').value = '';
  let input = document.getElementById('input');
  let history = document.getElementById('history');
  localStorage.clear();
  clearHistory();
  if (input.innerHTML === '0')
    history.innerHTML = '';
  else
    input.innerHTML = '0';
  signChange = 1;
}
function inputDelete() {
  let input = document.getElementById('input').innerHTML;
  if (input.length > 1 && input !== '0')
    document.getElementById('input').innerHTML = input.slice(0, input.length - 1);
  else
    document.getElementById('input').innerHTML = '0';
}
// ===============================================================

// Display the calculation result in the input field and change history
// ===============================================================
function isInt(x) {
  return x % 1 === 0 ? true : false;
}
function result() {
  localStorage.clear();
  clearHistory();
  let input = document.getElementById('input');
  let history = document.getElementById('history');
  if (input.innerHTML !== '0' && calcMode !== 'convert') {
    let res = calculate(input.innerHTML);
    if (!isInt(res))
      res = res.toFixed(4);
    res = res.toString(systemMode);
    let str = input.innerHTML.toString() + "=" + res;
    localStorage.setItem(localStorage.length.toString(), str);
    addToHistory(str);
    input.innerHTML = res;
  }
  if (calcMode === 'convert') {
    performConvert();
  }
  signChange = 1;
}

function calculate(input) {
  let numbersArr = [], operationsArr = [];
  parseData(input, numbersArr, operationsArr);
  performPriority(numbersArr, operationsArr);
  let res = numbersArr[0];
  numbersArr.shift();
  for (const val of operationsArr) {
    switch (val) {
      case '+':
        res = add(res, numbersArr[0]);
        numbersArr.shift();
        break;
      case '-':
        res = subtract(res, numbersArr[0]);
        numbersArr.shift();
        break;
      case '×':
        res = mul(res, numbersArr[0]);
        numbersArr.shift();
        break;
      case '÷':
        res = divide(res, numbersArr[0]);
        numbersArr.shift();
        break;
      default:
        return undefined;
    }
  }
  if (systemMode === 10)
    return res * signChange;
  else
    return +res >>> 0;
}
// ===============================================================

// Get operands and operations
// ===============================================================
function parseData(str, numbersArr, operationsArr) {
  let number = '';
  let root = false;
  for (let i = 0; i < str.length; ++i) {
    if (str[i] === '%') {
        number = percent(number).toString();
        continue;
    }
    else if (str[i] === '!') {
        number = factorial(number).toString();
        continue;
    }
    else if (str[i] === '√') {
        root = true;
        continue;
    }
    if (!/[\+\-×÷^]/g.test(str[i]))
        number = number.concat('', str[i]);
    else {
      if (number === '')
        number = number.concat('', str[i]);
      else {
        if (root) {
            number = sqrt(number);
            root = false;
        }
        numbersArr.push(+number);
        operationsArr.push(str[i])
        number = '';
      }
    }
  }
  if (number !== '') {
      if (root)
          number = sqrt(number);
      numbersArr.push(+number);
  }
}
// ===============================================================

// Calculate mul, div etc first
// ===============================================================
function performPriority(numbersArr, operationsArr) {
  performPriorityCreative(numbersArr, operationsArr);
  let i = 0;
  let res = 0;
  for (let j = 0; j < operationsArr.length; ++j) {
    switch (operationsArr[j]) {
      case '×':
        res = mul(numbersArr[i], numbersArr[i + 1]);
        numbersArr.splice(i, 2, res);
        operationsArr.splice(j, 1);
        j--;
        i--;
        break;
      case '÷':
        res = divide(numbersArr[i], numbersArr[i + 1]);
        numbersArr.splice(i, 2, res);
        operationsArr.splice(j, 1);
        j--;
        i--;
        break;
      default:
        break;
    }
    i++;
  }
}
function performPriorityCreative(numbersArr, operationsArr) {
    let i = 0;
    let res = 0;
    for (let j = 0; j < operationsArr.length; ++j) {
        switch (operationsArr[j]) {
            case '^':
                res = exponent(numbersArr[i], numbersArr[i + 1]);
                numbersArr.splice(i, 2, res);
                operationsArr.splice(j, 1);
                j--;
                i--;
                break;
            default:
                break;
        }
        i++;
    }
}
// ===============================================================

// Calc functions
// ===============================================================
function add(a, b) {
  if (a !== undefined && b !== undefined) {
    a = convertToSystem(a, systemMode);
    b = convertToSystem(b, systemMode);
    return a + b;
  }
}

function subtract(a, b) {
  if (a !== undefined && b !== undefined) {
    a = convertToSystem(a, systemMode);
    b = convertToSystem(b, systemMode);
    return a - b;
  }
}

function mul(a, b) {
  if (a !== undefined && b !== undefined) {
    a = convertToSystem(a, systemMode);
    b = convertToSystem(b, systemMode);
    return a * b;
  }
}

function divide(a, b) {
  if (a !== undefined && b !== undefined) {
    a = convertToSystem(a, systemMode);
    b = convertToSystem(b, systemMode);
    return a / b;
  }
}

function percent(number) {
  if (number !== undefined) {
    if (typeof number === 'string')
      number = +number;
    return number / 100;
  }
}
// ===============================================================
