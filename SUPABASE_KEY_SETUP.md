## 🔐 SETUP INSTRUCTIONS - SUPABASE API KEY

**❌ Current Issue:** Invalid API key error

**✅ Solution:** You need to add your REAL Supabase anon/public key

### Step 1: Get Your Anon Key

1. Open your browser and go to:
   ```
   https://supabase.com/dashboard/project/riwzkjsbnggcmqnjimsa/settings/api
   ```

2. Look for the section called **"Project API keys"**

3. Find the key labeled **"anon"** or **"public"**
   - It should start with `eyJhbGc...`
   - It's a very long JWT token (200+ characters)
   - DO NOT use the "service_role" key!

4. Copy that entire key

### Step 2: Update Your Config

Open: `src/core/config/env.config.js`

Replace line 19:
```javascript
SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_L89YcNI2LfXVM1ItoJlSOg_d_CdMrit',
```

With:
```javascript
SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || 'YOUR_ACTUAL_ANON_KEY_HERE',
```

### Step 3: Restart Your App

```bash
# Stop the current server (Ctrl+C in the terminal)
npm start
```

### Example of Valid Key Format:
```javascript
// ✅ CORRECT - JWT format (very long):
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpd3pranNibmdnY21xbmppbXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.abc123...'

// ❌ WRONG - Not a real key format:
'sb_publishable_L89YcNI2LfXVM1ItoJlSOg_d_CdMrit'
```

### Why This Is Needed:

The `sb_publishable_...` format is not a valid Supabase API key. Supabase uses JWT tokens for authentication. Without the correct key, the app cannot connect to your Supabase backend.

### Security Note:

- ✅ The "anon" key is SAFE to use in client apps
- ❌ NEVER use the "service_role" key in client code
- ⚠️ For production, use environment variables instead of hardcoding

---

**Once you update the key, your authentication will work perfectly!** 🎉
