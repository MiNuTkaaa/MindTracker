const app = document.getElementById('app');
const rateBtn = document.getElementById('rateBtn');
const progressBtn = document.getElementById('progressBtn');

function setActiveTab(activeBtn) {
  [rateBtn, progressBtn].forEach(btn => {
    btn.classList.remove('active-tab');
    btn.querySelector('span:last-child').classList.remove('active-tab');
  });
  activeBtn.classList.add('active-tab');
  activeBtn.querySelector('span:last-child').classList.add('active-tab');
}

rateBtn.addEventListener('click', () => {
  setActiveTab(rateBtn);
  loadRateMyself();
});

progressBtn.addEventListener('click', () => {
  setActiveTab(progressBtn);
  loadMyProgress();
});

function loadRateMyself() {
  app.innerHTML = `
    <h1 class="text-xl font-semibold mb-4">📝 Rate Myself</h1>
    <button class="bg-[#4a67ff] text-white rounded px-4 py-2 hover:bg-blue-700 transition-all">+ Create a Category</button>
    <div class="mt-6 text-sm text-gray-500">No categories yet.</div>
  `;
}

function loadMyProgress() {
  app.innerHTML = `
    <h1 class="text-xl font-semibold mb-4">📊 My Progress</h1>
    <button class="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition-all">📅 Record a Day</button>
    <div class="mt-6 text-sm text-gray-500">Charts will appear here.</div>
  `;
}

setActiveTab(rateBtn);
loadRateMyself();
