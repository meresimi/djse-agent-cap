// sections/stock/stock_pendingpack.js

export default `
<section id="pendingpack">
  <h2>Pending Seaweed to Pack</h2>

  <!-- Summary Card with Animation -->
  <div class='card summary-card' style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; animation: fadeIn 0.5s ease-in;">
    <h3 style="color: white; margin-top: 0;">📦 Pending to Pack Summary</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Batches</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalBatches">0</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Weight</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalPendingWeight">0.00 kg</div>
      </div>
    </div>
  </div>

  <!-- Selection Summary -->
  <div class='card' style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); animation: fadeIn 0.5s ease-in 0.1s both;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.9rem; color: #666;">✅ Selected</div>
        <div style="font-size: 1.5rem; font-weight: bold; color: #007c65;" id="selectedInfo">0 batches — 0.00 kg</div>
      </div>
      <button class="btn small" id="clearSelectionBtn" style="display:none;">❌ Clear</button>
    </div>
  </div>

  <!-- Content Card -->
  <div class='card' style="animation: fadeIn 0.5s ease-in 0.2s both;">
    <h3>Unstacked Batches</h3>
    
    <div id="pendingPackContent">
      <!-- Loading/content will be inserted here -->
    </div>

    <button class='btn primary' id='createQualityBagBtn' style='margin-top:15px; width:100%; padding:12px; font-size:1rem; min-height:48px;'>
      ➕ Create New Quality Bag from Selected
    </button>
  </div>

  <!-- Overlay mini-form -->
  <div id="packBagOverlay" class="overlayForm hidden" style="animation: fadeIn 0.3s ease-in;">
    <div class="miniForm" style="animation: slideUp 0.3s ease-out; max-width: 400px;">
      <h3>Create Quality Bag</h3>
      <p id="packBagSummary" style="font-size:0.9rem;margin-bottom:8px;background:#f0f9f6;padding:10px;border-radius:6px;"></p>

      <label>Bag Serial #</label>
      <input type="text" id="packBagSerialInput" placeholder="e.g. MIX001" style="padding:10px;font-size:1rem;">

      <label>Total Weight (kg)</label>
      <input type="number" id="packBagWeightDisplay" readonly style="padding:10px;font-size:1rem;background:#f5f5f5;">

      <div class="miniFormActions" style="margin-top:15px;display:flex;gap:10px;">
        <button class="btn primary" id="packBagSaveBtn" style="flex:1;padding:12px;">💾 Save Bag</button>
        <button class="btn" id="packBagCancelBtn" style="flex:1;padding:12px;">❌ Cancel</button>
      </div>
    </div>
  </div>
</section>

<style>
/* Reuse animations from warehouse */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* Batch Item Cards */
.batch-item-mobile {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.batch-item-mobile.selected {
  border-color: #007c65;
  background: #f0f9f6;
}

.batch-item-mobile:active {
  transform: scale(0.98);
}

.batch-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
}

.batch-content {
  flex: 1;
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.batch-farmer {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.batch-weight {
  font-size: 1.2rem;
  font-weight: bold;
  color: #007c65;
}

.batch-details {
  font-size: 0.9rem;
  color: #666;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  animation: fadeIn 0.3s ease-in;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f5576c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-in;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.empty-message {
  font-size: 0.95rem;
  color: #999;
  line-height: 1.5;
}
</style>
`;