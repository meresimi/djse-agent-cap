// sections/reports.js (ENHANCED VERSION)

console.log("✅ reports.js loaded");

export default `
<section id='reports'>
  <h2>Reports 📊</h2>

  <!-- Date Range Filter -->
  <div class='card'>
    <h3>Report Parameters</h3>
    
    <label>Report Type</label>
    <select id="reportType">
      <option value="summary">📊 Summary Report</option>
      <option value="farmer">👨‍🌾 By Farmer</option>
      <option value="daily">📅 Daily Activity</option>
      <option value="stock">📦 Stock Status</option>
      <option value="financial">💰 Financial Overview</option>
    </select>

    <label>Date Range</label>
    <div style="display:flex;gap:10px;align-items:center;">
      <input type="date" id="reportStartDate" style="flex:1;">
      <span>to</span>
      <input type="date" id="reportEndDate" style="flex:1;">
    </div>

    <label>Specific Farmer (optional)</label>
    <select id="reportFarmerFilter">
      <option value="">All Farmers</option>
    </select>

    <button class='btn primary' id='generateReportBtn'>📊 Generate Report</button>
    <button class='btn' id='exportReportBtn' style="display:none;">📋 Copy to Clipboard</button>
  </div>

  <!-- Report Output -->
  <div id='reportOutput' class='card' style="display:none;"></div>
</section>
`;

window.initReportsSection = async function () {
  console.log("✅ initReportsSection() running...");
  
  const reportType = document.getElementById("reportType");
  const startDate = document.getElementById("reportStartDate");
  const endDate = document.getElementById("reportEndDate");
  const farmerFilter = document.getElementById("reportFarmerFilter");
  const generateBtn = document.getElementById("generateReportBtn");
  const exportBtn = document.getElementById("exportReportBtn");
  const output = document.getElementById("reportOutput");

  let currentReportText = "";

  // --------------------------------------------------------
  // Set default date range (last 30 days)
  // --------------------------------------------------------
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  endDate.value = today.toISOString().split('T')[0];
  startDate.value = thirtyDaysAgo.toISOString().split('T')[0];

  // --------------------------------------------------------
  // Load farmers for filter
  // --------------------------------------------------------
  try {
    const farmers = await Storage.loadJSON("farmers.json") || [];
    farmers.forEach(f => {
      const opt = document.createElement("option");
      opt.value = f.id;
      opt.textContent = `${f.givenName} ${f.surname}`;
      farmerFilter.appendChild(opt);
    });
  } catch (e) {
    console.error("Failed to load farmers:", e);
  }

  // --------------------------------------------------------
  // Generate Report
  // --------------------------------------------------------
  generateBtn.onclick = async () => {
    const type = reportType.value;
    const start = new Date(startDate.value + "T00:00:00");
    const end = new Date(endDate.value + "T23:59:59");
    const farmerFilterId = farmerFilter.value;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Please select valid date range.");
      return;
    }

    if (start > end) {
      alert("Start date must be before end date.");
      return;
    }

    AppUtils.showLoading(output);
    output.style.display = "block";

    // Small delay for loading animation
    await new Promise(resolve => setTimeout(resolve, 300));

    let html = "";
    let textReport = "";

    try {
      switch(type) {
        case "summary":
          ({ html, text: textReport } = await generateSummaryReport(start, end, farmerFilterId));
          break;
        case "farmer":
          ({ html, text: textReport } = await generateFarmerReport(start, end, farmerFilterId));
          break;
        case "daily":
          ({ html, text: textReport } = await generateDailyReport(start, end));
          break;
        case "stock":
          ({ html, text: textReport } = await generateStockReport());
          break;
        case "financial":
          ({ html, text: textReport } = await generateFinancialReport(start, end));
          break;
      }

      output.innerHTML = html;
      currentReportText = textReport;
      exportBtn.style.display = "inline-block";

    } catch (e) {
      console.error("Report generation error:", e);
      AppUtils.showError(output, "Failed to generate report. Please try again.");
    }
  };

  // --------------------------------------------------------
  // Export Report
  // --------------------------------------------------------
  exportBtn.onclick = async () => {
    const success = await AppUtils.copyToClipboard(currentReportText);
    if (success) {
      AppUtils.alert("Report copied to clipboard!");
    } else {
      alert("Failed to copy. Please try manual selection.");
    }
  };

  // --------------------------------------------------------
  // REPORT GENERATORS
  // --------------------------------------------------------

  async function generateSummaryReport(start, end, farmerFilterId) {
    const purchases = await Storage.loadJSON("purchases.json") || [];
    const advances = await Storage.loadJSON("advances.json") || [];
    const repayments = await Storage.loadJSON("repayment.json") || [];
    const farmers = await Storage.loadJSON("farmers.json") || [];

    // Filter by date range
    const filteredPurchases = purchases.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    });

    const filteredAdvances = advances.filter(a => {
      const date = new Date(a.dateTime || a.createdAt);
      return date >= start && date <= end;
    });

    const filteredRepayments = repayments.filter(r => {
      const date = new Date(r.date);
      return date >= start && date <= end;
    });

    // Apply farmer filter if selected
    let displayPurchases = filteredPurchases;
    let displayAdvances = filteredAdvances;
    let displayRepayments = filteredRepayments;

    if (farmerFilterId) {
      displayPurchases = filteredPurchases.filter(p => p.farmerId === farmerFilterId);
      displayAdvances = filteredAdvances.filter(a => a.farmerId === farmerFilterId);
      displayRepayments = filteredRepayments.filter(r => r.farmerId === farmerFilterId);
    }

    // Calculate totals
    const totalPurchases = displayPurchases.length;
    const totalWeight = AppUtils.sum(displayPurchases, 'totalWeight');
    const totalValue = AppUtils.sum(displayPurchases, 'finalPay');
    const totalAdvances = AppUtils.sum(displayAdvances, 'amount');
    const totalRepayments = AppUtils.sum(displayRepayments, 'amount');
    const netAdvance = totalAdvances - totalRepayments;

    const uniqueFarmers = new Set(displayPurchases.map(p => p.farmerId || p.farmerName));

    const html = `
      <h3>📊 Summary Report</h3>
      <p><strong>Period:</strong> ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}</p>
      ${farmerFilterId ? `<p><strong>Farmer:</strong> ${farmerFilter.options[farmerFilter.selectedIndex].text}</p>` : ''}
      
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px;margin:20px 0;">
        <div style="padding:15px;background:#e8f5e9;border-radius:8px;">
          <div style="font-size:2rem;font-weight:bold;color:#2e7d32;">${totalPurchases}</div>
          <div style="color:#666;">Total Purchases</div>
        </div>
        
        <div style="padding:15px;background:#e3f2fd;border-radius:8px;">
          <div style="font-size:2rem;font-weight:bold;color:#1565c0;">${AppUtils.formatWeightValue(totalWeight)}</div>
          <div style="color:#666;">Total Weight (kg)</div>
        </div>
        
        <div style="padding:15px;background:#fff3e0;border-radius:8px;">
          <div style="font-size:2rem;font-weight:bold;color:#e65100;">${AppUtils.formatAmount(totalValue)}</div>
          <div style="color:#666;">Total Value (SBD)</div>
        </div>
        
        <div style="padding:15px;background:#fce4ec;border-radius:8px;">
          <div style="font-size:2rem;font-weight:bold;color:#c2185b;">${uniqueFarmers.size}</div>
          <div style="color:#666;">Active Farmers</div>
        </div>
      </div>

      <h4>Financial Summary</h4>
      <table class="data-table">
        <tr><td>Total Advances Given</td><td>${AppUtils.formatMoney(totalAdvances)}</td></tr>
        <tr><td>Total Repayments</td><td>${AppUtils.formatMoney(totalRepayments)}</td></tr>
        <tr><td><strong>Net Outstanding</strong></td><td><strong>${AppUtils.formatMoney(netAdvance)}</strong></td></tr>
        <tr><td>Total Paid to Farmers</td><td>${AppUtils.formatMoney(totalValue)}</td></tr>
      </table>
    `;

    const text = `
SUMMARY REPORT
Period: ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}
${farmerFilterId ? `Farmer: ${farmerFilter.options[farmerFilter.selectedIndex].text}` : ''}

OVERVIEW
- Total Purchases: ${totalPurchases}
- Total Weight: ${AppUtils.formatWeight(totalWeight)}
- Total Value: ${AppUtils.formatMoney(totalValue)}
- Active Farmers: ${uniqueFarmers.size}

FINANCIAL SUMMARY
- Total Advances Given: ${AppUtils.formatMoney(totalAdvances)}
- Total Repayments: ${AppUtils.formatMoney(totalRepayments)}
- Net Outstanding: ${AppUtils.formatMoney(netAdvance)}
- Total Paid to Farmers: ${AppUtils.formatMoney(totalValue)}
    `.trim();

    return { html, text };
  }

  async function generateFarmerReport(start, end, farmerFilterId) {
    const purchases = await Storage.loadJSON("purchases.json") || [];
    const advances = await Storage.loadJSON("advances.json") || [];
    const repayments = await Storage.loadJSON("repayment.json") || [];
    const farmers = await Storage.loadJSON("farmers.json") || [];

    // Filter by date
    const filteredPurchases = purchases.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    });

    // Group by farmer
    const farmerMap = new Map();

    filteredPurchases.forEach(p => {
      const key = p.farmerId || p.farmerName || "Unknown";
      if (!farmerMap.has(key)) {
        farmerMap.set(key, {
          name: p.farmerName || key,
          purchases: 0,
          weight: 0,
          value: 0
        });
      }
      const f = farmerMap.get(key);
      f.purchases++;
      f.weight += Number(p.totalWeight || 0);
      f.value += Number(p.finalPay || 0);
    });

    // Filter by specific farmer if selected
    if (farmerFilterId) {
      const filtered = new Map();
      if (farmerMap.has(farmerFilterId)) {
        filtered.set(farmerFilterId, farmerMap.get(farmerFilterId));
      }
      farmerMap.clear();
      filtered.forEach((v, k) => farmerMap.set(k, v));
    }

    // Sort by value descending
    const sorted = Array.from(farmerMap.values())
      .sort((a, b) => b.value - a.value);

    let html = `
      <h3>👨‍🌾 Farmer Performance Report</h3>
      <p><strong>Period:</strong> ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}</p>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Farmer</th>
            <th>Purchases</th>
            <th>Total Weight</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
    `;

    let text = `FARMER PERFORMANCE REPORT\nPeriod: ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}\n\n`;

    sorted.forEach(f => {
      html += `
        <tr>
          <td>${f.name}</td>
          <td>${f.purchases}</td>
          <td>${AppUtils.formatWeight(f.weight)}</td>
          <td>${AppUtils.formatMoney(f.value)}</td>
        </tr>
      `;

      text += `${f.name}\n`;
      text += `  Purchases: ${f.purchases}\n`;
      text += `  Weight: ${AppUtils.formatWeight(f.weight)}\n`;
      text += `  Value: ${AppUtils.formatMoney(f.value)}\n\n`;
    });

    html += `</tbody></table>`;

    return { html, text };
  }

  async function generateDailyReport(start, end) {
    const purchases = await Storage.loadJSON("purchases.json") || [];

    const filteredPurchases = purchases.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    });

    // Group by date
    const dailyMap = new Map();

    filteredPurchases.forEach(p => {
      const dateKey = AppUtils.formatDate(p.date);
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          purchases: 0,
          weight: 0,
          value: 0
        });
      }
      const d = dailyMap.get(dateKey);
      d.purchases++;
      d.weight += Number(p.totalWeight || 0);
      d.value += Number(p.finalPay || 0);
    });

    const sorted = Array.from(dailyMap.values())
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = `
      <h3>📅 Daily Activity Report</h3>
      <p><strong>Period:</strong> ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}</p>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Purchases</th>
            <th>Weight</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
    `;

    let text = `DAILY ACTIVITY REPORT\nPeriod: ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}\n\n`;

    sorted.forEach(d => {
      html += `
        <tr>
          <td>${d.date}</td>
          <td>${d.purchases}</td>
          <td>${AppUtils.formatWeight(d.weight)}</td>
          <td>${AppUtils.formatMoney(d.value)}</td>
        </tr>
      `;

      text += `${d.date}: ${d.purchases} purchases, ${AppUtils.formatWeight(d.weight)}, ${AppUtils.formatMoney(d.value)}\n`;
    });

    html += `</tbody></table>`;

    return { html, text };
  }

  async function generateStockReport() {
    const qualityBags = await Storage.loadJSON("qualitybags.json") || [];
    const unbatched = await Storage.loadJSON("unbatched.json") || [];
    const warehouse = await Storage.loadJSON("warehouse.json") || [];
    const dispatched = await Storage.loadJSON("dispatched.json") || [];

    const qbWeight = AppUtils.sum(qualityBags, 'weight');
    const ubWeight = AppUtils.sum(unbatched, 'weightRemaining');
    const whWeight = AppUtils.sum(warehouse, 'weight');
    const dispWeight = AppUtils.sum(dispatched, 'weight');

    const html = `
      <h3>📦 Stock Status Report</h3>
      <p><strong>Generated:</strong> ${AppUtils.formatDateTime(new Date())}</p>
      
      <table class="data-table">
        <thead>
          <tr><th>Category</th><th>Items</th><th>Total Weight</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Pending to Pack</td>
            <td>${unbatched.length}</td>
            <td>${AppUtils.formatWeight(ubWeight)}</td>
          </tr>
          <tr>
            <td>Pending Goods Receivable</td>
            <td>${qualityBags.length}</td>
            <td>${AppUtils.formatWeight(qbWeight)}</td>
          </tr>
          <tr>
            <td>Warehouse Stock</td>
            <td>${warehouse.length}</td>
            <td>${AppUtils.formatWeight(whWeight)}</td>
          </tr>
          <tr>
            <td>Dispatched</td>
            <td>${dispatched.length}</td>
            <td>${AppUtils.formatWeight(dispWeight)}</td>
          </tr>
          <tr style="background:#f0f9f6;font-weight:bold;">
            <td>TOTAL IN SYSTEM</td>
            <td>${unbatched.length + qualityBags.length + warehouse.length}</td>
            <td>${AppUtils.formatWeight(ubWeight + qbWeight + whWeight)}</td>
          </tr>
        </tbody>
      </table>
    `;

    const text = `
STOCK STATUS REPORT
Generated: ${AppUtils.formatDateTime(new Date())}

Pending to Pack: ${unbatched.length} items, ${AppUtils.formatWeight(ubWeight)}
Pending Goods Receivable: ${qualityBags.length} items, ${AppUtils.formatWeight(qbWeight)}
Warehouse Stock: ${warehouse.length} items, ${AppUtils.formatWeight(whWeight)}
Dispatched: ${dispatched.length} items, ${AppUtils.formatWeight(dispWeight)}

TOTAL IN SYSTEM: ${unbatched.length + qualityBags.length + warehouse.length} items, ${AppUtils.formatWeight(ubWeight + qbWeight + whWeight)}
    `.trim();

    return { html, text };
  }

  async function generateFinancialReport(start, end) {
    const purchases = await Storage.loadJSON("purchases.json") || [];
    const advances = await Storage.loadJSON("advances.json") || [];
    const repayments = await Storage.loadJSON("repayment.json") || [];

    const filteredPurchases = purchases.filter(p => {
      const date = new Date(p.date);
      return date >= start && date <= end;
    });

    const filteredAdvances = advances.filter(a => {
      const date = new Date(a.dateTime || a.createdAt);
      return date >= start && date <= end;
    });

    const filteredRepayments = repayments.filter(r => {
      const date = new Date(r.date);
      return date >= start && date <= end;
    });

    const totalPurchaseValue = AppUtils.sum(filteredPurchases, 'finalPay');
    const totalGrossValue = AppUtils.sum(filteredPurchases, 'grossAmount');
    const totalDeductions = AppUtils.sum(filteredPurchases, 'deductionValue');
    const totalAdvances = AppUtils.sum(filteredAdvances, 'amount');
    const totalRepayments = AppUtils.sum(filteredRepayments, 'amount');

    const html = `
      <h3>💰 Financial Overview</h3>
      <p><strong>Period:</strong> ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}</p>
      
      <h4>Purchase Payments</h4>
      <table class="data-table">
        <tr><td>Gross Purchase Value</td><td>${AppUtils.formatMoney(totalGrossValue)}</td></tr>
        <tr><td>Less: Advance Deductions</td><td>${AppUtils.formatMoney(totalDeductions)}</td></tr>
        <tr><td><strong>Net Paid to Farmers</strong></td><td><strong>${AppUtils.formatMoney(totalPurchaseValue)}</strong></td></tr>
      </table>

      <h4>Advance Activity</h4>
      <table class="data-table">
        <tr><td>Advances Given</td><td>${AppUtils.formatMoney(totalAdvances)}</td></tr>
        <tr><td>Repayments Received</td><td>${AppUtils.formatMoney(totalRepayments)}</td></tr>
        <tr><td><strong>Net Advance Position</strong></td><td><strong>${AppUtils.formatMoney(totalAdvances - totalRepayments)}</strong></td></tr>
      </table>

      <h4>Cash Flow Summary</h4>
      <table class="data-table">
        <tr><td>Cash Out (Advances)</td><td>${AppUtils.formatMoney(totalAdvances)}</td></tr>
        <tr><td>Cash Out (Net Purchase Payments)</td><td>${AppUtils.formatMoney(totalPurchaseValue)}</td></tr>
        <tr><td>Cash In (Repayments)</td><td>${AppUtils.formatMoney(totalRepayments)}</td></tr>
        <tr style="background:#fff3cd;font-weight:bold;">
          <td>Net Cash Out</td>
          <td>${AppUtils.formatMoney(totalAdvances + totalPurchaseValue - totalRepayments)}</td>
        </tr>
      </table>
    `;

    const text = `
FINANCIAL OVERVIEW
Period: ${AppUtils.formatDate(start)} to ${AppUtils.formatDate(end)}

PURCHASE PAYMENTS
Gross Purchase Value: ${AppUtils.formatMoney(totalGrossValue)}
Less: Advance Deductions: ${AppUtils.formatMoney(totalDeductions)}
Net Paid to Farmers: ${AppUtils.formatMoney(totalPurchaseValue)}

ADVANCE ACTIVITY
Advances Given: ${AppUtils.formatMoney(totalAdvances)}
Repayments Received: ${AppUtils.formatMoney(totalRepayments)}
Net Advance Position: ${AppUtils.formatMoney(totalAdvances - totalRepayments)}

CASH FLOW SUMMARY
Cash Out (Advances): ${AppUtils.formatMoney(totalAdvances)}
Cash Out (Net Purchase Payments): ${AppUtils.formatMoney(totalPurchaseValue)}
Cash In (Repayments): ${AppUtils.formatMoney(totalRepayments)}
Net Cash Out: ${AppUtils.formatMoney(totalAdvances + totalPurchaseValue - totalRepayments)}
    `.trim();

    return { html, text };
  }
};