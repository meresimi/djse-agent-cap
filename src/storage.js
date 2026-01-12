// storage.js — Cordova + Browser JSON storage engine (FIXED)
// ---------------------------------------------------

window.Storage = {
  basePath: null,
  isCordova: false,
  isReady: false, // ⚠️ ADDED: Flag for app.js to check

  // -----------------------
  // INIT
  // -----------------------
  async init() {
    console.log("[Storage] Initializing storage...");

    // Detect whether Cordova *file* APIs exist.
    const hasCordovaFile =
      !!(window.cordova &&
         window.resolveLocalFileSystemURL &&
         window.cordova.file &&
         window.cordova.file.dataDirectory);

    if (!hasCordovaFile) {
      this.isCordova = false;
      console.log("[Storage] Cordova file plugin not found. Using localStorage fallback.");
      this.isReady = true; // ⚠️ ADDED
      return Promise.resolve();
    }

    this.isCordova = true;

    return new Promise((resolve) => {
      try {
        window.resolveLocalFileSystemURL(
          window.cordova.file.dataDirectory,
          (dirEntry) => {
            this.basePath = dirEntry;
            console.log("[Storage] Cordova base path:", dirEntry.toURL());
            this.isReady = true; // ⚠️ ADDED
            resolve();
          },
          (err) => {
            console.error("[Storage] Error resolving FS:", err);
            this.isCordova = false;
            this.isReady = true; // ⚠️ ADDED
            resolve();
          }
        );
      } catch (e) {
        console.error("[Storage] Exception during FS init:", e);
        this.isCordova = false;
        this.isReady = true; // ⚠️ ADDED
        resolve();
      }
    });
  },

  // -----------------------
  // LOAD JSON FILE
  // -----------------------
  async loadJSON(filename) {
    try {
      // ===== Browser / Acode mode =====
      if (!this.isCordova) {
        const text = localStorage.getItem(filename);
        if (!text) return [];

        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("[Storage] JSON parse failed for", filename, e);
          return [];
        }
      }

      // ===== Cordova file mode =====
      return await new Promise((resolve) => {
        this.basePath.getFile(
          filename,
          { create: true },
          (fileEntry) => {
            fileEntry.file(
              (fileObj) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  try {
                    resolve(reader.result ? JSON.parse(reader.result) : []);
                  } catch (e) {
                    console.error("[Storage] JSON parse failed (cordova) for", filename, e);
                    resolve([]);
                  }
                };
                reader.readAsText(fileObj);
              },
              () => resolve([])
            );
          },
          () => resolve([])
        );
      });
    } catch (err) {
      console.error("[Storage] loadJSON error:", err);
      return [];
    }
  },

  // -----------------------
  // SAVE JSON FILE
  // -----------------------
  async saveJSON(filename, data) {
    try {
      const serialized = JSON.stringify(data);

      // ===== Browser / Acode mode =====
      if (!this.isCordova) {
        localStorage.setItem(filename, serialized);
        console.log(`[Storage] Saved ${filename} to localStorage`);
        return;
      }

      // ===== Cordova file mode =====
      return await new Promise((resolve, reject) => {
        this.basePath.getFile(
          filename,
          { create: true },
          (fileEntry) => {
            fileEntry.createWriter(
              (writer) => {
                writer.onwriteend = resolve;
                writer.onerror = reject;
                writer.write(serialized);
              },
              reject
            );
          },
          reject
        );
      });
    } catch (err) {
      console.error("[Storage] saveJSON error:", err);
    }
  },

  // -----------------------
  // ENSURE REQUIRED JSON FILES EXIST & HAVE CORRECT TYPE
  // -----------------------
  async ensureStockFiles() {
    // ⚠️ FIXED: Added missing files
    const arrayFiles = [
      "pendingpack.json",
      "pendinggoods.json",
      "warehouse.json",
      "dispatched.json",
      "unbatched.json",
      "qualitybags.json",
      "purchases.json",
      "farmers.json",
      "vessels.json",
      "repayment.json",  // ⚠️ ADDED
      "advances.json",   // ⚠️ ADDED
      "cash.json",       // ⚠️ ADDED
      "shipments.json",  // ⚠️ ADDED
      "reweighed.json"   // ⚠️ ADDED
    ];

    // Files that should be OBJECTS
    const objectFiles = [
      "price_config.json"
    ];

    // ===== Browser / Acode mode FIXER =====
    if (!this.isCordova && window.localStorage) {
      console.log("[Storage] ensureStockFiles() in browser/localStorage mode");

      // Arrays
      for (const file of arrayFiles) {
        const raw = localStorage.getItem(file);
        if (raw == null) {
          console.warn(`[Storage] ${file} missing → creating []`);
          await this.saveJSON(file, []);
          continue;
        }
        try {
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) {
            console.warn(`[Storage] ${file} invalid → resetting to []`);
            await this.saveJSON(file, []);
          }
        } catch {
          console.warn(`[Storage] ${file} corrupt → resetting to []`);
          await this.saveJSON(file, []);
        }
      }

      // Objects
      for (const file of objectFiles) {
        const raw = localStorage.getItem(file);
        if (raw == null) {
          console.warn(`[Storage] ${file} missing → creating {}`);
          await this.saveJSON(file, {});
          continue;
        }
        try {
          const parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            console.warn(`[Storage] ${file} wrong type → resetting to {}`);
            await this.saveJSON(file, {});
          }
        } catch {
          console.warn(`[Storage] ${file} corrupt → resetting to {}`);
          await this.saveJSON(file, {});
        }
      }

      return;
    }

    // ===== Cordova mode FIXER =====
    console.log("[Storage] ensureStockFiles() in Cordova mode");

    for (const file of arrayFiles) {
      let data = await this.loadJSON(file);
      if (!Array.isArray(data)) {
        console.warn(`[Storage] Resetting ${file} to [] (was:`, data, ")");
        await this.saveJSON(file, []);
      }
    }

    for (const file of objectFiles) {
      let data = await this.loadJSON(file);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        console.warn(`[Storage] Resetting ${file} to {}`);
        await this.saveJSON(file, {});
      }
    }
  }
};

// -------------------------------------------------
// AUTO-RUN initialization as soon as app starts
// -------------------------------------------------
document.addEventListener("deviceready", async () => {
  await window.Storage.init();
  await window.Storage.ensureStockFiles();
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.cordova) {
    await window.Storage.init();
    await window.Storage.ensureStockFiles();
  }
});