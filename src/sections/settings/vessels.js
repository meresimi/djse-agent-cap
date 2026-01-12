// ------------------------------------------------------------
// vessels.js — Shipping Vessels Management
// ------------------------------------------------------------

export default `
<section id="vesselsSettings">
  <h2>Shipping Vessels 🚢</h2>

  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
      <button class="btn primary" id="addVesselBtn">➕ Add Vessel</button>
      <input type="search" id="vesselSearch" placeholder="Search vessels..." 
        class="vessel-search">
    </div>

    <div class="scrollTable" style="margin-top:10px;">
      <table class="data-table" id="vesselsTable">
        <thead>
          <tr>
            <th>Vessel ID</th>
            <th>Ship Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody id="vesselsTbody">
          <tr><td colspan="4" style="text-align:center; color:#777;">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div id="vesselModal" class="overlayForm hidden">
    <div class="miniForm">
      <h3 id="vesselFormTitle">Add Vessel</h3>

      <div style="margin-bottom:8px; font-size:0.85rem; color:#555;">
        <em>Vessel ID is generated automatically (e.g., SHP-001)</em>
      </div>

      <table style="width:100%;">
        <tr>
          <td style="width:40%">Vessel ID</td>
          <td><input type="text" id="vesselIdInput" readonly required></td>
        </tr>

        <tr>
          <td>Ship Name</td>
          <td><input type="text" id="vesselNameInput" required></td>
        </tr>

        <tr>
          <td>Phone</td>
          <td><input type="tel" id="vesselPhoneInput"></td>
        </tr>

        <tr>
          <td>Email</td>
          <td><input type="email" id="vesselEmailInput"></td>
        </tr>
      </table>

      <div style="margin-top:12px; display:flex; gap:8px; justify-content:flex-end;">
        <button class="btn danger" id="vesselDeleteBtn" style="display:none;">🗑 Delete</button>
        <button class="btn primary" id="vesselSaveBtn">💾 Save</button>
        <button class="btn" id="vesselCancelBtn">❌ Cancel</button>
      </div>
    </div>
  </div>
</section>
`;

// ------------------------------------------------------------
// INITIALIZER  — MUST match dynamic loader name:
// initSettingsVesselsSection
// ------------------------------------------------------------

window.initSettingsVesselsSection = function () {
  console.log("🚢 initSettingsVesselsSection() running…");

  let vessels = [];
  let editingIndex = null;

  const tbody = document.getElementById("vesselsTbody");
  const search = document.getElementById("vesselSearch");
  const modal = document.getElementById("vesselModal");

  const idInput = document.getElementById("vesselIdInput");
  const nameInput = document.getElementById("vesselNameInput");
  const phoneInput = document.getElementById("vesselPhoneInput");
  const emailInput = document.getElementById("vesselEmailInput");

  const saveBtn = document.getElementById("vesselSaveBtn");
  const cancelBtn = document.getElementById("vesselCancelBtn");
  const deleteBtn = document.getElementById("vesselDeleteBtn");

  // ---------------------------------------------
  // LOAD EXISTING DATA
  // ---------------------------------------------
  (async () => {
    vessels = await window.Storage.loadJSON("vessels.json") || [];
    render();
  })();

  // ---------------------------------------------
  // AUTO-GENERATE ID (e.g SHP-001)
  // ---------------------------------------------
  function generateId() {
    const prefix = "SHP";
    let max = 0;

    vessels.forEach(v => {
      if (v.id?.startsWith(prefix + "-")) {
        const num = parseInt(v.id.split("-")[1]);
        if (num > max) max = num;
      }
    });

    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }

  // ---------------------------------------------
  // RENDER TABLE
  // ---------------------------------------------
  function render() {
    tbody.innerHTML = "";

    if (vessels.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#777;">No vessels yet.</td></tr>`;
      return;
    }

    vessels.forEach((v, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.id}</td>
        <td>${v.name}</td>
        <td>${v.phone || ""}</td>
        <td>${v.email || ""}</td>
      `;
      tr.onclick = () => openEdit(i);
      tbody.appendChild(tr);
    });
  }

  // ---------------------------------------------
  // ADD NEW
  // ---------------------------------------------
  document.getElementById("addVesselBtn").onclick = () => {
    editingIndex = null;

    idInput.value = generateId();
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";

    deleteBtn.style.display = "none";

    modal.classList.remove("hidden");
  };

  // ---------------------------------------------
  // EDIT
  // ---------------------------------------------
  function openEdit(i) {
    editingIndex = i;

    const v = vessels[i];

    idInput.value = v.id;
    nameInput.value = v.name;
    phoneInput.value = v.phone || "";
    emailInput.value = v.email || "";

    deleteBtn.style.display = "inline-block";

    modal.classList.remove("hidden");
  }

  // ---------------------------------------------
  // SAVE
  // ---------------------------------------------
  saveBtn.onclick = async () => {
    const id = idInput.value.trim();
    const name = nameInput.value.trim();

    if (!name) {
      alert("Ship name is required.");
      return;
    }

    const rec = {
      id,
      name,
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim()
    };

    if (editingIndex === null) vessels.push(rec);
    else vessels[editingIndex] = rec;

    await window.Storage.saveJSON("vessels.json", vessels);

    modal.classList.add("hidden");
    render();
  };

  // ---------------------------------------------
  // DELETE
  // ---------------------------------------------
  deleteBtn.onclick = async () => {
    if (editingIndex === null) return;

    if (confirm("Delete this vessel?")) {
      vessels.splice(editingIndex, 1);
      await window.Storage.saveJSON("vessels.json", vessels);
      modal.classList.add("hidden");
      render();
    }
  };

  // ---------------------------------------------
  // CANCEL
  // ---------------------------------------------
  cancelBtn.onclick = () => modal.classList.add("hidden");

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------
  search.oninput = () => {
    const q = search.value.toLowerCase();
    tbody.innerHTML = "";

    vessels
      .filter(v =>
        v.id.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        (v.phone || "").toLowerCase().includes(q)
      )
      .forEach((v, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${v.id}</td>
          <td>${v.name}</td>
          <td>${v.phone || ""}</td>
          <td>${v.email || ""}</td>
        `;
        tr.onclick = () => openEdit(i);
        tbody.appendChild(tr);
      });
  };
};