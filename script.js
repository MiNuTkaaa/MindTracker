// ===== Full script.js for MindTracker =====

const content = document.getElementById('content');
const btnRate = document.getElementById('btnRate');
const btnProgress = document.getElementById('btnProgress');
const modal = document.getElementById('modal');
const categoryNameInput = document.getElementById('categoryName');
const colorOptions = document.getElementById('colorOptions');
const cancelCategoryBtn = document.getElementById('cancelCategory');
const saveCategoryBtn = document.getElementById('saveCategory');
const pointModal = document.getElementById('pointModal');
const pointNameInput = document.getElementById('pointName');
const cancelPointBtn = document.getElementById('cancelPointBtn');
const savePointBtn = document.getElementById('savePointBtn');

let selectedColor = '#3b82f6'; // Default color
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategoryIdForPoint = null;
let recordRatings = {}; // { categoryId: { pointIndex: rating } }

function closeRecordDayModal() {
  const modal = document.getElementById('recordDayModal');
  if (modal) modal.style.display = 'none';
}

function submitRatings() {
  const today = new Date().toISOString().split('T')[0]; // e.g. '2025-07-17'

  // Load existing records
  const existing = JSON.parse(localStorage.getItem('dailyRatings') || '{}');

  // Prevent duplicate entry
  if (existing[today]) {
    alert('You already recorded today. Try again tomorrow!');
    return;
  }

  // Save new entry
  existing[today] = recordRatings;
  localStorage.setItem('dailyRatings', JSON.stringify(existing));

  alert('✅ Day recorded!');
  closeRecordDayModal();
}

function openRecordDayModal() {
  const modal = document.getElementById('recordDayModal');
  const content = document.getElementById('recordDayContent');
  content.innerHTML = ''; // Clear previous content
  recordRatings = {};

  if (!categories || categories.length === 0) {
    content.innerHTML = `<p><em>No categories available. Please create a category first.</em></p>`;
    modal.style.display = 'flex';
    return;
  }

  categories.forEach(cat => {
    // Create container for category
    const catDiv = document.createElement('div');
    catDiv.style.marginBottom = '20px';

    const catTitle = document.createElement('h3');
    catTitle.textContent = cat.name;
    catTitle.style.color = cat.color;
    catDiv.appendChild(catTitle);

    if (cat.points.length === 0) {
      const noPoints = document.createElement('em');
      noPoints.textContent = 'No points to rate.';
      catDiv.appendChild(noPoints);
    } else {
      cat.points.forEach((point, index) => {
        const pointRow = document.createElement('div');
        pointRow.style.display = 'flex';
        pointRow.style.alignItems = 'center';
        pointRow.style.justifyContent = 'space-between';
        pointRow.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = point.name;
        label.style.flex = '1';
        label.style.marginRight = '12px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 10;
        slider.value = 5; // default middle value
        slider.style.flex = '1 1 150px';
        slider.style.marginRight = '8px';

        const numberDisplay = document.createElement('span');
        numberDisplay.textContent = slider.value;
        numberDisplay.style.minWidth = '20px';
        numberDisplay.style.textAlign = 'center';

        slider.addEventListener('input', () => {
          numberDisplay.textContent = slider.value;
          if (!recordRatings[cat.id]) recordRatings[cat.id] = {};
          recordRatings[cat.id][index] = Number(slider.value);
        });

        // Initialize rating state
        if (!recordRatings[cat.id]) recordRatings[cat.id] = {};
        recordRatings[cat.id][index] = Number(slider.value);

        pointRow.appendChild(label);
        pointRow.appendChild(slider);
        pointRow.appendChild(numberDisplay);

        catDiv.appendChild(pointRow);
      });
    }

    content.appendChild(catDiv);
  });

  modal.style.display = 'flex';


  // Attach event handlers to modal buttons
  document.getElementById('cancelRecordDayBtn').onclick = () => {
    modal.style.display = 'none';
  };

  document.getElementById('saveRecordDayBtn').onclick = () => {
    modal.style.display = 'none';
    // Here you can save recordRatings to localStorage or process as needed
    console.log('Saved Ratings:', recordRatings);
    alert('Day recorded! (Save logic not yet implemented)');
  };
}


function openPointModal(catId) {
  currentCategoryIdForPoint = catId;
  pointNameInput.value = '';
  pointModal.style.display = 'flex';
}

function closePointModal() {
  pointModal.style.display = 'none';
}

cancelPointBtn.addEventListener('click', closePointModal);

savePointBtn.addEventListener('click', () => {
  const pointName = pointNameInput.value.trim();
  if (!pointName) {
    alert('Point name is required!');
    return;
  }
  const catIndex = categories.findIndex(c => c.id === currentCategoryIdForPoint);
  if (catIndex === -1) {
    alert('Category not found.');
    return;
  }
  categories[catIndex].points.push({ id: Date.now(), name: pointName });
  closePointModal();
  renderCategories();
});

function highlightSelectedColor() {
  const circles = document.querySelectorAll('.color-circle');
  circles.forEach(c => {
    if (c.dataset.color === selectedColor) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });
}

function saveToLocalStorage() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function renderRateMyself() {
  content.innerHTML = `
    <h1>📝 Rate Myself</h1>
    <button id="createCategoryBtn" style="
  background: #4a67ff;
  color: white;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: background 0.3s ease;
">
  + Create a Category
</button>

<button id="recordDayBtn" style="
        background: #1abc9c;
        color: white;
        font-weight: 600;
        font-size: 16px;
        padding: 12px 24px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background 0.3s ease;
      ">
        📅 Record a Day
      </button>
    </div>

    <div id="categoriesList" style="margin-top:20px;"></div>
  `;

  document.getElementById('createCategoryBtn').addEventListener('click', openModal);
  document.getElementById('recordDayBtn').addEventListener('click', openRecordDayModal);
  renderCategories();
}

function renderMyProgress() {
  content.innerHTML = `
    <h1>📈 My Progress</h1>

    <!-- Bar Chart & Filters -->
<div style="width: 90%; max-width: 800px; margin: 0 auto;">
  <div style="margin-bottom: 12px;">
    <label for="dateRange1" style="color: white; font-weight: bold;">📅 Time Range (Points):</label>
    <select id="dateRange1" style="padding: 6px 12px; border-radius: 6px; background-color: #222; color: white;">
      <option value="week">Last Week</option>
      <option value="month" selected>Last Month</option>
      <option value="year">Last Year</option>
    </select>
  </div>
  <div id="pointProgressChart" style="height: 400px;">
    <canvas id="chart2"></canvas>
  </div>
</div>

<!-- Life Wheel Chart & Filters -->
<div style="width: 90%; max-width: 600px; margin: 40px auto 0;">
  <div style="margin-bottom: 12px;">
    <label for="dateRange2" style="color: white; font-weight: bold;">📅 Time Range (Categories):</label>
    <select id="dateRange2" style="padding: 6px 12px; border-radius: 6px; background-color: #222; color: white;">
      <option value="week">Last Week</option>
      <option value="month" selected>Last Month</option>
      <option value="year">Last Year</option>
    </select>
  </div>
  <div id="totalProgressChart" style="height: 600px;">
    <canvas id="chart1"></canvas>
  </div>
</div>



    </div>

    <!-- Show Past Ratings Button -->
    <button id="togglePastRatingsBtn" style="
      background: #4a67ff;
      color: white;
      font-weight: 600;
      font-size: 16px;
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      transition: background 0.3s ease;
      margin-bottom: 16px;
    ">📊 Show Past Ratings</button>

    <!-- Past Ratings Display -->
    <div id="pastRatingsDisplay" style="display: none; margin-top: 20px; color: #fff;"></div>
  `;
let chartInstances = {};

function setupChartFilters(chartId, dateRangeId, pointFilterId) {
  const dateSelect = document.getElementById(dateRangeId);
  const pointFilter = document.getElementById(pointFilterId);

  dateSelect.addEventListener("change", () => renderChart(chartId, dateSelect.value));
  
  renderChart(chartId, dateSelect.value); // initial render
}

function renderChart(chartId, dateRange) {
  const ctx = document.getElementById(chartId).getContext("2d");

  const data = prepareChartData(chartId, dateRange);

  // Destroy previous chart if it exists
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
  }

  // Determine chart type based on ID
  const chartType = chartId === "chart1" ? "polarArea" : "bar";

  chartInstances[chartId] = new Chart(ctx, {
    type: chartType,
    data: {
      labels: data.labels,
      datasets: [{
        label: chartType === 'bar' ? 'Point Averages' : 'Category Averages',
        data: data.values,
        backgroundColor: data.colors,
        borderColor: data.colors,
        borderWidth: chartType === 'bar' ? 1 : 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#f7f7ff" // your theme color
          }
        }
      },
      scales: chartType === "bar" ? {
        x: {
          ticks: { color: "#f7f7ff" },
          grid: { color: "#444" }
        },
        y: {
          beginAtZero: true,
          max: 10,
          ticks: { color: "#f7f7ff" },
          grid: { color: "#444" }
        }
      } : {} // no scales needed for polarArea
    }
  });
}


function prepareChartData(chartId, range) {
  const stored = JSON.parse(localStorage.getItem('dailyRatings') || '{}');
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  console.log("Loaded ratings:", stored);

  const today = new Date();
  const cutoffDate = new Date(today);

  if (range === "week") cutoffDate.setDate(today.getDate() - 7);
  else if (range === "month") cutoffDate.setMonth(today.getMonth() - 1);
  else if (range === "year") cutoffDate.setFullYear(today.getFullYear() - 1);

  const filteredDates = Object.keys(stored).filter(dateStr => {
    const date = new Date(dateStr);
    return date >= cutoffDate;
  });

  const pointSums = {};
  const pointCounts = {};
  const categorySums = {};
  const categoryCounts = {};

  filteredDates.forEach(date => {
    const dayData = stored[date];
    Object.entries(dayData).forEach(([catId, ratings]) => {
      const category = categories.find(c => String(c.id) === String(catId));
      if (!category) return;

      // For bar chart
      Object.entries(ratings).forEach(([pointIndex, value]) => {
        const point = category.points?.[pointIndex];
        if (!point) return;

        const key = `${category.name} - ${point.name}`;
        pointSums[key] = (pointSums[key] || 0) + value;
        pointCounts[key] = (pointCounts[key] || 0) + 1;
      });

      // For radar chart
      const catKey = category.name;
      const avg = Object.values(ratings).reduce((sum, v) => sum + v, 0) / Object.values(ratings).length;
      categorySums[catKey] = (categorySums[catKey] || 0) + avg;
      categoryCounts[catKey] = (categoryCounts[catKey] || 0) + 1;
    });
  });

  if (chartId === "chart2") {
    const labels = Object.keys(pointSums);
    const values = labels.map(key => (pointSums[key] / pointCounts[key]).toFixed(2));
    const colors = labels.map((_, i) => `hsl(${(i * 45) % 360}, 70%, 60%)`);

    return { labels, values, colors };
  } else {
    const labels = Object.keys(categorySums);
    const values = labels.map(key => (categorySums[key] / categoryCounts[key]).toFixed(2));
    const colors = labels.map((_, i) => `hsl(${(i * 60) % 360}, 80%, 60%)`);

    return { labels, values, colors };
  }
}

  // Add event listener AFTER rendering button
  const toggleBtn = document.getElementById("togglePastRatingsBtn");
  toggleBtn.addEventListener("click", togglePastRatings);

  setupChartFilters("chart2", "dateRange1"); // bar chart (points)
  setupChartFilters("chart1", "dateRange2"); // polar area chart (categories)
}

function getStoredRatings() {
  const raw = localStorage.getItem("dailyRatings");
  return raw ? JSON.parse(raw) : [];
}

function filterRatingsByDate(ratings, range) {
  const now = new Date();
  let startDate;

  switch (range) {
    case "week":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "year":
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return ratings; // Custom not handled yet
  }

  return ratings.filter(r => new Date(r.date) >= startDate);
}

function computeAverages(ratings) {
  const pointSums = {};
  const pointCounts = {};

  ratings.forEach(entry => {
    entry.entries.forEach(cat => {
      cat.points.forEach(p => {
        const key = `${cat.categoryName}__${p.name}`;
        if (!pointSums[key]) {
          pointSums[key] = 0;
          pointCounts[key] = 0;
        }
        pointSums[key] += p.value;
        pointCounts[key] += 1;
      });
    });
  });

  const results = [];
  for (const key in pointSums) {
    const [categoryName, pointName] = key.split("__");
    const average = pointSums[key] / pointCounts[key];
    results.push({ categoryName, pointName, average });
  }
  return results;
}

function renderCharts() {
  const pointCanvas = document.getElementById('chart2');
  const totalCanvas = document.getElementById('chart1');

  if (!pointCanvas || !totalCanvas) {
    console.error("Canvas elements not found");
    return;
  }

  const pointCtx = pointCanvas.getContext('2d');
  const totalCtx = totalCanvas.getContext('2d');

  const range1 = document.getElementById("dateRange1")?.value || "month";
  const range2 = document.getElementById("dateRange2")?.value || "month";

  const pointData = prepareChartData("chart2", range1);
  const totalData = prepareChartData("chart1", range2);

  if (window.chart1) window.chart1.destroy();
  if (window.chart2) window.chart2.destroy();

  window.chart2 = new Chart(pointCtx, {
    type: 'bar',
    data: {
      labels: pointData.labels,
      datasets: [{
        label: 'Point Averages',
        data: pointData.values,
        backgroundColor: pointData.colors,
        borderRadius: 5,
        barThickness: 40,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { top: 10, bottom: 30 }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: { stepSize: 1, color: "#fff" },
          grid: { color: "#444" }
        },
        x: {
          ticks: { color: "#fff" },
          grid: { color: "#444" }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  window.chart1 = new Chart(totalCtx, {
    type: 'polarArea',  // <-- This is the key change!
    data: {
      labels: totalData.labels,
      datasets: [{
        label: 'Category Averages',
        data: totalData.values,
        backgroundColor: totalData.colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      }
    }
  });
}

function togglePastRatings() {
  const container = document.getElementById("pastRatingsDisplay");
  const button = document.getElementById("togglePastRatingsBtn");

  if (container.style.display === "none") {
    // Make sure categories is loaded globally here, e.g.:
    categories = JSON.parse(localStorage.getItem('categories')) || [];

    showPastRatings();
    container.style.display = "block";
    button.textContent = "❌ Hide Past Ratings";
  } else {
    container.innerHTML = "";
    container.style.display = "none";
    button.textContent = "📊 Show Past Ratings";
  }
}

function showPastRatings() {
  const pastRatingsDiv = document.getElementById("pastRatingsDisplay");
  pastRatingsDiv.innerHTML = '';

  const stored = JSON.parse(localStorage.getItem('dailyRatings') || '{}');
  const dates = Object.keys(stored).sort().reverse();

  if (dates.length === 0) {
    pastRatingsDiv.innerHTML = '<p><em>No past ratings found.</em></p>';
    return;
  }

  dates.forEach(dateKey => {
    const formattedDate = formatDate(dateKey);
    const dateBlock = document.createElement('div');
    dateBlock.style.marginBottom = '24px';
    dateBlock.style.padding = '16px';
    dateBlock.style.background = '#2a2a2a';
    dateBlock.style.borderRadius = '12px';
    dateBlock.style.position = 'relative';

    // Date heading container (date + delete button)
    const headingContainer = document.createElement('div');
    headingContainer.style.display = 'flex';
    headingContainer.style.justifyContent = 'space-between';
    headingContainer.style.alignItems = 'center';
    headingContainer.style.marginBottom = '12px';

    const heading = document.createElement('h3');
    heading.textContent = `📅 ${formattedDate}`;
    heading.style.margin = 0;

    // Delete Day Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Delete Day';
    deleteBtn.style.background = '#ff4a4a';
    deleteBtn.style.border = 'none';
    deleteBtn.style.color = 'white';
    deleteBtn.style.borderRadius = '6px';
    deleteBtn.style.padding = '6px 12px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '14px';

    deleteBtn.onclick = () => {
      if (confirm(`Are you sure you want to delete all ratings for ${formattedDate}?`)) {
        // Remove this date from storage
        delete stored[dateKey];
        localStorage.setItem('dailyRatings', JSON.stringify(stored));
        // Refresh list
        showPastRatings();
      }
    };

    headingContainer.appendChild(heading);
    headingContainer.appendChild(deleteBtn);
    dateBlock.appendChild(headingContainer);

    const dayData = stored[dateKey];

    Object.entries(dayData).forEach(([catId, ratings]) => {
      const category = categories.find(c => String(c.id) === String(catId));
      const catName = category?.name || 'Unknown Category';
      const catColor = category?.color || '#888';

      // Category header with color dot
      const catHeader = document.createElement('h4');
      catHeader.style.display = 'flex';
      catHeader.style.alignItems = 'center';
      catHeader.style.marginTop = '8px';
      catHeader.style.marginBottom = '6px';

      const colorDot = document.createElement('span');
      colorDot.style.display = 'inline-block';
      colorDot.style.width = '16px';
      colorDot.style.height = '16px';
      colorDot.style.borderRadius = '50%';
      colorDot.style.backgroundColor = catColor;
      colorDot.style.border = '2px solid #44475a';
      colorDot.style.marginRight = '8px';

      catHeader.appendChild(colorDot);
      catHeader.appendChild(document.createTextNode(catName));
      dateBlock.appendChild(catHeader);

      const ul = document.createElement('ul');
      ul.style.paddingLeft = '20px';

      Object.entries(ratings).forEach(([pointIndex, value]) => {
        const pointName = category?.points?.[pointIndex]?.name || `Point ${parseInt(pointIndex) + 1}`;
        const li = document.createElement('li');
        li.textContent = `${pointName}: ${value}/10`;
        ul.appendChild(li);
      });

      dateBlock.appendChild(ul);
    });

    pastRatingsDiv.appendChild(dateBlock);
  });
}

function formatDate(dateStr) {
  // dateStr expected format "yyyy-mm-dd"
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}


function openModal() {
  categoryNameInput.value = '';
  selectedColor = '#3b82f6';
  highlightSelectedColor();
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

function highlightSelectedColor() {
  const circles = colorOptions.querySelectorAll('.color-circle');
  circles.forEach(c => {
    c.style.border = (c.dataset.color === selectedColor) ? '2px solid #000' : '2px solid transparent';
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
  categories.push({ id: Date.now(), name, color: selectedColor, points: [], open: true });
  saveToLocalStorage();
  closeModal();
  renderCategories();
});

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function renderCategories() {
  const container = document.getElementById('categoriesList');
  if (!container) return;

  container.innerHTML = '';



  container.innerHTML += categories.map(cat => `
    <div style="
      border: 1px solid #555766; 
      border-radius: 8px; 
      margin-bottom: 12px; 
      background: #1e1e2f; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      color: #f7f7ff;
      font-family: system-ui, sans-serif;
    ">
      <button 
        style="
          width: 100%; 
          text-align: left; 
          padding: 12px 16px; 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          font-weight: 600; 
          background: none; 
          border: none; 
          cursor: pointer;
          color: #f7f7ff;
          font-size: 16px;
        "
        onclick="toggleCategory(${cat.id})"
      >
        <span style="
          width: 16px; 
          height: 16px; 
          border-radius: 50%; 
          background: ${cat.color}; 
          display: inline-block;
          flex-shrink: 0;
          border: 2px solid #44475a;
        "></span>
        ${cat.name}
        <span style="margin-left: auto; font-size: 18px;">${cat.open ? '▲' : '▼'}</span>
      </button>
      <div id="points-${cat.id}" style="
        padding: 0 16px 12px 42px; 
        display: ${cat.open ? 'block' : 'none'}; 
        font-size: 14px;
        color: #c8c8d1;
        font-family: system-ui, sans-serif;
      ">
        ${cat.points.length === 0 ? '<em>No points yet.</em>' : cat.points.map((p, i) => `
          <div style="
            margin-bottom: 6px; 
            padding: 4px 8px; 
            background: #292a3d; 
            border-radius: 4px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
          ">
            <span>${p.name}</span>
            <div>
              <button onclick="editPoint(${cat.id}, ${i})" style="
                margin-right: 4px; 
                font-size: 12px;
                background: #4a67ff; 
                color: white;
                border: none; 
                border-radius: 4px; 
                padding: 4px 8px; 
                cursor: pointer;
              ">✏️</button>
              <button onclick="deletePoint(${cat.id}, ${i})" style="
                font-size: 12px;
                background: #ff4a4a; 
                color: white;
                border: none; 
                border-radius: 4px; 
                padding: 4px 8px; 
                cursor: pointer;
              ">🗑️</button>
            </div>
          </div>
        `).join('')}
        <button 
          onclick="openPointModal(${cat.id})"
          style="
            margin-top: 8px; 
            background: #4a67ff; 
            color: white; 
            border: none; 
            border-radius: 5px; 
            padding: 8px 16px; 
            cursor: pointer;
            font-size: 14px;
            display: block;
            width: fit-content;
          "
        >+ Create a Point</button>
        <div style="margin-top: 6px; display: flex; gap: 8px; flex-wrap: wrap;">
          <button onclick="editCategory(${cat.id})" style="
            font-size: 12px; 
            background: #4a67ff; 
            color: white;
            border: none; 
            border-radius: 4px; 
            padding: 6px 10px;
            cursor: pointer;
          ">✏️ Edit Category</button>
          <button onclick="deleteCategory(${cat.id})" style="
            font-size: 12px; 
            background: #ff4a4a; 
            color: white;
            border: none; 
            border-radius: 4px; 
            padding: 6px 10px;
            cursor: pointer;
          ">🗑️ Delete Category</button>
        </div>
      </div>
    </div>
  `).join('');

  saveCategories();
}

window.toggleCategory = function(id) {
  categories = categories.map(cat => {
    if (cat.id === id) cat.open = !cat.open;
    return cat;
  });
  renderCategories();
};

window.editCategory = function(id) {
  const category = categories.find(cat => cat.id === id);
  const newName = prompt("Edit category name:", category.name);
  if (newName !== null && newName.trim() !== '') {
    category.name = newName.trim();
    renderCategories();
  }
};

window.deleteCategory = function(id) {
  if (confirm("Are you sure you want to delete this category and all its points?")) {
    categories = categories.filter(cat => cat.id !== id);
    renderCategories();
  }
};

window.editPoint = function(catId, pointIndex) {
  const category = categories.find(cat => cat.id === catId);
  const newPointName = prompt("Edit point name:", category.points[pointIndex].name);
  if (newPointName !== null && newPointName.trim() !== '') {
    category.points[pointIndex].name = newPointName.trim();
    renderCategories();
  }
};

window.deletePoint = function(catId, pointIndex) {
  const category = categories.find(cat => cat.id === catId);
  if (confirm(`Are you sure you want to delete the point "${category.points[pointIndex].name}"?`)) {
    category.points.splice(pointIndex, 1);
    renderCategories();
  }
};

window.recordDay = function(catId) {
  alert("Recording for category ID: " + catId);
  // Placeholder for modal logic / slider grading system
};

function openCreateCategoryModal() {
  alert("Open create category modal");
}

renderCategories();

function renderPointSlider(categoryId, point) {
  return `
    <div class="point-block">
      <label class="point-name">${point.name}</label>
      <input type="range" min="1" max="10" value="${point.value}" class="slider" 
        oninput="updateSliderValue(this, ${categoryId}, ${point.id})">
      <span class="slider-value">${point.value}</span>
    </div>
  `;
}

window.updateSliderValue = function(slider, categoryId, pointId) {
  const value = slider.value;
  const category = categories.find(c => c.id === categoryId);
  const point = category.points.find(p => p.id === pointId);
  point.value = value;
  const valueDisplay = slider.nextElementSibling;
  valueDisplay.textContent = value;
  saveToLocalStorage();
};

window.toggleCategory = function(id) {
  categories = categories.map(cat => {
    if (cat.id === id) cat.open = !cat.open;
    return cat;
  });
  saveToLocalStorage();
  renderCategories();
};

window.addPoint = function(categoryId) {
  const pointName = prompt('Enter point name:');
  if (!pointName) return;
  const category = categories.find(c => c.id === categoryId);
  category.points.push({ id: Date.now(), name: pointName, value: 5 });
  saveToLocalStorage();
  renderCategories();
};

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

document.addEventListener('DOMContentLoaded', () => {
  const colorCircles = document.querySelectorAll('.color-circle');
  colorCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      selectedColor = circle.dataset.color;
      highlightSelectedColor();
    });
  });

  highlightSelectedColor(); // Ensure one is selected by default
});

// Initial load
btnRate.click();