// utils.js — Shared utility functions for Jaytatz Agent App
// ========================================================

window.AppUtils = {
  
  // --------------------------------------------------------
  // DATE & TIME FORMATTING
  // --------------------------------------------------------
  
  /**
   * Format date as DD-MM-YY
   * @param {string|Date} d - Date string or Date object
   * @returns {string} Formatted date
   */
  formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(2);
    return `${dd}-${mm}-${yy}`;
  },

  /**
   * Format date as DD-MM-YYYY (full year)
   * @param {string|Date} d - Date string or Date object
   * @returns {string} Formatted date
   */
  formatDateFull(d) {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  },

  /**
   * Format time as 12-hour with am/pm
   * @param {string|Date} d - Date string or Date object
   * @returns {string} Formatted time
   */
  formatTime(d) {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    
    let hh = date.getHours();
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ampm = hh >= 12 ? "pm" : "am";
    hh = hh % 12;
    if (hh === 0) hh = 12;
    return `${hh}:${mm}${ampm}`;
  },

  /**
   * Format date and time together
   * @param {string|Date} d - Date string or Date object
   * @returns {string} Formatted date and time
   */
  formatDateTime(d) {
    if (!d) return "";
    return `${this.formatDate(d)} ${this.formatTime(d)}`;
  },

  /**
   * Get current date in ISO format (YYYY-MM-DD)
   * @returns {string} Today's date
   */
  getTodayISO() {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Get current datetime for datetime-local input
   * @returns {string} Current datetime in local format
   */
  getNowLocal() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  },

  // --------------------------------------------------------
  // CURRENCY FORMATTING
  // --------------------------------------------------------
  
  /**
   * Format number as currency (SBD)
   * @param {number} n - Amount to format
   * @returns {string} Formatted currency
   */
  formatMoney(n) {
    n = Number(n) || 0;
    return "$ " + n.toFixed(2).replace(/\.?0+$/, "");
  },

  /**
   * Format number as currency without symbol
   * @param {number} n - Amount to format
   * @returns {string} Formatted number
   */
  formatAmount(n) {
    n = Number(n) || 0;
    return n.toFixed(2).replace(/\.?0+$/, "");
  },

  // --------------------------------------------------------
  // WEIGHT FORMATTING
  // --------------------------------------------------------
  
  /**
   * Format weight with kg suffix
   * @param {number} n - Weight to format
   * @returns {string} Formatted weight
   */
  formatWeight(n) {
    n = Number(n) || 0;
    return n.toFixed(2).replace(/\.?0+$/, "") + " kg";
  },

  /**
   * Format weight without suffix
   * @param {number} n - Weight to format
   * @returns {string} Formatted number
   */
  formatWeightValue(n) {
    n = Number(n) || 0;
    return n.toFixed(2).replace(/\.?0+$/, "");
  },

  // --------------------------------------------------------
  // VALIDATION HELPERS
  // --------------------------------------------------------
  
  /**
   * Validate weight input
   * @param {any} value - Value to validate
   * @param {number} max - Maximum allowed value (default 10000)
   * @returns {boolean} True if valid
   */
  validateWeight(value, max = 10000) {
    const num = Number(value);
    return !isNaN(num) && num > 0 && num <= max;
  },

  /**
   * Validate amount input
   * @param {any} value - Value to validate
   * @param {number} max - Maximum allowed value (default 1000000)
   * @returns {boolean} True if valid
   */
  validateAmount(value, max = 1000000) {
    const num = Number(value);
    return !isNaN(num) && num > 0 && num <= max;
  },

  /**
   * Validate phone number (basic)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid
   */
  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 5 && cleaned.length <= 15;
  },

  /**
   * Validate email (basic)
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // --------------------------------------------------------
  // STRING HELPERS
  // --------------------------------------------------------
  
  /**
   * Truncate string to max length
   * @param {string} str - String to truncate
   * @param {number} max - Maximum length
   * @returns {string} Truncated string
   */
  truncate(str, max = 50) {
    if (!str) return "";
    return str.length > max ? str.slice(0, max) + "..." : str;
  },

  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // --------------------------------------------------------
  // UI HELPERS
  // --------------------------------------------------------
  
  /**
   * Show loading spinner in element
   * @param {HTMLElement} element - Element to show spinner in
   */
  showLoading(element) {
    if (!element) return;
    element.innerHTML = `
      <div style="text-align:center;padding:20px;">
        <div class="spinner"></div>
        <p style="color:#777;margin-top:10px;">Loading...</p>
      </div>
    `;
  },

  /**
   * Show empty state message
   * @param {HTMLElement} element - Element to show message in
   * @param {string} message - Message to display
   * @param {string} icon - Optional emoji icon
   */
  showEmpty(element, message, icon = "📭") {
    if (!element) return;
    element.innerHTML = `
      <div style="text-align:center;padding:30px;color:#999;">
        <div style="font-size:3rem;margin-bottom:10px;">${icon}</div>
        <p>${message}</p>
      </div>
    `;
  },

  /**
   * Show error message
   * @param {HTMLElement} element - Element to show error in
   * @param {string} message - Error message
   */
  showError(element, message) {
    if (!element) return;
    element.innerHTML = `
      <div style="padding:20px;background:#fff3cd;border-left:4px solid #ff6b6b;border-radius:6px;">
        <p style="color:#d32f2f;margin:0;">⚠️ ${message}</p>
      </div>
    `;
  },

  /**
   * Confirm action with custom message
   * @param {string} message - Confirmation message
   * @returns {boolean} True if confirmed
   */
  confirm(message) {
    return window.confirm(message);
  },

  /**
   * Show alert with vibration (if supported)
   * @param {string} message - Alert message
   */
  alert(message) {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    window.alert(message);
  },

  // --------------------------------------------------------
  // DATA HELPERS
  // --------------------------------------------------------
  
  /**
   * Generate unique ID with prefix
   * @param {string} prefix - ID prefix (e.g., 'INV', 'REP')
   * @returns {string} Unique ID
   */
  generateId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Sort array by date field (descending)
   * @param {Array} arr - Array to sort
   * @param {string} field - Date field name
   * @returns {Array} Sorted array
   */
  sortByDate(arr, field = 'date') {
    return [...arr].sort((a, b) => 
      new Date(b[field]) - new Date(a[field])
    );
  },

  /**
   * Group array by field
   * @param {Array} arr - Array to group
   * @param {string} field - Field to group by
   * @returns {Map} Grouped data
   */
  groupBy(arr, field) {
    return arr.reduce((map, item) => {
      const key = item[field];
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
      return map;
    }, new Map());
  },

  /**
   * Calculate sum of field in array
   * @param {Array} arr - Array of objects
   * @param {string} field - Field to sum
   * @returns {number} Sum
   */
  sum(arr, field) {
    return arr.reduce((total, item) => total + (Number(item[field]) || 0), 0);
  },

  // --------------------------------------------------------
  // EXPORT/IMPORT HELPERS
  // --------------------------------------------------------
  
  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} True if successful
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    } catch (e) {
      console.error('Copy failed:', e);
      return false;
    }
  },

  /**
   * Download text as file
   * @param {string} text - Text content
   * @param {string} filename - File name
   * @param {string} type - MIME type
   */
  downloadTextFile(text, filename, type = 'text/plain') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// Add spinner CSS if not already present
if (!document.getElementById('utilsStyles')) {
  const style = document.createElement('style');
  style.id = 'utilsStyles';
  style.textContent = `
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #007c65;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

console.log("✅ AppUtils loaded");