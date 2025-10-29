# 🔑 Supabase Key System - Updated

## ✅ Updated to New Key System

The codebase has been updated to use Supabase's current key naming system:

### Old System (Deprecated):
- ❌ `SUPABASE_ANON_KEY` - Old name

### New System (Current):
- ✅ `SUPABASE_PUBLISHABLE_KEY` - New name for client-side key
- ✅ `SUPABASE_SECRET_KEY` - Backend only (NOT used in this app)

---

## 🔐 Understanding Supabase Keys

### 1. Publishable Key (anon)
**What it is:**
- Safe to use in client-side code (React Native, web apps)
- Formerly called "anon key"
- Starts with `eyJ...`

**What it can do:**
- ✅ User authentication (sign up, sign in, sign out)
- ✅ Read/write data (with Row Level Security)
- ✅ Access storage (with policies)
- ✅ Call Edge Functions

**Security:**
- ✅ Safe to expose in frontend code
- ✅ Protected by Row Level Security (RLS)
- ✅ Users can only access their own data (when RLS is enabled)

**Where to use:**
- ✅ React Native app
- ✅ Web frontend
- ✅ Mobile apps

### 2. Secret Key (service_role)
**What it is:**
- Backend/server only key
- Bypasses Row Level Security
- Full database access

**What it can do:**
- ✅ Full database access (bypasses RLS)
- ✅ Admin operations
- ✅ Bulk operations
- ✅ Server-side functions

**Security:**
- ❌ NEVER expose in frontend code
- ❌ NEVER commit to git
- ❌ NEVER use in React Native app

**Where to use:**
- ✅ Backend servers only
- ✅ Server-side scripts
- ✅ Admin panels (backend)

---

## 📝 What Changed in This Update

### Files Updated: 6

1. **`src/core/config/env.config.js`**
   - Changed: `SUPABASE_ANON_KEY` → `SUPABASE_PUBLISHABLE_KEY`
   - Added: Comments explaining key types
   - Updated: Validation function

2. **`src/core/services/api/supabase.client.js`**
   - Changed: `supabaseAnonKey` → `supabasePublishableKey`
   - Updated: Configuration check
   - Added: Security comments

3. **`.env`**
   - Changed: `SUPABASE_ANON_KEY` → `SUPABASE_PUBLISHABLE_KEY`
   - Added: Warnings about Secret Key

4. **`.env.example`**
   - Changed: `SUPABASE_ANON_KEY` → `SUPABASE_PUBLISHABLE_KEY`
   - Added: Key system explanation

5. **`docs/SECURITY_SETUP.md`**
   - Updated: All references to new key names
   - Added: Key system explanation
   - Updated: Setup instructions

6. **`docs/SUPABASE_SETUP.md`**
   - Updated: API credentials section
   - Added: Key type warnings

---

## 🎯 How to Get Your Keys

### Step 1: Go to Supabase Dashboard

https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

### Step 2: Find Your Keys

You'll see two sections:

**Project API keys:**
- **Publishable Key (anon)** ← Use this one! ✅
- **Secret Key (service_role)** ← Don't use in frontend! ❌

**Project URL:**
- `https://xxxxx.supabase.co` ← Also need this

### Step 3: Copy the Right Key

**For React Native App:**
```
✅ Copy: Publishable Key (anon)
❌ Don't copy: Secret Key (service_role)
```

---

## 🔧 How to Update Your Configuration

### Option 1: Update env.config.js (Quick)

Open `src/core/config/env.config.js`:

```javascript
const ENV = {
  SUPABASE_URL: 'https://riwzkjsbnggcmqnjimsa.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'eyJ...your-publishable-key-here',
  // ... rest
};
```

### Option 2: Use .env File (Recommended)

Create `.env` file:

```env
SUPABASE_URL=https://riwzkjsbnggcmqnjimsa.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJ...your-publishable-key-here
```

Then install react-native-dotenv:
```bash
npm install react-native-dotenv
```

---

## ✅ Verification Checklist

After updating:

- [ ] `SUPABASE_URL` is set to your project URL
- [ ] `SUPABASE_PUBLISHABLE_KEY` is set (not Secret Key!)
- [ ] No `SUPABASE_ANON_KEY` references in code
- [ ] `.env` file is in `.gitignore`
- [ ] App compiles without errors
- [ ] Authentication works

---

## 🐛 Troubleshooting

### Error: "Invalid API key"

**Cause:** Using wrong key or old key format

**Solution:**
1. Go to Supabase dashboard
2. Copy **Publishable Key (anon)** (not Secret Key!)
3. Update `SUPABASE_PUBLISHABLE_KEY` in config

### Error: "supabaseAnonKey is not defined"

**Cause:** Old code still using old variable name

**Solution:**
- All code has been updated to use `SUPABASE_PUBLISHABLE_KEY`
- If you see this error, check for custom code using old name

### Warning: "SUPABASE_PUBLISHABLE_KEY not configured"

**Cause:** Using placeholder value

**Solution:**
- Update `src/core/config/env.config.js` with real key
- Or create `.env` file with real key

---

## 📚 Additional Resources

- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **API Keys Guide:** https://supabase.com/docs/guides/api/api-keys
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security

---

## 🎉 Summary

**Old System:**
```javascript
SUPABASE_ANON_KEY = 'eyJ...'  // ❌ Deprecated
```

**New System:**
```javascript
SUPABASE_PUBLISHABLE_KEY = 'eyJ...'  // ✅ Current
```

**What to Remember:**
- ✅ Use **Publishable Key** in React Native app
- ❌ Never use **Secret Key** in frontend
- ✅ Publishable Key is safe for client-side
- ✅ Protected by Row Level Security

**All code has been updated!** Just add your keys and you're ready to go! 🚀

