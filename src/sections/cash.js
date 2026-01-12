// sections/cash.js — Complete Cash on Hand Management

console.log("✅ cash.js loaded");

export default `
<section id='cash'>
  <h2>💰 Cash on Hand</h2>

  <!-- Current Balance Card -->
  <div class='card' style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
    <h3 style="color: white; margin-top: 0;">Current Cash Balance</h3>
    <div style="font-size: 2.5rem; font-weight: bold; text-align: center; margin: 20px 0;">
      <span id='cashBalance'>$ 0.00</span>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
      <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total In</div>
        <div style="font-size: 1.3rem; font-weight: bold;" id="totalIn">$ 0.00</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Out</div>
        <div style="font-size: 1.3rem; font-weight: bold;" id="totalOut">$ 0.00</div>
      </div>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class='card'>
    <h3>Cash Transactions</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <button class='btn primary' id='addIncomeBtn' style="width: 100%;">
        ➕ Record Income
      </button>
      <button class='btn danger' id='addExpenseBtn' style="width: 100%;">
        ➖ Record Expense
      </button>
    </div>
  </div>

  <!-- Filter & Search -->
  <div class='card'>
    <h3>Transaction History</h3>
    
    <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
      <select id="filterType" style="flex: 1; min-width: 120px;">
        <option value="all">All Transactions</option>
        <option value="income">Income Only</option>
        <option value="expense">Expense Only</option>
        <option value="purchase">Purchases Only</option>
        <option value="advance">Advances Only</option>
      </select>
      
      <input type="date" id="filterStartDate" style="flex: 1; min-width: 130px;">
      <input type="date" id="filterEndDate" style="flex: 1; min-width: 130px;">
      
      <button class='btn small' id='clearFilterBtn'>Clear Filter</button>
    </div>

    <!-- Transaction Table -->
    <div class="scrollTable">
      <table class='data-table' id='cashTable'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Description</th>
            <th>In</th>
            <th>Out</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody id='cashTbody'>
          <tr>
            <td colspan="7" style="text-align:center;color:#777;">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top: 15px; padding: 10px; background: #f0f9f6; border-radius: 6px;">
      <p style="margin: 4px 0;"><strong>Showing:</strong> <span id="transactionCount">0</span> transactions</p>
    </div>
  </div>

  <!-- Add Transaction Modal -->
  <div id="cashModal" class="overlayForm hidden">
    <div class="miniForm" style="max-width: 400px;">
      <h3 id="cashModalTitle">Add Transaction</h3>

      <label for="cashDateTime">Date & Time</label>
      <input type="datetime-local" id="cashDateTime">

      <label for="cashAmount">Amount (SBD)</label>
      <input type="number" id="cashAmount" step="0.01" min="0" placeholder="0.00">

      <!-- ⚠️ NEW: Received From / Paid To field -->
      <div id="receivedFromContainer" style="display:none;">
        <label for="cashReceivedFrom">Received From</label>
        <select id="cashReceivedFrom">
          <option value="">-- Select Source --</option>
          <option value="honiara">Main Office Honiara</option>
          <option value="wagina">Wagina Store</option>
          <option value="farmer">Farmer repays advance in cash (special cases)</option>
        </select>
      </div>

      <div id="paidToContainer" style="display:none;">
        <label for="cashPaidTo">Paid To</label>
        <input type="text" id="cashPaidTo" placeholder="Name of business or person" style="font-style:italic;">
      </div>

      <label for="cashDescription">Description</label>
      <select id="cashDescriptionSelect" style="display:none;">
        <option value="">-- Select --</option>
      </select>
      <input type="text" id="cashDescription" placeholder="Description" style="display:none;">
      
      <div id="farmerBalanceInfo" style="display:none; margin-top:5px; padding:8px; background:#fff3cd; border-radius:4px; font-size:0.85rem;">
        <strong>Current Balance:</strong> <span id="farmerCurrentBalance">$0.00</span>
      </div>

      <!-- ⚠️ MODIFIED: Reference field label changes based on type -->
      <label for="cashReference" id="cashReferenceLabel">Reference/Receipt # (optional)</label>
      <input type="text" id="cashReference" placeholder="Receipt or reference number">

      <!-- ⚠️ NEW: Image capture -->
      <button class="btn" id="cashCaptureImageBtn" style="width:100%; margin-top:10px;">
        📸 <span id="cashCaptureLabel">Capture Receipt</span>
      </button>

      <div id="cashImagePreviewContainer" class="hidden" style="margin-top:8px;">
        <img id="cashImagePreview" style="width:100%;max-height:200px;object-fit:contain;border-radius:6px;border:1px solid #ccc;">
      </div>

      <div style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end;">
        <button class="btn primary" id="cashSaveBtn">💾 Save</button>
        <button class="btn" id="cashCancelBtn">❌ Cancel</button>
      </div>
    </div>
  </div>

  <!-- Transaction Detail Modal -->
  <div id="cashDetailModal" class="modalOverlay hidden">
    <div class="modalCard small">
      <div class="modalHeader">
        <h3>Transaction Details</h3>
        <button class="closeBtn" id="cashDetailClose">&times;</button>
      </div>
      <div id="cashDetailBody" style="padding: 15px;"></div>
    </div>
  </div>
</section>
`;

// ============================================================
// INITIALIZER
// ============================================================
window.initCashSection = async function () {
  console.log("✅ initCashSection() running...");

  const balanceEl = document.getElementById("cashBalance");
  const totalInEl = document.getElementById("totalIn");
  const totalOutEl = document.getElementById("totalOut");
  const tbody = document.getElementById("cashTbody");
  const transactionCountEl = document.getElementById("transactionCount");

  const addIncomeBtn = document.getElementById("addIncomeBtn");
  const addExpenseBtn = document.getElementById("addExpenseBtn");
  
  const filterType = document.getElementById("filterType");
  const filterStartDate = document.getElementById("filterStartDate");
  const filterEndDate = document.getElementById("filterEndDate");
  const clearFilterBtn = document.getElementById("clearFilterBtn");

  const modal = document.getElementById("cashModal");
  const modalTitle = document.getElementById("cashModalTitle");
  const dateTimeInput = document.getElementById("cashDateTime");
  const amountInput = document.getElementById("cashAmount");
  const descriptionInput = document.getElementById("cashDescription");
  const descriptionSelect = document.getElementById("cashDescriptionSelect");
  const referenceInput = document.getElementById("cashReference");
  const referenceLabel = document.getElementById("cashReferenceLabel");
  const saveBtn = document.getElementById("cashSaveBtn");
  const cancelBtn = document.getElementById("cashCancelBtn");

  // ⚠️ NEW: Additional modal elements
  const receivedFromContainer = document.getElementById("receivedFromContainer");
  const receivedFromSelect = document.getElementById("cashReceivedFrom");
  const paidToContainer = document.getElementById("paidToContainer");
  const paidToInput = document.getElementById("cashPaidTo");
  const farmerBalanceInfo = document.getElementById("farmerBalanceInfo");
  const farmerCurrentBalance = document.getElementById("farmerCurrentBalance");
  const captureImageBtn = document.getElementById("cashCaptureImageBtn");
  const captureLabel = document.getElementById("cashCaptureLabel");
  const imagePreviewContainer = document.getElementById("cashImagePreviewContainer");
  const imagePreview = document.getElementById("cashImagePreview");

  let currentImageData = null;
  let currentFarmerAdvanceBalance = 0;
  let selectedFarmerId = null;

  const detailModal = document.getElementById("cashDetailModal");
  const detailBody = document.getElementById("cashDetailBody");
  const detailClose = document.getElementById("cashDetailClose");

  let transactions = [];
  let currentTransactionType = "income"; // income or expense

  // --------------------------------------------------------
  // Load all cash transactions
  // --------------------------------------------------------
  async function loadTransactions() {
    try {
      const cashData = await window.Storage.loadJSON("cash.json") || [];
      
      // Also load purchases and advances that affect cash
      const purchases = await window.Storage.loadJSON("purchases.json") || [];
      const advances = await window.Storage.loadJSON("advances.json") || [];

      // Combine all into transactions array
      transactions = [];

      // Add manual cash transactions
      cashData.forEach(t => {
        transactions.push({
          ...t,
          source: "manual"
        });
      });

      // Add purchases (cash out)
      purchases.forEach(p => {
        transactions.push({
          id: p.invoice,
          date: p.date,
          type: "purchase",
          description: `Purchase from ${p.farmerName}`,
          amount: Number(p.finalPay || 0),
          reference: p.cpvNumber || "",
          farmer: p.farmerName,
          weight: p.totalWeight,
          source: "purchase"
        });
      });

      // Add advances (cash out)
      advances.forEach(a => {
        transactions.push({
          id: a.id,
          date: a.dateTime || a.createdAt,
          type: "advance",
          description: `Cash advance to ${a.farmerName}`,
          amount: Number(a.amount || 0),
          reference: a.cavNumber || "",
          farmer: a.farmerName,
          expectedKg: a.expectedKg,
          source: "advance"
        });
      });

      // Sort by date descending
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      renderTransactions();

    } catch (e) {
      console.error("Failed to load transactions:", e);
      AppUtils.showError(tbody.parentElement, "Failed to load cash transactions");
    }
  }

  // --------------------------------------------------------
  // Calculate balance and render table
  // --------------------------------------------------------
  function renderTransactions() {
    tbody.innerHTML = "";

    // Apply filters
    let filtered = [...transactions];

    // Type filter
    if (filterType.value !== "all") {
      filtered = filtered.filter(t => t.type === filterType.value);
    }

    // Date range filter
    const startDate = filterStartDate.value ? new Date(filterStartDate.value + "T00:00:00") : null;
    const endDate = filterEndDate.value ? new Date(filterEndDate.value + "T23:59:59") : null;

    if (startDate || endDate) {
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        if (startDate && tDate < startDate) return false;
        if (endDate && tDate > endDate) return false;
        return true;
      });
    }

    // Calculate running balance
    let balance = 0;
    let totalIn = 0;
    let totalOut = 0;

    // Sort by date ascending for balance calculation
    const sortedForBalance = [...transactions].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Calculate running balance for each transaction
    sortedForBalance.forEach(t => {
      const isIncome = t.type === "income";
      const amount = Number(t.amount || 0);

      if (isIncome) {
        balance += amount;
        totalIn += amount;
      } else {
        balance -= amount;
        totalOut += amount;
      }

      t.runningBalance = balance;
    });

    // Update summary
    balanceEl.textContent = AppUtils.formatMoney(balance);
    balanceEl.style.color = balance >= 0 ? "white" : "#ff6b6b";
    totalInEl.textContent = AppUtils.formatMoney(totalIn);
    totalOutEl.textContent = AppUtils.formatMoney(totalOut);

    // Render filtered transactions (sorted descending)
    if (filtered.length === 0) {
      AppUtils.showEmpty(
        tbody.parentElement,
        "No transactions found for selected filters",
        "💵"
      );
      transactionCountEl.textContent = "0";
      return;
    }

    transactionCountEl.textContent = filtered.length;

    filtered.forEach(t => {
      const tr = document.createElement("tr");
      
      const isIncome = t.type === "income";
      const amount = Number(t.amount || 0);

      // Type badge with color
      let typeBadge = "";
      let typeColor = "";
      
      switch(t.type) {
        case "income":
          typeBadge = "💰 Income";
          typeColor = "#2e7d32";
          break;
        case "expense":
          typeBadge = "💸 Expense";
          typeColor = "#d32f2f";
          break;
        case "purchase":
          typeBadge = "🧾 Purchase";
          typeColor = "#f57c00";
          break;
        case "advance":
          typeBadge = "👨‍🌾 Advance";
          typeColor = "#1976d2";
          break;
        default:
          typeBadge = t.type;
          typeColor = "#666";
      }

      tr.innerHTML = `
        <td>${AppUtils.formatDate(t.date)}</td>
        <td>${AppUtils.formatTime(t.date)}</td>
        <td><span style="color:${typeColor};font-weight:bold;font-size:0.85rem;">${typeBadge}</span></td>
        <td>${AppUtils.truncate(t.description || "", 40)}</td>
        <td style="color:#2e7d32;font-weight:bold;">${isIncome ? AppUtils.formatMoney(amount) : ""}</td>
        <td style="color:#d32f2f;font-weight:bold;">${!isIncome ? AppUtils.formatMoney(amount) : ""}</td>
        <td style="font-weight:bold;">${AppUtils.formatMoney(t.runningBalance)}</td>
      `;

      tr.style.cursor = "pointer";
      tr.onclick = () => showTransactionDetail(t);

      tbody.appendChild(tr);
    });
  }

  // --------------------------------------------------------
  // Show Transaction Detail Modal
  // --------------------------------------------------------
  function showTransactionDetail(t) {
    let html = `
      <table class="data-table" style="margin: 0;">
        <tr><td><strong>Date</strong></td><td>${AppUtils.formatDateTime(t.date)}</td></tr>
        <tr><td><strong>Type</strong></td><td>${t.type.toUpperCase()}</td></tr>
        <tr><td><strong>Amount</strong></td><td>${AppUtils.formatMoney(t.amount)}</td></tr>
    `;

    // ⚠️ NEW: Show type-specific fields
    if (t.receivedFrom) {
      let source = "";
      switch(t.receivedFrom) {
        case "honiara": source = "Main Office Honiara"; break;
        case "wagina": source = "Wagina Store"; break;
        case "farmer": source = "Farmer Cash Repayment"; break;
        default: source = t.receivedFrom;
      }
      html += `<tr><td><strong>Received From</strong></td><td>${source}</td></tr>`;
    }

    if (t.paidTo) {
      html += `<tr><td><strong>Paid To</strong></td><td>${t.paidTo}</td></tr>`;
    }

    html += `<tr><td><strong>Description</strong></td><td>${t.description || "-"}</td></tr>`;

    if (t.reference) {
      const refLabel = t.type === "expense" ? "CPV #" : "Reference #";
      html += `<tr><td><strong>${refLabel}</strong></td><td>${t.reference}</td></tr>`;
    }

    if (t.farmerName) {
      html += `<tr><td><strong>Farmer</strong></td><td>${t.farmerName}</td></tr>`;
    }

    if (t.farmer) {
      html += `<tr><td><strong>Farmer</strong></td><td>${t.farmer}</td></tr>`;
    }

    if (t.weight) {
      html += `<tr><td><strong>Weight</strong></td><td>${AppUtils.formatWeight(t.weight)}</td></tr>`;
    }

    if (t.expectedKg) {
      html += `<tr><td><strong>Expected KG</strong></td><td>${AppUtils.formatWeight(t.expectedKg)}</td></tr>`;
    }

    html += `
        <tr><td><strong>Balance After</strong></td><td>${AppUtils.formatMoney(t.runningBalance)}</td></tr>
      </table>
    `;

    // ⚠️ NEW: Show image if available
    if (t.image) {
      html += `
        <div style="margin-top: 15px;">
          <strong>Receipt/CPV Image:</strong>
          <img src="${t.image}" style="width:100%; margin-top:8px; border:1px solid #ccc; border-radius:6px;">
        </div>
      `;
    }

    // Show delete button only for manual transactions
    if (t.source === "manual") {
      html += `
        <div style="margin-top: 15px; text-align: center;">
          <button class="btn danger" id="deleteTransactionBtn">🗑️ Delete Transaction</button>
        </div>
      `;
    }

    detailBody.innerHTML = html;
    detailModal.classList.remove("hidden");

    // Attach delete handler
    const deleteBtn = document.getElementById("deleteTransactionBtn");
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (!confirm(`Delete this ${t.type} transaction?\n\nAmount: ${AppUtils.formatMoney(t.amount)}\nDescription: ${t.description}`)) {
          return;
        }

        try {
          let cashData = await window.Storage.loadJSON("cash.json") || [];
          cashData = cashData.filter(c => c.id !== t.id);
          await window.Storage.saveJSON("cash.json", cashData);

          detailModal.classList.add("hidden");
          await loadTransactions();
          AppUtils.alert("Transaction deleted successfully");

        } catch (e) {
          console.error("Delete error:", e);
          alert("Failed to delete transaction");
        }
      };
    }
  }

  detailClose.onclick = () => detailModal.classList.add("hidden");
  detailModal.onclick = (e) => {
    if (e.target === detailModal) detailModal.classList.add("hidden");
  };

  // --------------------------------------------------------
  // Filter handlers
  // --------------------------------------------------------
  filterType.onchange = renderTransactions;
  filterStartDate.onchange = renderTransactions;
  filterEndDate.onchange = renderTransactions;

  clearFilterBtn.onclick = () => {
    filterType.value = "all";
    filterStartDate.value = "";
    filterEndDate.value = "";
    renderTransactions();
  };

  // --------------------------------------------------------
  // Add Income/Expense Modal
  // --------------------------------------------------------
  function openCashModal(type) {
    currentTransactionType = type;
    currentImageData = null;
    selectedFarmerId = null;
    currentFarmerAdvanceBalance = 0;
    
    if (type === "income") {
      modalTitle.textContent = "➕ Record Income";
      receivedFromContainer.style.display = "block";
      paidToContainer.style.display = "none";
      referenceLabel.textContent = "Reference/Receipt # (optional)";
      captureLabel.textContent = "Capture Receipt";
    } else {
      modalTitle.textContent = "➖ Record Expense";
      receivedFromContainer.style.display = "none";
      paidToContainer.style.display = "block";
      referenceLabel.textContent = "CPV # (optional)";
      captureLabel.textContent = "Capture CPV";
      
      // Set expense dropdown options
      descriptionSelect.innerHTML = `
        <option value="">-- Select --</option>
        <option value="Fuel">Fuel</option>
        <option value="Casual Wages">Casual Wages</option>
        <option value="Food">Food</option>
      `;
      descriptionSelect.style.display = "block";
      descriptionInput.style.display = "none";
    }

    dateTimeInput.value = AppUtils.getNowLocal();
    amountInput.value = "";
    descriptionInput.value = "";
    descriptionSelect.value = "";
    referenceInput.value = "";
    receivedFromSelect.value = "";
    paidToInput.value = "";
    imagePreview.src = "";
    imagePreviewContainer.classList.add("hidden");
    farmerBalanceInfo.style.display = "none";

    modal.classList.remove("hidden");
  }

  // ⚠️ NEW: Handle "Received From" change
  receivedFromSelect.onchange = async () => {
    const source = receivedFromSelect.value;
    farmerBalanceInfo.style.display = "none";
    descriptionSelect.innerHTML = '<option value="">-- Select --</option>';
    
    if (source === "honiara" || source === "wagina") {
      // Operational Fund only
      descriptionSelect.innerHTML = `
        <option value="">-- Select --</option>
        <option value="Operational Fund">Operational Fund</option>
      `;
      descriptionSelect.style.display = "block";
      descriptionInput.style.display = "none";
      
    } else if (source === "farmer") {
      // Load farmers with outstanding advances
      try {
        const farmers = await window.Storage.loadJSON("farmers.json") || [];
        const advances = await window.Storage.loadJSON("advances.json") || [];
        const repayments = await window.Storage.loadJSON("repayment.json") || [];
        
        // Calculate balance for each farmer
        const farmerBalances = new Map();
        
        advances.forEach(a => {
          const fid = a.farmerId;
          if (!farmerBalances.has(fid)) {
            farmerBalances.set(fid, {
              farmerId: fid,
              farmerName: a.farmerName,
              totalAdvance: 0,
              totalRepaid: 0
            });
          }
          farmerBalances.get(fid).totalAdvance += Number(a.amount || 0);
        });
        
        repayments.forEach(r => {
          const fid = r.farmerId;
          if (farmerBalances.has(fid)) {
            farmerBalances.get(fid).totalRepaid += Number(r.amount || 0);
          }
        });
        
        // Filter farmers with positive balance
        const farmersWithBalance = Array.from(farmerBalances.values())
          .filter(f => (f.totalAdvance - f.totalRepaid) > 0)
          .map(f => ({
            ...f,
            balance: f.totalAdvance - f.totalRepaid
          }))
          .sort((a, b) => a.farmerName.localeCompare(b.farmerName));
        
        if (farmersWithBalance.length === 0) {
          descriptionSelect.innerHTML = `
            <option value="">No farmers with outstanding advances</option>
          `;
          descriptionSelect.disabled = true;
        } else {
          descriptionSelect.innerHTML = '<option value="">-- Select Farmer --</option>';
          farmersWithBalance.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f.farmerId;
            opt.textContent = `${f.farmerName} (Balance: ${AppUtils.formatMoney(f.balance)})`;
            opt.dataset.balance = f.balance;
            descriptionSelect.appendChild(opt);
          });
          descriptionSelect.disabled = false;
        }
        
        descriptionSelect.style.display = "block";
        descriptionInput.style.display = "none";
        
      } catch (e) {
        console.error("Failed to load farmers:", e);
        alert("Failed to load farmer list");
      }
      
    } else {
      // No source selected, hide description
      descriptionSelect.style.display = "none";
      descriptionInput.style.display = "none";
    }
  };

  // ⚠️ NEW: Handle description select change (for farmer repayment)
  descriptionSelect.onchange = () => {
    const source = receivedFromSelect.value;
    
    if (source === "farmer" && descriptionSelect.value) {
      // Show farmer balance
      selectedFarmerId = descriptionSelect.value;
      const selectedOption = descriptionSelect.options[descriptionSelect.selectedIndex];
      currentFarmerAdvanceBalance = Number(selectedOption.dataset.balance || 0);
      
      farmerCurrentBalance.textContent = AppUtils.formatMoney(currentFarmerAdvanceBalance);
      farmerBalanceInfo.style.display = "block";
    } else {
      farmerBalanceInfo.style.display = "none";
      selectedFarmerId = null;
      currentFarmerAdvanceBalance = 0;
    }
  };

  // ⚠️ NEW: Image capture
  captureImageBtn.onclick = (e) => {
    e.preventDefault();
    
    if (!navigator.camera) {
      alert("Camera plugin not available.");
      return;
    }

    navigator.camera.getPicture(
      (imgData) => {
        currentImageData = "data:image/jpeg;base64," + imgData;
        imagePreview.src = currentImageData;
        imagePreviewContainer.classList.remove("hidden");
      },
      (err) => {
        console.warn("Camera error:", err);
        alert("Failed to capture image");
      },
      {
        quality: 70,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true
      }
    );
  };

  addIncomeBtn.onclick = () => openCashModal("income");
  addExpenseBtn.onclick = () => openCashModal("expense");
  cancelBtn.onclick = () => modal.classList.add("hidden");

  // --------------------------------------------------------
  // Save Transaction
  // --------------------------------------------------------
  saveBtn.onclick = async () => {
    const dateTime = dateTimeInput.value;
    if (!dateTime) {
      alert("Please enter date & time");
      return;
    }

    const amount = Number(amountInput.value);
    if (!AppUtils.validateAmount(amount)) {
      alert("Please enter a valid amount (greater than 0)");
      return;
    }

    // ⚠️ NEW: Validation for income
    if (currentTransactionType === "income") {
      const source = receivedFromSelect.value;
      if (!source) {
        alert("Please select where income was received from");
        return;
      }

      const description = descriptionSelect.value;
      if (!description) {
        alert("Please select a description");
        return;
      }

      // Special validation for farmer repayment
      if (source === "farmer") {
        if (!selectedFarmerId) {
          alert("Please select a farmer");
          return;
        }

        if (amount > currentFarmerAdvanceBalance) {
          alert(`Amount (${AppUtils.formatMoney(amount)}) exceeds farmer's balance (${AppUtils.formatMoney(currentFarmerAdvanceBalance)})`);
          return;
        }
      }
    }

    // ⚠️ NEW: Validation for expense
    if (currentTransactionType === "expense") {
      const paidTo = paidToInput.value.trim();
      if (!paidTo) {
        alert("Please enter who was paid");
        return;
      }

      const description = descriptionSelect.value;
      if (!description) {
        alert("Please select expense type");
        return;
      }
    }

    try {
      const cashData = await window.Storage.loadJSON("cash.json") || [];

      const transaction = {
        id: AppUtils.generateId("CASH"),
        date: new Date(dateTime).toISOString(),
        type: currentTransactionType,
        amount: amount,
        reference: referenceInput.value.trim() || "",
        image: currentImageData || null,
        createdAt: new Date().toISOString()
      };

      // ⚠️ NEW: Add type-specific fields
      if (currentTransactionType === "income") {
        const source = receivedFromSelect.value;
        transaction.receivedFrom = source;
        transaction.description = descriptionSelect.value;

        // If farmer repayment, create repayment record
        if (source === "farmer" && selectedFarmerId) {
          const farmers = await window.Storage.loadJSON("farmers.json") || [];
          const farmer = farmers.find(f => f.id === selectedFarmerId);
          const farmerName = farmer 
            ? `${farmer.givenName} ${farmer.surname}` 
            : descriptionSelect.options[descriptionSelect.selectedIndex].text.split(" (")[0];

          transaction.farmerId = selectedFarmerId;
          transaction.farmerName = farmerName;

          // Create repayment record
          const repayments = await window.Storage.loadJSON("repayment.json") || [];
          repayments.push({
            id: AppUtils.generateId("REP"),
            date: new Date(dateTime).toISOString(),
            farmerId: selectedFarmerId,
            farmerName: farmerName,
            amount: amount,
            cpv: referenceInput.value.trim() || "",
            remarks: "Paid Cash",
            type: "cash_repayment",
            createdAt: new Date().toISOString()
          });
          await window.Storage.saveJSON("repayment.json", repayments);
          console.log("[Cash] Created repayment record for farmer cash payment");
        }

      } else {
        // Expense
        transaction.paidTo = paidToInput.value.trim();
        transaction.description = descriptionSelect.value;
      }

      cashData.push(transaction);
      await window.Storage.saveJSON("cash.json", cashData);

      modal.classList.add("hidden");
      await loadTransactions();
      
      const msg = currentTransactionType === "income" 
        ? "Income recorded successfully!" 
        : "Expense recorded successfully!";
      
      AppUtils.alert(msg);

    } catch (e) {
      console.error("Save error:", e);
      alert("Failed to save transaction. Please try again.");
    }
  };

  // --------------------------------------------------------
  // Initialize
  // --------------------------------------------------------
  await loadTransactions();
};