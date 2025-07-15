// Initial screen load
const app = document.getElementById('app');
const rateBtn = document.getElementById('rateBtn');
const progressBtn = document.getElementById('progressBtn');

function loadRateMyself() {
  app.innerHTML = `
    <h1 class="text-xl font-semibold mb-4">Rate Myself</h1>
    <button id="createCategoryBtn" class="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">+ Create a Category</button>
    <div id="categoryList" class="mt-6 space-y-2"></div>
  `;

  document.getElementById('createCategoryBtn').addEventListener('click', showCategoryModal);
}

function loadMyProgress() {
  app.innerHTML = `
    <section class="p-4">
      <h1 class="text-2xl font-bold mb-4">My Progress</h1>
      <button class="bg-green-600 px-4 py-2 rounded mb-4">📅 Record a Day</button>
      <!-- Charts will be added later -->
      <div class="text-sm text-gray-400">Charts coming soon...</div>
    </section>
  `;
}

function showCategoryModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="bg-white text-gray-900 rounded-lg p-6 w-11/12 max-w-md shadow-xl">
      <h2 class="text-lg font-semibold mb-4">New Category</h2>
      <label class="block mb-2">Category Name</label>
      <input id="categoryNameInput" type="text" class="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. Focus, Mood">

      <label class="block mb-2">Color</label>
      <div class="flex gap-2 mb-4">
        <button class="colorBtn w-6 h-6 rounded-full bg-red-500 border-2 border-transparent" data-color="#ef4444"></button>
        <button class="colorBtn w-6 h-6 rounded-full bg-yellow-500 border-2 border-transparent" data-color="#f59e0b"></button>
        <button class="colorBtn w-6 h-6 rounded-full bg-green-500 border-2 border-transparent" data-color="#10b981"></button>
        <button class="colorBtn w-6 h-6 rounded-full bg-blue-500 border-2 border-transparent" data-color="#3b82f6"></button>
        <button class="colorBtn w-6 h-6 rounded-full bg-purple-500 border-2 border-transparent" data-color="#8b5cf6"></button>
      </div>

      <div class="flex justify-end gap-2">
        <button id="cancelModal" class="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button id="saveCategoryBtn" class="text-sm px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Save</button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Color picker logic
  let selectedColor = "#3b82f6";
  document.querySelectorAll('.colorBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.colorBtn').forEach(b => b.classList.remove('border-gray-900'));
      btn.classList.add('border-gray-900');
      selectedColor = btn.dataset.color;
    });
  });

  document.getElementById('cancelModal').onclick = () => modal.classList.add('hidden');
  document.getElementById('saveCategoryBtn').onclick = () => {
    const name = document.getElementById('categoryNameInput').value.trim();
    if (!name) return alert("Please enter a category name.");

    addCategoryToList(name, selectedColor);
    modal.classList.add('hidden');
  };
}

function addCategoryToList(name, color) {
  const list = document.getElementById('categoryList');
  const id = `cat-${Date.now()}`;
  const categoryHTML = `
    <div class="rounded border border-gray-300">
      <button onclick="toggleCategory('${id}')" class="w-full text-left px-4 py-2 flex items-center justify-between bg-white hover:bg-gray-100">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" style="background-color: ${color};"></span>
          <span class="font-medium">${name}</span>
        </div>
        <span>▼</span>
      </button>
      <div id="${id}" class="px-4 py-2 hidden text-sm text-gray-500">
        No points yet.
      </div>
    </div>
  `;
  list.insertAdjacentHTML('beforeend', categoryHTML);
}

function toggleCategory(id) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
}

rateBtn.addEventListener('click', () => {
  setActiveTab(rateBtn);
  loadRateMyself();
});

progressBtn.addEventListener('click', () => {
  setActiveTab(progressBtn);
  loadMyProgress();
});

function setActiveTab(activeBtn) {
  [rateBtn, progressBtn].forEach(btn => {
    btn.classList.remove('bg-gray-700');
  });
  activeBtn.classList.add('bg-gray-700');
}


// Load default screen
loadRateMyself();
