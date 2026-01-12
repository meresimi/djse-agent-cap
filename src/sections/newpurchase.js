console.log("✅ newpurchase.js loaded");

export default `
<section id="newpurchase">
  <h2>New Purchase</h2>

  <!-- ⚠️ NEW: Cash Balance & Purchase Capacity Card -->
  <div class="card" style="background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%); color: white;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div>
        <div style="font-size: 0.9rem; opacity: 0.9;">💰 Cash on Hand</div>
        <div style="font-size: 1.8rem; font-weight: bold; margin-top: 5px;" id="cashOnHand">$ 0.00</div>
      </div>
      <div>
        <div style="font-size: 0.9rem; opacity: 0.9;">📦 Can Buy Up To</div>
        <div style="font-size: 1.8rem; font-weight: bold; margin-top: 5px;" id="maxPurchaseKg">0.00 kg</div>
      </div>
    </div>
    <div style="margin-top: 10px; padding: 8px; background: rgba(255,255,255,0.2); border-radius: 6px; font-size: 0.85rem;">
      <span id="purchaseCapacityNote">Based on current price per kg</span>
    </div>
  </div>

  <!-- 1. FARMER INFO -->
  <div class="card" style="animation: fadeIn 0.5s ease-in;">
    <h3>Farmer Information</h3>

    <label>Date & Time</label>
    <input type="datetime-local" id="purchaseDate">

    <label>Farmer</label>
    <select id="farmerSelect">
      <option value="">-- Select Farmer --</option>
    </select>

    <label>Station</label>
    <input type="text" id="station" readonly>

    <label>Agent</label>
    <input type="text" id="agent" readonly>
  </div>

  <!-- 2. SEAWEED DETAILS -->
  <div class="card" style="animation: fadeIn 0.5s ease-in 0.1s both;">
    <h3>Seaweed Details</h3>

    <!-- Bags -->
    <div id="bagSection">
      <h4>Quality Bags</h4>
      <div id="bagList" class="listArea"></div>
      <button class="btn primary" id="addBagBtn">⚖️ Weigh Quality Bag</button>

      <div id="bagMiniForm" class="hidden overlayForm">
        <div class="miniForm">
          <h4 id="bagFormTitle">Add Bag</h4>
          <label>Bag Serial #</label>
          <input type="text" id="bagSerialInput">

          <label>Weight (kg)</label>
          <input type="number" id="bagWeightInput" step="0.01">

          <div class="miniFormActions">
            <button class="btn primary" id="bagSaveBtn">💾 Save</button>
            <button class="btn danger" id="bagDeleteBtn" style="display:none;">🗑 Delete</button>
            <button class="btn" id="bagCancelBtn">❌ Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Batches -->
    <div id="batchSection" style="margin-top:18px;">
      <h4>Unstacked Batches</h4>
      <div id="batchList" class="listArea"></div>
      <button class="btn primary" id="addBatchBtn">📦 Weigh Unstacked Batch</button>

      <div id="batchMiniForm" class="hidden overlayForm">
        <div class="miniForm">
          <h4 id="batchFormTitle">Add Batch</h4>

          <label>Batch Weight (kg)</label>
          <input type="number" id="batchWeightInput" step="0.01">

          <div class="miniFormActions">
            <button class="btn primary" id="batchSaveBtn">💾 Save</button>
            <button class="btn danger" id="batchDeleteBtn" style="display:none;">🗑 Delete</button>
            <button class="btn" id="batchCancelBtn">❌ Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. PRICING & PAYMENT -->
  <div class="card" style="animation: fadeIn 0.5s ease-in 0.2s both;">
    <h3>Pricing & Payment</h3>

    <p>Price per kg: <span id="priceValue" style="font-weight:bold;color:#006400;">$ 0.00</span></p>
    <p>Total Weight: <span id="totalWeight" style="font-weight:bold;">0.00</span> kg</p>
    <p>Total Amount: <span id="totalAmount" style="font-weight:bold;">$ 0.00</span></p>
  </div>

  <!-- 4. LESS FARMER ADVANCE -->
  <div class="card">
    <h3>Less Farmer Advance</h3>

    <p>Total Farmer's Advance: <span id="farmerAdvanceTotal" style="font-weight:bold;color:#000;">$ 0.00</span></p>
    <p>Estimated Seaweed Owed: <span id="farmerAdvanceKg" style="font-weight:bold;">0.00 kg</span></p>

    <label>Amount of kg to deduct:</label>
    <input type="number" id="kgDeductInput" step="0.01"
      style="width:25%;display:inline-block;margin-left:8px;margin-top:0;">
  </div>

  <!-- 5. FINAL PAYOUT (C4 BOLD CENTERED) -->
  <div class="card" id="finalPayoutCard">
    <h3>Final Pay to Farmer</h3>
    <p id="finalPayDisplay" 
       style="font-size:1.4rem;font-weight:bold;color:#004d00;text-align:center;">
       $ 0.00
    </p>
  </div>

  <!-- 6. CPV -->
  <div class="card">
    <h3>Cash Payment Voucher (CPV)</h3>

    <label>CPV Number</label>
    <input type="text" id="cpvNumber">

    <button class="btn primary" id="cpvCaptureBtn">📸 Capture CPV Slip</button>

    <div id="cpvPreviewContainer" class="hidden" style="margin-top:8px;">
      <img id="cpvPreview" style="width:100%;max-height:220px;object-fit:contain;border-radius:6px;">
    </div>
  </div>

  <!-- 7. SAVE BUTTON -->
  <div class="card">
    <button class="btn primary" id="savePurchaseBtn">💾 Save Purchase</button>
    <button class="btn danger" onclick="window.loadSection('dashboard')">❌ Cancel</button>
  </div>

</section>
`;

// =======================================================
// SECTION LOGIC
// =======================================================
window.initNewpurchaseSection = async function () {

  console.log("🔥 initNewpurchaseSection()");

  // Set default datetime
  const now = new Date();
  const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  document.getElementById("purchaseDate").value = localIso;

  // ⚠️ NEW: Elements for cash balance display
  const cashOnHandEl = document.getElementById("cashOnHand");
  const maxPurchaseKgEl = document.getElementById("maxPurchaseKg");
  const purchaseCapacityNote = document.getElementById("purchaseCapacityNote");

  // -------------------------------
  // LOAD FARMERS FOR DROPDOWN
  // -------------------------------
  let farmers = await Storage.loadJSON("farmers.json") || [];
  const farmerSelect = document.getElementById("farmerSelect");

  farmers.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = `${f.givenName} ${f.surname}`;
    farmerSelect.appendChild(opt);
  });

  // -------------------------------
  // LOAD PRICE FROM SETTINGS
  // -------------------------------
  let priceCfg = await Storage.loadJSON("price_config.json");
  let pricePerKg = priceCfg?.pricePerKg ? Number(priceCfg.pricePerKg) : 0;
  document.getElementById("priceValue").textContent = "$ " + pricePerKg.toFixed(2);

  // ⚠️ NEW: Calculate and display cash on hand & purchase capacity
  async function updateCashBalance() {
    try {
      // Load all cash transactions
      const cashData = await Storage.loadJSON("cash.json") || [];
      const purchases = await Storage.loadJSON("purchases.json") || [];
      const advances = await Storage.loadJSON("advances.json") || [];

      // Calculate balance
      let balance = 0;

      // Add manual income/expenses
      cashData.forEach(t => {
        if (t.type === "income") {
          balance += Number(t.amount || 0);
        } else {
          balance -= Number(t.amount || 0);
        }
      });

      // Subtract purchases
      purchases.forEach(p => {
        balance -= Number(p.finalPay || 0);
      });

      // Subtract advances
      advances.forEach(a => {
        balance -= Number(a.amount || 0);
      });

      // Display cash balance
      cashOnHandEl.textContent = AppUtils.formatMoney(balance);
      cashOnHandEl.style.color = balance >= 0 ? "white" : "#ff6b6b";

      // Calculate max purchase capacity
      if (pricePerKg > 0 && balance > 0) {
        const maxKg = balance / pricePerKg;
        maxPurchaseKgEl.textContent = AppUtils.formatWeightValue(maxKg) + " kg";
        maxPurchaseKgEl.style.color = "white";
        purchaseCapacityNote.textContent = `Based on price: ${AppUtils.formatMoney(pricePerKg)}/kg`;
      } else if (balance <= 0) {
        maxPurchaseKgEl.textContent = "0.00 kg";
        maxPurchaseKgEl.style.color = "#ff6b6b";
        purchaseCapacityNote.textContent = "⚠️ Insufficient cash balance";
      } else {
        maxPurchaseKgEl.textContent = "N/A";
        purchaseCapacityNote.textContent = "⚠️ Price per kg not set";
      }

    } catch (e) {
      console.error("Failed to calculate cash balance:", e);
      cashOnHandEl.textContent = "Error";
      maxPurchaseKgEl.textContent = "N/A";
    }
  }

  // Initialize cash balance display
  await updateCashBalance();

  // -------------------------------
  // FARMER SELECT EVENT
  // -------------------------------
  document.getElementById("station").value = "";
  document.getElementById("agent").value = "";

  farmerSelect.onchange = () => {
    const f = farmers.find(x => x.id === farmerSelect.value);
    if (!f) return;
    document.getElementById("station").value = f.islandBase || "";
    document.getElementById("agent").value = f.agent || "";
    loadFarmerAdvance(f.id);
  };

  // STORAGE OF BAGS + BATCHES
  let bags = [];
  let batches = [];

  // =======================================================
  // REUSABLE HELPERS
  // =======================================================
  function recalcTotals() {
    let totalW = 0;
    bags.forEach(b => totalW += Number(b.weight));
    batches.forEach(b => totalW += Number(b.weight));

    document.getElementById("totalWeight").textContent = totalW.toFixed(2);
    document.getElementById("totalAmount").textContent = "$ " + (totalW * pricePerKg).toFixed(2);

    // Advance deduction
    const kgDeduct = Number(document.getElementById("kgDeductInput").value || 0);
    const deductionVal = kgDeduct * pricePerKg;

    const gross = totalW * pricePerKg;
    const finalPay = Math.max(gross - deductionVal, 0);

    document.getElementById("finalPayDisplay").textContent = "$ " + finalPay.toFixed(2);
  }

  // Recalc whenever KG deduction changes
  document.getElementById("kgDeductInput").oninput = recalcTotals;


  // =======================================================
  // LOAD FARMER ADVANCE DETAILS
  // =======================================================
  async function loadFarmerAdvance(farmerId) {
    const allAdv = await Storage.loadJSON("advances.json") || [];
    const fAdv = allAdv.filter(a => a.farmerId === farmerId);

    let totalCash = 0;
    let totalKg = 0;

    fAdv.forEach(a => {
      totalCash += Number(a.amount || 0);
      totalKg += Number(a.expectedKg || 0);
    });

    document.getElementById("farmerAdvanceTotal").textContent = "$ " + totalCash.toFixed(2);
    document.getElementById("farmerAdvanceKg").textContent = totalKg.toFixed(2) + " kg";

    recalcTotals();
  }


  // =======================================================
  // BAG LOGIC
  // =======================================================
  const addBagBtn = document.getElementById("addBagBtn");
  const bagMiniForm = document.getElementById("bagMiniForm");
  const bagSerialInput = document.getElementById("bagSerialInput");
  const bagWeightInput = document.getElementById("bagWeightInput");
  const bagList = document.getElementById("bagList");
  const bagSaveBtn = document.getElementById("bagSaveBtn");
  const bagCancelBtn = document.getElementById("bagCancelBtn");
  const bagDeleteBtn = document.getElementById("bagDeleteBtn");
  let editingBagIndex = null;

  function renderBags() {
    bagList.innerHTML = "";
    bags.forEach((b, i) => {
      const btn = document.createElement("button");
      btn.className = "btn small";
      btn.textContent = `(${b.serial}) ${i+1} → ${b.weight} kg`;
      btn.onclick = () => openBagForm(i);
      bagList.appendChild(btn);
    });
    recalcTotals();
  }

  function openBagForm(i=null) {
    editingBagIndex = i;
    if (i !== null) {
      bagSerialInput.value = bags[i].serial;
      bagWeightInput.value = bags[i].weight;
      bagDeleteBtn.style.display = "inline-block";
    }
    else {
      bagSerialInput.value = "";
      bagWeightInput.value = "";
      bagDeleteBtn.style.display = "none";
    }
    bagMiniForm.classList.remove("hidden");
  }

  addBagBtn.onclick = () => openBagForm();

  bagSaveBtn.onclick = () => {
    const serial = bagSerialInput.value.trim();
    const weight = Number(bagWeightInput.value);

    if (!serial || weight <= 0) return alert("Invalid bag data.");

    if (editingBagIndex !== null) bags[editingBagIndex] = { serial, weight };
    else bags.push({ serial, weight });

    bagMiniForm.classList.add("hidden");
    renderBags();
  };

  bagCancelBtn.onclick = () => bagMiniForm.classList.add("hidden");

  bagDeleteBtn.onclick = () => {
    if (editingBagIndex !== null) {
      bags.splice(editingBagIndex, 1);
      bagMiniForm.classList.add("hidden");
      renderBags();
    }
  };


  // =======================================================
  // BATCH LOGIC
  // =======================================================
  const addBatchBtn = document.getElementById("addBatchBtn");
  const batchMiniForm = document.getElementById("batchMiniForm");
  const batchWeightInput = document.getElementById("batchWeightInput");
  const batchList = document.getElementById("batchList");
  const batchSaveBtn = document.getElementById("batchSaveBtn");
  const batchCancelBtn = document.getElementById("batchCancelBtn");
  const batchDeleteBtn = document.getElementById("batchDeleteBtn");
  let editingBatchIndex = null;

  function renderBatches() {
    batchList.innerHTML = "";
    batches.forEach((b, i) => {
      const btn = document.createElement("button");
      btn.className = "btn small";
      btn.textContent = `${i+1} Batch → ${b.weight} kg`;
      btn.onclick = () => openBatchForm(i);
      batchList.appendChild(btn);
    });
    recalcTotals();
  }

  function openBatchForm(i=null) {
    editingBatchIndex = i;
    if (i !== null) {
      batchWeightInput.value = batches[i].weight;
      batchDeleteBtn.style.display = "inline-block";
    }
    else {
      batchWeightInput.value = "";
      batchDeleteBtn.style.display = "none";
    }
    batchMiniForm.classList.remove("hidden");
  }

  addBatchBtn.onclick = () => openBatchForm();

  batchSaveBtn.onclick = () => {
    const weight = Number(batchWeightInput.value);
    if (weight <= 0) return alert("Invalid batch weight.");

    if (editingBatchIndex !== null) batches[editingBatchIndex] = { weight };
    else batches.push({ weight });

    batchMiniForm.classList.add("hidden");
    renderBatches();
  };

  batchCancelBtn.onclick = () => batchMiniForm.classList.add("hidden");

  batchDeleteBtn.onclick = () => {
    if (editingBatchIndex !== null) {
      batches.splice(editingBatchIndex, 1);
      batchMiniForm.classList.add("hidden");
      renderBatches();
    }
  };


  // =======================================================
  // CPV CAPTURE
  // =======================================================
  let cpvImageData = null;

  document.getElementById("cpvCaptureBtn").onclick = () => {
    if (!navigator.camera) {
      alert("Camera plugin not available.");
      return;
    }

    navigator.camera.getPicture(
      img => {
        cpvImageData = "data:image/jpeg;base64," + img;
        document.getElementById("cpvPreview").src = cpvImageData;
        document.getElementById("cpvPreviewContainer").classList.remove("hidden");
      },
      err => console.warn("Camera error", err),
      {
        quality: 70,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
      }
    );
  };


  // =======================================================
  // SAVE PURCHASE ⚠️ FIXED WITH DATA FLOW
  // =======================================================
  document.getElementById("savePurchaseBtn").onclick = async () => {

    const farmer = farmers.find(f => f.id === farmerSelect.value);
    if (!farmer) return alert("Select a farmer first.");

    if (!document.getElementById("cpvNumber").value.trim())
      return alert("Enter CPV Number.");
    if (!cpvImageData)
      return alert("Capture CPV image first.");

    const totalWeight = Number(document.getElementById("totalWeight").textContent);
    const grossAmount = totalWeight * pricePerKg;

    const kgDeduct = Number(document.getElementById("kgDeductInput").value || 0);
    const deductionValue = kgDeduct * pricePerKg;

    const finalPay = Math.max(grossAmount - deductionValue, 0);

    // ⚠️ NEW: Check if purchase exceeds cash balance
    try {
      const cashData = await Storage.loadJSON("cash.json") || [];
      const purchases = await Storage.loadJSON("purchases.json") || [];
      const advances = await Storage.loadJSON("advances.json") || [];

      let balance = 0;
      cashData.forEach(t => {
        balance += t.type === "income" ? Number(t.amount || 0) : -Number(t.amount || 0);
      });
      purchases.forEach(p => balance -= Number(p.finalPay || 0));
      advances.forEach(a => balance -= Number(a.amount || 0));

      if (finalPay > balance) {
        const confirm = window.confirm(
          `⚠️ WARNING: Purchase amount (${AppUtils.formatMoney(finalPay)}) exceeds cash balance (${AppUtils.formatMoney(balance)}).\n\nDo you want to continue anyway?`
        );
        if (!confirm) return;
      }
    } catch (e) {
      console.error("Failed to check balance:", e);
    }

    const purchaseDate = document.getElementById("purchaseDate").value;
    const invoice = "INV-" + Date.now();

    const purchase = {
      date: purchaseDate,
      invoice: invoice,
      farmerId: farmer.id,
      farmerName: `${farmer.givenName} ${farmer.surname}`,
      station: farmer.islandBase,
      agent: farmer.agent,
      pricePerKg,
      totalWeight,
      grossAmount,
      deductionKg: kgDeduct,
      deductionValue,
      finalPay,
      cpvNumber: document.getElementById("cpvNumber").value.trim(),
      cpvImage: cpvImageData,
      bags,
      batches
    };

    // ⚠️ SAVE PURCHASE
    const purchases = await Storage.loadJSON("purchases.json") || [];
    purchases.push(purchase);
    await Storage.saveJSON("purchases.json", purchases);

    // ⚠️ SAVE QUALITY BAGS TO qualitybags.json
    const qualityBags = await Storage.loadJSON("qualitybags.json") || [];
    bags.forEach(bag => {
      qualityBags.push({
        id: `QB-${Date.now()}-${bag.serial}`,
        date: purchaseDate,
        serial: bag.serial,
        farmer: purchase.farmerName,
        weight: bag.weight,
        sourceInvoice: invoice
      });
    });
    await Storage.saveJSON("qualitybags.json", qualityBags);

    // ⚠️ SAVE UNBATCHED TO unbatched.json
    const unbatched = await Storage.loadJSON("unbatched.json") || [];
    batches.forEach((batch, idx) => {
      unbatched.push({
        id: `UB-${Date.now()}-${idx}`,
        date: purchaseDate,
        farmer: purchase.farmerName,
        invoice: invoice,
        weight: batch.weight,
        weightRemaining: batch.weight
      });
    });
    await Storage.saveJSON("unbatched.json", unbatched);

    // ⚠️ NEW: Also add quality bags DIRECTLY to warehouse (stock at hand)
    const warehouse = await Storage.loadJSON("warehouse.json") || [];
    bags.forEach(bag => {
      warehouse.push({
        id: `WH-${Date.now()}-${bag.serial}`,
        date: purchaseDate,
        serial: bag.serial,
        farmer: purchase.farmerName,
        weight: bag.weight,
        sourceInvoice: invoice,
        status: "in_stock"
      });
    });
    await Storage.saveJSON("warehouse.json", warehouse);
    console.log(`[NewPurchase] Added ${bags.length} quality bags directly to warehouse`);

    // ⚠️ NEW: If deduction was made, create repayment record
    if (kgDeduct > 0 && deductionValue > 0) {
      const repayments = await Storage.loadJSON("repayment.json") || [];
      repayments.push({
        id: `REP-${Date.now()}`,
        date: purchaseDate,
        farmerId: farmer.id,
        farmerName: purchase.farmerName,
        amount: deductionValue,
        cpv: purchase.cpvNumber,
        remarks: `Deducted ${kgDeduct.toFixed(2)} kg from purchase ${invoice}`,
        type: "purchase_deduction",
        sourceInvoice: invoice,
        createdAt: new Date().toISOString()
      });
      await Storage.saveJSON("repayment.json", repayments);
      console.log(`[NewPurchase] Created repayment record for ${money(deductionValue)}`);
    }

    alert("Purchase saved successfully!");
    window.loadSection("purchases");
  };

};