console.log("✅ settings/price.js loaded");

export default `
<section id="priceSettings">
  <h2>Price of Seaweed 💰</h2>

  <div class="card">
    <p>Set the standard buying price per kg. This value will be used automatically in the <strong>New Purchase</strong> screen.</p>

    <label for="priceInput">Price per kg (SBD)</label>
    <input type="number" id="priceInput" step="0.01" min="0" placeholder="0.00">

    <p id="priceInfo" style="font-size:0.85rem; color:#555; margin-top:6px;"></p>

    <div style="margin-top:12px; display:flex; gap:8px; justify-content:flex-start;">
      <button class="btn primary" id="priceSaveBtn">💾 Save Price</button>
    </div>
  </div>
</section>
`;

// ============================================================
// CRITICAL FIX: Initializer name MUST match app.js expectation
// app.js expects: window.initSettingsPriceSection
// ============================================================
window.initSettingsPriceSection = async function () {
  console.log("✅ initSettingsPriceSection() running...");

  const input = document.getElementById("priceInput");
  const info = document.getElementById("priceInfo");
  const saveBtn = document.getElementById("priceSaveBtn");

  // Load existing price
  const data = await window.Storage.loadJSON("price_config.json");
  let price = 5.0;
  let updatedText = "";

  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (typeof data.pricePerKg === "number") {
      price = data.pricePerKg;
    }
    if (data.updatedAt) {
      updatedText = `Last updated: ${new Date(data.updatedAt).toLocaleString()}`;
    }
  }

  input.value = price.toFixed(2);
  info.textContent = updatedText || "No previous price stored. Default used.";

  // Save button handler
  saveBtn.onclick = async () => {
    const value = parseFloat(input.value);
    if (isNaN(value) || value <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    const payload = {
      pricePerKg: value,
      updatedAt: new Date().toISOString()
    };

    await window.Storage.saveJSON("price_config.json", payload);
    info.textContent = `Last updated: ${new Date(payload.updatedAt).toLocaleString()}`;
    alert("Price saved and will be used in New Purchase.");
  };
};