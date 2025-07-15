const content = document.getElementById('content');
const btnRate = document.getElementById('btnRate');
const btnProgress = document.getElementById('btnProgress');

const modal = document.getElementById('modal');
const categoryNameInput = document.getElementById('categoryName');
const colorOptions = document.getElementById('colorOptions');
const cancelCategoryBtn = document.getElementById('cancelCategory');
const saveCategoryBtn = document.getElementById('saveCategory');

let selectedColor = '#3b82f6'; // default color
let categories = [];

function renderRateMyself() {
  content.innerHTML = `
    <h1>📝 Rate Myself</h1>
    <button id="createCategoryBtn" style="background:#4a67ff; color:white; border:none; border-radius:5px; padding:10px 20px; cursor:pointer;">
      + Create a Category
    </button>
    <div id="categoriesList" style="margin-top:20px;"></div>
  `;

  document.getElementById('createCategoryBtn').addEventListener('click', () => {
    openModal();
  });

  renderCategories();
}

function renderMyProgress() {
  content.innerHTML = `
    <h1>📊 My Progress</h1>
    <button style="background:#22c55e; color:white; border:none; border-radius:5px; padding:10px 20px; cursor:pointer;">
      📅 Record a Day
    </button>
    <p style="margin-top:20px; color:#666;">Charts will appear here.</p>
  `;
}

function openModal() {
  categoryNameInput.value = '';
  selectedColor = '#3b82f6';
  highlightSelectedColor();
  modal.style.display = 'flex';  // <-- must be flex for centering
}

function closeModal() {
  modal.style.display = 'none';
}

function highlightSelectedColor() {
  const circles = colorOptions.querySelectorAll('.color-circle');
  circles.forEach(c => {
    if (c.dataset.color === selectedColor) {
      c.style.border = '2px solid #000';
    } else {
      c.style.border = '2px solid transparent';
    }
  });
}

colorOptions.querySelectorAll('.color-circle').forEach(circle => {
  circle.addEventListener('click', () => {
    selectedColor = circle.dataset.color;
    highlightSelectedColor();
  });
});

cancelCategoryBtn.addEventListener('click', closeModal);

saveCategoryBtn.addEventListener('click', () => {
  const name = categoryNameInput.value.trim();
  if (!name) {
    alert('Category name is required!');
    return;
  }
  // Add new category
  categories.push({ id: Date.now(), name, color: selectedColor, points: [], open: false });
  closeModal();
  renderCategories();
});

function renderCategories() {
  const container = document.getElementById('categoriesList');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div style="border:1px solid #d0d0d0; border-radius:8px; margin-bottom:12px; background:#fff; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
      <button 
        style="width:100%; text-align:left; padding:12px 16px; display:flex; align-items:center; gap:10px; font-weight:600; background:none; border:none; cursor:pointer;"
        onclick="toggleCategory(${cat.id})"
      >
        <span style="width:16px; height:16px; border-radius:50%; background:${cat.color}; display:inline-block;"></span>
        ${cat.name}
        <span style="margin-left:auto;">${cat.open ? '▲' : '▼'}</span>
      </button>
      <div id="points-${cat.id}" style="padding:0 16px 12px 42px; display:${cat.open ? 'block' : 'none'}; color:#666; font-size:14px;">
        ${cat.points.length === 0 ? 'No points yet.' : ''}
      </div>
    </div>
  `).join('');
}

// Toggle category open/close
window.toggleCategory = function(id) {
  categories = categories.map(cat => {
    if (cat.id === id) cat.open = !cat.open;
    return cat;
  });
  renderCategories();
};

// Navigation buttons logic
btnRate.addEventListener('click', () => {
  btnRate.classList.add('active');
  btnProgress.classList.remove('active');
  renderRateMyself();
});

btnProgress.addEventListener('click', () => {
  btnProgress.classList.add('active');
  btnRate.classList.remove('active');
  renderMyProgress();
});

// Initialize app on load
btnRate.click();
