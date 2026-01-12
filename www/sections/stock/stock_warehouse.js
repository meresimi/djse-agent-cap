// sections/stock/stock_warehouse.js (FULLY FUNCTIONAL VERSION)

console.log("✅ stock/stock_warehouse.js loaded");

export default `
<section id='warehouse'>
  <h2>Warehouse Stock</h2>

  <!-- Summary Card with Animation -->
  <div class='card summary-card' style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; animation: fadeIn 0.5s ease-in;">
    <h3 style="color: white; margin-top: 0;">📊 Current Stock Summary</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Bags</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="whTotalBags">0</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Weight</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="whTotalWeight">0.00 kg</div>
      </div>
    </div>
  </div>

  <!-- Search & Filter Card -->
  <div class='card' style="animation: fadeIn 0.5s ease-in 0.1s both;">
    <h3>🔍 Search & Filter</h3>
    <input type="search" id="whSearch" placeholder="Search by serial or farmer..." 
           style="width:100%;padding:12px;margin-bottom:10px;font-size:1rem;border-radius:8px;border:2px solid #e0e0e0;transition:all 0.3s;">
  </div>

  <!-- Stock List Card -->
  <div class='card' style="animation: fadeIn 0.5s ease-in 0.2s both;">
    <h3>🏚️ Warehouse Stock</h3>
    
    <div id="warehouseContent">
      <!-- Loading state will be inserted here -->
    </div>
  </div>

  <!-- Dispatch Modal with Animation -->
  <div id="dispatchModal" class="overlayForm hidden" style="animation: fadeIn 0.3s ease-in;">
    <div class="miniForm" style="animation: slideUp 0.3s ease-out; max-width: 400px;">
      <h3>🚢 Dispatch to Ship</h3>
      
      <p id="dispatchBagInfo" style="margin-bottom:15px; padding:12px; background:#f0f9f6; border-radius:6px;"></p>
      
      <label>Select Vessel</label>
      <select id="dispatchVesselSelect" style="padding:10px; font-size:1rem;">
        <option value="">-- Select Vessel --</option>
      </select>
      
      <label>Dispatch Date</label>
      <input type="date" id="dispatchDate" style="padding:10px; font-size:1rem;">
      
      <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn primary" id="dispatchSaveBtn" style="min-width:100px;">🚢 Dispatch</button>
        <button class="btn" id="dispatchCancelBtn" style="min-width:100px;">❌ Cancel</button>
      </div>
    </div>
  </div>
</section>

<style>
/* Smooth Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Mobile-Optimized Stock Items */
.stock-item-mobile {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stock-item-mobile:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.stock-item-mobile:hover {
  border-color: #007c65;
  box-shadow: 0 4px 8px rgba(0,124,101,0.2);
}

.stock-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stock-serial {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007c65;
}

.stock-weight {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.stock-farmer {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 8px;
}

.stock-date {
  font-size: 0.85rem;
  color: #999;
}

.dispatch-btn-mobile {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  font-size: 1rem;
  min-height: 48px; /* Better touch target */
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dispatch-btn-mobile:active {
  transform: scale(0.95);
}

/* Loading Spinner */
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: fadeIn 0.3s ease-in;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007c65;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-in;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.empty-message {
  font-size: 0.95rem;
  color: #999;
  line-height: 1.5;
}

/* Search Input Enhancement */
#whSearch:focus {
  border-color: #007c65;
  box-shadow: 0 0 0 3px rgba(0,124,101,0.1);
  outline: none;
}

/* Responsive Design */
@media (max-width: 600px) {
  .stock-item-mobile {
    padding: 12px;
  }
  
  .stock-serial {
    font-size: 1rem;
  }
  
  .stock-weight {
    font-size: 1.1rem;
  }
  
  .summary-card h3 {
    font-size: 1.1rem;
  }
  
  .summary-card > div > div {
    padding: 12px;
  }
  
  .summary-card > div > div > div:first-child {
    font-size: 0.85rem;
  }
  
  .summary-card > div > div > div:last-child {
    font-size: 1.5rem;
  }
}
</style>
`;

// ⚠️ CRITICAL FIX: Init function name MUST match app.js expectation
window.initStockWarehouseSection = async function () {
  console.log("✅ initStockWarehouseSection() running...");

  const tbody = document.getElementById("whTbody");
  const searchInput = document.getElementById("whSearch");
  const totalBagsEl = document.getElementById("whTotalBags");
  const totalWeightEl = document.getElementById("whTotalWeight");
  
  const modal = document.getElementById("dispatchModal");
  const vesselSelect = document.getElementById("dispatchVesselSelect");
  const dispatchDate = document.getElementById("dispatchDate");
  const dispatchInfo = document.getElementById("dispatchBagInfo");
  const dispatchSaveBtn = document.getElementById("dispatchSaveBtn");
  const dispatchCancelBtn = document.getElementById("dispatchCancelBtn");

  let warehouse = [];
  let vessels = [];
  let selectedBag = null;

  // Load warehouse stock
  try {
    const data = await window.Storage.loadJSON("warehouse.json");
    warehouse = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Failed to load warehouse.json:", e);
    warehouse = [];
  }

  // Load vessels for dispatch
  try {
    const vData = await window.Storage.loadJSON("vessels.json");
    vessels = Array.isArray(vData) ? vData : [];
  } catch (e) {
    console.error("Failed to load vessels.json:", e);
    vessels = [];
  }

  // Populate vessel dropdown
  vesselSelect.innerHTML = '<option value="">-- Select Vessel --</option>';
  vessels.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = v.name;
    vesselSelect.appendChild(opt);
  });

  // Set default dispatch date to today
  const today = new Date().toISOString().split('T')[0];
  dispatchDate.value = today;

  // ==========================================
  // RENDER TABLE
  // ==========================================
  function renderWarehouse() {
    const content = document.getElementById("warehouseContent");
    
    if (!content) return;

    // Show loading state
    content.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
        <p style="color:#666;margin-top:10px;">Loading warehouse stock...</p>
      </div>
    `;

    // Simulate brief loading for smooth UX (can remove in production)
    setTimeout(() => {
      if (!warehouse.length) {
        // Empty state
        content.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <div class="empty-title">No Stock in Warehouse</div>
            <div class="empty-message">
              Warehouse is currently empty.<br>
              Move items from Pending Goods Receivable<br>
              or create new purchases to add stock.
            </div>
          </div>
        `;
        totalBagsEl.textContent = "0";
        totalWeightEl.textContent = "0.00 kg";
        return;
      }

      // Calculate totals with animation
      let totalBags = warehouse.length;
      let totalWeight = warehouse.reduce((sum, b) => sum + (Number(b.weight) || 0), 0);

      // Animate numbers
      animateNumber(totalBagsEl, totalBags);
      animateNumber(totalWeightEl, totalWeight, true);

      // Filter by search
      const term = (searchInput.value || "").toLowerCase().trim();
      let filtered = warehouse;
      
      if (term) {
        filtered = warehouse.filter(b =>
          (b.serial || "").toLowerCase().includes(term) ||
          (b.farmer || "").toLowerCase().includes(term)
        );
      }

      if (!filtered.length) {
        // No search results
        content.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <div class="empty-title">No Results Found</div>
            <div class="empty-message">
              No bags match your search: "<strong>${term}</strong>"<br>
              Try different keywords or clear the search.
            </div>
          </div>
        `;
        return;
      }

      // Render as mobile-optimized cards
      let html = '<div style="animation: fadeIn 0.5s ease-in;">';
      
      filtered.forEach((bag, index) => {
        const dateStr = bag.date ? new Date(bag.date).toLocaleDateString() : "-";
        const animationDelay = Math.min(index * 0.05, 0.5); // Stagger animation
        
        html += `
          <div class="stock-item-mobile" style="animation: slideUp 0.4s ease-out ${animationDelay}s both;">
            <div class="stock-item-header">
              <div class="stock-serial">📦 ${bag.serial || "-"}</div>
              <div class="stock-weight">${(Number(bag.weight) || 0).toFixed(2)} kg</div>
            </div>
            <div class="stock-farmer">👨‍🌾 ${bag.farmer || "Unknown"}</div>
            <div class="stock-date">📅 ${dateStr}</div>
            <button class="btn primary dispatch-btn-mobile" data-id="${bag.id}">
              🚢 Dispatch to Ship
            </button>
          </div>
        `;
      });
      
      html += '</div>';
      content.innerHTML = html;

      // Attach dispatch button handlers
      content.querySelectorAll("button[data-id]").forEach(btn => {
        btn.onclick = () => {
          // Add haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(10);
          }
          openDispatchModal(btn.dataset.id);
        };
      });
    }, 300);
  }

  // ==========================================
  // NUMBER ANIMATION
  // ==========================================
  function animateNumber(element, targetValue, isDecimal = false) {
    const duration = 800; // ms
    const steps = 30;
    const increment = targetValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      
      if (step >= steps) {
        current = targetValue;
        clearInterval(timer);
      }

      if (isDecimal) {
        element.textContent = current.toFixed(2) + " kg";
      } else {
        element.textContent = Math.round(current);
      }
    }, duration / steps);
  }

  // Search handler
  searchInput.oninput = renderWarehouse;

  // Initial render
  renderWarehouse();

  // ==========================================
  // DISPATCH MODAL
  // ==========================================
  function openDispatchModal(bagId) {
    selectedBag = warehouse.find(b => b.id === bagId);
    if (!selectedBag) return;

    dispatchInfo.innerHTML = `
      <strong>Bag:</strong> ${selectedBag.serial || "N/A"}<br>
      <strong>Farmer:</strong> ${selectedBag.farmer || "N/A"}<br>
      <strong>Weight:</strong> ${(Number(selectedBag.weight) || 0).toFixed(2)} kg
    `;

    modal.classList.remove("hidden");
  }

  dispatchCancelBtn.onclick = () => {
    modal.classList.add("hidden");
    selectedBag = null;
  };

  dispatchSaveBtn.onclick = async () => {
    if (!selectedBag) return;

    const vesselId = vesselSelect.value;
    if (!vesselId) {
      alert("Please select a vessel.");
      return;
    }

    // ⚠️ FIX #6: Add confirmation dialog
    const vessel = vessels.find(v => v.id === vesselId);
    const vesselName = vessel ? vessel.name : vesselId;
    
    const confirmMsg = `Dispatch bag ${selectedBag.serial || "N/A"} (${AppUtils.formatWeight(selectedBag.weight)}) to ${vesselName}?\n\nThis action cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    // Create dispatch record
    let dispatched = await window.Storage.loadJSON("dispatched.json");
    if (!Array.isArray(dispatched)) dispatched = [];

    dispatched.push({
      id: `DISP-${Date.now()}`,
      date: dispatchDate.value,
      serial: selectedBag.serial,
      farmer: selectedBag.farmer,
      weight: selectedBag.weight,
      vessel: vesselName,
      vesselId: vesselId,
      warehouseId: selectedBag.id
    });

    await window.Storage.saveJSON("dispatched.json", dispatched);

    // Remove from warehouse
    warehouse = warehouse.filter(b => b.id !== selectedBag.id);
    await window.Storage.saveJSON("warehouse.json", warehouse);

    modal.classList.add("hidden");
    selectedBag = null;

    alert(`Bag ${selectedBag.serial || "N/A"} dispatched to ${vesselName}`);
    renderWarehouse();
  };
};