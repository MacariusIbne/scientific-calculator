const display = document.getElementById('display');

function appendValue(val) {
  display.value += val;
}

function appendOperator(op) {
  display.value += op;
}

function appendFunction(fn) {
  display.value += fn + '('; // opening parenthesis; function
}

function appendConstant(c) {
  display.value += c;
}

function clearDisplay() {
  display.value = '';
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  let expr = display.value;

  // Replace π with Math.PI
  expr = expr.replace(/π/g, 'Math.PI');

  // Convert degrees to radians for sin, cos, and tan
  expr = expr.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
  expr = expr.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
  expr = expr.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');

  // Math functions
  expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
  expr = expr.replace(/log\(/g, 'Math.log10('); // base-10
  expr = expr.replace(/ln\(/g, 'Math.log(');     // natural log (base e)

  // Power operator
  expr = expr.replace(/\^/g, '**');

  // Evaluate the expression safely
  try {
    let result = eval(expr);
    display.value = result;
  } catch (error) {
    display.value = "Error";
  }
}
const isDegreeMode = true; // Default to degree mode
  try {
    const result = eval(expr);
    display.value = (result === Infinity) ? 'Error' : result;
  } catch {
    display.value = 'Error';
    setTimeout(() => display.value = '', 1500);
  }

  function toggleAngleMode() {
  isDegreeMode = !isDegreeMode;
  const modeBtn = document.getElementById('angle-mode-btn');
  modeBtn.textContent = isDegreeMode ? "Deg" : "Rad";
}
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  const themeButton = document.getElementById('theme-button');
  themeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

function saveToHistory(expression, result) {
  const entry = { expression, result };
  const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  history.unshift(entry); // Potential entry: correct or failure/error or null
  if (history.length > 10) {
    history.pop(); // Remove oldest entry
  }
  localStorage.setItem('calcHistory', JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  console.log('Calculation History:', history); // Debugging 
  return history;
}

function exportHistoryToFile() {
  const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  const json = JSON.stringify(history, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'history.json';
  link.click();

  URL.revokeObjectURL(url);
}

function importHistoryFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedHistory = JSON.parse(e.target.result);
      if (Array.isArray(importedHistory)) {
        localStorage.setItem('calcHistory', JSON.stringify(importedHistory));
        alert('History successfully imported!');
      } else {
        alert('Invalid history file format.');
      }
    } catch (err) {
      alert('Error reading history file.');
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
  const themeButton = document.getElementById('theme-button');
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    themeButton.textContent = 'Light Mode';
  } else {
    themeButton.textContent = 'Dark Mode';
  }

  // Load history on page load
  loadHistory();
});

function saveToHistory(expression, result) {
  const entry = {
    expression,
    result,
    lastEdited: new Date().toISOString()  // timestamp; last revision
  };
  const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  history.unshift(entry);
  if (history.length > 10) {
    history.pop();
  }
  localStorage.setItem('calcHistory', JSON.stringify(history));
}
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
  const historyPanel = document.getElementById('history-panel');
  historyPanel.innerHTML = ''; // Clear existing history

  history.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'history-entry';
    entryDiv.textContent = `${entry.expression} = ${entry.result} (Last edited: ${new Date(entry.lastEdited).toLocaleString()})`;
    historyPanel.appendChild(entryDiv);
  });
}

function clearHistory() {
  localStorage.removeItem('calcHistory');
  loadHistory(); // Refresh the history display
}

document.getElementById('export-button').addEventListener('click', exportHistoryToFile);
document.getElementById('import-button').addEventListener('change', importHistoryFromFile, false);
  saveToHistory(display.value, result);
  loadHistory();
