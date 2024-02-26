const colorOptions = ['#FF5733', '#3498DB', '#27AE60', '#F1C40F', '#9B59B6', '#ffff'];

let showColorOptions = true;
let selectedColor = null;
let originalColor = [];
let isEditing = false;

function handleCellClick(event) {
  if (event.detail === 2 && !isEditing) { // Check for double click
    isEditing = true;
    const cell = event.target.closest('td');

    // Remove any existing color options from the cell
    cell.querySelectorAll('.color-options').forEach((div) => div.remove());

    cell.contentEditable = true;
    cell.focus(); // Set focus to the cell
    cell.addEventListener('blur', handleCellBlur); // Add event listener for losing focus
  } else if (event.target.classList.contains('color-button')) {
    showColorOptions = true;
    const cell = event.target.closest('td');
    originalColor = cell.style.backgroundColor;
    cell.style.backgroundColor = selectedColor;
  }
}

function handleCellBlur(event) {
  const cell = event.target;
  cell.contentEditable = false;
  isEditing = false;
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

// **Modified handleTextInput function:**
function handleTextInput(event) {
  const cell = event.target;

  // **Only show color options once when the cell becomes empty:**
  if (cell.textContent.trim() === '' && showColorOptions) {
    const colorOptionsDiv = createColorOptionsDiv(cell.dataset.row, cell.dataset.col);
    cell.appendChild(colorOptionsDiv);
    showColorOptions = false; // Hide color options for subsequent keystrokes
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
  const cell = document.querySelector(`td[data-row="<span class="math-inline">\{rowIndex\}"\]\[data\-col\="</span>{colIndex}"]`);
  cell.style.backgroundColor = color;
  localStorage.setItem(`cell-<span class="math-inline">\{rowIndex\}\-</span>{colIndex}`, color);
}

function createTable() {
  const table = document.createElement('table');
  table.classList.add('table');

  const tbody = document.createElement('tbody');

  for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
    const tr = document.createElement('tr');

    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const td = document.createElement('td');
      td.dataset.row = rowIndex;
      td.dataset.col = colIndex;
      td.addEventListener('click', handleCellClick);
      td.addEventListener('mouseenter', handleMouseEnter);
      td.addEventListener('mouseleave', handleMouseLeave);

      const originalColor = localStorage.getItem(`cell-${rowIndex}-${colIndex}`);
      if (originalColor) {
        td.style.backgroundColor = originalColor;
      }

      if (showColorOptions) {
        const colorOptionsDiv = createColorOptionsDiv(rowIndex, colIndex);
        td.appendChild(colorOptionsDiv);
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
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
