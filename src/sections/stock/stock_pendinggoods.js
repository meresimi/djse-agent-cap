// sections/stock/stock_pendinggoods.js

export default `
<section id="pendingGoods">
  <h2>Pending Goods Receivable</h2>

  <!-- Summary Card -->
  <div class='card summary-card' style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; animation: fadeIn 0.5s ease-in;">
    <h3 style="margin-top: 0;">⏳ Pending Goods Summary</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
      <div style="background: rgba(255,255,255,0.6); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.8;">Total Bags</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalPendingBags">0</div>
      </div>
      <div style="background: rgba(255,255,255,0.6); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.8;">Total Weight</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalPendingGoodsWeight">0.00 kg</div>
      </div>
    </div>
  </div>

  <!-- Selection Summary -->
  <div class='card' style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); animation: fadeIn 0.5s ease-in 0.1s both;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.9rem; color: #666;">✅ Selected</div>
        <div style="font-size: 1.5rem; font-weight: bold; color: #007c65;" id="pendingGoodsSummary">0 bags — 0.00 kg</div>
      </div>
      <button class="btn small" id="clearPendingSelectionBtn" style="display:none;">❌ Clear</button>
    </div>
  </div>

  <!-- Content Card -->
  <div class='card' style="animation: fadeIn 0.5s ease-in 0.2s both;">
    <h3>Quality Bags</h3>
    <p style="font-size:0.9rem;color:#666;margin-bottom:15px;">
      <em>These bags have NOT yet been moved into the Warehouse.
      Select and move them when ready.</em>
    </p>

    <div id="pendingGoodsContent">
      <!-- Loading/content will be inserted here -->
    </div>

    <button class='btn primary' id='moveToWarehouseBtn' style='margin-top:15px; width:100%; padding:12px; font-size:1rem; min-height:48px;'>
      📦 Move Selected to Warehouse
    </button>
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

.bag-item-mobile {
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

.bag-item-mobile.selected {
  border-color: #007c65;
  background: #f0f9f6;
}

.bag-item-mobile:active {
  transform: scale(0.98);
}

.bag-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
}

.bag-content {
  flex: 1;
}

.bag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bag-serial {
  font-size: 1.1rem;
  font-weight: bold;
  color: #007c65;
}

.bag-weight {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.bag-farmer {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 4px;
}

.bag-date {
  font-size: 0.85rem;
  color: #999;
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
  border-top: 4px solid #fcb69f;
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