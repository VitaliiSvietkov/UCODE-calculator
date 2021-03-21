function expand() {
  if (calcMode === 'convert') {
    calcMode = 'dec';
    systemMode = 10;
    document.getElementById('converter').style.display = 'none';
    document.getElementById('history').style.display = 'flex';
    document.getElementById('input').style.display = 'flex';
  }
  let style = document.getElementById('expand').style;
  if (style.display === 'none' || !style.display) {
    style.display = 'block';
    calcMode = 'dec';
    systemMode = 10;
  }
  else {
    style.display = 'none';
    switchMode('dec');
    systemMode = 10;
  }
}

function exponent(a, b) {
  if (a !== undefined && b !== undefined) {
    if (typeof a === 'string')
      a = +a;
    if (typeof b === 'string')
      b = +b;
    return Math.pow(a, b);
  }
}

function factorial(number) {
  if (number !== undefined) {
    if (typeof number === 'string')
      number = +number;
    if (number < 0)
      return -1;
    else if (number === 0)
      return 1;
    else
      return (number * factorial(number - 1));
  }
}

function sqrt(number) {
  if (number !== undefined) {
    if (typeof number === 'string')
      number = +number;
    return Math.sqrt(number);
  }
}

function convertToSystem(number, system) {
  let res = parseInt(number, system);
  return res;
}

function openConverter() {
  if (document.getElementById('converter').style.display !== 'flex') {
    switchMode('dec');
    systemMode = 10;
    calcMode = 'convert';
    document.getElementById('history').style.display = 'none';
    document.getElementById('input').style.display = 'none';
    document.getElementById('converter').style.display = 'flex';
    document.getElementById('expand').style.display = 'none';
  }
  else {
    calcMode = 'dec';
    systemMode = 10;
    document.getElementById('converter').style.display = 'none';
    document.getElementById('history').style.display = 'flex';
    document.getElementById('input').style.display = 'flex';
  }
}

// Memory functions
// ===============================================================
function memoryRecall() {
  let input = document.getElementById('input').innerHTML;
  if (!/[\+\-×÷!^√]/g.test(input))
    localStorage.setItem('memVal', input);
}
function memoryClear() {
  localStorage.removeItem('memVal');
}
function memoryAdd() {
  let val = localStorage.getItem('memVal');
  if (val !== null) {
    val = +val + +document.getElementById('input').innerHTML;
    localStorage.setItem('memVal', val);
  }
}
function memorySub() {
  let val = localStorage.getItem('memVal');
  if (val !== null) {
    val = +val - +document.getElementById('input').innerHTML;
    localStorage.setItem('memVal', val);
  }
}
// ===============================================================

// Save last operation in local storage
// ===============================================================
function getAllValuesFromLocalStorage() {
  var values = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    values.push(localStorage.getItem(keys[i]));
  }

  return values;
}

let inputDOM = document.getElementById("input");
let historyDOM = document.getElementById("history");

function addToHistory(el) {
  historyDOM.insertAdjacentHTML("beforeend", `<div>${el}<div/>`);
}

function clearHistory() { 
    historyDOM.innerHTML = '';
}

document.addEventListener("DOMContentLoaded", (ev) => {
  getAllValuesFromLocalStorage().forEach((el) => {
    addToHistory(el);
  });
});
// ===============================================================

// Different calc modes
// ===============================================================
function switchMode(id) {
  document.getElementById(calcMode).className = document.getElementById(calcMode).className.replace(' equals', '');
  if (calcMode === id && calcMode !== 'dec') {
    calcMode = 'dec';
    systemMode = 10;
    document.getElementById('dec').className += ' equals';
    return;
  }
  calcMode = id;
  if (id === 'hex')
    systemMode = 16;
  if (id === 'binary')
    systemMode = 2;
  if (id === 'dec')
    systemMode = 10;
  document.getElementById(id).className += ' equals';
}
// ===============================================================

function performConvert() {
  let convertFrom = document.getElementById('initial-unit').selectedOptions[0].value;
  let convertTo = document.getElementById('convert-to-unit').selectedOptions[0].value;
  let input = document.getElementById('initial').value;
  let output = document.getElementById('converted');
  input = conversion(+input, convertFrom, convertTo);
  output.innerHTML = input;
}
function conversion(number, from, to) {
    if (from === 'centimetres') {
      if (to === 'meters')
        return number / 100;
      if (to === 'kilometres')
        return number / 100000;
    }
    if (from === 'meters') {
      if (to === 'centimetres')
        return number * 100;
      if (to === 'kilometres')
        return number / 1000;
    }
    if (from === 'kilometres') {
      if (to === 'centimetres')
        return number * 100000;
      if (to === 'meters')
        return number * 1000;
    }
    if (from === 'grams') {
      if (to === 'kilograms')
        return number / 1000;
      if (to === 'tonnes')
        return number / 1000000;
    }
    if (from === 'kilograms') {
      if (to === 'grams')
        return number * 1000;
      if (to === 'tonnes')
        return number / 1000;
    }
    if (from === 'tonnes') {
      if (to === 'grams')
        return number * 1000000;
      if (to === 'kilograms')
        return number / 1000;
    }
    if (from === 'sq-centimetres') {
      if (to === 'sq-metres')
        return number / 1000;
      if (to === 'sq-kilometres')
        return number / 10000000000;
      if (to === 'hectares')
        return number / 100000000;
    }
    if (from === 'sq-metres') {
      if (to === 'sq-centimetres')
        return number * 10000;
      if (to === 'sq-kilometres')
        return number / 1000000;
      if (to === 'hectares')
        return number / 10000;
    }
    if (from === 'sq-kilometres') {
      if (to === 'sq-centimetres')
        return number * 10000000000;
      if (to === 'sq-metres')
        return number * 1000000;
      if (to === 'hectares')
        return number * 100;
    }
    if (from === 'hectares') {
      if (to === 'sq-centimetres')
        return number * 100000000;
      if (to === 'sq-metres')
        return number * 10000;
      if (to === 'sq-kilometres')
        return number / 100;
    }
    return 'error';
  }
