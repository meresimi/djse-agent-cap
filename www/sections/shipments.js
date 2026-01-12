// sections/shipments.js (FIXED - Standard Export Pattern)

console.log("✅ shipments.js loaded");

export default `
<section id="shipments">
  <h2>🚢 Shipments</h2>

  <div class="card">
    <h3>New Shipment</h3>
    
    <label>Vessel Name</label>
    <select id="vesselNameSelect">
      <option value="">-- Select Vessel --</option>
    </select>

    <label>Date</label>
    <input type="date" id="shipmentDate">

    <label>Total Bags</label>
    <input type="number" id="shipmentBags" placeholder="0" min="0">

    <label>Total Weight (kg)</label>
    <input type="number" id="shipmentWeight" step="0.01" placeholder="0.00" min="0">

    <label>Destination</label>
    <input type="text" id="shipmentDest" placeholder="e.g. Honiara">

    <button class="btn primary" id="saveShipmentBtn">💾 Save Shipment</button>
  </div>

  <div class="card">
    <h3>📋 Shipment Records</h3>
    
    <input type="search" id="shipmentSearch" placeholder="Search by vessel or destination..." 
           style="width:100%;padding:8px;margin-bottom:10px;">
    
    <div class="scrollTable">
      <table class="data-table" id="shipmentsTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Vessel</th>
            <th>Bags</th>
            <th>Weight (kg)</th>
            <th>Destination</th>
          </tr>
        </thead>
        <tbody id="shipmentsTbody">
          <tr>
            <td colspan="5" style="text-align:center;color:#777;">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div id="shipmentSummary" style="margin-top:15px;padding:10px;background:#f0f9f6;border-radius:6px;">
      <p style="margin:4px 0;"><strong>Total Shipments:</strong> <span id="totalShipments">0</span></p>
      <p style="margin:4px 0;"><strong>Total Bags Shipped:</strong> <span id="totalBags">0</span></p>
      <p style="margin:4px 0;"><strong>Total Weight Shipped:</strong> <span id="totalWeight">0.00</span> kg</p>
    </div>
  </div>
</section>
`;

// ============================================================
// INITIALIZER (Matches app.js naming convention)
// ============================================================
window.initShipmentsSection = async function () {
  console.log("✅ initShipmentsSection() running...");

  const vesselSelect = document.getElementById("vesselNameSelect");
  const dateInput = document.getElementById("shipmentDate");
  const bagsInput = document.getElementById("shipmentBags");
  const weightInput = document.getElementById("shipmentWeight");
  const destInput = document.getElementById("shipmentDest");
  const saveBtn = document.getElementById("saveShipmentBtn");
  const searchInput = document.getElementById("shipmentSearch");
  
  const tbody = document.getElementById("shipmentsTbody");
  const totalShipmentsEl = document.getElementById("totalShipments");
  const totalBagsEl = document.getElementById("totalBags");
  const totalWeightEl = document.getElementById("totalWeight");

  let shipments = [];
  let vessels = [];

  // ==========================================
  // LOAD DATA
  // ==========================================
  
  // Load vessels for dropdown
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
    opt.value = v.name; // Store vessel name as value
    opt.textContent = v.name;
    opt.dataset.id = v.id;
    vesselSelect.appendChild(opt);
  });

  // Load existing shipments
  try {
    const sData = await window.Storage.loadJSON("shipments.json");
    shipments = Array.isArray(sData) ? sData : [];
  } catch (e) {
    console.error("Failed to load shipments.json:", e);
    shipments = [];
  }

  // Set default date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  // ==========================================
  // RENDER TABLE
  // ==========================================
  function renderShipments() {
    tbody.innerHTML = "";

    if (!shipments.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;color:#777;">
            No shipment records yet.
          </td>
        </tr>`;
      updateSummary([]);
      return;
    }

    // Filter by search term
    const term = (searchInput.value || "").toLowerCase().trim();
    let filtered = shipments;

    if (term) {
      filtered = shipments.filter(s =>
        (s.vessel || "").toLowerCase().includes(term) ||
        (s.destination || "").toLowerCase().includes(term)
      );
    }

    if (!filtered.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;color:#777;">
            No matching shipments found.
          </td>
        </tr>`;
      updateSummary([]);
      return;
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(s => {
      const tr = document.createElement("tr");
      
      const dateStr = s.date ? new Date(s.date).toLocaleDateString() : "-";
      
      tr.innerHTML = `
        <td>${dateStr}</td>
        <td>${s.vessel || "-"}</td>
        <td>${s.bags || 0}</td>
        <td>${(Number(s.weight) || 0).toFixed(2)}</td>
        <td>${s.destination || "-"}</td>
      `;
      
      tbody.appendChild(tr);
    });

    updateSummary(filtered);
  }

  // ==========================================
  // UPDATE SUMMARY
  // ==========================================
  function updateSummary(filteredShipments) {
    const count = filteredShipments.length;
    const totalB = filteredShipments.reduce((sum, s) => sum + (Number(s.bags) || 0), 0);
    const totalW = filteredShipments.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);

    totalShipmentsEl.textContent = count;
    totalBagsEl.textContent = totalB;
    totalWeightEl.textContent = totalW.toFixed(2);
  }

  // Search handler
  searchInput.oninput = renderShipments;

  // Initial render
  renderShipments();

  // ==========================================
  // SAVE NEW SHIPMENT
  // ==========================================
  saveBtn.onclick = async () => {
    const vessel = vesselSelect.value.trim();
    const date = dateInput.value;
    const bags = parseInt(bagsInput.value) || 0;
    const weight = parseFloat(weightInput.value) || 0;
    const dest = destInput.value.trim();

    // Validation
    if (!vessel) {
      alert("Please select a vessel.");
      return;
    }

    if (!date) {
      alert("Please select a date.");
      return;
    }

    if (!dest) {
      alert("Please enter a destination.");
      return;
    }

    if (bags <= 0 && weight <= 0) {
      alert("Please enter either total bags or total weight.");
      return;
    }

    // Get vessel ID if available
    const selectedOption = vesselSelect.options[vesselSelect.selectedIndex];
    const vesselId = selectedOption ? selectedOption.dataset.id : null;

    // Create shipment record
    const record = {
      id: `SHIP-${Date.now()}`,
      date: date,
      vessel: vessel,
      vesselId: vesselId,
      bags: bags,
      weight: weight,
      destination: dest,
      createdAt: new Date().toISOString()
    };

    shipments.push(record);
    await window.Storage.saveJSON("shipments.json", shipments);

    // Clear form
    vesselSelect.value = "";
    bagsInput.value = "";
    weightInput.value = "";
    destInput.value = "";
    dateInput.value = today;

    alert("Shipment saved successfully!");
    renderShipments();
  };
};