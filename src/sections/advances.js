// ------------------------------------------------------------
// advances.js — ENHANCED UI VERSION
// ✅ Modern design with 2x2 cards, filtering, and analytics
// ------------------------------------------------------------

console.log("✅ advances.js (ENHANCED) loaded");

export default `
<section id="advances">
  <h2>💰 Farmer Advances</h2>

  <!-- Summary Cards - 2 Column Grid -->
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
    
    <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Total Advances</div>
      <div style="font-size: 2rem; font-weight: bold;" id="totalAdvancesCount">0</div>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Total Amount</div>
      <div style="font-size: 2rem; font-weight: bold;" id="totalAdvancesAmount">$ 0</div>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Expected Seaweed</div>
      <div style="font-size: 2rem; font-weight: bold;" id="totalExpectedKg">0 kg</div>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 15px; border-radius: 12px;">
      <div style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 5px;">Active Farmers</div>
      <div style="font-size: 2rem; font-weight: bold;" id="activeFarmersCount">0</div>
    </div>
  </div>

  <!-- Actions & Filters Card -->
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
      <h3 style="margin: 0;">Advances by Farmer</h3>
      <button class="btn primary" id="addAdvanceBtn" style="padding: 10px 20px;">
        ➕ New Advance
      </button>
    </div>

    <!-- Filter Controls -->
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
      <input
        type="search"
        id="advanceSearch"
        placeholder="🔍 Search farmers..."
        style="flex: 1; min-width: 200px; padding: 8px; border: 1px solid #ddd; border-radius: 6px;"
      >
      
      <select id="statusFilter" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; min-width: 150px;">
        <option value="all">All Status</option>
        <option value="due-soon">Due Soon (7 days)</option>
        <option value="overdue">Overdue</option>
      </select>
    </div>

    <!-- Results Info -->
    <div style="padding: 10px; background: #f0f9f6; border-radius: 6px; margin-bottom: 15px;">
      <p style="margin: 0; font-size: 0.9rem;">
        <strong>Showing:</strong> <span id="filteredFarmersCount">0</span> farmers with advances
      </p>
    </div>

    <!-- Farmer Advances List -->
    <div class="scrollTable" style="max-height: 600px;">
      <table class="data-table" id="advanceFarmersTable">
        <thead>
          <tr>
            <th style="cursor: pointer;" data-sort="farmerName">Farmer ↕</th>
            <th style="cursor: pointer;" data-sort="totalAmount">Total Advance ↕</th>
            <th style="cursor: pointer;" data-sort="expectedKg">Expected KG ↕</th>
            <th style="cursor: pointer;" data-sort="nextDue">Next Due ↕</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="advanceFarmersTbody">
          <tr>
            <td colspan="5" style="text-align:center;color:#777;padding:30px;">
              <div style="font-size: 3rem; margin-bottom: 10px;">💰</div>
              <div>Loading advances...</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Farmer Statement Modal -->
  <div id="advanceFarmerModal" class="modalOverlay hidden">
    <div class="modalCard" style="max-width: 900px;">
      <div class="modalHeader" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin: -15px -15px 15px -15px; border-radius: 12px 12px 0 0;">
        <h3 id="advanceFarmerTitle" style="margin: 0; color: white;">Farmer Advances</h3>
        <button class="closeBtn" id="advanceFarmerClose" style="color: white; font-size: 1.8rem;">&times;</button>
      </div>
      <div id="advanceFarmerBody" style="max-height: 70vh; overflow-y: auto;"></div>
    </div>
  </div>

  <!-- Add Cash Advance Modal -->
  <div id="advanceModal" class="overlayForm hidden">
    <div class="miniForm" style="max-width: 400px;">
      <h3 id="advanceFormTitle">💰 Add Cash Advance</h3>

      <!-- DATE & TIME -->
      <label for="advanceDateTime">📅 Date &amp; Time</label>
      <input type="datetime-local" id="advanceDateTime">

      <!-- FARMER -->
      <label for="advanceFarmerSelect">👨‍🌾 Farmer</label>
      <select id="advanceFarmerSelect">
        <option value="">-- Select Farmer --</option>
      </select>

      <!-- AMOUNT + EXPECTED KG -->
      <label for="advanceAmount">💵 Amount (SBD)</label>
      <input type="number" id="advanceAmount" step="0.01" min="0" placeholder="0.00">

      <label for="advanceExpectedKg">⚖️ Expected Dry Seaweed to Repay (kg)</label>
      <input
        type="text"
        id="advanceExpectedKg"
        readonly
        style="font-weight:bold; color:#006400; background:#f0f9f6;"
      >

      <!-- REPAY DATE -->
      <label for="advanceRepayDate">📆 Repay Date (within 7 days)</label>
      <input type="date" id="advanceRepayDate">

      <!-- CAV NUMBER + IMAGE -->
      <label for="advanceCavNumber">📝 CAV Number</label>
      <input type="text" id="advanceCavNumber" placeholder="Enter CAV number">

      <button class="btn" id="advanceCavCaptureBtn" style="width:100%; margin-top:10px;">
        📸 Capture CAV Slip
      </button>

      <div id="advanceCavPreviewContainer" class="hidden" style="margin-top:8px;">
        <p style="margin:4px 0; font-size:0.9rem;"><strong>CAV Image Preview:</strong></p>
        <img
          id="advanceCavPreview"
          src=""
          style="width:100%;max-height:200px;border:1px solid #ccc;border-radius:6px;object-fit:contain;"
        >
      </div>

      <div style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end;">
        <button class="btn primary" id="advanceSaveBtn">💾 Save</button>
        <button class="btn" id="advanceCancelBtn">❌ Cancel</button>
      </div>
    </div>
  </div>
</section>
`;

// ------------------------------------------------------------
// ENHANCED INITIALIZER
// ------------------------------------------------------------
window.initAdvancesSection = async function () {
  console.log("✅ initAdvancesSection() ENHANCED running...");

  // Summary elements
  const totalCountEl = document.getElementById("totalAdvancesCount");
  const totalAmountEl = document.getElementById("totalAdvancesAmount");
  const totalKgEl = document.getElementById("totalExpectedKg");
  const activeFarmersEl = document.getElementById("activeFarmersCount");

  // Table elements
  const addBtn = document.getElementById("addAdvanceBtn");
  const searchInput = document.getElementById("advanceSearch");
  const statusFilter = document.getElementById("statusFilter");
  const farmersTbody = document.getElementById("advanceFarmersTbody");
  const filteredCountEl = document.getElementById("filteredFarmersCount");

  // Modals
  const farmerModal = document.getElementById("advanceFarmerModal");
  const farmerModalBody = document.getElementById("advanceFarmerBody");
  const farmerModalTitle = document.getElementById("advanceFarmerTitle");
  const farmerModalClose = document.getElementById("advanceFarmerClose");

  const modal = document.getElementById("advanceModal");
  const dateTimeInput = document.getElementById("advanceDateTime");
  const farmerSelect = document.getElementById("advanceFarmerSelect");
  const amountInput = document.getElementById("advanceAmount");
  const expectedKgInput = document.getElementById("advanceExpectedKg");
  const repayDateInput = document.getElementById("advanceRepayDate");
  const cavNumberInput = document.getElementById("advanceCavNumber");
  const cavCaptureBtn = document.getElementById("advanceCavCaptureBtn");
  const cavPreview = document.getElementById("advanceCavPreview");
  const cavPreviewWrap = document.getElementById("advanceCavPreviewContainer");
  const saveBtn = document.getElementById("advanceSaveBtn");
  const cancelBtn = document.getElementById("advanceCancelBtn");

  let farmers = [];
  let advances = [];
  let repayments = [];
  let cavImageData = null;
  let pricePerKg = 0;
  let currentSortField = "farmerName";
  let currentSortAsc = true;

  // --------------------------------------------------------
  // Load Data
  // --------------------------------------------------------
  try {
    const fList = await window.Storage.loadJSON("farmers.json");
    farmers = Array.isArray(fList) ? fList : [];
  } catch (e) {
    console.warn("Failed loading farmers.json", e);
    farmers = [];
  }

  farmerSelect.innerHTML = `<option value="">-- Select Farmer --</option>`;
  farmers.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id || `${(f.givenName || "")} ${(f.surname || "")}`.trim();
    opt.textContent = `${f.givenName || ""} ${f.surname || ""}`.trim() || (f.id || "Unnamed");
    farmerSelect.appendChild(opt);
  });

  try {
    const cfg = await window.Storage.loadJSON("price_config.json");
    if (cfg && cfg.pricePerKg) {
      pricePerKg = Number(cfg.pricePerKg) || 0;
    }
  } catch (e) {
    console.warn("Failed loading price_config.json", e);
  }

  try {
    const aList = await window.Storage.loadJSON("advances.json");
    advances = Array.isArray(aList) ? aList : [];
  } catch (e) {
    console.warn("Failed loading advances.json", e);
    advances = [];
  }

  try {
    const rList = await window.Storage.loadJSON("repayment.json");
    repayments = Array.isArray(rList) ? rList : [];
  } catch (e) {
    console.warn("Failed loading repayment.json", e);
    repayments = [];
  }

  // --------------------------------------------------------
  // Calculate Statistics & Group by Farmer
  // --------------------------------------------------------
  function getGroupedData() {
    const groups = new Map();

    advances.forEach(a => {
      const key = a.farmerId || a.farmerName || "unknown";
      if (!groups.has(key)) {
        groups.set(key, {
          farmerId: a.farmerId || null,
          farmerName: a.farmerName || "Unknown",
          records: [],
          totalAmount: 0,
          totalKg: 0,
          nextDue: null,
          status: "active"
        });
      }
      
      const group = groups.get(key);
      group.records.push(a);
      group.totalAmount += Number(a.amount) || 0;
      group.totalKg += Number(a.expectedKg) || 0;
      
      // Find earliest due date
      if (a.repayDate) {
        if (!group.nextDue || new Date(a.repayDate) < new Date(group.nextDue)) {
          group.nextDue = a.repayDate;
        }
      }
    });

    // Calculate status for each farmer
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    groups.forEach((group, key) => {
      if (group.nextDue) {
        const dueDate = new Date(group.nextDue);
        dueDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          group.status = "overdue";
        } else if (diffDays <= 7) {
          group.status = "due-soon";
        } else {
          group.status = "active";
        }
      }
    });

    return Array.from(groups.values());
  }

  // --------------------------------------------------------
  // Update Summary Cards
  // --------------------------------------------------------
  function updateSummary(groupedData) {
    const totalCount = advances.length;
    const totalAmount = advances.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    const totalKg = advances.reduce((sum, a) => sum + (Number(a.expectedKg) || 0), 0);
    const activeFarmers = groupedData.length;

    totalCountEl.textContent = totalCount;
    totalAmountEl.textContent = AppUtils.formatMoney(totalAmount);
    totalKgEl.textContent = AppUtils.formatWeight(totalKg);
    activeFarmersEl.textContent = activeFarmers;
  }

  // --------------------------------------------------------
  // Filter & Sort Logic
  // --------------------------------------------------------
  function getFilteredGroups() {
    let groups = getGroupedData();

    // Search filter
    const term = (searchInput.value || "").toLowerCase().trim();
    if (term) {
      groups = groups.filter(g =>
        g.farmerName.toLowerCase().includes(term)
      );
    }

    // Status filter
    const status = statusFilter.value;
    if (status !== "all") {
      groups = groups.filter(g => g.status === status);
    }

    return groups;
  }

  function sortGroups(field) {
    if (currentSortField === field) {
      currentSortAsc = !currentSortAsc;
    } else {
      currentSortField = field;
      currentSortAsc = true;
    }
    renderFarmerSummary();
  }

  // --------------------------------------------------------
  // Render Farmer Summary Table
  // --------------------------------------------------------
  function renderFarmerSummary() {
    let groups = getFilteredGroups();
    
    updateSummary(getGroupedData());
    filteredCountEl.textContent = groups.length;
    
    farmersTbody.innerHTML = "";

    if (!groups.length) {
      farmersTbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;color:#777;padding:40px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🔍</div>
            <div style="font-size: 1.1rem; margin-bottom: 5px;">No advances found</div>
            <div style="font-size: 0.9rem; color: #999;">Try adjusting your filters</div>
          </td>
        </tr>`;
      return;
    }

    // Sort
    groups.sort((a, b) => {
      let aVal, bVal;
      
      switch(currentSortField) {
        case "farmerName":
          aVal = a.farmerName;
          bVal = b.farmerName;
          break;
        case "totalAmount":
          aVal = a.totalAmount;
          bVal = b.totalAmount;
          break;
        case "expectedKg":
          aVal = a.totalKg;
          bVal = b.totalKg;
          break;
        case "nextDue":
          aVal = a.nextDue ? new Date(a.nextDue) : new Date('9999-12-31');
          bVal = b.nextDue ? new Date(b.nextDue) : new Date('9999-12-31');
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return currentSortAsc ? -1 : 1;
      if (aVal > bVal) return currentSortAsc ? 1 : -1;
      return 0;
    });

    // Render rows
    groups.forEach(g => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";
      tr.style.transition = "all 0.2s";

      // Status badge
      let statusBadge = "";
      if (g.status === "overdue") {
        statusBadge = `<span style="background:#ff6b6b;color:white;padding:4px 8px;border-radius:12px;font-size:0.75rem;font-weight:bold;">⚠️ OVERDUE</span>`;
      } else if (g.status === "due-soon") {
        statusBadge = `<span style="background:#ffa500;color:white;padding:4px 8px;border-radius:12px;font-size:0.75rem;font-weight:bold;">⏰ DUE SOON</span>`;
      } else {
        statusBadge = `<span style="background:#43e97b;color:white;padding:4px 8px;border-radius:12px;font-size:0.75rem;font-weight:bold;">✅ ACTIVE</span>`;
      }

      const rowStyle = g.status === "overdue" ? "background:#fff5f5;" : "";

      tr.innerHTML = `
        <td style="${rowStyle}"><strong>${g.farmerName}</strong></td>
        <td style="${rowStyle} text-align:right;"><strong>${AppUtils.formatMoney(g.totalAmount)}</strong></td>
        <td style="${rowStyle} text-align:right;">${AppUtils.formatWeight(g.totalKg)}</td>
        <td style="${rowStyle}">${g.nextDue ? AppUtils.formatDate(g.nextDue) : "-"}</td>
        <td style="${rowStyle}">${statusBadge}</td>
      `;

      tr.onclick = () => showFarmerStatement(g);

      tr.onmouseenter = () => {
        tr.style.backgroundColor = "#f0f9f6";
        tr.style.transform = "scale(1.01)";
      };
      
      tr.onmouseleave = () => {
        tr.style.backgroundColor = rowStyle || "";
        tr.style.transform = "scale(1)";
      };

      farmersTbody.appendChild(tr);
    });
  }

  // --------------------------------------------------------
  // Show Farmer Statement Modal
  // --------------------------------------------------------
  async function showFarmerStatement(group) {
    const recs = group.records.sort((a, b) =>
      new Date(a.dateTime || a.createdAt) - new Date(b.dateTime || b.createdAt)
    );

    const farmerRepayments = repayments.filter(r =>
      r.farmerId === group.farmerId || r.farmerName === group.farmerName
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    let running = 0;

    let html = `
      <div style="padding: 0 15px 15px 15px;">
        
        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
          
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align:center;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Total Advances</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #667eea;">${group.records.length}</div>
          </div>

          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align:center;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Total Amount</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #f5576c;">${AppUtils.formatMoney(group.totalAmount)}</div>
          </div>

          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; text-align:center;">
            <div style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Expected KG</div>
            <div style="font-size: 1.4rem; font-weight: bold; color: #43e97b;">${AppUtils.formatWeight(group.totalKg)}</div>
          </div>
        </div>

        <!-- Advance Records -->
        <h4 style="margin-top: 25px; margin-bottom: 15px; color: #667eea;">💰 Advance Records</h4>
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 25px;">
          <table class="data-table" style="margin: 0;">
            <thead style="position: sticky; top: 0; background: #667eea; color: white;">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>CAV #</th>
                <th>Amount</th>
                <th>Expected KG</th>
                <th>Repay Date</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
    `;

    recs.forEach(r => {
      const amt = Number(r.amount || 0);
      running += amt;

      html += `
        <tr>
          <td>${AppUtils.formatDate(r.dateTime || r.createdAt)}</td>
          <td>${AppUtils.formatTime(r.dateTime || r.createdAt)}</td>
          <td>${r.cavNumber || "-"}</td>
          <td>${AppUtils.formatMoney(amt)}</td>
          <td>${AppUtils.formatWeight(r.expectedKg)}</td>
          <td>${r.repayDate ? AppUtils.formatDate(r.repayDate) : "-"}</td>
          <td><strong>${AppUtils.formatMoney(running)}</strong></td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
    `;

    // Combined Statement
    const merged = [
      ...recs.map(a => ({
        type: "Advance",
        amount: a.amount,
        date: a.dateTime || a.createdAt,
        ref: a.cavNumber || "",
        extra: `Expected: ${AppUtils.formatWeight(a.expectedKg)}`
      })),
      ...farmerRepayments.map(r => ({
        type: "Repayment",
        amount: r.amount,
        date: r.date,
        ref: r.cpv || "",
        extra: r.remarks || ""
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    html += `
      <h4 style="margin-top: 25px; margin-bottom: 15px; color: #4facfe;">📊 Combined Statement</h4>
      <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <table class="data-table" style="margin: 0;">
          <thead style="position: sticky; top: 0; background: #4facfe; color: white;">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reference</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
    `;

    merged.forEach(m => {
      const typeColor = m.type === "Advance" ? "#f5576c" : "#43e97b";
      html += `
        <tr>
          <td>${AppUtils.formatDate(m.date)}</td>
          <td><span style="color:${typeColor};font-weight:bold;">${m.type}</span></td>
          <td>${AppUtils.formatMoney(m.amount)}</td>
          <td>${m.ref || "-"}</td>
          <td style="font-size:0.85rem;color:#666;">${m.extra || ""}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    </div>
    `;

    farmerModalBody.innerHTML = html;
    farmerModalTitle.textContent = `Advance Statement — ${group.farmerName}`;
    farmerModal.classList.remove("hidden");
  }

  // --------------------------------------------------------
  // Modal Controls
  // --------------------------------------------------------
  farmerModalClose.onclick = () => farmerModal.classList.add("hidden");
  farmerModal.onclick = (e) => {
    if (e.target === farmerModal) farmerModal.classList.add("hidden");
  };

  // --------------------------------------------------------
  // Add New Advance Modal
  // --------------------------------------------------------
  function openAdvanceModal() {
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    dateTimeInput.value = localIso;

    amountInput.value = "";
    expectedKgInput.value = "";
    repayDateInput.value = "";
    cavNumberInput.value = "";
    cavImageData = null;
    cavPreview.src = "";
    cavPreviewWrap.classList.add("hidden");
    farmerSelect.value = "";

    const today = new Date().toISOString().slice(0, 10);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    repayDateInput.min = today;
    repayDateInput.max = maxDate.toISOString().slice(0, 10);

    modal.classList.remove("hidden");
  }

  function closeAdvanceModal() {
    modal.classList.add("hidden");
  }

  amountInput.oninput = () => {
    const amt = Number(amountInput.value) || 0;
    if (!pricePerKg || pricePerKg <= 0) {
      expectedKgInput.value = "Price not set";
      return;
    }
    expectedKgInput.value = (amt / pricePerKg).toFixed(2).replace(/\.?0+$/, "");
  };

  cavCaptureBtn.onclick = () => {
    if (!navigator.camera) {
      alert("Camera plugin unavailable.");
      return;
    }

    navigator.camera.getPicture(
      (imgData) => {
        cavImageData = "data:image/jpeg;base64," + imgData;
        cavPreview.src = cavImageData;
        cavPreviewWrap.classList.remove("hidden");
      },
      (err) => console.warn("Camera error:", err),
      {
        quality: 70,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
      }
    );
  };

  // --------------------------------------------------------
  // Save New Advance
  // --------------------------------------------------------
  saveBtn.onclick = async () => {
    const farmerVal = farmerSelect.value;
    if (!farmerVal) {
      alert("Please select a farmer.");
      return;
    }

    const farmerObj = farmers.find(f => f.id === farmerVal) ||
      farmers.find(f => `${f.givenName || ""} ${f.surname || ""}`.trim() === farmerVal);

    const farmerName = farmerObj
      ? `${farmerObj.givenName || ""} ${farmerObj.surname || ""}`.trim()
      : farmerVal;

    const dtVal = dateTimeInput.value;
    if (!dtVal) {
      alert("Please enter the Date & Time.");
      return;
    }

    const amount = Number(amountInput.value) || 0;
    if (amount <= 0) {
      alert("Please enter a valid Amount.");
      return;
    }

    if (!repayDateInput.value) {
      alert("Please select a Repay Date.");
      return;
    }

    // 7-day rule
    const createdDate = new Date(dtVal.split("T")[0] + "T00:00:00");
    const repayDate = new Date(repayDateInput.value + "T00:00:00");
    const diffMs = repayDate.getTime() - createdDate.getTime();

    if (diffMs < 0 || diffMs > 7 * 24 * 60 * 60 * 1000) {
      alert("Repay Date must be within 7 days from advance date.");
      return;
    }

    const cavNo = cavNumberInput.value.trim();
    if (!cavNo) {
      alert("Please enter the CAV Number.");
      return;
    }

    const expectedKgVal = Number(expectedKgInput.value) || 0;

    const record = {
      id: "ADV-" + Date.now(),
      createdAt: new Date().toISOString(),
      dateTime: new Date(dtVal).toISOString(),
      farmerId: farmerObj?.id || null,
      farmerName,
      amount,
      expectedKg: expectedKgVal,
      pricePerKg: pricePerKg,
      repayDate: repayDateInput.value,
      cavNumber: cavNo,
      cavImage: cavImageData || null
    };

    advances.push(record);
    await window.Storage.saveJSON("advances.json", advances);

    alert("Cash advance saved successfully!");
    closeAdvanceModal();
    renderFarmerSummary();
  };

  cancelBtn.onclick = closeAdvanceModal;
  addBtn.onclick = openAdvanceModal;

  // Event listeners
  searchInput.oninput = renderFarmerSummary;
  statusFilter.onchange = renderFarmerSummary;

  // Sort headers
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.onclick = () => sortGroups(th.dataset.sort);
  });

  // Initial render
  renderFarmerSummary();

  // Due soon notification
  const dueSoon = getGroupedData().filter(g => g.status === "due-soon" || g.status === "overdue");
  if (dueSoon.length) {
    console.log(`[Advances] ${dueSoon.length} farmer(s) have advances due soon or overdue.`);
  }
};
