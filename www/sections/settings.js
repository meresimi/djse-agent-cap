console.log("✅ settings.js loaded");

export default `
<section id="settings">
  <h2>Settings ⚙️</h2>

  <!-- Display Settings -->
  <div class="card">
    <h3>Display</h3>

    <!-- Theme -->
    <label for="themeToggle">Theme</label>
    <select id="themeToggle">
      <option value="light">🌞 Light Mode</option>
      <option value="dark">🌙 Dark Mode</option>
    </select>

    <!-- Font Size -->
    <label for="fontSize">Font Size</label>
    <input type="range" id="fontSize" min="12" max="22" step="1">
    <p id="fontSizePreview">Preview text size</p>
  </div>

  <!-- Language Settings -->
  <div class="card">
    <h3>Language</h3>
    <label for="languageSelect">App Language</label>
    <select id="languageSelect">
      <option value="en">English (Default)</option>
      <option value="pijin">Pijin</option>
      <option value="kiribati">Kiribati</option>
    </select>
    <p class="hint">Other languages are planned and not active yet.</p>
  </div>

  <!-- Management -->
  <div class="card">
    <h3>General Management</h3>
    <button class="btn" id="farmersBtn">👩‍🌾 Farmers</button>
    <button class="btn" id="vesselsBtn">🚢 Shipping Vessels</button>
    <button class="btn" id="priceBtn">💰 Price of Seaweed/kg</button>
  </div>

  <!-- ⚠️ NEW: Data Management -->
  <div class="card">
    <h3>Data Management</h3>
    <p style="font-size:0.9rem;color:#666;margin-bottom:10px;">
      <strong>Important:</strong> Regularly backup your data to prevent loss.
    </p>
    
    <button class="btn primary" id="exportDataBtn">📤 Export All Data</button>
    <button class="btn" id="importDataBtn">📥 Import Data</button>
    <button class="btn danger" id="clearDataBtn">🗑️ Clear All Data</button>
    
    <!-- Hidden file input for import -->
    <input type="file" id="importFileInput" accept=".json" style="display:none;">
  </div>

  <!-- Export Modal -->
  <div id="exportModal" class="modalOverlay hidden">
    <div class="modalCard">
      <div class="modalHeader">
        <h3>Export Data</h3>
        <button class="closeBtn" id="exportModalClose">&times;</button>
      </div>
      <div style="padding:15px;">
        <p style="margin-bottom:15px;">
          Your data has been exported. Choose an option below:
        </p>
        
        <button class="btn primary" id="copyExportBtn" style="width:100%;margin-bottom:10px;">
          📋 Copy to Clipboard
        </button>
        
        <button class="btn" id="downloadExportBtn" style="width:100%;margin-bottom:10px;">
          💾 Download as File
        </button>
        
        <div style="margin-top:20px;">
          <label style="font-size:0.9rem;color:#666;">Export Data (for reference):</label>
          <textarea id="exportTextarea" readonly 
                    style="width:100%;height:200px;font-family:monospace;font-size:0.8rem;
                           padding:10px;margin-top:5px;border:1px solid #ccc;border-radius:4px;">
          </textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- App Information -->
  <div class="card">
    <h3>About</h3>
    <div style="text-align: center; padding: 15px;">
      <div style="font-size: 2rem; margin-bottom: 10px;">🌊</div>
      <h4 style="margin: 5px 0; color: #007c65;">DJ-SE Main Agent</h4>
      <p style="font-size: 0.9rem; color: #666; margin: 5px 0;">Version 1.0.0</p>
      <p style="font-size: 0.85rem; color: #999; margin: 15px 0 5px 0;">
        DJ Seafood Enterprise<br>
        Henderson, Honiara<br>
        Solomon Islands
      </p>
      <p style="font-size: 0.8rem; color: #999; margin-top: 15px;">
        © 2025 DJ Seafood Enterprise
      </p>
    </div>
  </div>

  <!-- Connection Status Indicator -->
  <div id="connectionStatus" 
       style="position:fixed;bottom:10px;right:10px;padding:8px 12px;
              background:#4caf50;color:white;border-radius:20px;font-size:0.8rem;
              box-shadow:0 2px 8px rgba(0,0,0,0.2);display:none;">
    📡 <span id="connectionText">Online</span>
  </div>
</section>
`;

// ===============================
// Init
// ===============================
window.initSettingsSection = function () {
  console.log("✅ initSettingsSection() running!");

  const themeSelect = document.getElementById("themeToggle");
  const fontSlider = document.getElementById("fontSize");
  const fontPreview = document.getElementById("fontSizePreview");
  const languageSelect = document.getElementById("languageSelect");

  const exportBtn = document.getElementById("exportDataBtn");
  const importBtn = document.getElementById("importDataBtn");
  const clearBtn = document.getElementById("clearDataBtn");
  const importFileInput = document.getElementById("importFileInput");

  const exportModal = document.getElementById("exportModal");
  const exportModalClose = document.getElementById("exportModalClose");
  const exportTextarea = document.getElementById("exportTextarea");
  const copyExportBtn = document.getElementById("copyExportBtn");
  const downloadExportBtn = document.getElementById("downloadExportBtn");

  // ===============================
  // Display Settings
  // ===============================
  
  // Load saved prefs (with defaults)
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedFont = parseInt(localStorage.getItem("fontSize")) || 16;
  const savedLang = localStorage.getItem("language") || "en";

  themeSelect.value = savedTheme;
  fontSlider.value = savedFont;
  fontPreview.style.fontSize = savedFont + "px";
  languageSelect.value = savedLang;

  applyTheme(savedTheme);
  applyFontSize(savedFont);

  // Theme change
  themeSelect.onchange = () => {
    const theme = themeSelect.value;
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  };

  // Font size change
  fontSlider.oninput = () => {
    const size = parseInt(fontSlider.value);
    fontPreview.style.fontSize = size + "px";
    applyFontSize(size);
    localStorage.setItem("fontSize", size);
  };

  // Language change
  languageSelect.onchange = () => {
    const lang = languageSelect.value;
    if (lang === "en") {
      localStorage.setItem("language", "en");
      console.log("Language set to English.");
      return;
    }

    alert("This language is yet to be implemented.");
    languageSelect.value = "en";
    localStorage.setItem("language", "en");
  };

  // ===============================
  // Management Buttons
  // ===============================
  
  document.getElementById("farmersBtn").onclick = () =>
    window.loadSection("settings/farmers");
  document.getElementById("vesselsBtn").onclick = () =>
    window.loadSection("settings/vessels");
  document.getElementById("priceBtn").onclick = () =>
    window.loadSection("settings/price");

  // ===============================
  // ⚠️ FIX #5: Data Export/Backup
  // ===============================

  let currentExportData = "";

  exportBtn.onclick = async () => {
    try {
      // Collect all data files
      const dataFiles = [
        "purchases.json",
        "advances.json",
        "repayment.json",
        "cash.json",
        "farmers.json",
        "vessels.json",
        "price_config.json",
        "qualitybags.json",
        "unbatched.json",
        "warehouse.json",
        "dispatched.json",
        "reweighed.json",
        "shipments.json"
      ];

      const exportData = {
        exportDate: new Date().toISOString(),
        appName: "DJ-SE Main Agent",
        appVersion: "1.0.0",
        company: "DJ Seafood Enterprise",
        location: "Henderson, Honiara, Solomon Islands",
        data: {}
      };

      for (const file of dataFiles) {
        try {
          exportData.data[file] = await window.Storage.loadJSON(file);
        } catch (e) {
          console.warn(`Could not load ${file}:`, e);
          exportData.data[file] = null;
        }
      }

      currentExportData = JSON.stringify(exportData, null, 2);
      exportTextarea.value = currentExportData;
      exportModal.classList.remove("hidden");

    } catch (e) {
      console.error("Export error:", e);
      alert("Failed to export data. Please try again.");
    }
  };

  copyExportBtn.onclick = async () => {
    const success = await AppUtils.copyToClipboard(currentExportData);
    if (success) {
      alert("✅ Data copied to clipboard! Save it somewhere safe.");
    } else {
      alert("❌ Failed to copy. Please select and copy manually from the text box.");
    }
  };

  downloadExportBtn.onclick = () => {
    const timestamp = AppUtils.formatDate(new Date()).replace(/\//g, '-');
    const filename = `djse-main-agent-backup-${timestamp}.json`;
    AppUtils.downloadTextFile(currentExportData, filename, 'application/json');
    alert("✅ Data downloaded! Keep this file safe.");
  };

  exportModalClose.onclick = () => {
    exportModal.classList.add("hidden");
  };

  exportModal.onclick = (e) => {
    if (e.target === exportModal) {
      exportModal.classList.add("hidden");
    }
  };

  // ===============================
  // Import Data
  // ===============================

  importBtn.onclick = () => {
    importFileInput.click();
  };

  importFileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.data) {
        throw new Error("Invalid backup file format");
      }

      const confirmMsg = `⚠️ WARNING: This will overwrite ALL existing data!\n\nBackup exported on: ${AppUtils.formatDateTime(importData.exportDate)}\n\nDo you want to continue?`;
      
      if (!confirm(confirmMsg)) {
        importFileInput.value = "";
        return;
      }

      // Import all data files
      let successCount = 0;
      for (const [filename, data] of Object.entries(importData.data)) {
        if (data !== null) {
          try {
            await window.Storage.saveJSON(filename, data);
            successCount++;
          } catch (e) {
            console.error(`Failed to import ${filename}:`, e);
          }
        }
      }

      importFileInput.value = "";
      alert(`✅ Import completed! ${successCount} files restored.\n\nPlease restart the app to see changes.`);

    } catch (e) {
      console.error("Import error:", e);
      alert("❌ Failed to import data. Please check the file and try again.");
      importFileInput.value = "";
    }
  };

  // ===============================
  // Clear All Data
  // ===============================

  clearBtn.onclick = async () => {
    const confirm1 = confirm("⚠️ WARNING: This will DELETE ALL DATA!\n\nThis action CANNOT be undone.\n\nAre you sure?");
    if (!confirm1) return;

    const confirm2 = confirm("⚠️ FINAL WARNING!\n\nAll purchases, advances, farmers, and stock data will be permanently deleted.\n\nType YES mentally and click OK to proceed.");
    if (!confirm2) return;

    try {
      const dataFiles = [
        "purchases.json",
        "advances.json",
        "repayment.json",
        "cash.json",
        "qualitybags.json",
        "unbatched.json",
        "warehouse.json",
        "dispatched.json",
        "reweighed.json",
        "shipments.json"
      ];

      for (const file of dataFiles) {
        await window.Storage.saveJSON(file, []);
      }

      alert("✅ All data has been cleared.\n\nPlease restart the app.");
      window.loadSection("dashboard");

    } catch (e) {
      console.error("Clear data error:", e);
      alert("❌ Failed to clear data. Please try again.");
    }
  };

  // ===============================
  // ⚠️ FIX #10: Connection Status
  // ===============================
  
  const connectionStatus = document.getElementById("connectionStatus");
  const connectionText = document.getElementById("connectionText");

  function updateConnectionStatus() {
    const isOnline = navigator.onLine;
    connectionStatus.style.display = "block";
    
    if (isOnline) {
      connectionStatus.style.background = "#4caf50";
      connectionText.textContent = "Online";
    } else {
      connectionStatus.style.background = "#ff9800";
      connectionText.textContent = "Offline Mode";
    }
  }

  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  updateConnectionStatus();

  // Hide after 3 seconds if online
  setTimeout(() => {
    if (navigator.onLine) {
      connectionStatus.style.display = "none";
    }
  }, 3000);
};

// ===============================
// Helpers
// ===============================
function applyTheme(theme) {
  const header = document.querySelector("header");
  const cards = document.querySelectorAll(".card");

  if (theme === "dark") {
    document.body.style.background = "#111827";
    document.body.style.color = "#e5e7eb";
    if (header) header.style.background = "#004d40";
    cards.forEach(c => {
      c.style.background = "#1f2937";
      c.style.color = "#e5e7eb";
      c.style.boxShadow = "0 2px 6px rgba(0,0,0,0.6)";
    });
  } else {
    document.body.style.background = "#f3f5f4";
    document.body.style.color = "#111827";
    if (header) header.style.background = "#007c65";
    cards.forEach(c => {
      c.style.background = "#ffffff";
      c.style.color = "#111827";
      c.style.boxShadow = "0 2px 4px rgba(0,0,0,0.12)";
    });
  }
}

function applyFontSize(size) {
  document.documentElement.style.setProperty("--app-font-size", size + "px");
  const targets = document.querySelectorAll(
    "body, input, button, p, label, li, td, th, h1, h2, h3, h4"
  );
  targets.forEach(el => {
    el.style.fontSize = size + "px";
  });
}