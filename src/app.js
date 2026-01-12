// ========================================================================
// app.js — Dynamic Loader + Correct Universal Init Builder + Navigation
// ========================================================================

let sectionHistory = ["dashboard"];

// ========================================================================
// Dynamic Section Loader (supports nested folders)
// Examples:
//   loadSection("purchases")
//   loadSection("stock/stock_pendingpack")
//   loadSection("settings/farmers")
// ========================================================================
async function loadSection(name, addToHistory = true) {
  const main = document.getElementById("content");

  main.innerHTML = `<p style="color:#007c65;font-weight:bold;">Loading ${name}...</p>`;

  const path = `./sections/${name}.js?${Date.now()}`;

  try {
    const mod = await import(path);

    // Validate that we got actual content
    if (!mod || typeof mod.default !== "string") {
      throw new Error("Section file returned invalid content");
    }

    const html = mod.default.trim();
    
    // Check for empty content
    if (html === "") {
      throw new Error("Section file is empty");
    }

    // Insert HTML content from section file
    main.innerHTML = html;

    // ====================================================================
    // UNIVERSAL INIT NAME GENERATOR (FIXED for stock/* files)
    //
    // Current section files define these init names:
    //   stock/stock_home            -> window.initStockHomeSection
    //   stock/stock_pendingpack     -> window.initStockPendingpackSection
    //   stock/stock_pendinggoods    -> window.initStockPendinggoodsSection
    //   stock/stock_warehouse       -> window.initStockWarehouseSection
    //   stock/stock_dispatched      -> window.initStockDispatchedSection
    //
    // Other sections:
    //   dashboard            -> window.initDashboardSection
    //   purchases            -> window.initPurchasesSection
    //   settings/farmers     -> window.initSettingsFarmersSection
    //   settings/vessels     -> window.initSettingsVesselsSection
    //   settings/price       -> window.initSettingsPriceSection
    // ====================================================================

    let parts = name.split("/");
    let clean = "";

    if (parts.length > 1 && parts[0] === "stock" && parts[1].startsWith("stock_")) {
      // Special handling for stock/* files to match existing init names

      // "stock" -> "Stock"
      const folderCap = "Stock";

      // Take part *after* "stock_" (e.g. "home", "pendingpack", "pendinggoods")
      const rest = parts[1].slice("stock_".length);  // e.g. "home"

      // Capitalize first letter -> "Home", "Pendingpack", "Pendinggoods"
      const restCap = rest.charAt(0).toUpperCase() + rest.slice(1);

      // Build "StockHome", "StockPendingpack" etc.
      clean = folderCap + restCap;

    } else {
      // Default behaviour for everything else
      // "dashboard"            -> "Dashboard"
      // "settings/farmers"     -> "SettingsFarmers"
      clean = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join("");
    }

    const initName = "init" + clean + "Section";
    console.log("Calling initializer:", initName);

    // If initializer exists — run it
    if (typeof window[initName] === "function") {
      window[initName]();
    } else {
      console.warn(`Initializer function ${initName} not found - section may not be interactive`);
    }

    // Add to history for back button
    if (addToHistory && sectionHistory[sectionHistory.length - 1] !== name) {
      sectionHistory.push(name);
    }

  } catch (err) {
    console.error("Failed to load section:", name, err);

    // Enhanced error UI with recovery option
    main.innerHTML = `
      <div class="card" style="background:#fff3cd;border-left:4px solid #ff6b6b;padding:20px;">
        <h3 style="color:#d32f2f;margin-top:0;">⚠️ Failed to Load Section</h3>
        <p style="margin:10px 0;">
          Section <strong>${name}</strong> could not be loaded.
        </p>
        <p style="font-size:0.9rem;color:#666;margin:10px 0;">
          This might be due to a missing file or network issue.
        </p>
        <button class="btn primary" onclick="window.loadSection('dashboard')" style="margin-top:15px;">
          🏠 Return to Dashboard
        </button>
        <button class="btn" onclick="window.loadSection('${name}')" style="margin-top:15px;margin-left:10px;">
          🔄 Try Again
        </button>
      </div>`;
  }
}

// Expose function globally
window.loadSection = loadSection;


// ========================================================================
// Menu + Overlay
// ========================================================================
function setupMenu() {
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menuBtn");
  const overlay = document.getElementById("menuOverlay");

  btn.onclick = (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  };

  overlay.onclick = () => {
    menu.classList.add("hidden");
    overlay.classList.add("hidden");
  };

  menu.querySelectorAll("li").forEach((li) => {
    li.onclick = (e) => {
      e.stopPropagation();
      menu.classList.add("hidden");
      overlay.classList.add("hidden");
      loadSection(li.dataset.section);
    };
  });
}


// ========================================================================
// Android Back Button Handler
// ========================================================================
function setupBackButton() {
  document.addEventListener(
    "backbutton",
    (e) => {
      e.preventDefault();

      const current = sectionHistory[sectionHistory.length - 1];

      if (current === "dashboard" || sectionHistory.length <= 1) {
        if (confirm("Do you want to exit DJ-SE Main Agent now?")) {
          navigator.app.exitApp();
        }
      } else {
        sectionHistory.pop();
        const previous = sectionHistory[sectionHistory.length - 1];
        loadSection(previous, false);
      }
    },
    false
  );
}


// ========================================================================
// App Initialization
// ========================================================================
async function initApp() {
  console.log("DJ-SE Main Agent starting...");

  // Wait for storage to be ready
  let storageReady = false;
  let attempts = 0;
  const maxAttempts = 50; // 2.5 seconds max wait

  while (!storageReady && attempts < maxAttempts) {
    if (window.Storage && window.Storage.isReady) {
      storageReady = true;
      console.log("Storage is ready");
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
    attempts++;
  }

  if (!storageReady) {
    console.warn("Storage initialization timeout - proceeding anyway");
  }

  setupMenu();
  setupBackButton();

  // Load dashboard first
  setTimeout(() => loadSection("dashboard"), 400);
}

// Initialize app when Capacitor or DOM is ready
if (window.Capacitor) {
  // Capacitor native environment
  document.addEventListener("DOMContentLoaded", initApp);
} else if (window.cordova) {
  // Legacy Cordova support
  document.addEventListener("deviceready", initApp);
} else {
  // Browser/web environment
  document.addEventListener("DOMContentLoaded", initApp);
}