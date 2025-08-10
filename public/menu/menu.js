// =================== GLOBAL VARIABLES =================== //
let menuData = [];
let selectedOrderMode = null;
let searchTimeout;

const menuContainer = document.getElementById('menu');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalImg = document.getElementById('modal-img');
const modalDesc = document.getElementById('modal-desc');
const modalIng = document.getElementById('modal-ing');
const modalPrice = document.getElementById('modal-price');
const modalAllergy = document.getElementById('modal-allergy');
const modalSpice = document.getElementById('modal-spice');
const modalPreptime = document.getElementById('modal-preptime');
const modalCalories = document.getElementById('modal-calories');

// =================== FETCH & INITIALIZE =================== //
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const cafe = data.cafe;
    menuData = cafe.menu;
    renderMenu(menuData);
  })
  .catch(error => console.error('Error loading JSON:', error));

// =================== RENDER FUNCTION =================== //
function renderMenu(items) {
  const grid = document.getElementById("menu-list");
  grid.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.item}" class="menu-image">
      <h3>${item.item} - RM ${item.price.toFixed(2)}</h3>
      <p class="click-info">(Click for details)</p>
    `;
    div.onclick = () => openModal(item);
    grid.appendChild(div);
  });
}

// =================== MODAL FUNCTIONS =================== //
function openModal(item) {
  modalTitle.textContent = item.item;
  modalImg.src = item.image;
  modalDesc.textContent = item.description;
  modalIng.textContent = item.ingredients;
  modalPrice.textContent = item.price.toFixed(2);
  modalAllergy.textContent = item.allergy_info || "None";
  modalSpice.textContent = item.spice_level;
  modalPreptime.textContent = item.prep_time;
  modalCalories.textContent = item.calories;
  modal.style.display = 'flex'; // For flex centering
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function (event) {
  if (event.target === modal) {
    closeModal();
  }
}

// =================== FILTER FUNCTION =================== //
function applyFilters() {
  const sort = document.getElementById("sortSelect").value;
  const budget = document.getElementById("budgetRange").value;
  let filtered = [...menuData];

  if (selectedOrderMode) {
    filtered = filtered.filter(item =>
      Array.isArray(item.order_mode)
        ? item.order_mode.includes(selectedOrderMode)
        : item.order_mode === selectedOrderMode
    );
  }

  if (budget > 0) {
    filtered = filtered.filter(item => item.price <= budget);
  }

  const sortMap = {
    priceLow: (a, b) => a.price - b.price,
    priceHigh: (a, b) => b.price - a.price,
    caloriesLow: (a, b) => a.calories - b.calories,
    caloriesHigh: (a, b) => b.calories - a.calories,
    spiceLow: (a, b) => a.spice_level - b.spice_level,
    spiceHigh: (a, b) => b.spice_level - a.spice_level,
    prepTimeLow: (a, b) => a.prep_time - b.prep_time,
    prepTimeHigh: (a, b) => b.prep_time - a.prep_time
  };

  if (sortMap[sort]) {
    filtered.sort(sortMap[sort]);
  }

  renderMenu(filtered);
}

// =================== BUDGET SLIDER =================== //
const budgetRange = document.getElementById('budgetRange');
const budgetValue = document.getElementById('budgetValue');

budgetValue.textContent = budgetRange.value;

budgetRange.addEventListener('input', () => {
  budgetValue.textContent = budgetRange.value;
});

// =================== CATEGORY TABS =================== //
const categoryTabs = document.querySelectorAll(".category-tabs .tab");
const categoryCache = new Map(); // Cache for filtered menu

categoryTabs.forEach(button => {
  button.addEventListener("click", () => {
    categoryTabs.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.id;

    let filteredMenu;
    if (selectedCategory === "All") {
      filteredMenu = menuData; // Show all items
    } else if (categoryCache.has(selectedCategory)) { // Check cache first
      filteredMenu = categoryCache.get(selectedCategory); // Use cached data
    } else {
      filteredMenu = menuData.filter(item => item.category === selectedCategory); // Filter by selected category
      categoryCache.set(selectedCategory, filteredMenu); // Cache the filtered data
    }

    renderMenu(filteredMenu);
  });
});

// =================== ORDER MODE FILTER =================== //
const orderButtons = document.querySelectorAll(".order-btn");

orderButtons.forEach(button => {
  button.addEventListener("click", () => {
    const mode = button.getAttribute("data-type");

    if (selectedOrderMode === mode) {
      selectedOrderMode = null;
      button.classList.remove("active");
    } else {
      selectedOrderMode = mode;
      orderButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    }

    applyFilters();
  });
});

// =================== SEARCH FUNCTION =================== //
document.getElementById("searchInput").addEventListener("input", function () {
  clearTimeout(searchTimeout);
  const query = this.value.trim().toLowerCase();

  searchTimeout = setTimeout(() => {
    const filtered = menuData.filter(item =>
      item.item.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
    renderMenu(filtered);
  }, 400);
});
