export default `
<section id="stockHome">
  <h2>Stock at Hand</h2>

  <!-- Overview Card -->
  <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; animation: fadeIn 0.5s ease-in;">
    <h3 style="color: white; margin-top: 0;">📊 Stock Overview</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Items</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalStockItems">...</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
        <div style="font-size: 0.9rem; opacity: 0.9;">Total Weight</div>
        <div style="font-size: 2rem; font-weight: bold; margin-top: 5px;" id="totalStockWeight">...</div>
      </div>
    </div>
  </div>

  <!-- Stock Categories Grid -->
  <div class="stock-dashboard-grid">
    
    <!-- Pending to Pack Card -->
    <div class="stock-category-card to-pack" id="btnPendingPack" style="animation: slideUp 0.4s ease-out 0.1s both;">
      <div class="category-icon">📦</div>
      <div class="category-title">Pending to Pack</div>
      <div class="category-stats">
        <div class="stat-item">
          <span class="stat-value" id="pendingPackBatches">...</span>
          <span class="stat-label">batches</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="pendingPackWeight">...</span>
          <span class="stat-label">kg</span>
        </div>
      </div>
      <div class="category-description">Unstacked batches waiting to be packed into quality bags</div>
      <div class="category-arrow">→</div>
    </div>

    <!-- Pending Goods Card -->
    <div class="stock-category-card pending-goods" id="btnPendingGoods" style="animation: slideUp 0.4s ease-out 0.2s both;">
      <div class="category-icon">⏳</div>
      <div class="category-title">Pending Goods</div>
      <div class="category-stats">
        <div class="stat-item">
          <span class="stat-value" id="pendingGoodsBags">...</span>
          <span class="stat-label">bags</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="pendingGoodsWeight">...</span>
          <span class="stat-label">kg</span>
        </div>
      </div>
      <div class="category-description">Quality bags not yet moved into warehouse</div>
      <div class="category-arrow">→</div>
    </div>

    <!-- Warehouse Card -->
    <div class="stock-category-card warehouse" id="btnWarehouseStock" style="animation: slideUp 0.4s ease-out 0.3s both;">
      <div class="category-icon">🏚️</div>
      <div class="category-title">Warehouse</div>
      <div class="category-stats">
        <div class="stat-item">
          <span class="stat-value" id="warehouseBags">...</span>
          <span class="stat-label">bags</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="warehouseWeight">...</span>
          <span class="stat-label">kg</span>
        </div>
      </div>
      <div class="category-description">Total bags and weight in warehouse</div>
      <div class="category-arrow">→</div>
    </div>

    <!-- Dispatched Card -->
    <div class="stock-category-card dispatched" id="btnDispatch" style="animation: slideUp 0.4s ease-out 0.4s both;">
      <div class="category-icon">🚢</div>
      <div class="category-title">Dispatched</div>
      <div class="category-stats">
        <div class="stat-item">
          <span class="stat-value" id="dispatchedBags">...</span>
          <span class="stat-label">bags</span>
        </div>
        <div class="stat-item">
          <span class="stat-value" id="dispatchedWeight">...</span>
          <span class="stat-label">kg</span>
        </div>
      </div>
      <div class="category-description">Items moved out and assigned to vessels</div>
      <div class="category-arrow">→</div>
    </div>

  </div>

  <!-- Quick Actions -->
  <div class="card" style="animation: fadeIn 0.5s ease-in 0.5s both;">
    <h3>⚡ Quick Actions</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin-top: 10px;">
      <button class="btn small" onclick="window.loadSection('newpurchase')" style="padding: 10px;">
        ➕ New Purchase
      </button>
      <button class="btn small" onclick="window.loadSection('stock/stock_pendingpack')" style="padding: 10px;">
        📦 Pack Batches
      </button>
      <button class="btn small" onclick="window.loadSection('stock/stock_warehouse')" style="padding: 10px;">
        🚢 Dispatch
      </button>
      <button class="btn small" onclick="location.reload()" style="padding: 10px;">
        🔄 Refresh
      </button>
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

.stock-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.stock-category-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.stock-category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: all 0.3s ease;
}

.stock-category-card.to-pack::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.stock-category-card.pending-goods::before {
  background: linear-gradient(90deg, #ffecd2, #fcb69f);
}

.stock-category-card.warehouse::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.stock-category-card.dispatched::before {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.stock-category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.stock-category-card:active {
  transform: translateY(-2px) scale(0.98);
}

.stock-category-card.to-pack:hover {
  border-color: #f5576c;
}

.stock-category-card.pending-goods:hover {
  border-color: #fcb69f;
}

.stock-category-card.warehouse:hover {
  border-color: #764ba2;
}

.stock-category-card.dispatched:hover {
  border-color: #00f2fe;
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 10px;
  text-align: center;
  opacity: 0.9;
}

.category-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.category-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  padding: 15px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007c65;
}

.stat-label {
  font-size: 0.85rem;
  color: #999;
  text-transform: uppercase;
}

.category-description {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  line-height: 1.4;
  flex: 1;
  margin-top: 10px;
}

.category-arrow {
  position: absolute;
  bottom: 15px;
  right: 20px;
  font-size: 1.5rem;
  color: #007c65;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.stock-category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Loading state for stats */
.stat-value.loading {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Responsive */
@media (max-width: 600px) {
  .stock-dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .category-icon {
    font-size: 2.5rem;
  }
  
  .category-title {
    font-size: 1.1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
`;