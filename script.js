const xlsx = require('xlsx'); // Assumindo que você instalou a biblioteca xlsx

const colorOptions = ['#FF5733', '#3498DB', '#27AE60', '#F1C40F', '#9B59B6'];

let showColorOptions = true;
let selectedColor = null;
let originalColor = [];

function handleCellClick(event) {
  if (event.target.classList.contains('color-button')) {
    showColorOptions = true;
    const cell = event.target.closest('td');
    originalColor = cell.style.backgroundColor;
    cell.style.backgroundColor = selectedColor;
  }
}

function handleMouseEnter(event) {
  const cell = event.target.closest('td');
  cell.classList.add('active');
  showColorOptions = true;
}

function handleMouseLeave() {
  const cell = event.target.closest('td');
  cell.classList.remove('active');
  showColorOptions = false;
}

function handleColorChange(color, rowIndex, colIndex) {
  selectedColor = color;
  const cell = document.querySelector(`td[data-row="${rowIndex}"][data-col="${colIndex}"]`);
  cell.style.backgroundColor = color;
  localStorage.setItem(`cell-${rowIndex}-${colIndex}`, color);
}

async function createTable() {
  const table = document.createElement('table');
  table.classList.add('table');

  const tbody = document.createElement('tbody');

  try {
    const workbook = await xlsx.readFile('Cronograma.xlsx');
    const sheetName = 'Planilha1'; // Substitua pelo nome real da planilha
    const sheet = workbook.Sheets[sheetName];

    const data = [];

    for (let row = 1; row <= sheet['!ref'].split(':')[1].row; row++) {
      const rowData = [];
      for (let col = 1; col <= sheet['!ref'].split(':')[1].col; col++) {
        const cell = sheet[`${col}${row}`];
        rowData.push(cell ? cell.v : '');
      }
      data.push(rowData);
    }

    // Popular a tabela com os dados do Excel
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const tr = document.createElement('tr');

      for (let colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
        const td = document.createElement('td');
        td.textContent = data[rowIndex][colIndex];
        // Adicione os event listeners existentes e a lógica relacionada à cor
        // ...
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }
  } catch (error) {
    console.error('Erro ao ler o arquivo Excel:', error);
    // Manipule o erro de forma adequada, por exemplo, exiba uma mensagem de erro para o usuário
  }

  table.appendChild(tbody);
  return table;
}

function createColorOptionsDiv(rowIndex, colIndex) {
  const colorOptionsDiv = document.createElement('div');
  colorOptionsDiv.classList.add('color-options', 'active');

  colorOptions.forEach((color) => {
    const colorButton = document.createElement('button');
    colorButton.classList.add('color-button');
    colorButton.style.backgroundColor = color;
    colorButton.addEventListener('click', () => handleColorChange(color, rowIndex, colIndex));
    colorOptionsDiv.appendChild(colorButton);
  });

  return colorOptionsDiv;
}

const table = createTable();
document.body.appendChild(table);
