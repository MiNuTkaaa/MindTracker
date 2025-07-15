// Initial screen load
const app = document.getElementById('app');
const rateBtn = document.getElementById('rateBtn');
const progressBtn = document.getElementById('progressBtn');

function loadRateMyself() {
  app.innerHTML = `
    <section class="p-4">
      <h1 class="text-2xl font-bold mb-4">Rate Myself</h1>
      <button id="createCategoryBtn" class="bg-blue-600 px-4 py-2 rounded flex items-center gap-2">
        <span>➕</span> Create a Category
      </button>
      <!-- Categories will appear here -->
      <div id="categoryList" class="mt-4 space-y-2"></div>
    </section>
  `;
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

rateBtn.addEventListener('click', loadRateMyself);
progressBtn.addEventListener('click', loadMyProgress);

// Load default screen
loadRateMyself();
