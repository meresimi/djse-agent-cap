# DJ-SE Main Agent - Capacitor for VoltBuilder

## 🎯 Overview

This is the **Capacitor version** of the DJ-SE Main Agent app, specifically configured for building with **VoltBuilder**.

**Original:** Cordova project  
**Converted to:** Capacitor 6  
**Build Platform:** VoltBuilder  
**Target:** Android

---

## 📦 What's Included

```
djse-main-agent-capacitor/
├── www/                      # Your complete web app
│   ├── index.html           # Main HTML (updated for Capacitor)
│   ├── styles.css           # All styles
│   ├── app.js               # Main app logic (Capacitor-ready)
│   ├── utils.js             # Utility functions
│   ├── storage.js           # Local storage manager
│   ├── icon.png             # App icon
│   ├── topbar_bg.png        # Header background
│   └── sections/            # All feature modules
│       ├── dashboard.js
│       ├── cash.js
│       ├── purchases.js
│       ├── newpurchase.js
│       ├── advances.js
│       ├── shipments.js
│       ├── reports.js
│       ├── settings.js
│       ├── settings/        # Settings submodules
│       │   ├── farmers.js
│       │   ├── price.js
│       │   └── vessels.js
│       └── stock/           # Stock management
│           ├── stock_home.js
│           ├── stock_pendingpack.js
│           ├── stock_pendinggoods.js
│           ├── stock_warehouse.js
│           └── stock_dispatched.js
│
├── capacitor.config.json    # Capacitor configuration
├── package.json             # Dependencies
├── voltbuilder.json         # VoltBuilder build config
└── README.md                # This file
```

---

## 🔄 What Changed from Cordova

### Key Differences:

1. **No cordova.js**: Capacitor injects its runtime automatically
2. **Plugin System**: Uses npm packages instead of Cordova plugins
3. **Configuration**: Uses `capacitor.config.json` instead of `config.xml`
4. **API**: Capacitor APIs are promise-based (async/await friendly)

### Files Updated:

✅ **index.html** - Removed `<script src="cordova.js"></script>`  
✅ **app.js** - Updated initialization to detect Capacitor  
✅ **NEW: capacitor.config.json** - App configuration  
✅ **NEW: package.json** - Dependencies  
✅ **NEW: voltbuilder.json** - VoltBuilder Capacitor config  

### Files Unchanged:

✅ **All section files** - No changes needed  
✅ **styles.css** - Works as-is  
✅ **utils.js** - Compatible  
✅ **storage.js** - Uses localStorage (still works)  
✅ **Images** - All retained  

---

## 🚀 Building with VoltBuilder

### Method 1: Upload ZIP to VoltBuilder

**Step 1: Create ZIP file**

If on **Termux/Android**:
```bash
# Navigate to project folder
cd djse-main-agent-capacitor

# Create zip (excluding node_modules)
zip -r ../djse-main-agent-voltbuilder.zip . -x "node_modules/*" ".git/*"
```

If on **Desktop**:
- Right-click the folder
- Select "Compress" or "Send to > Compressed folder"
- Name it: `djse-main-agent-voltbuilder.zip`

**Step 2: Upload to VoltBuilder**

1. Go to https://www.voltbuilder.com
2. Login/Create account
3. Click "New App" or "Upload"
4. Upload your ZIP file
5. VoltBuilder will automatically detect:
   - Framework: Capacitor
   - Version: 6
   - Plugins needed

**Step 3: Configure Build**

VoltBuilder will read `voltbuilder.json` automatically:
- App ID: `com.djseafood.mainagent`
- App Name: DJ-SE Main Agent
- Version: 1.0.0
- Platform: Android
- Plugins: Camera, Filesystem, Preferences, etc.

**Step 4: Build**

- Click "Build for Android"
- Wait 2-5 minutes
- Download APK when ready

---

### Method 2: VoltBuilder CLI (Desktop)

If you have Node.js installed:

```bash
# Install VoltBuilder CLI
npm install -g voltbuilder

# Login
voltbuilder login

# Build
voltbuilder build android
```

---

## 🔌 Plugins Used

The app uses these Capacitor plugins:

| Plugin | Purpose | Cordova Equivalent |
|--------|---------|-------------------|
| @capacitor/camera | Take photos | cordova-plugin-camera |
| @capacitor/filesystem | File access | cordova-plugin-file |
| @capacitor/preferences | Data storage | Built-in localStorage (enhanced) |
| @capacitor/app | App lifecycle | cordova-plugin-device |
| @capacitor/splash-screen | Launch screen | cordova-plugin-splashscreen |
| @capacitor/status-bar | Status bar control | cordova-plugin-statusbar |

All plugins are **automatically installed by VoltBuilder** from `voltbuilder.json`.

---

## ⚙️ Configuration Files

### capacitor.config.json

Main Capacitor configuration:
- App ID and name
- Web directory location
- Android preferences
- Plugin settings

```json
{
  "appId": "com.djseafood.mainagent",
  "appName": "DJ-SE Main Agent",
  "webDir": "www"
}
```

### voltbuilder.json

VoltBuilder-specific settings:
- Framework: capacitor
- Capacitor version: 6
- Plugins to install
- Build preferences
- Keystore info (for signed builds)

**Important:** Update keystore fields for production builds!

```json
{
  "framework": "capacitor",
  "capacitor_version": "6",
  "build_android": {
    "keystore": "your-keystore.jks",
    "keystore_alias": "your-alias",
    "keystore_pw": "your-password",
    "keystore_alias_pw": "your-key-password"
  }
}
```

---

## 📝 Making Changes

### Update App Content

Edit files in `www/`:
- `sections/*.js` - Feature modules
- `styles.css` - Styling
- `app.js` - Core logic

### Update App Config

Edit `capacitor.config.json` for:
- App ID
- App name
- Plugin settings
- Android preferences

### Update Build Config

Edit `voltbuilder.json` for:
- Version number
- Build preferences
- Keystore info

---

## 🐛 Troubleshooting VoltBuilder

### Build Fails

**Issue:** "Invalid configuration"
- **Fix:** Check `voltbuilder.json` syntax (use JSON validator)

**Issue:** "Plugin not found"
- **Fix:** Verify plugin names in `voltbuilder.json`
- Capacitor plugins: Use `@capacitor/plugin-name`

**Issue:** "Missing www directory"
- **Fix:** Ensure www/ folder is at root of ZIP

### App Crashes on Launch

**Issue:** White screen or immediate crash
- **Check:** Browser console for errors
- **Test:** Open `www/index.html` in browser first
- **Verify:** All section files are present

**Issue:** "deviceready not firing"
- **Fixed:** Already handled in updated `app.js`
- Capacitor uses DOMContentLoaded instead

---

## 🔐 Production Builds

### Create Keystore

You'll need a keystore for signed APK (Google Play):

```bash
keytool -genkey -v -keystore djse-mainagent.keystore \
  -alias djse-mainagent \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Important:** Save keystore file and passwords securely!

### Upload Keystore to VoltBuilder

1. Go to VoltBuilder settings
2. Upload keystore file
3. Enter passwords
4. Build signed APK

Or update `voltbuilder.json`:

```json
{
  "build_android": {
    "keystore": "djse-mainagent.keystore",
    "keystore_alias": "djse-mainagent",
    "keystore_pw": "YOUR_KEYSTORE_PASSWORD",
    "keystore_alias_pw": "YOUR_KEY_PASSWORD"
  }
}
```

---

## 📱 Testing

### Test in Browser First

```bash
# Navigate to www folder
cd www

# Start simple server (if you have Python)
python -m http.server 8080

# Or use Node.js
npx http-server -p 8080
```

Open: http://localhost:8080

### Test APK on Device

1. Build APK with VoltBuilder
2. Download APK
3. Transfer to Android device
4. Enable "Install from Unknown Sources"
5. Install and test

---

## 🎯 Next Steps

1. ✅ Test in browser
2. ✅ Upload to VoltBuilder
3. ✅ Build debug APK
4. ⬜ Test on device
5. ⬜ Create production keystore
6. ⬜ Build signed APK
7. ⬜ Deploy to users

---

## 📊 Comparison: Cordova vs Capacitor

| Feature | Cordova | Capacitor |
|---------|---------|-----------|
| Plugin Install | CLI commands | npm packages |
| Runtime | cordova.js | capacitor.js (auto) |
| Device Ready | Event listener | DOMContentLoaded |
| API Style | Callbacks | Promises/async |
| Config | config.xml | capacitor.config.json |
| Build Tool | Cordova CLI | Capacitor CLI |
| VoltBuilder | ✅ Supported | ✅ Supported |

**Your app now works with both!** 🎉

---

## 🆘 Support

### VoltBuilder Help
- Website: https://www.voltbuilder.com
- Docs: https://www.voltbuilder.com/docs
- Support: support@voltbuilder.com

### Capacitor Help
- Docs: https://capacitorjs.com
- Forum: https://forum.ionicframework.com

---

## 📄 Files You Can Delete (Optional)

If coming from Cordova project, you can remove:
- `config.xml` (replaced by capacitor.config.json)
- `platforms/` folder (not needed for VoltBuilder)
- `plugins/` folder (VoltBuilder installs automatically)

---

## ✅ Quick Checklist

Before uploading to VoltBuilder:

- [ ] All files in `www/` folder present
- [ ] `capacitor.config.json` configured
- [ ] `voltbuilder.json` configured
- [ ] `package.json` has all plugins
- [ ] Tested in browser
- [ ] Images included (icon.png, topbar_bg.png)
- [ ] All section JS files present
- [ ] No `node_modules` in ZIP (VoltBuilder installs)

---

**Ready to build!** 🚀

Upload to VoltBuilder and your APK will be ready in minutes!

---

*DJ Seafood Enterprise / Jaytatz Holdings Ltd.*  
*Converted to Capacitor: January 2026*
