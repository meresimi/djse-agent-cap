export default `
<section id="dashboard">
  <h2>Main Agent Dashboard</h2>

  <div class="card-grid">

    <!-- Cash -->
    <div class="card dash-card" onclick="window.loadSection('cash')">
      <div class="card-header">
        <span class="icon">💰</span>
      </div>
      <p class="card-title">Cash</p>
      <p class="dash-stats">Manage cash advances and balances.</p>
    </div>

    <!-- Purchases -->
    <div class="card dash-card" onclick="window.loadSection('purchases')">
      <div class="card-header">
        <span class="icon">🧾</span>
      </div>
      <p class="card-title">Purchases</p>
      <p class="dash-stats">Daily seaweed purchases.</p>
    </div>

    <!-- Stock at Hand -->
    <div class="card dash-card" onclick="window.loadSection('stock/stock_home')">
      <div class="card-header">
        <span class="icon">🏚️</span>
      </div>
      <p class="card-title">Stock at Hand</p>
      <p class="dash-stats">Pending batches, GRN, warehouse & dispatch.</p>
    </div>

    <!-- Shipments -->
    <div class="card dash-card" onclick="window.loadSection('shipments')">
      <div class="card-header">
        <span class="icon">🚢</span>
      </div>
      <p class="card-title">Shipments</p>
      <p class="dash-stats">Outgoing seaweed shipments.</p>
    </div>

    <!-- Reports -->
    <div class="card dash-card" onclick="window.loadSection('reports')">
      <div class="card-header">
        <span class="icon">📊</span>
      </div>
      <p class="card-title">Reports</p>
      <p class="dash-stats">Daily summaries & statistics.</p>
    </div>

    <!-- Settings -->
    <div class="card dash-card" onclick="window.loadSection('settings')">
      <div class="card-header">
        <span class="icon">⚙️</span>
      </div>
      <p class="card-title">Settings</p>
      <p class="dash-stats">Preferences & app info.</p>
    </div>

    <!-- --------------------------- -->
    <!-- NEW BUTTONS ADDED BELOW     -->
    <!-- --------------------------- -->

    <!-- Add New Purchase -->
    <div class="card dash-card" onclick="window.loadSection('newpurchase')">
      <div class="card-header">
        <span class="icon">➕</span>
      </div>
      <p class="card-title">Add New Purchase</p>
      <p class="dash-stats">Record a new seaweed purchase.</p>
    </div>

    <!-- Farmer Advance -->
    <div class="card dash-card" onclick="window.loadSection('advances')">
      <div class="card-header">
        <span class="icon">👨🏾‍🌾</span>
      </div>
      <p class="card-title">Farmer Advance</p>
      <p class="dash-stats">Give or review farmer advances.</p>
    </div>

  </div>
</section>
`;