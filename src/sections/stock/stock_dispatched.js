export default `
<section id="dispatched">
  <h2>Dispatch to Ship</h2>

  <!-- Summary Card -->
  <div class='card summary-card' style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; animation: fadeIn 0.5s ease-in;">
    <h3 style="color: white; margin-top: 0;">🚢 Dispatched Summary</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Dispatched</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalDispatchedBags">0</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Weight</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalDispatchedWeight">0.00 kg</div>
      </div>
    </div>
  </div>

  <!-- Action Card -->
  <div class="card" style="animation: fadeIn 0.5s ease-in 0.1s both;">
    <button class="btn primary" id="btnReweigh" style="width:100%; padding:12px; font-size:1rem; min-height:48px;">
      ⚖️ Reweigh Before Dispatch
    </button>
  </div>

  <!-- Reweighed Card -->
  <div class="card" style="animation: fadeIn 0.5s ease-in 0.2s both;">
    <h3>⚖️ Reweighed Bags (Before Dispatch)</h3>
    <div id="reweighTableContainer">
      <!-- Content will be inserted here -->
    </div>
  </div>

  <!-- Dispatched Items Card -->
  <div class="card" style="animation: fadeIn 0.5s ease-in 0.3s both;">
    <h3>📋 Dispatched Items</h3>
    <div id="dispatchContainer">
      <!-- Content will be inserted here -->
    </div>
  </div>

  <!-- Reweigh Overlay -->
  <div id="reweighOverlay" class="overlayForm hidden" style="animation: fadeIn 0.3s ease-in;">
    <div class="miniForm" style="animation: slideUp 0.3s ease-out; max-width: 400px;">
      <h3>⚖️ Reweigh Bag</h3>

      <label>Search Serial #</label>
      <input type="text" id="rwSearchSerial" placeholder="e.g. 0003" style="padding:10px;font-size:1rem;">

      <div id="rwSearchResults" style="margin-top:6px;font-size:0.9rem;color:#444;"></div>

      <div id="rwBagDetails" style="margin-top:10px;display:none;font-size:0.9rem;background:#f0f9f6;padding:10px;border-radius:6px;">
        <p><strong>Farmer:</strong> <span id="rwFarmer"></span></p>
        <p><strong>Current Weight:</strong> <span id="rwOldWeight"></span> kg</p>

        <label>New Weight (kg)</label>
        <input type="number" id="rwNewWeight" step="0.01" placeholder="0.00" style="padding:10px;font-size:1rem;">
      </div>

      <div style="margin-top:15px;display:flex;gap:10px;">
        <button class="btn primary" id="rwSaveBtn" style="flex:1;padding:12px;">💾 Save Reweigh</button>
        <button class="btn danger" id="rwCancelBtn" style="flex:1;padding:12px;">❌ Cancel</button>
      </div>
    </div>
  </div>
</section>

<style>
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

.dispatch-item-mobile {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dispatch-item-mobile:active {
  transform: scale(0.98);
}

.reweigh-item-mobile {
  background: white;
  border: 2px solid #9c27b0;
  border-left: 6px solid #9c27b0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.reweigh-item-mobile:hover {
  border-color: #7b1fa2;
  box-shadow: 0 4px 8px rgba(156,39,176,0.3);
}

.reweigh-item-mobile:active {
  transform: scale(0.98);
}

.dispatch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.dispatch-serial {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2196f3;
}

.dispatch-weight {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.dispatch-details {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
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
  border-top: 4px solid #00f2fe;
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