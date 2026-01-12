// ------------------------------------------------------------
// purchases.js — ENHANCED UI VERSION (2-COLUMN CARDS)
// ✅ Modern design with 2x2 card grid layout
// ------------------------------------------------------------

console.log("✅ purchases.js (ENHANCED 2-COLUMN) loaded");

export default `
<section id="purchases">
  <h2>📊 Purchase Records</h2>

  <!-- Summary Cards - 2 Column Grid -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
    
    <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Total Purchases</div>
      <div style="font-size: 2rem; font-weight: bold;" id="totalPurchaseCount">0</div>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Total Weight</div>
      <div style="font-size: 2rem; font-weight: bold;" id="totalPurchaseWeight">0 kg</div>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Total Value</div>
      <div style="font-size: 2rem; font-weight: bold;" id="totalPurchaseValue">$ 0</div>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Unique Farmers</div>
      <div style="font-size: 2rem; font-weight: bold;" id="uniqueFarmersCount">0</div>
    </div>
  </div>

  <!-- Actions & Filters Card -->
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
      <h3 style="margin: 0;">Purchase History</h3>
      <button onclick="window.loadSection('newpurchase')" class="btn primary" style="padding: 10px 20px;">
        ➕ New Purchase
      </button>
    </div>

    <!-- Filter Controls -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
      
      <div>
        <label style="font-size: 0.85rem; color: #666; margin-bottom: 4px; display: block;">🔍 Search</label>
        <input 
          type="search" 
          id="purchaseSearch" 
          placeholder="Farmer, CPV, Station..." 
          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;"
        >
      </div>

      <div>
        <label style="font-size: 0.85rem; color: #666; margin-bottom: 4px; display: block;">👨‍🌾 Farmer</label>
        <select id="farmerFilter" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
          <option value="">All Farmers</option>
        </select>
      </div>

      <div>
        <label style="font-size: 0.85rem; color: #666; margin-bottom: 4px; display: block;">📅 From Date</label>
        <input type="date" id="startDateFilter" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
      </div>

      <div>
        <label style="font-size: 0.85rem; color: #666; margin-bottom: 4px; display: block;">📅 To Date</label>
        <input type="date" id="endDateFilter" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
      </div>
    </div>

    <!-- Quick Filter Chips -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 15px;">
      <button class="btn small" id="filterToday">Today</button>
      <button class="btn small" id="filterWeek">This Week</button>
      <button class="btn small" id="filterMonth">This Month</button>
      <button class="btn small" id="clearFilters">Clear Filters</button>
      <button class="btn small" id="exportPurchases" style="margin-left: auto;">📥 Export CSV</button>
    </div>

    <!-- Results Info -->
    <div style="padding: 10px; background: #f0f9f6; border-radius: 6px; margin-bottom: 15px;">
      <p style="margin: 0; font-size: 0.9rem;">
        <strong>Showing:</strong> <span id="filteredCount">0</span> of <span id="totalCount">0</span> purchases
      </p>
    </div>

    <!-- Purchase Table -->
    <div class="scrollTable" style="max-height: 600px;">
      <table class="data-table" id="purchasesTable">
        <thead>
          <tr>
            <th style="cursor: pointer;" data-sort="cpvNumber">CPV # ↕</th>
            <th>Pic</th>
            <th style="cursor: pointer;" data-sort="date">Date ↕</th>
            <th>Time</th>
            <th style="cursor: pointer;" data-sort="farmerName">Farmer ↕</th>
            <th>Station</th>
            <th>Agent</th>
            <th style="cursor: pointer;" data-sort="totalWeight">Weight ↕</th>
            <th style="cursor: pointer;" data-sort="totalAmount">Amount ↕</th>
          </tr>
        </thead>
        <tbody id="purchasesTbody">
          <tr>
            <td colspan="9" style="text-align:center;color:#777;padding:30px;">
              <div style="font-size: 3rem; margin-bottom: 10px;">📋</div>
              <div>Loading purchases...</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Enhanced Detail Modal -->
  <div id="purchaseDetailModal" class="modalOverlay hidden">
    <div class="modalCard" style="max-width: 900px;">
      <div class="modalHeader" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin: -15px -15px 15px -15px; border-radius: 12px 12px 0 0;">
        <h3 style="margin: 0; color: white;">Purchase Details</h3>
        <button class="closeBtn" id="purchaseDetailClose" style="color: white; font-size: 1.8rem;">&times;</button>
      </div>
      <div id="purchaseDetailBody" style="max-height: 70vh; overflow-y: auto;"></div>
    </div>
  </div>
</section>
`;

// ------------------------------------------------------------
// ENHANCED INITIALIZER
// ------------------------------------------------------------
window.initPurchasesSection = async function () {
  console.log("✅ initPurchasesSection() ENHANCED 2-COLUMN running...");

  const tbody = document.getElementById("purchasesTbody");
  const modal = document.getElementById("purchaseDetailModal");
  const modalClose = document.getElementById("purchaseDetailClose");
  const detailBody = document.getElementById("purchaseDetailBody");

  // Summary elements
  const totalCountEl = document.getElementById("totalPurchaseCount");
  const totalWeightEl = document.getElementById("totalPurchaseWeight");
  const totalValueEl = document.getElementById("totalPurchaseValue");
  const uniqueFarmersEl = document.getElementById("uniqueFarmersCount");

  // Filter elements
  const searchInput = document.getElementById("purchaseSearch");
  const farmerFilter = document.getElementById("farmerFilter");
  const startDateFilter = document.getElementById("startDateFilter");
  const endDateFilter = document.getElementById("endDateFilter");
  const filteredCountEl = document.getElementById("filteredCount");
  const totalCountInfoEl = document.getElementById("totalCount");

  // Quick filter buttons
  const filterTodayBtn = document.getElementById("filterToday");
  const filterWeekBtn = document.getElementById("filterWeek");
  const filterMonthBtn = document.getElementById("filterMonth");
  const clearFiltersBtn = document.getElementById("clearFilters");
  const exportBtn = document.getElementById("exportPurchases");

  let purchases = [];
  let farmerMap = {};
  let currentSortField = "date";
  let currentSortAsc = false;

  // ---------------------------------------------------
  // Load Data
  // ---------------------------------------------------
  try {
    const farmerList = await Storage.loadJSON("farmers.json");
    farmerList.forEach(f => {
      farmerMap[f.id] = f;
      const opt = document.createElement("option");
      opt.value = f.id;
      opt.textContent = `${f.givenName} ${f.surname}`;
      farmerFilter.appendChild(opt);
    });
  } catch (e) {
    console.warn("Failed to load farmers:", e);
  }

  try {
    const list = await Storage.loadJSON("purchases.json");
    purchases = Array.isArray(list) ? list : [];
  } catch (e) {
    console.warn("Failed to load purchases:", e);
    purchases = [];
  }

  // ---------------------------------------------------
  // Utility Functions
  // ---------------------------------------------------
  function getFarmerName(p) {
    if (p.farmerName && p.farmerName.trim().length > 0) return p.farmerName;
    if (p.farmer && p.farmer.trim().length > 0) return p.farmer;
    if (p.farmerId && farmerMap[p.farmerId]) {
      const f = farmerMap[p.farmerId];
      return `${f.givenName} ${f.surname}`.trim();
    }
    return p.farmerId || "Unknown";
  }

  // ---------------------------------------------------
  // Filter Logic
  // ---------------------------------------------------
  function getFilteredPurchases() {
    let filtered = [...purchases];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(p => {
        const farmerName = getFarmerName(p).toLowerCase();
        const cpv = (p.cpvNumber || "").toLowerCase();
        const station = (p.station || "").toLowerCase();
        const agent = (p.agent || "").toLowerCase();
        
        return farmerName.includes(searchTerm) ||
               cpv.includes(searchTerm) ||
               station.includes(searchTerm) ||
               agent.includes(searchTerm);
      });
    }

    // Farmer filter
    if (farmerFilter.value) {
      filtered = filtered.filter(p => p.farmerId === farmerFilter.value);
    }

    // Date range filter
    if (startDateFilter.value) {
      const startDate = new Date(startDateFilter.value);
      filtered = filtered.filter(p => new Date(p.date) >= startDate);
    }

    if (endDateFilter.value) {
      const endDate = new Date(endDateFilter.value + "T23:59:59");
      filtered = filtered.filter(p => new Date(p.date) <= endDate);
    }

    return filtered;
  }

  // ---------------------------------------------------
  // Sort Logic
  // ---------------------------------------------------
  function sortPurchases(field) {
    if (currentSortField === field) {
      currentSortAsc = !currentSortAsc;
    } else {
      currentSortField = field;
      currentSortAsc = true;
    }
    renderTable();
  }

  // ---------------------------------------------------
  // Update Summary Cards
  // ---------------------------------------------------
  function updateSummary(filtered) {
    const count = filtered.length;
    const totalWeight = filtered.reduce((sum, p) => sum + (Number(p.totalWeight) || 0), 0);
    const totalValue = filtered.reduce((sum, p) => sum + (Number(p.finalPay) || Number(p.totalAmount) || 0), 0);
    const uniqueFarmers = new Set(filtered.map(p => p.farmerId || p.farmerName)).size;

    totalCountEl.textContent = count;
    totalWeightEl.textContent = AppUtils.formatWeight(totalWeight);
    totalValueEl.textContent = AppUtils.formatMoney(totalValue);
    uniqueFarmersEl.textContent = uniqueFarmers;
  }

  // ---------------------------------------------------
  // Render Table
  // ---------------------------------------------------
  function renderTable() {
    tbody.innerHTML = "";
    
    let filtered = getFilteredPurchases();
    
    // Update counts
    totalCountInfoEl.textContent = purchases.length;
    filteredCountEl.textContent = filtered.length;
    updateSummary(filtered);

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center;color:#777;padding:40px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
            <div style="font-size: 1.1rem; margin-bottom: 5px;">No purchases found</div>
            <div style="font-size: 0.9rem; color: #999;">Try adjusting your filters</div>
          </td>
        </tr>`;
      return;
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch(currentSortField) {
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case "cpvNumber":
          aVal = a.cpvNumber || "";
          bVal = b.cpvNumber || "";
          break;
        case "farmerName":
          aVal = getFarmerName(a);
          bVal = getFarmerName(b);
          break;
        case "totalWeight":
          aVal = Number(a.totalWeight) || 0;
          bVal = Number(b.totalWeight) || 0;
          break;
        case "totalAmount":
          aVal = Number(a.finalPay) || Number(a.totalAmount) || 0;
          bVal = Number(b.finalPay) || Number(b.totalAmount) || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return currentSortAsc ? -1 : 1;
      if (aVal > bVal) return currentSortAsc ? 1 : -1;
      return 0;
    });

    // Render rows
    filtered.forEach(p => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.style.transition = "all 0.2s";
      
      const cpvImg = p.cpvImage
        ? `<img src="${p.cpvImage}" class="purchase-thumb" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">`
        : `<div style="width:40px;height:40px;background:#eee;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">📄</div>`;

      const dateObj = new Date(p.date);
      const isToday = dateObj.toDateString() === new Date().toDateString();
      const dateStyle = isToday ? "background:#e8f5e9;font-weight:bold;" : "";

      tr.innerHTML = `
        <td style="${dateStyle}">${p.cpvNumber || "-"}</td>
        <td>${cpvImg}</td>
        <td style="${dateStyle}">${AppUtils.formatDate(p.date)}</td>
        <td>${AppUtils.formatTime(p.date)}</td>
        <td><strong>${getFarmerName(p)}</strong></td>
        <td>${p.station || "-"}</td>
        <td>${p.agent || "-"}</td>
        <td style="text-align:right;">${AppUtils.formatWeight(p.totalWeight)}</td>
        <td style="text-align:right;"><strong>${AppUtils.formatMoney(p.finalPay || p.totalAmount)}</strong></td>
      `;

      tr.onclick = () => openDetail(p);
      
      tr.onmouseenter = () => {
        tr.style.backgroundColor = "#f0f9f6";
        tr.style.transform = "scale(1.01)";
      };
      
      tr.onmouseleave = () => {
        tr.style.backgroundColor = "";
        tr.style.transform = "scale(1)";
      };

      tbody.appendChild(tr);
    });
  }

  // ---------------------------------------------------
  // Enhanced Detail Modal
  // ---------------------------------------------------
  function openDetail(p) {
    const farmerName = getFarmerName(p);

    let html = `
      <div style="padding: 0 15px 15px 15px;">
        
        <!-- Main Info Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
          
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">📅 Date & Time</div>
            <div style="font-size: 1.1rem; font-weight: bold;">${AppUtils.formatDate(p.date)}</div>
            <div style="font-size: 0.9rem; color: #666;">${AppUtils.formatTime(p.date)}</div>
          </div>

          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">👨‍🌾 Farmer</div>
            <div style="font-size: 1.1rem; font-weight: bold;">${farmerName}</div>
            <div style="font-size: 0.9rem; color: #666;">${p.station || "-"}</div>
          </div>

          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">⚖️ Total Weight</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #667eea;">${AppUtils.formatWeight(p.totalWeight)}</div>
          </div>

          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">💰 Total Amount</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #43e97b;">${AppUtils.formatMoney(p.finalPay || p.totalAmount)}</div>
          </div>
        </div>

        <!-- CPV Section -->
        <div style="padding: 15px; background: #fff3cd; border-radius: 8px; margin-bottom: 20px;">
          <div style="font-size: 0.9rem; color: #856404; margin-bottom: 5px;"><strong>📝 CPV Number:</strong></div>
          <div style="font-size: 1.2rem; font-weight: bold; color: #856404;">${p.cpvNumber || "-"}</div>
        </div>
    `;

    // Agent info if present
    if (p.agent) {
      html += `
        <div style="padding: 10px; background: #e3f2fd; border-radius: 6px; margin-bottom: 20px;">
          <strong>Agent:</strong> ${p.agent}
        </div>
      `;
    }

    // Quality Bags
    if (p.bags && p.bags.length > 0) {
      html += `
        <h4 style="margin-top: 25px; margin-bottom: 15px; color: #667eea;">
          🎒 Quality Bags (${p.bags.length})
        </h4>
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
          <table class="data-table" style="margin: 0;">
            <thead style="position: sticky; top: 0; background: #667eea; color: white;">
              <tr>
                <th>#</th>
                <th>Serial Number</th>
                <th style="text-align: right;">Weight</th>
              </tr>
            </thead>
            <tbody>
      `;

      p.bags.forEach((b, idx) => {
        html += `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${b.serial}</strong></td>
            <td style="text-align: right;">${AppUtils.formatWeight(b.weight)}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Unstacked Batches
    if (p.batches && p.batches.length > 0) {
      const totalBatchWeight = p.batches.reduce((sum, b) => sum + (Number(b.weight) || 0), 0);
      
      html += `
        <h4 style="margin-top: 25px; margin-bottom: 15px; color: #f5576c;">
          📦 Unstacked Batches (${p.batches.length}) - Total: ${AppUtils.formatWeight(totalBatchWeight)}
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
      `;

      p.batches.forEach((b, idx) => {
        html += `
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
            <div style="font-size: 0.85rem; color: #666;">Batch ${idx + 1}</div>
            <div style="font-size: 1.2rem; font-weight: bold; color: #f5576c; margin-top: 5px;">
              ${AppUtils.formatWeight(b.weight)}
            </div>
          </div>
        `;
      });

      html += `</div>`;
    }

    // Deduction info if present
    if (p.deductionKg && p.deductionKg > 0) {
      html += `
        <div style="padding: 15px; background: #fff3e0; border-radius: 8px; margin-top: 20px;">
          <div style="font-size: 0.9rem; color: #e65100; margin-bottom: 5px;"><strong>Less Advance Deduction:</strong></div>
          <div style="font-size: 1.1rem; font-weight: bold; color: #e65100;">
            ${AppUtils.formatWeight(p.deductionKg)} = ${AppUtils.formatMoney(p.deductionValue)}
          </div>
        </div>
      `;
    }

    html += `</div>`;

    detailBody.innerHTML = html;
    modal.classList.remove("hidden");
  }

  // ---------------------------------------------------
  // Event Listeners
  // ---------------------------------------------------
  modalClose.onclick = () => modal.classList.add("hidden");
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  };

  // Filter inputs
  searchInput.oninput = renderTable;
  farmerFilter.onchange = renderTable;
  startDateFilter.onchange = renderTable;
  endDateFilter.onchange = renderTable;

  // Quick filters
  filterTodayBtn.onclick = () => {
    const today = new Date().toISOString().split('T')[0];
    startDateFilter.value = today;
    endDateFilter.value = today;
    renderTable();
  };

  filterWeekBtn.onclick = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    startDateFilter.value = weekAgo.toISOString().split('T')[0];
    endDateFilter.value = today.toISOString().split('T')[0];
    renderTable();
  };

  filterMonthBtn.onclick = () => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    startDateFilter.value = monthAgo.toISOString().split('T')[0];
    endDateFilter.value = today.toISOString().split('T')[0];
    renderTable();
  };

  clearFiltersBtn.onclick = () => {
    searchInput.value = "";
    farmerFilter.value = "";
    startDateFilter.value = "";
    endDateFilter.value = "";
    renderTable();
  };

  // Sort headers
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.onclick = () => sortPurchases(th.dataset.sort);
  });

  // Export to CSV
  exportBtn.onclick = () => {
    const filtered = getFilteredPurchases();
    
    if (filtered.length === 0) {
      alert("No purchases to export");
      return;
    }

    let csv = "Date,Time,CPV Number,Farmer,Station,Agent,Total Weight (kg),Total Amount (SBD)\n";
    
    filtered.forEach(p => {
      const row = [
        AppUtils.formatDate(p.date),
        AppUtils.formatTime(p.date),
        p.cpvNumber || "",
        getFarmerName(p),
        p.station || "",
        p.agent || "",
        p.totalWeight || 0,
        p.finalPay || p.totalAmount || 0
      ].map(v => `"${v}"`).join(",");
      
      csv += row + "\n";
    });

    const filename = `jaytatz-purchases-${AppUtils.formatDate(new Date())}.csv`;
    AppUtils.downloadTextFile(csv, filename, 'text/csv');
    alert(`✅ Exported ${filtered.length} purchases to ${filename}`);
  };

  // Initial render
  renderTable();
};
