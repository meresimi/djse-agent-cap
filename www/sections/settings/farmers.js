// ------------------------------------------------------------
// farmers.js  (FINAL FIXED VERSION - FULLY WORKING)
// ------------------------------------------------------------

export default `
<section id="farmersSettings">
  <h2>Farmers 👩‍🌾</h2>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
      <button class="btn primary" id="addFarmerBtn" style="min-width:120px;">➕ Add Farmer</button>
       <input type="search" id="farmerSearch" placeholder="Search farmers..." 
  class="farmer-search">
    </div>

    <div class="scrollTable" style="margin-top:10px; overflow-x:auto;">
      <table class="data-table" id="farmersTable">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Given Name</th>
            <th>Surname</th>
            <th>Island Base Camp</th>
            <th>Agent</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody id="farmersTbody">
          <tr><td colspan="6" style="text-align:center; color:#777;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div id="farmerModal" class="overlayForm hidden">
    <div class="miniForm" style="width:340px;">
      <h3 id="farmerFormTitle">Add Farmer</h3>

      <p style="margin:0; margin-bottom:6px; font-size:0.8rem; color:#666;">
        <em>Farmer ID is auto-generated (not editable).</em>
      </p>

      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="width:40%;">Farmer ID</td>
          <td><input type="text" id="farmerIdInput" readonly></td>
        </tr>
        <tr>
          <td>Given Name</td>
          <td><input type="text" id="farmerGivenInput" required></td>
        </tr>
        <tr>
          <td>Surname</td>
          <td><input type="text" id="farmerSurnameInput" required></td>
        </tr>
        <tr>
          <td>Island Base</td>
          <td><input type="text" id="farmerBaseInput" required></td>
        </tr>
        <tr>
          <td>Agent</td>
          <td><input type="text" id="farmerAgentInput" required></td>
        </tr>
        <tr>
          <td>Phone</td>
          <td><input type="tel" id="farmerPhoneInput"></td>
        </tr>
      </table>

      <div style="margin-top:15px; display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn danger" id="farmerDeleteBtn" style="display:none;">🗑 Delete</button>
        <button class="btn primary" id="farmerSaveBtn">💾 Save</button>
        <button class="btn" id="farmerCancelBtn">❌ Cancel</button>
      </div>
    </div>
  </div>
</section>
`;


// ------------------------------------------------------------
// INITIALIZER — MUST match app.js dynamic initName:
// initSettingsFarmersSection
// ------------------------------------------------------------

window.initSettingsFarmersSection = function () {
  console.log("🔧 initSettingsFarmersSection() running…");

  let farmers = [];
  let editingIndex = null;

  const tbody = document.getElementById("farmersTbody");
  const search = document.getElementById("farmerSearch");
  const modal = document.getElementById("farmerModal");

  const idInput = document.getElementById("farmerIdInput");
  const givenInput = document.getElementById("farmerGivenInput");
  const surnameInput = document.getElementById("farmerSurnameInput");
  const baseInput = document.getElementById("farmerBaseInput");
  const agentInput = document.getElementById("farmerAgentInput");
  const phoneInput = document.getElementById("farmerPhoneInput");

  const saveBtn = document.getElementById("farmerSaveBtn");
  const cancelBtn = document.getElementById("farmerCancelBtn");
  const deleteBtn = document.getElementById("farmerDeleteBtn");


  // ----------------------------------------------------------
  // Load existing farmers
  // ----------------------------------------------------------
  (async () => {
    farmers = (await window.Storage.loadJSON("farmers.json")) || [];
    render();
  })();


  // ----------------------------------------------------------
  // Auto-generate Farmer ID based on Agent prefix
  // ----------------------------------------------------------
  function generateId(agent) {
    if (!agent) return "";
    const prefix = agent.replace(/[^A-Za-z]/g, "").slice(0,3).toUpperCase() || "AGT";

    let max = 0;
    farmers.forEach(f => {
      if (f.id?.startsWith(prefix + "-")) {
        const num = parseInt(f.id.split("-")[1]);
        if (num > max) max = num;
      }
    });

    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }


  // ----------------------------------------------------------
  // RENDER TABLE
  // ----------------------------------------------------------
  function render() {
    tbody.innerHTML = "";

    if (farmers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#777;">No farmers yet.</td></tr>`;
      return;
    }

    farmers.forEach((f, i) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-index", i);
      tr.innerHTML = `
        <td>${f.id}</td>
        <td>${f.givenName}</td>
        <td>${f.surname}</td>
        <td>${f.islandBase}</td>
        <td>${f.agent}</td>
        <td>${f.phone || ""}</td>
      `;
      tr.onclick = () => openEdit(i);
      tbody.appendChild(tr);
    });
  }


  // ----------------------------------------------------------
  // ADD NEW
  // ----------------------------------------------------------
  document.getElementById("addFarmerBtn").onclick = () => {
    editingIndex = null;
    deleteBtn.style.display = "none";

    idInput.value = "";
    givenInput.value = "";
    surnameInput.value = "";
    baseInput.value = "";
    agentInput.value = "";
    phoneInput.value = "";

    modal.classList.remove("hidden");
  };


  // ----------------------------------------------------------
  // EDIT EXISTING
  // ----------------------------------------------------------
  function openEdit(i) {
    editingIndex = i;
    const f = farmers[i];

    deleteBtn.style.display = "inline-block";

    idInput.value = f.id;
    givenInput.value = f.givenName;
    surnameInput.value = f.surname;
    baseInput.value = f.islandBase;
    agentInput.value = f.agent;
    phoneInput.value = f.phone || "";

    modal.classList.remove("hidden");
  }


  // ----------------------------------------------------------
  // SAVE RECORD
  // ----------------------------------------------------------
  saveBtn.onclick = async () => {

    const g = givenInput.value.trim();
    const s = surnameInput.value.trim();
    const b = baseInput.value.trim();
    const a = agentInput.value.trim();

    if (!g || !s || !b || !a) {
      alert("Please fill all required fields.");
      return;
    }

    let finalId = idInput.value.trim();
    if (!finalId) finalId = generateId(a);

    const rec = {
      id: finalId,
      givenName: g,
      surname: s,
      islandBase: b,
      agent: a,
      phone: phoneInput.value.trim()
    };

    if (editingIndex === null) {
      farmers.push(rec);
    } else {
      farmers[editingIndex] = rec;
    }

    await window.Storage.saveJSON("farmers.json", farmers);

    modal.classList.add("hidden");
    render();
  };


  // ----------------------------------------------------------
  // DELETE RECORD
  // ----------------------------------------------------------
  deleteBtn.onclick = async () => {
    if (editingIndex === null) return;

    if (!confirm("Delete this farmer?")) return;

    farmers.splice(editingIndex, 1);

    await window.Storage.saveJSON("farmers.json", farmers);

    modal.classList.add("hidden");
    render();
  };


  // ----------------------------------------------------------
  // CANCEL
  // ----------------------------------------------------------
  cancelBtn.onclick = () => modal.classList.add("hidden");
};